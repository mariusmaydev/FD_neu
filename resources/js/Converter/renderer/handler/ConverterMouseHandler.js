

class ConverterMouseHandler {
    static animationTime = 0;
    static mouseDown(e){
        if(!this.CanvasActive){
            return;
        }
        ConverterEvents.start.call(this, e);
    }
    static mouseMove(e){
        if(!this.CanvasActive){ 
            return; 
        }
        if((Date.now() - ConverterMouseHandler.animationTime) > 16){
            ConverterMouseHandler.animationTime = Date.now();
            let a = window.requestAnimationFrame(function(){
                ConverterEvents.move.call(this, e)
            }.bind(this));
        }
    }
    static mouseUp(e){
        if(!this.CanvasActive){
            return;
        }
        ConverterEvents.end.call(this, e);
    }
    static calcOffset(e){
        let offset = CONVERTER_STORAGE.canvasNEW.canvas.getBoundingClientRect();
        this.mouse.X = e.pageX - (offset.left);
        this.mouse.Y = e.pageY - (offset.top);
    }
}