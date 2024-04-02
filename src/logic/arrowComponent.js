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
  
    draw(ctx, mousePosition, cartPosition){

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cartPosition, this.basePoint.y);
        ctx.lineTo(mousePosition, this.basePoint.y);
        ctx.strokeStyle = this.arrowColor;
        ctx.stroke();
        
        
        if(mousePosition > cartPosition) {
          this.x1 = mousePosition - this.arrowLength;
          this.y1 = this.basePoint.y - this.arrowWidth/2;
          this.x2 = mousePosition - this.arrowLength;
          this.y2 = this.basePoint.y + this.arrowWidth/2;
          this.x3 = mousePosition;
          this.y3 = this.basePoint.y;
        }
        else {
          this.x1 = mousePosition + this.arrowLength;
          this.y1 = this.basePoint.y - this.arrowWidth/2;
          this.x2 = mousePosition + this.arrowLength;
          this.y2 = this.basePoint.y + this.arrowWidth/2;
          this.x3 = mousePosition;
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
  