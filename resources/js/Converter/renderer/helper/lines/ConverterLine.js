

class ConverterLine {
    constructor(x, y, dx, dy, id){
        this.x      = x;
        this.y      = y;
        this.dx     = dx;
        this.dy     = dy;
        this.id     = id;
        this.BoxWidth  = 0.02; 
        this.ctx    = null;
        this.path   = null;
        this.scheme = new Object();
        this.scheme.color       = "red";
        this.scheme.lineWidth   = 2;
    }
    draw(ctx = this.ctx){
        CanvasHelper.Line(this.x, this.y, this.dx, this.dy, ctx, this.scheme);
    }
    get Path2D(){
        if(this.path == null) {
            this.updatePath();
        }
        return this.path;
    }
    updatePath(ctx = this.ctx){
        let difX = this.dx - this.x;
        let difY = this.dy - this.y;

        let difX1 = -difY;
        let difY1 = difX;
        let f = this.BoxWidth;
        let path = new Path2D();
            path.moveTo((this.x + difX1 * f), (this.y + difY1 * f));
            path.lineTo((this.x - difX1 * f), (this.y - difY1 * f));
            path.lineTo((this.dx - difX1 * f), (this.dy - difY1 * f));
            path.lineTo((this.dx + difX1 * f), (this.dy + difY1 * f));
            path.closePath();
        this.path = path;
    }
    getSnapPoint(x, y, data){
        // console.log(x, y);

        let difX = this.dx - this.x;
        let difY = this.dy - this.y;
        let ddX = -1;
        let ddY = -1;
        if(difX == 0){
            ddX = 1;
            ddY = 0;
        } else if(difY == 0){
            ddY = 1;
            ddX = 0;
        } else {
            ddX = difY / difX;
            ddY = difX / difY;
        }
        let yO = ddX * (y );
        let xO = ddY * (x );

        yO +=  data.ImageHeight /16.4 + data.ImageHeight /2;
       ;

        // let 

        // let dd = difX / difY;
        // let mX = (this.dy - this.y) / (this.dx - this.x);
        // let mY = (this.dx - this.x) / (this.dy - this.y);
        // console.log(mX, mY);
        // let xO = x * mX;
        // let yO = y * mY;
        // let g = ddX * x;
        console.log(x, y,xO, yO, ddX, ddY);
        return [xO, yO];
        // console.log(xO, yO);
    }
}