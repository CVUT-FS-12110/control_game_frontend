  export class ImgComponent {
    constructor({img, x, y, fi, speedX, speedFi, desired_size, m2px}) {
      this.img = img;
      this.x = x;
      this.y = y;
      this.fi = fi;
      this.speedX = speedX;
      this.speedFi = speedFi;
      this.m2px = m2px;
      this.desired_size = desired_size;
      this.scale = {x: desired_size.width / img.width, y: desired_size.height / img.height};
  
      // Set initial width and height based on the scale
      this.width = img.width * this.scale.x;
      this.height = img.height * this.scale.y;
  
      // Automatically calculate rotation axis based on image dimensions
      this.rotationAxis = {
        x: img.width / 2 * this.scale.x,
        y: img.height * this.scale.y
      };
    }
  
    draw(ctx) {
      ctx.save();
    
      // Step 1: Translate to the position of the rotation axis
      ctx.translate(this.x * this.m2px + this.rotationAxis.x, this.y + this.rotationAxis.y);
    
      // Step 2: Rotate the context
      ctx.rotate(this.fi);
    
      // Step 3: Translate back to position where the top left corner of the image should be
      ctx.translate(-this.rotationAxis.x, -this.rotationAxis.y);
    
      // Step 4: Draw the image at the new transformed position
      ctx.drawImage(this.img, 0, 0, this.width, this.height);
    
      // Restore the original context to not affect other drawings
      ctx.restore();
    }
    
  
    updatePosition(newX, newY) {
      this.x = newX;
      this.y = newY;
    }
  }
  

// export class FlameComponent {
//     constructor(img, basePoint, maxFlameSize) {
//       this.img = img;
//       this.basePoint = basePoint;
//       this.maxFlameSize = maxFlameSize;
//     }
  
//     draw(ctx, force) {
//       // Calculate the scale based on the magnitude of the force
//       const scale = Math.min(1, Math.abs(force) / 20); // Adjust this scaling factor as needed
  
//       // Set size to zero if force is zero
//       const flameHeight = scale === 0 ? 0 : this.maxFlameSize.height * scale;
//       const flameWidth = scale === 0 ? 0 : this.maxFlameSize.width * scale;
  
//       // Only draw the image if the size is greater than zero
//       if (flameHeight > 0 && flameWidth > 0) {
//         ctx.drawImage(
//           this.img,
//           this.basePoint.x - flameWidth / 2,
//           this.basePoint.y,
//           flameWidth,
//           flameHeight
//         );
//       }
//     }
//   }
  
export class FlameComponent {
    constructor(img, basePoint, maxFlameSize) {
      this.img = img;
      this.basePoint = basePoint;
      this.maxFlameSize = maxFlameSize;
    }
  
    draw(ctx, x, y, angle, force) {
      const scale = Math.min(1, Math.abs(force) / 20); // Adjust the scaling factor based on force
      const flameHeight = this.maxFlameSize.height * scale;
      const flameWidth = this.maxFlameSize.width * scale;
  
      if (flameHeight > 0 && flameWidth > 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle); // Rotate to match the direction from rocket bottom to mouse
        ctx.drawImage(
          this.img,
          -flameWidth / 2, // Center the flame image horizontally
          0, // Start drawing at the bottom of the rocket
          flameWidth,
          flameHeight
        );
        ctx.restore();
      }
    }
  }
  