<template>
    <div ref="threejsCanvas"></div>
  </template>
  
  <script>
  import * as THREE from 'three';
  
  export default {
    name: 'ThreeJsPendulum',
    mounted() {
      this.initThreeJS();
    },
    methods: {
      initThreeJS() {
        const width = this.$refs.threejsCanvas.clientWidth;
        const height = this.$refs.threejsCanvas.clientHeight;
  
        // Scene
        const scene = new THREE.Scene();
  
        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);
  
        // Renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        this.$refs.threejsCanvas.appendChild(renderer.domElement);
  
        // Pendulum Object (using a simple box as a placeholder)
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
  
        // Animation Loop
        const animate = () => {
          requestAnimationFrame(animate);
  
          // Pendulum animation logic here
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
  
          renderer.render(scene, camera);
        };
  
        animate();
      },
    },
  };
  </script>
  
  <style scoped>
  div {
    width: 100%;
    height: 100vh;
  }
  </style>
  