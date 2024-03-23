
class ConverterTouchHandler {
    static {
        this.rotation = new Object();
        this.distance = new Object();
        this.ELEConverter = null;
    }
    static get ELEConverter(){
        if(this._ELEConverter == null) {
            this._ELEConverter = $("#" + ConverterHelper.ELE_SQUARE_BORDER);
        }
        return this._ELEConverter;
    }
    static set ELEConverter(v){
        this._ELEConverter = v;
    }
    static touchStart(e){
        // if(!this.CanvasActive){
        //   return;
        // }
        // console.dir(e);
        ConverterTouchHandler.startDistance(e);
        ConverterTouchHandler.startRotation(e);
        ConverterTouchEvents.start.call(this, e, false);
    }
    static touchMove(e){
        if(!this.CanvasActive){
          return;
        }
        let g = ConverterTouchHandler.calcRotation(e);

        ConverterTouchHandler.calcDistance(e);
        // if(e.touches.length > 1){
        //     let g = ConverterTouchHandler.calcRotation(e.touches);
            // console.log(ConverterTouchHandler.distance);
        //     console.log(e);
        //     e.rot = g;
        // }
        // console.dir(
        //     e);
        //     let sP1X = this.rotation.start.p1.x
        //     let sP1Y = this.rotation.start.p1.y
        //     let sP2X = this.rotation.start.p2.x
        //     let sP2Y = this.rotation.start.p2.y

        //     let nP1X = e.touches[0].pageX 
        //     let nP1Y = e.touches[0].pageY 
        //     let nP2X = e.touches[1].pageX 
        //     let nP2Y = e.touches[1].pageY 

        //     let div1X = Math.abs(sP1X - sP2X);
        //     let div1Y = Math.abs(sP1Y - sP2Y);

        //     let div2X = Math.abs(nP1X - nP2X);
        //     let div2Y = Math.abs(nP1Y - nP2Y);
        // window.requestAnimationFrame(function(){
            ConverterTouchEvents.move.call(this, e, false)
        // }.bind(this));
    }
    static touchEnd(e){
        if(!this.CanvasActive){
          return;
        }
        ConverterTouchHandler.endRotation(e);
        ConverterTouchHandler.endDistance(e);
        ConverterTouchEvents.end.call(this, e, false);
    }
    static calcOffset(e){

        let offset = ConverterTouchHandler.ELEConverter.offset();
        this.mouse.X = e.touches[0].pageX - (offset.left);
        this.mouse.Y = e.touches[0].pageY - (offset.top);
    }
    static startRotation(event){
        this.rotation = new Object();
        if(event.touches.length >= 2){
            // this.rotation.start = new Object();
            // this.rotation.start.p1 = new Object();
            // this.rotation.start.p1.x = event.touches[0].pageX 
            // this.rotation.start.p1.y = event.touches[0].pageY
            // this.rotation.start.p2 = new Object();
            // this.rotation.start.p2.x = event.touches[1].pageX 
            // this.rotation.start.p2.y = event.touches[1].pageY 
            // this.rotation.start = Math.atan2(event.touches[0].pageY - event.touches[1].pageY, event.touches[0].pageX - event.touches[1].pageX) * 180 / Math.PI;
        }
    }
    static endRotation(event){
        console.dir(event)
        console.dir(this.rotation)
        // this.rotation = new Object();
    }
    static calcRotation(event){
        let rotation = event.rotation;
        if(event.touches.length >= 2){
            rotation = Math.atan2(event.touches[0].pageY - event.touches[1].pageY, event.touches[0].pageX - event.touches[1].pageX) * 180 / Math.PI;
        } else {
            return false;
        }
        this.rotation.now = rotation - this.rotation.start;
        // if (!rotation) {
        // }
       return this.rotation.now;
    }
    static startDistance(event){
        ConverterTouchHandler.distance.now = 0;
        ConverterTouchHandler.distance.start = ConverterTouchHandler.calcDistance(event);
    }
    static endDistance(){
        ConverterTouchHandler.distance = new Object();
        ConverterTouchHandler.distance.now = 0;
    }
    static calcDistance(event){
        if(event.touches.length >= 2){
            let x = Math.abs(event.touches[0].pageX - event.touches[1].pageX);
            let y = Math.abs(event.touches[0].pageY - event.touches[1].pageY);
            let dist = S_Math.pytagoras(x, y);
            ConverterTouchHandler.distance.now = dist;
            ConverterTouchHandler.distance.ratio = 1 / ConverterTouchHandler.distance.start *dist;
            return dist;
        }
        return 0;
    }
}