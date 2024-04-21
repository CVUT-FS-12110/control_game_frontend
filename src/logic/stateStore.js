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
      pendulumMass: 1,
      pendulumLength: 1,
      controlMode: 'Mouse',
      distance: 0,
      timeLimit: 60, // Time limit in seconds
      currentTime: 0, // Current time in seconds
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
      state.force = force;
    },
    updateDisturbance(state, disturbance) {
      state.disturbance = disturbance;
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

    toggleControlMode({ commit }, mode) {
      commit('updateControlMode', mode);
    },
    startTimer({ commit, state }) {
      const timer = setInterval(() => {
        if (state.currentTime < state.timeLimit) {
          commit('setCurrentTime', state.currentTime + 1);
        } else {
          clearInterval(timer);
          // Dispatch an action at the end of the timer, if needed
          // commit('endOfSimulation');
        }
      }, 1000);
    },
    resetTimer({ commit }) {
      commit('resetTimer');
    },
  // actions and getters as needed
  },
});
