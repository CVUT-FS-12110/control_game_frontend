<template>
    <v-container class="pa1">
      <!-- <v-card-title>Time Series Chart</v-card-title> -->
      <v-card-text>
        <div ref="plotlyRef" style="width:100%; height:100%;"></div>
      </v-card-text>
    </v-container>
  </template>


<script>
import { ref, onMounted, watch, reactive } from 'vue';
import Plotly from 'plotly.js-dist-min';
import { useStore } from 'vuex';
import { debounce } from 'lodash';

export default {
  setup() {
    // References to DOM elements and Vuex store
    const plotlyRef = ref(null);
    const store = useStore();
    const maxDataPoints = 200;

    // Chart layout configuration
    const layout = reactive({
      title: 'Real-Time Data',
      xaxis: { title: 'Time' },
      yaxis: { title: 'Value' }
    });

    // Initializes the Plotly chart
    function initializePlot() {
      if (plotlyRef.value) {
        Plotly.newPlot(plotlyRef.value, [{
          x: store.state.timeSeriesData.t,
          y: store.state.timeSeriesData.fi,
          mode: 'lines+markers',
          type: 'scatter',
          name: 'Angle fi'
        },
        {
          x: store.state.timeSeriesData.t,
          y: store.state.timeSeriesData.u,
          mode: 'lines+markers',
          type: 'scatter',
          name: 'Applied Force'
      }
      ], layout, { responsive: true });
      }
    }

    // Resets the chart and reinitializes it with recent data points
    // function resetChart() {
    //   if (plotlyRef.value) {
    //     Plotly.purge(plotlyRef.value); // Clear the chart
    //     Plotly.newPlot(plotlyRef.value, [{
    //       x: store.state.timeSeriesData.t.slice(-maxDataPoints),
    //       y: store.state.timeSeriesData.x.slice(-maxDataPoints),
    //       mode: 'lines+markers',
    //       type: 'scatter'
    //     }], layout, { responsive: true });
    //   }
    // }

    // Updates the chart by extending traces or resetting if needed
    const updateChart = debounce((newData) => {
      if (plotlyRef.value && newData !== undefined && store.state.x !== undefined) {
        try {
          Plotly.update(plotlyRef.value, {
            x: [store.state.timeSeriesData.t, store.state.timeSeriesData.t],
            y: [store.state.timeSeriesData.fi, store.state.timeSeriesData.u]
          }, [0, 1]);

          // if (store.state.timeSeriesData.t.length > maxDataPoints) {
          //   resetChart();
          // }
        } catch (error) {
          console.error('Failed to extend traces on Plotly chart:', error);
        }
      }
    }, 5); // Adjusted debounce time to 200 milliseconds

    // Watcher for new data points from Vuex store
    watch(() => store.state.currentTime, (newData) => {
      if (newData !== undefined && store.state.x !== undefined) {
        store.dispatch('addDataPoint', { t: newData, x: store.state.x, fi: store.state.fi, u: store.state.force});
        updateChart(newData);
      }
    }, { immediate: true });

    // Initialize the plot when the component is mounted
    onMounted(initializePlot);

    return {
      plotlyRef
    };
  }
};
</script>

  
  <style scoped>
  /* Add any additional styling if necessary */
  </style>