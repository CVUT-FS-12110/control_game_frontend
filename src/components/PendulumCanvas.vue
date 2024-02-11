<template>
    <v-container class="pa-1">
      <canvas ref="pendulumCanvas" class="bordered-canvas"></canvas>
    </v-container>
  </template>


<script>
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
      basePoint: { x: null, y: null },
      mouseX: 0,
      mouseY: 0,
    };
  },
  mounted() {
    this.loadAndDrawImage();
    this.setBasePoint();
    this.$refs.pendulumCanvas.addEventListener('mousemove', this.applyForceWithMouse);
    this.$refs.pendulumCanvas.addEventListener('mousedown', this.handleMouseDown);
    this.$refs.pendulumCanvas.addEventListener('mouseup', this.handleMouseUp);
  },
  beforeDestroy() {
    this.$refs.pendulumCanvas.removeEventListener('mousemove', this.applyForceWithMouse);
    this.$refs.pendulumCanvas.removeEventListener('mousedown', this.handleMouseDown);
    this.$refs.pendulumCanvas.removeEventListener('mouseup', this.handleMouseUp);
    // Cancel the animation frame request when the component is destroyed
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },
  methods: {
    loadAndDrawImage() {
      const canvas = this.$refs.pendulumCanvas;
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 400;
      const imgScale = 0.3;

      const img = new Image();
      img.onload = () => {
        // Initialize the segway instance with a starting position
        this.segway = new ImgComponent(img, 200, 20, 0, 0, 0, imgScale);
        this.startAnimation(ctx, canvas.width, canvas.height);
      };
      img.src = segwayImage;
    },

    setBasePoint() {
    // Assuming the base point is the center bottom of the canvas
    const canvas = this.$refs.pendulumCanvas;
    this.basePoint.x = canvas.width / 2;
    this.basePoint.y = canvas.height / 2;
  },

    drawReferenceLine(mouseX, mouseY) {
      const ctx = this.$refs.pendulumCanvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(this.basePoint.x, this.basePoint.y); // Start at the base point
      ctx.lineTo(mouseX, mouseY); // Draw line to current mouse position
      ctx.strokeStyle = '#ff0000'; // Set line color
      ctx.stroke();

      // Clear the line if necessary, depending on how you manage the canvas drawing
    },

    startAnimation(ctx, canvasWidth, canvasHeight) {
      let moveRight = true;

      const animate = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas

        // Update the segway's position
        if (this.segway.x > canvasWidth - this.segway.width) {
          moveRight = false;
        } else if (this.segway.x < 0) {
          moveRight = true;
        }

        // Move the segway right or left
        this.segway.x += moveRight ? 2 : -2;

        // Redraw the segway at its new position
        this.segway.draw(ctx);

        this.drawReferenceLine(this.mouseX, this.mouseY)
        // console.log(this.mouseX)

        // Request the next frame of the animation
        this.animationFrameId = requestAnimationFrame(animate);
      };

            this.animationFrameId = requestAnimationFrame(animate);
    },

    handleMouseDown(event) {
    // Check if the primary (left) mouse button is pressed
      if (event.buttons === 1) {
        this.isMouseDown = true;
      }
    },
    handleMouseUp(event) {
      this.isMouseDown = false;
    },
    applyForceWithMouse(event) {
      if (!this.isMouseDown) {
        // If the mouse is not pressed, do not apply force
        return;
      }
      const rect = this.$refs.pendulumCanvas.getBoundingClientRect();
      const scaleX = this.$refs.pendulumCanvas.width / rect.width; // Determine the scale factor for X
      const scaleY = this.$refs.pendulumCanvas.height / rect.height; // Determine the scale factor for Y
      
      // Adjust mouse position by the element's position and scale
      this.mouseX = (event.clientX - rect.left) * scaleX;
      this.mouseY = (event.clientY - rect.top) * scaleY;


      // Convert mouseX and mouseY to force values as needed for your simulation
      // This part depends on your specific needs and simulation setup
      let force = this.calculateForceFromMousePosition(this.mouseX, this.mouseY);
      // Draw the reference line
      this.drawReferenceLine(this.mouseX, this.mouseY);

      // Apply the force to your simulation
      // Example: this.applyForce(force);
    },
    calculateForceFromMousePosition(mouseX, mouseY) {
      // Implement logic to convert mouse position to force
      // This is a placeholder function; replace with your actual force calculation
      return { x: mouseX, y: mouseY };
    },

    clearCanvas() {
    const canvas = this.$refs.pendulumCanvas;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw anything else that needs to be persistent on the canvas
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
  