export class ArrowComponent {
    constructor(arrowLength, arrowWidth, arrowColor, basePoint) {
     this.arrowLength = arrowLength;
     this.arrowWidth = arrowWidth;
     this.arrowColor = arrowColor;
     this.basePoint = basePoint;
     this.x1 = 0;
     this.y1 = 0;
     this.x2 = 0;
     this.y2 = 0;
     this.x3 = 0;
     this.y3 = 0;
    }
  
    draw(ctx, mousePosition) {

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.basePoint.x, this.basePoint.y);
        ctx.lineTo(mousePosition.x, this.basePoint.y);
        ctx.strokeStyle = this.arrowColor;
        ctx.stroke();
        
        
        if(mousePosition.x > this.basePoint.x) {
          this.x1 = mousePosition.x - this.arrowLength;
          this.y1 = this.basePoint.y - this.arrowWidth/2;
          this.x2 = mousePosition.x - this.arrowLength;
          this.y2 = this.basePoint.y + this.arrowWidth/2;
          this.x3 = mousePosition.x;
          this.y3 = this.basePoint.y;
        }
        else {
          this.x1 = mousePosition.x + this.arrowLength;
          this.y1 = this.basePoint.y - this.arrowWidth/2;
          this.x2 = mousePosition.x + this.arrowLength;
          this.y2 = this.basePoint.y + this.arrowWidth/2;
          this.x3 = mousePosition.x;
          this.y3 = this.basePoint.y;
        }
      
        // Calculate the points for the arrowhead
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2 );
        ctx.lineTo(this.x3, this.y3);
        ctx.lineTo(this.x1, this.y1);
        ctx.fillStyle = this.arrowColor;
        ctx.fill();
    }

  }
  