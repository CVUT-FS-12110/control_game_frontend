<script setup>
import { onMounted, onBeforeUnmount, ref, reactive, computed } from 'vue';
import rocketImage from "@/assets/rocket-icon-vector.jpg";
import flamesImage from "@/assets/flames.png";
import { ImgComponent, FlameComponent } from '@/logic/imageComponent';
import { solvePendulumNonLinear, PID } from '@/logic/solver';
import { useStore } from 'vuex';
import { ArrowComponent } from '@/logic/arrowComponent';

const store = useStore();
const pendulumCanvas = ref(null);
const animationFrameId = ref(null);
const basePoint = reactive({ x: null, y: null });
const disturbanceBasePoint = reactive({ x: null, y: null });
const forceControl = reactive({ angle: Math.PI /2 , magnitude: 10 }); // Added control for angle and force magnitude
const desired_img_size = { width: 50, height: 100 };
// Parameters for the simulation
const params = reactive({
  deltaT: 0.0167, // Time step for simulation
  mC: computed(() => store.state.cartMass), // Mass of the cart
  mP: computed(() => store.state.pendulumMass), // Mass of the pendulum
  inertia: 0.02, // Inertia of the pendulum
  b: 1, // Damping coefficient
  lt: computed(() => store.state.pendulumLength), // Length of the pendulum
  g: -9.81, // Gravitational constant
  r0: computed(() => store.state.p_constant), // Proportional gain for PID
  rI: computed(() => store.state.i_constant), // Integral gain for PID
  rD: computed(() => store.state.d_constant), // Derivative gain for PID
  lastState: "" // Last control state (PID or Keyboard)
});

// State variables for the pendulum and cart
const states = reactive({ x: 0, xDot: 0, fi: 0, fiDot: 0 });
const segway = ref(null);
const rocketBottom = reactive({ x: 0, y: 0 });
const PIDController = ref(null);
const rocketFlames = ref(null);

// Pause button label
const pauseLabel = computed(() => store.state.isPaused ? 'Resume' : 'Pause');

// Setup event listeners for keyboard controls
const setupKeyboardEventListeners = () => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
};

// Handle keydown event for force control
const handleKeyDown = (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      forceControl.angle -= 0.05; // Decrease the angle of the force
      break;
    case 'ArrowRight':
      forceControl.angle += 0.05; // Increase the angle of the force
      break;
    case 'a':
    case 'A':
      forceControl.magnitude += 0.5; // Increase the force magnitude
      store.commit('updateForce', forceControl.magnitude); // Commit force value to store
      break;
    case 's':
    case 'S':
      forceControl.magnitude -= 0.5; // Decrease the force magnitude
      if (forceControl.magnitude < 0) forceControl.magnitude = 0; // Ensure force magnitude is non-negative
      store.commit('updateForce', forceControl.magnitude); // Commit force value to store
      break;
  }
};

// Handle keyup event to reset any continuous behavior if needed
const handleKeyUp = (event) => {
  // Optional: Add logic if you need to stop something when the key is released
};

// Load and draw the image of the segway
const loadAndDrawImage = (canvas) => {
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const m2px = 100; // 1 meter = 100 pixels
  img.onload = () => {
    segway.value = new ImgComponent({img: img, x: basePoint.x, y: 100, fi: 0, speedX: 0, speedFi: 0, desired_size: desired_img_size, m2px: m2px});
    ctx.drawImage(img, basePoint.x - img.width / 2, basePoint.y - img.height, img.width, img.height);
    startAnimation(ctx);
  };

  img.src = rocketImage;

  // Load the flames image
  const flamesImg = new Image();
  flamesImg.onload = () => {
    rocketFlames.value = new FlameComponent(flamesImg, basePoint, { width: 50, height: 150 });
  };
  flamesImg.src = flamesImage;
};

