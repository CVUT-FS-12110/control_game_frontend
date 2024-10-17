<template>
  <v-container >
    <v-row>
      <v-col class="child-width">
        <Canvas_rocket />
      </v-col>
      <v-col class="child-width">
        <Graph_Chartjs />
      </v-col>
      </v-row>
      <v-row class="child-width">
        <Parameters />
      </v-row>
  </v-container>
</template>

<script>
import Control from '@/components/rocket/Control_rocket.vue'
import Parameters from '@/components/rocket/Parameters_rocket.vue';
import Graph_Chartjs from '@/components/rocket/Graph_Chartjs_rocket.vue';
import Canvas_rocket from '@/components/rocket/Canvas_rocket.vue';

export default {
    name: 'Game',
    components: { Canvas_rocket, Parameters, Control, Graph_Chartjs},
}
</script>

<style scoped>
.child-width {
  width: 800px; /* Example width */
  justify-content: start;
  
}
</style>
