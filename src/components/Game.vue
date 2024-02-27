<template>
  <v-container >
    <v-row class="child-width">
        <PendulumCanvas />
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

export default {
    name: 'Game',
    components: { PendulumCanvas, Parameters, Control }
}
</script>

<style scoped>
.child-width {
  width: 800px; /* Example width */
  justify-content: start;
  
}
</style>
