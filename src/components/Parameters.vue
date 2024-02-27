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
      <v-card-text>
        <v-text-field
          label="Mass"
          v-model="mass"
          :rules="[rules.minValue, rules.maxValue]"
          type="number"
    ></v-text-field>
      </v-card-text>
      <v-btn @click="updateParameters">Update Parameters</v-btn>
      <v-switch
      v-model="controlModeSwitch"
      :label="`Control Mode: ${controlModeSwitch ? 'PID' : 'Mouse'}`"
    ></v-switch>
      <!-- Add more parameters as needed -->
    </v-card>
  </v-container>
  </template>
  

  <script>
  import { useStore } from 'vuex';
  import { computed, ref } from 'vue';


  export default {
    name: 'Parameters',
    setup() {
      const store = useStore();
      const xPos = computed(() => store.state.x);
      const force = computed(() => store.state.force);
      const angle = computed(() => store.state.fi);


      // Computed properties to get/set Vuex state
      const mass = ref(store.state.cartMass)
      const controlMode = ref(store.state.controlMode);
      // Add more parameters as needed

      const rules = {
      minValue: v => (!v || v >= 0.1) || 'Mass must be at least 1 kg',
      maxValue: v => (!v || v <= 100) || 'Mass must be no more than 100 kg',
      // Add similar rules for other parameters
    }

    function updateParameters() {
      store.dispatch('setMass', parseFloat(mass.value));
      // Dispatch other parameter updates similarly
    }

    const controlModeSwitch = computed({
      get: () => store.state.controlMode === 'PID',
      set: (value) => {
        const newMode = value ? 'PID' : 'Mouse';
        store.dispatch('toggleControlMode', newMode);
      },
    });


      return {
        xPos,
        angle,
        force,
        mass,
        rules,
        updateParameters,
        controlModeSwitch,
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
  