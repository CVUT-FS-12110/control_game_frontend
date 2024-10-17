<template>
  <v-container class="pa-1">
    <canvas ref="pendulumCanvas" class="bordered-canvas"></canvas>
  </v-container>
  <!-- add reset button -->
  <v-btn @click="resetSimulation">Reset</v-btn>
  <v-btn @click="togglePause">{{ pauseLabel }}</v-btn>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, reactive, computed } from 'vue';
import segwayImage from "@/assets/segway.png";
import { ImgComponent } from '@/logic/imageComponent';
import { solvePendulumNonLinear, PID } from '@/logic/solver';
import { useStore } from 'vuex';
import { ArrowComponent } from '@/logic/arrowComponent';

const store = useStore();
const pendulumCanvas = ref(null);
const animationFrameId = ref(null);
const isMouseDown = ref(false);
const mousePosition = reactive({ x: 0, y: 0 });
const basePoint = reactive({ x: null, y: null });
const disturbanceBasePoint = reactive({ x: null, y: null });
const mouseForce = reactive({ x: 0, y: 0 });
const PIDForce = ref(0);
const params = reactive({
  deltaT: 0.0167,
  mC: computed(() => store.state.cartMass),
  mP: computed(() => store.state.pendulumMass),
  inertia: 0.002,
  b: 0.2,
  lt: computed(() => store.state.pendulumLength),
  g: -9.81,
  r0: computed(() => store.state.p_constant),
  rI: computed(() => store.state.i_constant),
  rD: computed(() => store.state.d_constant),
  lastState: ""
});
const states = reactive({ x: 0, xDot: 0, fi: 0, fiDot: 0 });
const segway = ref(null);
const PIDController = ref(null);
const arrow = ref(null);
const disturbanceArrow = ref(null);

const angle = computed(() => store.state.fi);
const controlMode = computed(() => store.state.controlMode);
const appliedForce = computed(() => store.state.totalForce);
const disturbance = computed(() => store.state.disturbance);
const timeLimit = computed(() => store.state.timeLimit);
const currentTime = computed(() => store.state.currentTime);
const pauseLabel = computed(() => store.state.isPaused ? 'Resume' : 'Pause');

const setupEventListeners = (canvas) => {
  canvas.addEventListener('mousemove', applyForceWithMouse);
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
};

const loadAndDrawImage = (canvas) => {
  const ctx = canvas.getContext('2d');
  const imgScale = 0.3;
  const img = new Image();
  const m2px = 100; // 1 meter = 100 pixels
  img.onload = () => {
    segway.value = new ImgComponent(img, basePoint.x, 20, 0, 0, 0, imgScale, m2px);
    startAnimation(ctx);
  };
  img.src = segwayImage;
};

const startAnimation = (ctx) => {
  let lastTime = 0;
  store.dispatch('resetTimer');
  store.dispatch('startTimer');

  const animate = (timestamp) => {
    if (store.state.isPaused) return;

    if (!lastTime) {
      lastTime = timestamp; // Initialize lastTime with the first timestamp
    }

    let deltaT = (timestamp - lastTime) * 0.001; // Convert to seconds

    ctx.clearRect(0, 0, pendulumCanvas.value.width, pendulumCanvas.value.height);
    updateSegwayPosition(deltaT);
    segway.value.draw(ctx);
    drawReferenceLine(ctx);
    drawDisturbanceLine(ctx);
    drawZeroLine(ctx);
    store.commit("updateDisturbance", generateRandomForce(-1, 1));
    store.commit("updateTotalForce", store.state.force + store.state.disturbance);
    lastTime = timestamp;
    animationFrameId.value = requestAnimationFrame(animate);
  };
  animate();
};

const updateSegwayPosition = (deltaT) => {
  updateStates(deltaT);
  segway.value.x = states.x;
  segway.value.fi = states.fi;
};

const drawReferenceLine = (ctx) => {
  if (!isMouseDown.value || controlMode.value !== 'Mouse') return;
  arrow.value.draw(ctx, mousePosition.x, basePoint.x);
};

const drawZeroLine = (ctx) => {
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(basePoint.x, 0);
  ctx.lineTo(basePoint.x, pendulumCanvas.value.height);
  ctx.strokeStyle = '#000000';
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash pattern
};

const drawDisturbanceLine = (ctx) => {
  disturbanceArrow.value.draw(ctx, disturbanceBasePoint.x + store.state.disturbance * 50, disturbanceBasePoint.x);
};

