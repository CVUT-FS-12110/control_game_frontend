<template>
    <div class="parameters">
      <p>X Position: {{ xPos }}</p>
      <p>Y Position: {{ yPos }}</p>
      <p>Applied Force: {{ force }}</p>
      <!-- Add more parameters as needed -->
    </div>
  </template>
  
  <script>
  export default {
    name: 'Parameters',
    props: {
      xPos: Number,
      yPos: Number,
      force: Number,
      // Define other parameters as props here
    }
  }
  </script>
  
  <style>
  /* Add styles for your parameters component here */
  .parameters {
    /* Styling example */
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
  }
  </style>
  