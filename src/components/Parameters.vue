<template>
  <v-container class="pa-1">
    <v-card>
      <v-card-title>Parameters</v-card-title>
      <v-card-text>
        <p>X Position: {{ xPos.toFixed(2) }}</p>
        <p>Angle: {{ angle.toFixed(2) }}</p>
        <p>Applied Force: {{ force.toFixed(2) }}</p>
        <!-- Add more parameters as needed -->
      <!-- </v-card-text>
      <v-card-text>
        <v-text-field
          label="Mass"
          v-model="mass"
          :rules="[rules.minValue, rules.maxValue]"
          type="number"
    ></v-text-field> -->
      </v-card-text> 
      <v-switch
      v-model="controlModeSwitch"
      :label="`Control Mode: ${controlModeSwitch ? 'PID' : 'Mouse'}`"
    ></v-switch>
      <!-- Add more parameters as needed -->
    </v-card>
    <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab value="pid">PID parameters</v-tab>
      <v-tab value="model">Model parameters</v-tab>
      <v-tab value="simulation">Simulation parameters</v-tab>
    </v-tabs>

    <v-container>
      <v-window v-model="tab">
        <v-window-item value="pid">
          <v-row>
            <v-col>
              <v-text-field
                label="P"
                v-model="p_constant"
                :rules="[rulesPID.minValue, rulesPID.maxValue]"
                type="number"
              ></v-text-field>
          </v-col>
          <v-col>

            <v-text-field
              label="I"
              v-model="i_constant"
              :rules="[rulesPID.minValue, rulesPID.maxValue]"
              type="number"
            ></v-text-field>

          </v-col>
          <v-col>
            <v-text-field
              label="D"
              v-model="d_constant"
              :rules="[rulesPID.minValue, rulesPID.maxValue]"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>  


        </v-window-item>

        <v-window-item value="model">
          <v-row>
            <v-col>            
              <v-text-field
              label="Cart mass"
              v-model="mass"
              :rules="[rulesParams.minValue, rulesParams.maxValue]"
              type="number"
              ></v-text-field>
        </v-col>
    
        <v-col>
          <v-text-field
          label="Pendulum mass"
          v-model="pendulum_mass"
          :rules="[rulesParams.minValue, rulesParams.maxValue]"
          type="number"
          ></v-text-field>
        </v-col>

        <v-col>
          <v-text-field
          label="Pendulum length"
          v-model="pendulum_length"
          :rules="[rulesParams.minValue, rulesParams.maxValue]"
          type="number"
          ></v-text-field>
        </v-col>

          </v-row>
        </v-window-item>

        <v-window-item value="simulation">
          Three
        </v-window-item>
      </v-window>
      <v-btn @click="updateParameters">Update Parameters</v-btn>
    </v-container>
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
      const force = computed(() => store.state.totalForce);
      const angle = computed(() => store.state.fi);
      const tab = ref();
      const p_constant = ref(store.state.p_constant);
      const i_constant = ref(store.state.i_constant);
      const d_constant = ref(store.state.d_constant);
      // const pid = ref(store.state.pid);


      // TODO: Difference vs ref or computed here?
      // Computed properties to get/set Vuex state
      const mass = ref(store.state.cartMass)
      const pendulum_mass= ref(store.state.pendulumMass)
      const pendulum_length = ref(store.state.pendulumLength)

      const controlMode = ref(store.state.controlMode);
      // Add more parameters as needed

      const rulesParams = {
      minValue: v => (!v || v >= 0.1) || 'Minimum value is 0.1',
      maxValue: v => (!v || v <= 100) || 'Maximum value is 100',
      // Add similar rules for other parameters
    }

    const rulesPID = {
      minValue: v => (!v || v >= -1000) || 'Min value is -1000',
      maxValue: v => (!v || v <= 1000) || 'Max value is 1000',
      // Add similar rules for other parameters
    }

    function updateParameters() {
      store.dispatch('setMass', parseFloat(mass.value));
      store.dispatch('setPendulumMass', parseFloat(pendulum_mass.value));
      store.dispatch('setPendulumLength', parseFloat(pendulum_length.value));

      store.dispatch('setPConstant', parseFloat(p_constant.value));
      store.dispatch('setIConstant', parseFloat(i_constant.value));
      store.dispatch('setDConstant', parseFloat(d_constant.value));
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
        pendulum_mass,
        pendulum_length,
        rulesParams,
        rulesPID,
        updateParameters,
        controlModeSwitch,
        tab,
        p_constant,
        i_constant,
        d_constant,        // Add more parameters as needed
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
  