const generateRandomForce = (min, max) => Math.random() * (max - min) + min;

const applyForceWithPID = (deltaT) => {
  if (controlMode.value === 'PID') {
    let e = 0 - states.fi;
    PIDController.value.r0 = params.r0;
    PIDController.value.rI = params.rI;
    PIDController.value.rD = params.rD;
    store.commit('updateForce', PIDController.value.update(e, deltaT));
  }
};

const applyForceWithMouse = (event) => {
  if (!isMouseDown.value && controlMode.value === 'Mouse') {
    mouseForce.x = 0;
    store.commit('updateForce', mouseForce.x);
    params.lastState = 'Mouse';
  } else if (controlMode.value === 'Mouse') {
    const rect = pendulumCanvas.value.getBoundingClientRect();
    const scaleX = pendulumCanvas.value.width / rect.width;
    const scaleY = pendulumCanvas.value.height / rect.height;
    const forceScale = 0.05;
    mousePosition.x = (event.clientX - rect.left) * scaleX;
    mousePosition.y = (event.clientY - rect.top) * scaleY;
    mouseForce.x = (mousePosition.x - basePoint.x) * forceScale;
    store.commit('updateForce', mouseForce.x);
    params.lastState = 'Mouse';
  }
};

const updateStates = (deltaT) => {
  params.deltaT = deltaT || 0.016;

  if (controlMode.value === 'PID' && params.lastState !== 'PID') {
    PIDController.value.reset();
    states.x = 4;
    states.xDot = 0;
    states.fi = 0.15;
    states.fiDot = 0;
    applyForceWithPID(deltaT);
    params.lastState = 'PID';
  } else if (controlMode.value === 'PID' && params.lastState === 'PID') {
    applyForceWithPID(deltaT);
  }

  const newStates = solvePendulumNonLinear(states, appliedForce.value, params);
  states.x = newStates.x;
  states.xDot = newStates.xDot;
  states.fi = newStates.fi;
  states.fiDot = newStates.fiDot;

  if (states.x < 0) {
    states.x = 0;
    states.xDot = 0;
  } else if (states.x > ((pendulumCanvas.value.width - segway.value.width) / segway.value.m2px)) {
    states.x = ((pendulumCanvas.value.width - segway.value.width) / segway.value.m2px);
    states.xDot = 0;
  }

  store.commit('updateFi', states.fi);
  store.commit('updateX', states.x);
};

const handleMouseDown = (event) => {
  if (event.buttons === 1) {
    isMouseDown.value = true;
  }
};

const handleMouseUp = () => {
  isMouseDown.value = false;
};

onMounted(() => {
  initializeCanvas();
});

onBeforeUnmount(() => {
  cleanupCanvas();
});

const initializeCanvas = () => {
  const canvas = pendulumCanvas.value;
  if (canvas) {
    setupEventListeners(canvas);
    canvas.width = 800;
    canvas.height = 400;
    basePoint.x = canvas.width / 2;
    basePoint.y = canvas.height / 2;
    disturbanceBasePoint.x = canvas.width - 200;
    disturbanceBasePoint.y = canvas.height - 100;
    states.x = (basePoint.x - 75 * 0.3) / 100;
    loadAndDrawImage(canvas);
    arrow.value = new ArrowComponent(15, 15, '#ff0000', basePoint);
    disturbanceArrow.value = new ArrowComponent(15, 15, '#0000ff', disturbanceBasePoint);
    PIDController.value = new PID(params.r0, params.rI, params.rD, params.deltaT);
  }
};

const cleanupCanvas = () => {
  const canvas = pendulumCanvas.value;
  if (canvas) {
    canvas.removeEventListener('mousemove', applyForceWithMouse);
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mouseup', handleMouseUp);
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
    }
  }
};

const resetSimulation = () => {
  states.x = 4;
  states.xDot = 0;
  states.fi = 0;
  states.fiDot = 0;
  store.commit('updateFi', states.fi);
  store.commit('updateX', states.x);
  store.commit('updateForce', 0);
  store.dispatch('resetTimer');
};

const togglePause = () => {
  store.dispatch('togglePause');
  if (!store.state.isPaused) {
    startAnimation(pendulumCanvas.value.getContext('2d'));
  }
};
</script>

<style>
.bordered-canvas {
  border: 1px solid #000;
}
</style>
