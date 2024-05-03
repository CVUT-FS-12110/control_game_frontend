import { add } from 'numeric';
import { createStore } from 'vuex';

export const stateStore = createStore({
  state() {
    return {
      x: 0,
      x_velocity: 0,
      fi: 0,
      fi_velocity: 0,
      force: 0,
      disturbance: 0,
      totalForce: 0,
      cartMass: 1,
      pendulumMass: 0.2,
      pendulumLength: 0.5,
      p_constant: -50,
      i_constant: -20,
      d_constant: -10,
      max_force: 20,
      controlMode: 'Mouse',
      distance: 0,
      timeLimit: 100, // Time limit in seconds
      currentTime: 0, // Current time in seconds
      timeSeriesData: {
                      t: [],
                      x: [],
                      fi: [],
                      u: []
      },
      maxDataPoints: 200,
      isPaused: false,
      // other variables
    };
  },
  mutations: {
    updateX(state, x) {
      state.x = x;
    },
    updateXVelocity(state, x_velocity) {
      state.x_velocity =x_velocity;
    },
    updateFi(state, fi) {
      state.fi = fi;
    },
    updateFiVelocity(state, fi_velocity) {
      state.fi_velocity = fi_velocity;
    },
    updateForce(state, force) {
      if (force > state.max_force) {
        state.force = state.max_force;
      } else if (force < -state.max_force) {
      state.force = -state.max_force;
      } else {
        state.force = force;
      }
    },

    updateDisturbance(state, disturbance) {
      state.disturbance = disturbance;
    },

    updateDatapoint(state, data) {
      state.timeSeriesData.t.push(data.t);
      state.timeSeriesData.x.push(data.x);
      state.timeSeriesData.fi.push(data.fi);
      state.timeSeriesData.u.push(data.u);
      // Check if the data exceeds the maximum allowed points
      if (state.timeSeriesData.t.length > state.maxDataPoints) {
          state.timeSeriesData.t.shift(); // Remove the oldest data point
          state.timeSeriesData.x.shift();
          state.timeSeriesData.fi.shift();
          state.timeSeriesData.u.shift();
      }
    },

    resetTimeSeriesData(state) {
      state.timeSeriesData = {
        t: [],
        x: [],
        fi: [],
        u: []
      };
    },

    updateTotalForce(state, force) {
      state.totalForce = force;
    },
    updateCartMass(state, mass) {
      state.cartMass = mass;
    },

    updatePendulumMass(state, mass) {
      state.pendulumMass = mass;
    },

    updatePendulumLength(state, length) {
      state.pendulumLength = length;
    },

    updatePConstant(state, p_constant) {
      state.p_constant = p_constant;
    },

    updateIConstant(state, i_constant) {
      state.i_constant = i_constant;
    },

    updateDConstant(state, d_constant) {
      state.d_constant = d_constant;
    },

    updateMaxForce(state, force) {
      state.max_force = force;
    },
    
    updateControlMode(state, mode) {
      state.controlMode = mode;
    },
    updateDisturbance(state, disturbance) {
      state.disturbance = disturbance;
    },
    setTimeLimit(state, limit) {
      state.timeLimit = limit;
    },
    setCurrentTime(state, time) {
      state.currentTime = time;
    },
    resetTimer(state) {
      state.currentTime = 0;
    },
    pauseSimulation(state) {
      state.isPaused = !state.isPaused;
    },
    // other mutations
  },
  actions: {
    setMass({ commit }, mass) {
      commit('updateCartMass', mass);
    },

    setPendulumMass({ commit }, mass) {
      commit('updatePendulumMass', mass);
    },

    setPendulumLength({ commit }, length) {
      commit('updatePendulumLength', length);
    },

    setPConstant({ commit }, p_constant) {
      commit('updatePConstant', p_constant);
    },

    setIConstant({ commit }, i_constant) {
      commit('updateIConstant', i_constant);
    },

    setDConstant({ commit }, d_constant) {
      commit('updateDConstant', d_constant);
    },

    setMaxForce({ commit }, force) {
      commit('updateMaxForce', force);
    },

    toggleControlMode({ commit }, mode) {
      commit('updateControlMode', mode);
    },
    startTimer({ commit, state }) {
      const timer = setInterval(() => {
        if (!state.isPaused) {    
          if (state.currentTime < state.timeLimit) {
            commit('setCurrentTime', state.currentTime + 0.05);
          } else {
            clearInterval(timer);
            // commit('resetTimer');
            this.dispatch('resetTimer');


          // Dispatch an action at the end of the timer, if needed
          // commit('endOfSimulation');
        }
      }
      }, 100);
    },
    resetTimer({ commit }) {
      commit('resetTimer');
      this.dispatch("resetTimeSeries");
      this.dispatch("startTimer");
    },

    resetTimeSeries({ commit }) {
      commit('resetTimeSeriesData');
    },

    addDataPoint({ commit }, data) {
      commit('updateDatapoint', data);
    },
    togglePause({ commit }) {
      commit('pauseSimulation');
    },

  // actions and getters as needed
  },
});
