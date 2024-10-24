// export class ImgComponent {
//     constructor(img, x, y, fi, speedX, speedFi, segwayScale, m2px) {
//       this.width = img.width * segwayScale;
//       this.height = img.height * segwayScale;
//       this.img = img;
//       this.x = x;
//       this.y = y;
//       this.speedX = speedX;
//       this.fi = fi;
//       this.speedFi = speedFi;
//       this.segwayAxis = {
//         y: 454*segwayScale, //segway rotation axis
//         x: 75*segwayScale  //segway rotation axis
//     };
//       this.segwayScale = segwayScale;
//       this.m2px = m2px;
//           // Scale positions from meters to pixels
//       this.scaledX = this.x * this.segwayScale;
//       this.scaledY = this.y * this.segwayScale;
//       // this.scaledWidth = this.width * this.segwayScale;
//       // this.scaledHeight = this.height * this.segwayScale;
//     }
  
//     draw(ctx) {
//       // Ensure transformation is applied before drawing
//       // this.transform(ctx);

//       ctx.save();

//       ctx.translate(this.x * this.m2px + this.segwayAxis.x, this.y + this.segwayAxis.y);

//       ctx.rotate(this.fi);

//       ctx.drawImage(this.img, -this.segwayAxis.x, -this.segwayAxis.y, this.width, this.height);
      
//       ctx.restore();
  
//       // Adjusted to draw the image based on its transformed position
//       // ctx.drawImage(this.img, 0, 0, this.width, this.height);
  
//       // Reset transformation after drawing to not affect other canvas operations
//       // ctx.setTransform(1, 0, 0, 1, 0, 0);
//     }
  
//     transform(ctx) {
//       // Reset the current transformation matrix to the identity matrix

//       ctx.setTransform(1, 0, 0, 1, 0, 0);
  
//       ctx.transform(1, 0, 0, 1, this.x*this.m2px + this.segwayAxis.x, this.y*this.m2px + this.segwayAxis.y);// shift to the axis

//       ctx.transform(Math.cos(this.fi), Math.sin(this.fi), -Math.sin(this.fi), Math.cos(this.fi), 0, 0);// rotate

//       ctx.transform(1, 0, 0, 1, -this.segwayAxis.x, -this.segwayAxis.y); // shift to the img corner
  
//       // Additional translation if needed, for example, to center the image
//       // ctx.translate(-this.width / 2, -this.height / 2); // Uncomment if needed
//     }
//     // Inside ImgComponent class
//     updatePosition(newX, newY) {
//       this.x = newX;
//       this.y = newY;
// }

//   }
  

  export class ImgComponent {
    constructor(img, x, y, fi, speedX, speedFi, scale, m2px) {
      this.img = img;
      this.x = x;
      this.y = y;
      this.fi = fi;
      this.speedX = speedX;
      this.speedFi = speedFi;
      this.scale = scale;
      this.m2px = m2px;
  
      // Set initial width and height based on the scale
      this.width = img.width * this.scale;
      this.height = img.height * this.scale;
  
      // Automatically calculate rotation axis based on image dimensions
      this.rotationAxis = {
        x: img.width / 2 * this.scale,
        y: img.height * this.scale
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
  