import { createStore } from 'vuex';

export const stateStore = createStore({
  state() {
    return {
      x: 0,
      x_velocity: 0,
      fi: 0,
      fi_velocity: 0,
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
    // other mutations
  },
  // actions and getters as needed
});
