<template>
    <v-container class="pa-1">
      <canvas ref="pendulumCanvas" class="bordered-canvas"></canvas>
    </v-container>
  </template>


<script>
import numeric from 'numeric';
import segwayImage from '@/assets/segway.png'; // Static import at the top
import { ImgComponent } from '@/logic/imageComponent';
import Control from './Control.vue';

export default {
  name: 'SegwayDisplay',
  components: {
    Control
  },
  data() {
    return {
      segway: null,
      animationFrameId: null,
      isMouseDown: false,
      mousePosition: { x: 0, y: 0 },
      basePoint: { x: null, y: null },
      force: { x: 0, y: 0 },
      params: {
                deltaT: 0.01,
                mC: 0.5,
                mP: 0.5,
                inertia: 0.002,
                b: 0.1,
                lt: 0.5,
                g: 9.81
              },
      result: {x1: 0, x2: 0, x3: 0, x4: 0}
    };
  },
  mounted() {
    this.initializeCanvas();
  },
  beforeDestroy() {
    this.cleanupCanvas();
  },
  methods: {
    initializeCanvas() {
      const canvas = this.$refs.pendulumCanvas;
      this.setupEventListeners(canvas);
      canvas.width = 800;
      canvas.height = 400;
      this.basePoint.x = canvas.width / 2;
      this.basePoint.y = canvas.height / 2;
      this.loadAndDrawImage(canvas);
    },
    setupEventListeners(canvas) {
      canvas.addEventListener('mousemove', this.applyForceWithMouse);
      canvas.addEventListener('mousedown', this.handleMouseDown);
      canvas.addEventListener('mouseup', this.handleMouseUp);
    },
    cleanupCanvas() {
      const canvas = this.$refs.pendulumCanvas;
      canvas.removeEventListener('mousemove', this.applyForceWithMouse);
      canvas.removeEventListener('mousedown', this.handleMouseDown);
      canvas.removeEventListener('mouseup', this.handleMouseUp);
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    },
    loadAndDrawImage(canvas) {
      const ctx = canvas.getContext('2d');
      const imgScale = 0.3;
      const img = new Image();
      img.onload = () => {
        this.segway = new ImgComponent(img, 200, 20, 0, 0, 0, imgScale);
        this.startAnimation(ctx);
      };
      img.src = segwayImage;
    },
    startAnimation(ctx) {
      const animate = () => {
        ctx.clearRect(0, 0, this.$refs.pendulumCanvas.width, this.$refs.pendulumCanvas.height);
        // this.updateSegwayPosition();
        this.updateSegwayPosition();
        this.segway.draw(ctx);
        this.drawReferenceLine();
        this.animationFrameId = requestAnimationFrame(animate);
      };
      this.animationFrameId = requestAnimationFrame(animate);
    },
    updateSegwayPosition() {
      // Simplified movement logic for demonstration
      this.segway.x = this.force.x;

    },
    isMovingLeft() {
      return this.segway.x <= 0;
    },
      // Continued from the previous refactoring example

  handleMouseDown(event) {
    if (event.buttons === 1) { // Check if the primary (left) mouse button is pressed
      this.isMouseDown = true;
    }
  },

  handleMouseUp() {
    this.isMouseDown = false;
    // Optionally reset the force or make other adjustments on mouse release
  },

  applyForceWithMouse(event) {
    if (!this.isMouseDown) return; // Exit if the mouse is not pressed

    const rect = this.$refs.pendulumCanvas.getBoundingClientRect();
    const scaleX = this.$refs.pendulumCanvas.width / rect.width; // Scale factor for X
    const scaleY = this.$refs.pendulumCanvas.height / rect.height; // Scale factor for Y

    // Adjust mouse position based on the canvas position and scale
    this.mousePosition.x = (event.clientX - rect.left) * scaleX;
    this.mousePosition.y = (event.clientY - rect.top) * scaleY;

    // Example: Convert mouse position to force and apply it
    this.force = this.calculateForceFromMousePosition(this.mousePosition.x, this.mousePosition.y);
    // Apply the calculated force to your simulation
    // Example: this.applyForce(force);
  },

  drawReferenceLine() {
    if (!this.isMouseDown) return; // Only draw the line if the mouse is pressed

    const ctx = this.$refs.pendulumCanvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(this.basePoint.x, this.basePoint.y); // Start from the base point
    ctx.lineTo(this.mousePosition.x, this.mousePosition.y); // Draw line to the current mouse position
    ctx.strokeStyle = '#ff0000'; // Set the line color
    ctx.stroke();
    // Clear the line as necessary, depending on your canvas management strategy
  },

  calculateForceFromMousePosition(mouseX, mouseY) {
    // Implement the logic to convert mouse position to force
    // Placeholder function; replace with actual force calculation logic
    return { x: mouseX - this.basePoint.x, y: mouseY - this.basePoint.y };
  },

  transform(){
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.transform(1, 0, 0, 1, this.x * this.m2px + this.axis.x, this.y * this.m2px + this.axis.y);// shift to the axis
        this.ctx.transform(Math.cos(this.fi), Math.sin(this.fi), -Math.sin(this.fi), Math.cos(this.fi), 0, 0);// rotate
        this.ctx.transform(1, 0, 0, 1, -this.axis.x, -this.axis.y); // shift to the img corner
    },

  updateSegwayPosition(){
        //call solver
        this.result = this.solvePendulumNonLinear(
                                                    this.segway.x,
                                                    this.segway.speedX,
                                                    this.segway.fi,
                                                    this.segway.speedFi,
                                                    this.force.x,
                                                    this.params.deltaT,
                                                    this.params.mC,
                                                    this.params.mP,
                                                    this.params.inertia,
                                                    this.params.b,
                                                    this.params.lt,
                                                    -this.params.g);
        //update segway
        this.segway.x = this.result.x1;
        this.segway.speedX = this.result.x2;
        // this.segway.fi = this.result.x3;
        // this.segway.speedFi = this.result.x4;

  },

    

  solvePendulumNonLinear(x, xDot, fi, fiDot, u, deltaT, mC, mP, b, lt, g) {
      if (xDot > 0){
          u = u - 1;      
      } else if (xDot < 0){
          u = u + 1;
      }
      //denominator for shorter eqn
      let denom = ((7*lt**2*mP**2)/3 - lt**2*mP**2*Math.cos(fi)**2 + (7*mC*lt**2*mP)/3);

      //explicit euler solver
      let x2e = xDot + deltaT*((7*u*lt**2*mP)/3 - (7*b*xDot*lt**2*mP)/3 + (7*fiDot**2*lt**3*mP**2*Math.sin(fi))/3 + g*lt**2*mP**2*Math.cos(fi)*Math.sin(fi))/denom;
      let x3e= fi + deltaT*fiDot;
      let x4e = fiDot - deltaT*(lt*mP*(lt*mP*Math.cos(fi)*Math.sin(fi)*fiDot**2 + u*Math.cos(fi) + g*mP*Math.sin(fi) + mC*g*Math.sin(fi) - b*xDot*Math.cos(fi)))/denom;

      //implicit euler solver
      denom = ((7*lt**2*mP**2)/3 - lt**2*mP**2*Math.cos(x3e)**2 + (7*mC*lt**2*mP)/3);

      return {
          x1: x + deltaT*x2e,
          x2: xDot + deltaT*((7*u*lt**2*mP)/3 - (7*b*x2e*lt**2*mP)/3 + (7*x4e**2*lt**3*mP**2*Math.sin(x3e))/3 + g*lt**2*mP**2*Math.cos(x3e)*Math.sin(x3e))/denom,
          x3: fi + deltaT*x4e,
          x4: fiDot - deltaT*(lt*mP*(lt*mP*Math.cos(x3e)*Math.sin(x3e)*x4e**2 + u*Math.cos(x3e) + g*mP*Math.sin(x3e) + mC*g*Math.sin(x3e) - b*x2e*Math.cos(x3e)))/denom
      }
  },

  clearCanvas() {
    const ctx = this.$refs.pendulumCanvas.getContext('2d');
    ctx.clearRect(0, 0, this.$refs.pendulumCanvas.width, this.$refs.pendulumCanvas.height);
    // Optionally, redraw anything else that needs to be persistent on the canvas
  },

  },
};
</script>
  
  
  <style>
  .bordered-canvas {
    border: 1px solid #000;
  }
  /* .canvas-container { */
    /* position: relative; */
    /* width: 100%; */
    /* height: 100vh; */
  /* } */
  /* canvas {
    display: block;
    background-color: #f0f0f0;
  } */

  </style>
  