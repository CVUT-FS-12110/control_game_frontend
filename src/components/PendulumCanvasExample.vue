<template>
    <div ref="canvasContainer" class="canvas-container">
      <canvas ref="pendulumCanvas"></canvas>
    </div>
  </template>
  
  <script>
  // Import the physics solver
  import { calculatePendulumPhysics } from '@/logic/pendulumPhysics';
  
  export default {
    name: 'PendulumSimulation',
    mounted() {
      this.initializeCanvas();
      this.startAnimation();
    },
    methods: {
      initializeCanvas() {
        const canvas = this.$refs.pendulumCanvas;
        canvas.width = this.$refs.canvasContainer.offsetWidth;
        canvas.height = this.$refs.canvasContainer.offsetHeight;
        this.ctx = canvas.getContext('2d');
        this.pendulumLength = 100;
        this.angle = Math.PI / 4;
        this.angularVelocity = 0;
        this.gravity = 0.981;
      },
      startAnimation() {
        const animate = () => {
          requestAnimationFrame(animate);
          this.updatePhysics();
          this.draw();
        };
        animate();
      },
      updatePhysics() {
        // Use the imported physics solver
        const physics = calculatePendulumPhysics(this.angle, this.angularVelocity, this.pendulumLength, this.gravity);
        this.angle = physics.angle;
        this.angularVelocity = physics.angularVelocity;
      },
      draw() {
        const centerX = this.$refs.pendulumCanvas.width / 2;
        const centerY = 20;
        const pendulumX = centerX + this.pendulumLength * Math.sin(this.angle);
        const pendulumY = centerY + this.pendulumLength * Math.cos(this.angle);
  
        this.ctx.clearRect(0, 0, this.$refs.pendulumCanvas.width, this.$refs.pendulumCanvas.height);
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(pendulumX, pendulumY);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(pendulumX, pendulumY, 10, 0, 2 * Math.PI);
        this.ctx.fill();
      },
    },
  };
  </script>
  
  <style>
  .canvas-container {
    width: 100%;
    height: 100vh;
  }
  canvas {
    display: block;
    background-color: #f0f0f0;
  }
  </style>
  