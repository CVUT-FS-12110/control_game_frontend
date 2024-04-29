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
      timeLimit: 60, // Time limit in seconds
      currentTime: 0, // Current time in seconds
      timeSeriesData: {
                      t: [],
                      x: []
      }
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
    },

    resetTimeSeriesData(state) {
      state.timeSeriesData = {
        t: [],
        x: []
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
        if (state.currentTime < state.timeLimit) {
          commit('setCurrentTime', state.currentTime + 0.01);
        } else {
          clearInterval(timer);
          // Dispatch an action at the end of the timer, if needed
          // commit('endOfSimulation');
        }
      }, 10);
    },
    resetTimer({ commit }) {
      commit('resetTimer');
    },

    resetTimeSeriesData({ commit }) {
      commit('resetTimeSeriesData');
    },

    addDataPoint({ commit }, data) {
      commit('updateDatapoint', data);
    },

  // actions and getters as needed
  },
});
