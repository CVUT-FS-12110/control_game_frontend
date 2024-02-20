   <template>
    <v-container class="pa-1">
      <canvas ref="pendulumCanvas" class="bordered-canvas"></canvas>
    </v-container>
    <v-card>
      <v-card-title>Angle Value</v-card-title>
      <v-card-text>
        The current angle is: {{ angle }}
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import { onMounted, onBeforeUnmount, ref, reactive, watch, computed} from 'vue';
  import segwayImage from '@/assets/segway.png';
  import { ImgComponent } from '@/logic/imageComponent';
  import Control from './Control.vue';
  import { solvePendulumNonLinear } from '@/logic/solver';
  import Parameters from './Parameters.vue';
  import { useStore } from 'vuex';

// import Parameters from './Parameters.vue';
  
  export default {
    name: 'SegwayDisplay',
//     components: {
//     Control,
//     // Parameters,
//     // Parameters
// },
    setup() {
      const pendulumCanvas = ref(null);
      const animationFrameId = ref(null);
      const isMouseDown = ref(false);
      const mousePosition = reactive({ x: 0, y: 0 });
      const basePoint = reactive({ x: null, y: null });
      const force = reactive({ x: 0, y: 0 });
      const params = reactive({
        deltaT: 0.01,
        mC: 1.0,
        mP: 0.2,
        inertia: 0.002,
        b: 0.1,
        lt: 0.5,
        g: -9.81,
      });
      const states = reactive({ x: 0, xDot: 0, fi: 0, fiDot: 0 });
      const lastFrameTime = ref(null);
      const segway = ref(null);
      const store = useStore();
      const angle = computed(() => store.state.fi);
  
  
      const setupEventListeners = (canvas) => {
        canvas.addEventListener('mousemove', applyForceWithMouse);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mouseup', handleMouseUp);
      };
  
      const loadAndDrawImage = (canvas) => {
        const ctx = canvas.getContext('2d');
        const imgScale = 0.3;
        const img = new Image();
        img.onload = () => {
          segway.value = new ImgComponent(img, 200, 20, 0, 0, 0, imgScale);
          startAnimation(ctx);
        };
        img.src = segwayImage;
      };
  
      const startAnimation = (ctx) => {
        let lastTime = 0;
        
        const animate = (timestamp) => {

          if (!lastTime) {
             lastTime = timestamp; // Initialize lastTime with the first timestamp
              }

          let deltaT = (timestamp - lastTime)*0.001; // Convert to seconds

          ctx.clearRect(0, 0, pendulumCanvas.value.width, pendulumCanvas.value.height);
          updateSegwayPosition(deltaT);
          segway.value.draw(ctx);
          drawReferenceLine(ctx);
          lastTime = timestamp;
          animationFrameId.value = requestAnimationFrame(animate);
          
        };
        animate();
      };
  
      const updateSegwayPosition = (deltaT) => {
        // You will need to integrate your logic for updating the segway's position here.
        // This is a placeholder implementation.
        updateStates(deltaT);
        segway.value.x = states.x;
        segway.value.fi = states.fi;
  
        // Additional logic for updating segway's position based on the current state.
      };
  
      const drawReferenceLine = (ctx) => {
        if (!isMouseDown.value) return;
        ctx.beginPath();
        ctx.moveTo(basePoint.x, basePoint.y);
        ctx.lineTo(mousePosition.x, mousePosition.y);
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
      };


  
      const applyForceWithMouse = (event) => {
        if (!isMouseDown.value) {
          force.x = 0;
        }
        else {
        const rect = pendulumCanvas.value.getBoundingClientRect();
        const scaleX = pendulumCanvas.value.width / rect.width;
        const scaleY = pendulumCanvas.value.height / rect.height;
        const forceScale = 0.05;
        mousePosition.x = (event.clientX - rect.left) * scaleX;
        mousePosition.y = (event.clientY - rect.top) * scaleY;
        // Your logic to apply force based on mouse position.
        force.x = (mousePosition.x - basePoint.x) * forceScale;
        }

      };

          // Example method to update states using the solver
      const updateStates = (deltaT) => {
        
        params.deltaT = deltaT;
        
        if(!deltaT) {
          params.deltaT = 0.016;
        }
        
        // const rect = pendulumCanvas.value.getBoundingClientRect();
        const newStates = solvePendulumNonLinear(states, force.x, params);
        // Update the reactive states with the results
        states.x = newStates.x;
        states.xDot = newStates.xDot;
        states.fi = newStates.fi;
        states.fiDot = newStates.fiDot;
        store.commit('updateFi', states.fi)


        if (states.x < 0) {
          states.x = 0;
          states.xDot = 0;
        }
        else if (segway.x > (pendulumCanvas.value.width - segway.value.width)) {
          states.x = (pendulumCanvas.value.width - segway.value.width);
          states.xDot = 0;
        }
    };

  
      const handleMouseDown = (event) => {
        if (event.buttons === 1) {
          isMouseDown.value = true;
        }
      };
  
      const handleMouseUp = () => {
        isMouseDown.value = false;
        // Additional logic for when the mouse button is released.
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
          loadAndDrawImage(canvas);
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
  
      return {
        pendulumCanvas,
        angle,
        // xPosition,
        // yPosition,
        // appliedForce,
      // Other properties
  
        // Return any other properties and methods used in your template
      };
    },
  };
  </script>
  
  <style>
  .bordered-canvas {
    border: 1px solid #000;
  }
  </style>
  