// Start the animation loop
const startAnimation = (ctx) => {
  let lastTime = 0;
  store.dispatch('resetTimer');
  store.dispatch('startTimer');

  const animate = (timestamp) => {
    if (store.state.isPaused) return; // Pause the animation if needed

    if (!lastTime) {
      lastTime = timestamp; // Initialize lastTime with the first timestamp
    }

    let deltaT = (timestamp - lastTime) * 0.001; // Convert to seconds

    // Clear the canvas and update the simulation
    ctx.clearRect(0, 0, pendulumCanvas.value.width, pendulumCanvas.value.height);
    updateSegwayPosition(deltaT);
    segway.value.draw(ctx);
    drawFlames(ctx); // Draw flames
    drawZeroLine(ctx);
    store.commit("updateDisturbance", generateRandomForce(-1, 1));
    store.commit("updateTotalForce", store.state.force + store.state.disturbance);
    lastTime = timestamp;
    animationFrameId.value = requestAnimationFrame(animate);
  };
  animationFrameId.value = requestAnimationFrame(animate);
};

// Update the position of the segway
const updateSegwayPosition = (deltaT) => {
  updateStates(deltaT);
  segway.value.x = states.x;
  segway.value.fi = states.fi;
  rocketBottom.x = segway.value.x * segway.value.m2px;
  rocketBottom.y = segway.value.y + segway.value.desired_size.height;
};

// Draw flames based on the applied force
const drawFlames = (ctx) => {
  if (rocketFlames.value) {
    const angle = forceControl.angle;
    rocketFlames.value.draw(ctx, rocketBottom.x, rocketBottom.y, angle - Math.PI / 2, forceControl.magnitude);
  }
};

// Draw the zero line for reference
const drawZeroLine = (ctx) => {
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(basePoint.x, 0);
  ctx.lineTo(basePoint.x, pendulumCanvas.value.height);
  ctx.strokeStyle = '#000000';
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash pattern
};

// Generate a random force within a given range
const generateRandomForce = (min, max) => Math.random() * (min - max) + min;

// Update the states of the pendulum and cart
const updateStates = (deltaT) => {
  params.deltaT = deltaT || 0.016;

  // Update the states using the nonlinear solver
  const forceX = forceControl.magnitude * Math.cos(forceControl.angle);
  const newStates = solvePendulumNonLinear(states, -forceX, params);
  states.x = newStates.x;
  states.xDot = newStates.xDot;
  states.fi = newStates.fi;
  states.fiDot = newStates.fiDot;

  // Ensure the cart stays within the canvas bounds
  if (states.x < 0) {
    states.x = 0;
    states.xDot = 0;
  } else if (states.x > ((pendulumCanvas.value.width - segway.value.width) / segway.value.m2px)) {
    states.x = ((pendulumCanvas.value.width - segway.value.width) / segway.value.m2px);
    states.xDot = 0;
  }

  // Update the store with the new states
  store.commit('updateFi', states.fi);
  store.commit('updateX', states.x);
};

// Lifecycle hook to initialize the canvas
onMounted(() => {
  initializeCanvas();
  setupKeyboardEventListeners();
});

// Lifecycle hook to clean up the canvas
onBeforeUnmount(() => {
  cleanupCanvas();
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});

// Initialize the canvas and set up components
const initializeCanvas = () => {
  const canvas = pendulumCanvas.value;
  if (canvas) {
    canvas.width = 800;
    canvas.height = 400;
    basePoint.x = canvas.width / 2;
    basePoint.y = canvas.height / 2;
    disturbanceBasePoint.x = canvas.width - 200;
    disturbanceBasePoint.y = canvas.height - 100;
    states.x = (basePoint.x - 75 * 0.3) / 100;
    loadAndDrawImage(canvas);
    PIDController.value = new PID(params.r0, params.rI, params.rD, params.deltaT);
  }
};

// Clean up the canvas and remove event listeners
const cleanupCanvas = () => {
  const canvas = pendulumCanvas.value;
  if (canvas) {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
    }
  }
};
</script>

<template>
  <v-container class="pa-1">
    <canvas ref="pendulumCanvas" class="bordered-canvas"></canvas>
  </v-container>
  <!-- add reset button -->
  <v-btn @click="resetSimulation">Reset</v-btn>
  <v-btn @click="togglePause">{{ pauseLabel }}</v-btn>
</template>

<style>
.bordered-canvas {
  border: 1px solid #000;
}
</style>
