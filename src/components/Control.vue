<template>
  <v-container class="pa-1">
    <v-container id="canvas-container">
      <canvas ref="controlCanvas" id="controlCanvas"></canvas>
      <canvas ref="staticCanvas" id="staticCanvas"></canvas>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount} from 'vue';
import { useStore } from 'vuex';

const controlCanvas = ref(null);
const staticCanvas = ref(null);
const basePoint = ref({ x: null, y: null });
let animationFrameId;
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

const setupControlCanvas = () => {
  const canvas = controlCanvas.value;
  const ctx = canvas.getContext('2d');
  const staticCtx = staticCanvas.value.getContext('2d');
  staticCanvas.value.width = 800;
  staticCanvas.value.height = 200;
  canvas.width = 800;
  canvas.height = 200;

  ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawZeroForceLine(staticCtx);
  startAnimation(ctx, canvas.width, canvas.height);
};

const setBasePoint = () => {
  const canvas = controlCanvas.value;
  basePoint.value.x = canvas.width / 2;
  basePoint.value.y = canvas.height / 2;
};

const handleMouseMove = (event) => {
  const rect = controlCanvas.value.getBoundingClientRect();
  const scaleX = controlCanvas.value.width / rect.width;
  const scaleY = controlCanvas.value.height / rect.height;

  mouseX = (event.clientX - rect.left) * scaleX;
  mouseY = (event.clientY - rect.top) * scaleY;
};

const handleMouseDown = () => {
  isMouseDown = true;
};

const handleMouseUp = () => {
  isMouseDown = false;
};

const drawReferenceLine = (ctx) => {
  if (!isMouseDown) return;

  ctx.beginPath();
  ctx.moveTo(basePoint.value.x, basePoint.value.y);
  ctx.lineTo(mouseX, basePoint.value.y);
  ctx.strokeStyle = '#ff0000';
  ctx.stroke();
};

const drawZeroForceLine = (ctx) => {
  ctx.beginPath();
  ctx.moveTo(staticCanvas.value.width / 2, 10);
  ctx.lineTo(staticCanvas.value.width / 2, staticCanvas.value.height - 10);
  ctx.strokeStyle = '#000000';
  ctx.stroke();
};

const startAnimation = (ctx) => {
  const animate = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawReferenceLine(ctx);
    animationFrameId = requestAnimationFrame(animate);
  };

  animate();
};

onMounted(() => {
  setupControlCanvas();
  setBasePoint();
  controlCanvas.value.addEventListener('mousemove', handleMouseMove);
  controlCanvas.value.addEventListener('mousedown', handleMouseDown);
  controlCanvas.value.addEventListener('mouseup', handleMouseUp);
});

onBeforeUnmount(() => {
  controlCanvas.value.removeEventListener('mousemove', handleMouseMove);
  controlCanvas.value.removeEventListener('mousedown', handleMouseDown);
  controlCanvas.value.removeEventListener('mouseup', handleMouseUp);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
#canvas-container {
  position: relative;
  padding: 0px;
  height: 200px;
  width: 800px;
  margin: 0;
}

#staticCanvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  border: 1px solid #000;
}

#controlCanvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  border: 1px solid #000;
}
</style>
