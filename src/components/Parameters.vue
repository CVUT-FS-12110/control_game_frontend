<template>
  <v-container class="pa-1">
    <v-card>
      <v-card-title>Parameters</v-card-title>
      <v-card-text>
        <p>X Position: {{ xPos.toFixed(2) }}</p>
        <p>Angle: {{ angle.toFixed(2) }}</p>
        <p>Applied Force: {{ force.toFixed(2) }}</p>
        <!-- Add more parameters as needed -->
      </v-card-text>
      <!-- Add more parameters as needed -->
    </v-card>
  </v-container>
  </template>
  

  <script>
  import { useStore } from 'vuex';
  import { computed } from 'vue';


  export default {
    name: 'Parameters',
    setup() {
      const store = useStore();
      const xPos = computed(() => store.state.x);
      const force = computed(() => store.state.force);
      const angle = computed(() => store.state.fi);
      // Add more parameters as needed

      return {
        xPos,
        angle,
        force,
        // Add more parameters as needed
      };
    },
  }
  </script>
  
  <style>
  /* Add styles for your parameters component here */
  .parameters {
    /* Styling example */
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
  }
  </style>
  