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
    const plotlyRef = ref(null);
    const store = useStore();
    const maxDataPoints = 200;

    const layout = reactive({
      title: 'Real-Time Data',
      xaxis: { title: 'Time' },
      yaxis: { title: 'Value' }
    });

    function initializePlot() {
      const initialData = getChartData();
      if (plotlyRef.value) {
        Plotly.newPlot(plotlyRef.value, initialData, layout, { responsive: true });
      }
    }

    function getChartData() {
      return [{
        x: store.state.timeSeriesData.t,
        y: store.state.timeSeriesData.x,
        mode: 'lines+markers',
        type: 'scatter'
      }];
    }

    function handleNewData(newData) {
      if (newData !== undefined && store.state.x !== undefined) {
        store.dispatch('addDataPoint', { t: newData, x: store.state.x });
        debouncedUpdateChart(newData);
      }
    }

    function resetChart() {
        if (plotlyRef.value) {
            // Use Plotly.react to reset the data with an empty dataset
            Plotly.react(plotlyRef.value, [{
            x: [],
            y: [],
            mode: 'lines+markers',
            type: 'scatter'
            }], layout, { responsive: true });
        }
        }

    const updateChart = (newData) => {
      if (plotlyRef.value) {
        try {
          Plotly.extendTraces(plotlyRef.value, {
            x: [[newData]],
            y: [[store.state.x]]
          }, [0]);
        // Remove old data points if the length exceeds maxDataPoints
        if (store.state.timeSeriesData.t.length > maxDataPoints) {
        resetChart();
        Plotly.extendTraces(plotlyRef.value, {
            x: [[newData]],
            y: [[store.state.x]]
          }, [0]);
          }

        } catch (error) {
          console.error('Failed to extend traces on Plotly chart:', error);
        }
      }
    };

    const debouncedUpdateChart = debounce(updateChart, 6);

    watch(() => store.state.currentTime, handleNewData, { immediate: true });

    onMounted(initializePlot);

    return {
      plotlyRef
    };
  }
};
</script>

  
  <!-- <script>
  import { ref, onMounted, onUnmounted, reactive, watch} from 'vue';
  import Plotly from 'plotly.js-dist-min';
  import { useStore } from 'vuex';
  import { debounce } from 'lodash';
  
  export default {
  setup() {
    const plotlyRef = ref(null);
    const store = useStore();

    const layout = {
      title: 'Real-Time Data',
      xaxis: { title: 'Time' },
      yaxis: { title: 'Value' }
    };

    function plot() {
      const data = [{
        x: store.state.timeSeriesData.t,
        y: store.state.timeSeriesData.x,
        mode: 'lines+markers',
        type: 'scatter'
      }];
      if (plotlyRef.value) {
        Plotly.newPlot(plotlyRef.value, data, layout, { responsive: true });
      }
    }

    const updateChart = (newData) => {
      if (plotlyRef.value && newData !== undefined && store.state.x !== undefined) {
        try {
          Plotly.extendTraces(plotlyRef.value, {
            x: [[newData]],
            y: [[store.state.x]]
          }, [0]); // Index of the first trace
        } catch (error) {
          console.error('Failed to extend traces on Plotly chart:', error);
        }
      }
    };

    const debouncedUpdateChart = debounce(updateChart, 6);

    watch(() => store.state.currentTime, (newData) => {
      // Ensure the new data point is valid before dispatching
      if (newData !== undefined && store.state.x !== undefined) {
        store.dispatch('addDataPoint', { t: newData, x: store.state.x });

        // Update the chart, debounced
        debouncedUpdateChart(newData);
      }
    }, { immediate: true });

    onMounted(plot);

    return {
      plotlyRef
    };
  }
};
</script> -->
  
  <style scoped>
  /* Add any additional styling if necessary */
  </style>