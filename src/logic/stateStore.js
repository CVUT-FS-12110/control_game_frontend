import { createStore } from 'vuex';

export const stateStore = createStore({
  state() {
    return {
      x: 0,
      x_velocity: 0,
      fi: 0,
      fi_velocity: 0,
      force: 0,
      cartMass: 1,
      controlMode: 'Mouse',
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
    updateCartMass(state, mass) {
      state.cartMass = mass;
    },

    updateControlMode(state, mode) {
      state.controlMode = mode;
    },
    // other mutations
  },
  actions: {
    setMass({ commit }, mass) {
      commit('updateCartMass', mass);
    },

    toggleControlMode({ commit }, mode) {
      commit('updateControlMode', mode);
    },
  // actions and getters as needed
  },
});
