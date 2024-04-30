<template>
  <v-container >
    <v-row>
      <v-col class="child-width">
        <PendulumCanvas />
      </v-col>
      <v-col class="child-width">
        <Graph />
      </v-col>
      </v-row>
      <v-row class="child-width">
        <Parameters />
      </v-row>
  </v-container>
</template>

<script>
import Control from './Control.vue';
import Parameters from './Parameters.vue';
import PendulumCanvas from './PendulumCanvas.vue';
import Graph from './Graph.vue';

export default {
    name: 'Game',
    components: { PendulumCanvas, Parameters, Control, Graph }
}
</script>

<style scoped>
.child-width {
  width: 800px; /* Example width */
  justify-content: start;
  
}
</style>
