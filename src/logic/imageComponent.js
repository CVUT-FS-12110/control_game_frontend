export class ImgComponent {
    constructor(img, x, y, fi, speedX, speedFi, segwayScale) {
      this.width = img.width * segwayScale;
      this.height = img.height * segwayScale;
      this.img = img;
      this.x = x;
      this.y = y;
      this.speedX = speedX;
      this.fi = fi;
      this.speedFi = speedFi;
      // Added segwayScale to the constructor for flexibility
      this.segwayScale = segwayScale;
    }
  
    draw(ctx) {
      // Ensure transformation is applied before drawing
      this.transform(ctx);
  
      // Adjusted to draw the image based on its transformed position
      ctx.drawImage(this.img, 0, 0, this.width, this.height);
  
      // Reset transformation after drawing to not affect other canvas operations
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  
    transform(ctx) {
      // Reset the current transformation matrix to the identity matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);
  
      // Translate to the current position
      ctx.translate(this.x, this.y);
  
      // Rotate by the current rotation angle
      ctx.rotate(this.fi);
  
      // Additional translation if needed, for example, to center the image
      // ctx.translate(-this.width / 2, -this.height / 2); // Uncomment if needed
    }
    // Inside ImgComponent class
    updatePosition(newX, newY) {
      this.x = newX;
      this.y = newY;
}

  }
  