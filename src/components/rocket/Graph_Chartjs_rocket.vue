<template>
  <v-container class="pa1">
    <canvas ref="chartRef"></canvas>
  </v-container>
</template>

<script>
import { Chart, LinearScale, LineController, LineElement, PointElement, CategoryScale, Legend, Title } from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useStore } from 'vuex';

Chart.register(LinearScale, LineController, LineElement, PointElement, CategoryScale, Legend, Title);

export default {
  setup() {
    const chartRef = ref(null);
    const store = useStore();
    let chart = null;
    let updateIntervalId = null;

    const timeSeriesData = computed(() => ({
      t: [...store.state.timeSeriesData.t],
      fi: [...store.state.timeSeriesData.fi],
      u: [...store.state.timeSeriesData.u],
    }));

    onMounted(() => {
      chart = new Chart(chartRef.value.getContext('2d'), {
        type: 'line',
        data: {
          labels: timeSeriesData.value.t,
          datasets: [
            {
              label: 'Angle fi',
              data: timeSeriesData.value.fi,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
            {
              label: 'Applied Force',
              data: timeSeriesData.value.u,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'linear',
              title: {
                display: true,
                text: 'Time',
              },
            },
            y: {
              type: 'linear',
              title: {
                display: true,
                text: 'Value',
              }, 
            },
          },
          plugins: {
            legend: {
              display: true,
            },
            title: {
              display: true,
              text: 'Control System Graphs',
            },
          },
        },
      });

      updateIntervalId = setInterval(() => {
        if (chart) {
          chart.data.labels = timeSeriesData.value.t;
          chart.data.datasets[0].data = timeSeriesData.value.fi;
          chart.data.datasets[1].data = timeSeriesData.value.u;
          chart.update();
        }
      }, 200); // update every 1000 milliseconds (1 second)
    });

    onUnmounted(() => {
      if (updateIntervalId) {
        clearInterval(updateIntervalId);
      }
    });

    watch(
      () => store.state.currentTime,
      (newData) => {
        if (newData !== undefined && store.state.x !== undefined) {
          store.dispatch('addDataPoint', {
            t: newData,
            x: store.state.x,
            fi: store.state.fi,
            u: store.state.force,
          });
        }
      },
      { immediate: true }
    );

    return {
      chartRef,
    };
  },
};
</script>