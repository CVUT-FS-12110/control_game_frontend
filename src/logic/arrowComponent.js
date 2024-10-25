// export class ArrowComponent {
//     constructor(arrowLength, arrowWidth, arrowColor, basePoint) {
//      this.arrowLength = arrowLength;
//      this.arrowWidth = arrowWidth;
//      this.arrowColor = arrowColor;
//      this.basePoint = basePoint;
//      this.x1 = 0;
//      this.y1 = 0;
//      this.x2 = 0;
//      this.y2 = 0;
//      this.x3 = 0;
//      this.y3 = 0;
//     }
  
//     draw(ctx, mousePosition, cartPosition){

//         ctx.lineWidth = 2;
//         ctx.beginPath();
//         ctx.moveTo(cartPosition, this.basePoint.y);
//         ctx.lineTo(mousePosition.x, this.basePoint.y);
//         ctx.strokeStyle = this.arrowColor;
//         ctx.stroke();
        
        
//         if(mousePosition.x > cartPosition) {
//           this.x1 = mousePosition.x - this.arrowLength;
//           this.y1 = this.basePoint.y - this.arrowWidth/2;
//           this.x2 = mousePosition.x - this.arrowLength;
//           this.y2 = this.basePoint.y + this.arrowWidth/2;
//           this.x3 = mousePosition.x;
//           this.y3 = this.basePoint.y;
//         }
//         else {
//           this.x1 = mousePosition.x + this.arrowLength;
//           this.y1 = this.basePoint.y - this.arrowWidth/2;
//           this.x2 = mousePosition.x + this.arrowLength;
//           this.y2 = this.basePoint.y + this.arrowWidth/2;
//           this.x3 = mousePosition.x;
//           this.y3 = this.basePoint.y;
//         }
      
//         // Calculate the points for the arrowhead
//         ctx.beginPath();
//         ctx.moveTo(this.x1, this.y1);
//         ctx.lineTo(this.x2, this.y2 );
//         ctx.lineTo(this.x3, this.y3);
//         ctx.lineTo(this.x1, this.y1);
//         ctx.fillStyle = this.arrowColor;
//         ctx.fill();
//     }

//   }
  
  export class ArrowComponent {
    constructor(arrowLength, arrowWidth, arrowColor, basePoint) {
      this.arrowLength = arrowLength;
      this.arrowWidth = arrowWidth;
      this.arrowColor = arrowColor;
      this.basePoint = basePoint;
    }
  
    draw(ctx, mousePosition, cartPosition) {
      const startX = cartPosition.x;
      const startY = cartPosition.y;
      const endX = mousePosition.x;
      const endY = mousePosition.y;
  
      // Calculate the angle of the arrow
      const angle = Math.atan2(endY - startY, endX - startX);
  
      // Draw the main line
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = this.arrowColor;
      ctx.stroke();
  
      // Calculate the arrowhead points
      const arrowheadX1 = endX - this.arrowLength * Math.cos(angle - Math.PI / 6);
      const arrowheadY1 = endY - this.arrowLength * Math.sin(angle - Math.PI / 6);
      const arrowheadX2 = endX - this.arrowLength * Math.cos(angle + Math.PI / 6);
      const arrowheadY2 = endY - this.arrowLength * Math.sin(angle + Math.PI / 6);
  
      // Draw the arrowhead
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(arrowheadX1, arrowheadY1);
      ctx.lineTo(arrowheadX2, arrowheadY2);
      ctx.lineTo(endX, endY);
      ctx.fillStyle = this.arrowColor;
      ctx.fill();
    }
  }
  