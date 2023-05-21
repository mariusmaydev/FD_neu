
class ConverterTouchHandler {
    static touchStart(e){
        if(!this.CanvasActive){
          return;
        }
        ConverterEvents.start.call(this, e, false);
    }
    static touchMove(e){
        if(!this.CanvasActive){
          return;
        }
        window.requestAnimationFrame(function(){
            ConverterEvents.move.call(this, e, false)
        }.bind(this));
    }
    static touchEnd(e){
        if(!this.CanvasActive){
          return;
        }
        ConverterEvents.end.call(this, e, false);
    }
    static calcOffset(e){
        let offset = $("#" + ConverterHelper.ELE_SQUARE_BORDER).offset();
        this.mouse.X = e.touches[0].pageX - (offset.left);
        this.mouse.Y = e.touches[0].pageY - (offset.top);
    }
}