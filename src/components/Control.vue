<!-- <template>
    <v-container class="pa-1" style="position: relative; width: 800; height: 400;">  
      <canvas ref="controlCanvas" style="border: 1px solid #000; position: absolute; top: 0; left: 0; z-index: 0;" ></canvas>
      <canvas ref="staticCanvas" style="position: absolute; top: 0; left: 0; border: 1px solid #000; z-index: 1;" ></canvas>
    </v-container>
  </template> -->
  

  <template>
    <v-container class="pa-1">
      <v-container id="canvas-container" >  
      <canvas ref="controlCanvas" id="controlCanvas"></canvas>
      <canvas ref="staticCanvas" id="staticCanvas" ></canvas>
    </v-container>
  </v-container>
  </template>


  <script>
  export default {
    name: 'Control',
    mounted() {
      this.setupControlCanvas();
      this.$refs.controlCanvas.addEventListener('mousemove', this.handleMouseMove);
      // Add other event listeners as needed, e.g., mousedown, mouseup
      this.$refs.controlCanvas.addEventListener('mousedown', this.handleMouseDown);
      this.$refs.controlCanvas.addEventListener('mouseup', this.handleMouseUp);
      this.setBasePoint();

    },
    data() {
      return {
        basePoint: { x: null, y: null },
        
      };
    },

    beforeDestroy() {
      this.$refs.controlCanvas.removeEventListener('mousemove', this.handleMouseMove);
      this.$refs.controlCanvas.removeEventListener('mousedown', this.handleMouseDown);
      this.$refs.controlCanvas.removeEventListener('mouseup', this.handleMouseUp);

      // Remove other event listeners as needed
    },
    methods: {
      setupControlCanvas() {
        const canvas = this.$refs.controlCanvas;
        const ctx = canvas.getContext('2d');
        const staticCanvas = this.$refs.staticCanvas;
        staticCanvas.width = 800;
        staticCanvas.height = 200;
        canvas.width = 800;
        canvas.height = 200;
  
        // Initial drawing or setup, e.g., drawing the initial state of the control
        ctx.fillStyle = 'rgba(0, 0, 255, 0.2)'; // Example: light blue fill
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw a vertical line in the middle of the canvas with padding
        this.drawZeroForceLine();
        
        this.startAnimation(ctx, canvas.width, canvas.height);
        // Setup event listeners for user interaction
        
        // Add other event listeners as needed, e.g., mousedown, mouseup
      },

      setBasePoint() {
        // Assuming the base point is the center bottom of the canvas
        const canvas = this.$refs.controlCanvas;
        this.basePoint.x = canvas.width / 2;
        this.basePoint.y = canvas.height / 2;
      },



      handleMouseMove(event) {
      const rect = this.$refs.controlCanvas.getBoundingClientRect();
      const scaleX = this.$refs.controlCanvas.width / rect.width; // Determine the scale factor for X
      const scaleY = this.$refs.controlCanvas.height / rect.height; // Determine the scale factor for Y
      
      // Adjust mouse position by the element's position and scale
      this.mouseX = (event.clientX - rect.left) * scaleX;
      this.mouseY = (event.clientY - rect.top) * scaleY;
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
      // Convert mouseX and mouseY to force values as needed for your simulation
      // This part depends on your specific needs and simulation setup
      // let force = this.calculateForceFromMousePosition(mouseX, mouseY);
      // Draw the reference line
      this.drawReferenceLine(mouseX, mouseY);

      // Apply the force to your simulation
      // Example: this.applyForce(force);

    },
    drawReferenceLine(mouseX, mouseY) {
      const ctx = this.$refs.controlCanvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(this.basePoint.x, this.basePoint.y); // Start at the base point
      ctx.lineTo(mouseX, this.basePoint.y); // Draw line to current mouse position
      ctx.strokeStyle = '#ff0000'; // Set line color
      ctx.stroke();

      // Clear the line if necessary, depending on how you manage the canvas drawing
    },

    drawZeroForceLine() {
      const staticCanvas = this.$refs.staticCanvas;
      const ctx = staticCanvas.getContext('2d');
      // Draw a vertical line in the middle of the static canvas
      ctx.beginPath();
      ctx.moveTo(staticCanvas.width / 2, 10);
      ctx.lineTo(staticCanvas.width / 2, staticCanvas.height - 10);
      ctx.strokeStyle = '#000000'; // Black color
      ctx.stroke();
    },
    startAnimation(ctx, canvasWidth, canvasHeight) {

      const animate = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas

        this.drawReferenceLine(this.mouseX, this.mouseY)
        

        // Request the next frame of the animation
        this.animationFrameId = requestAnimationFrame(animate);
      };

      this.animationFrameId = requestAnimationFrame(animate);
      
},
      // Start the animation loop
      // Example: this.animationFrameId = requestAnimationFrame(this.animate);
    },
  };



  </script>
  
  <style scoped>
  #canvas-container {
    position: relative;
    padding: 0px;
    height: 200px;
    width: 800px;
    margin: 0;
  }

 #staticCanvas{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #000;


  }

  #controlCanvas{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    border: 1px solid #000;


  }


  
  /* .control-container {
    width: 100%;
    height: 100vh;
  }
  canvas {
    display: block;
    background-color: #f0f0f0;
  } */
  </style>
  