
class ConverterComputeEdges {
    static compute(element, id, mouse, ratio){
        this.element = element;
        this.align       = element.data.ImageAlign;
        this.center      = new Object();
        this.center.X    = element.data.ImagePosX;
        this.center.Y    = element.data.ImagePosY;
        
        this.mouse       = new Object();
        this.mouse.X     = (mouse.X * ratio.X);
        this.mouse.Y     = (mouse.Y * ratio.Y);
        this.mouse.offset = new Object();
        this.mouse.offset.X = this.mouse.X - this.center.X;
        this.mouse.offset.Y = this.mouse.Y - this.center.Y;

        this.imgSize = new Object();
        this.imgSize.X = element.data.ImageWidth
        this.imgSize.Y = element.data.ImageHeight;
        this.imgSize.base = new Object();
        this.imgSize.base.X = element.widthBase;
        this.imgSize.base.Y = element.heightBase;

        this.imgRatio = new Object();
        this.imgRatio.X_Y = Math.round((this.imgSize.base.X / this.imgSize.base.Y)*100)/100;
        this.imgRatio.Y_X = Math.round((this.imgSize.base.Y / this.imgSize.base.X)*100)/100;

        let wb = element.widthBase;
        let hb = element.heightBase;
        let size = {width: wb, height: hb};
        switch(id){
            case 0: {
                let x = Math.cos(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.X/2)-Math.sin(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.Y/2)
                let y = Math.sin(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.X/2)+Math.cos(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.Y/2)
                let vec = this.#calculate(x, y);
                let width = Math.abs(this.imgSize.base.X / x * vec.X);
                let height = Math.abs(this.imgSize.base.Y / y * vec.Y);
                size = {width: width, height: height};
                size = this.#checkSize(size, true);
            };break;
            case 1: {
                let x = -Math.sin(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.Y/2)
                let y = Math.cos(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.Y/2)
                let vec = this.#calculate(x, y);
                let height = Math.abs(this.imgSize.base.Y / y * vec.Y);
                size = {width: wb, height: height};
                size = this.#checkSize(size);
            };break;
            case 2: {
                let x = Math.cos(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.X/2)-Math.sin(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.Y/2)
                let y = Math.sin(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.X/2)+Math.cos(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.Y/2)
                let vec = this.#calculate(x, y);
                let width = Math.abs(this.imgSize.base.X / x * vec.X);
                let height = Math.abs(this.imgSize.base.Y / y * vec.Y);
                size = {width: width, height: height};
                size = this.#checkSize(size, true);
            };break;
            case 3: {
                let x = Math.cos(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.X/2)
                let y = Math.sin(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.X/2)
                
                let vec = this.#calculate(x, y);
                let width = Math.abs(this.imgSize.base.X / x * vec.X);
                size = {width: width, height: hb};
                size = this.#checkSize(size);
            };break;
            case 4: {
                let x = Math.cos(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.X/2)-Math.sin(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.Y/2)
                let y = Math.sin(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.X/2)+Math.cos(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.Y/2)
                let vec = this.#calculate(x, y);
                let width = Math.abs(this.imgSize.base.X / x * vec.X);
                let height = Math.abs(this.imgSize.base.Y / y * vec.Y);
                size = {width: width, height: height};
                size = this.#checkSize(size, true);
            };break;
            case 5: {
                let x = -Math.sin(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.Y/2)
                let y = Math.cos(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.Y/2)
                let vec = this.#calculate(x, y);
                let height = Math.abs(this.imgSize.base.Y / y * vec.Y);
                size = {width: wb, height: height};
                size = this.#checkSize(size);
            };break;
            case 6: {
                let x = Math.cos(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.X/2)-Math.sin(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.Y/2)
                let y = Math.sin(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.X/2)+Math.cos(SPLINT.Math.toRadians(this.align))*(this.imgSize.base.Y/2)
                let vec = this.#calculate(x, y);
                let width = Math.abs(this.imgSize.base.X / x * vec.X);
                let height = Math.abs(this.imgSize.base.Y / y * vec.Y);
                size = {width: width, height: height};
                size = this.#checkSize(size, true);
            };break;
            case 7:{
                let x = Math.cos(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.X/2)
                let y = Math.sin(SPLINT.Math.toRadians(this.align))*(-this.imgSize.base.X/2)
                
                let vec = this.#calculate(x, y);
                let width = Math.abs(this.imgSize.base.X / x * vec.X);
                size = {width: width, height: hb};
                size = this.#checkSize(size);
            };break;
            case 8: {
              let a = element.data.ImagePosX - this.mouse.X;
              let b = element.data.ImagePosY - this.mouse.Y;
              let c = SPLINT.Math.pytagoras(a, b);
              if(a < 0 ){
                element.data.ImageAlign = Math.round(SPLINT.Math.toDegrees(Math.acos(b / c))) ;
              } else {
                element.data.ImageAlign = Math.round(-SPLINT.Math.toDegrees(Math.acos(b / c)));
              }
              if(CONVERTER_STORAGE.toolBar.imageBar != undefined){
                for(const ele of CONVERTER_STORAGE.toolBar.imageBar.ELEMENTS){
                      if(ele.ImageID == element.ID){
                          ele.sl_rotation.value = element.data.ImageAlign;
                      }
                }
              }
            } break;
            default: break;
        }
        element.data.ImageWidth  = size.width;
        element.data.ImageHeight = size.height;
    }
    static #checkSize(size, ofCenter = false){
        if(ofCenter){
            if(size.width <= 300){
                size.height = size.height / size.width * 300;
                size.width = 300;
            }
            if(size.height <= 300){
                size.width = size.width / size.height * 300;
                size.height = 300;
            }
        } else {
            if(size.width <= 300){
                size.width = 300;
            }
            if(size.height <= 300){
                size.height = 300;
            }
        }
        return size;
    }
    static #calculate(x, y){
        let gFx = x / Math.abs(this.mouse.offset.X);
        let gY = y / gFx

        let gFy = y / Math.abs(this.mouse.offset.Y);
        let gX = x / gFy;

        let geX = 0;
        let geY = 0;
        if(!this.element.calcEdgeFlag){
            if(this.imgRatio.X_Y * Math.abs(gY) <= Math.abs(gX) ){
                this.element.calcEdgeType = "mouseX";
                geX = Math.abs(this.mouse.offset.X);
                geY = Math.abs(gY);
            } else {
                this.element.calcEdgeType = "mouseY";
                geX = Math.abs(gX);
                geY = Math.abs(this.mouse.offset.Y);
            }
            this.element.calcEdgeFlag = true;
        } else {
            if(this.element.calcEdgeType == "mouseX"){
                geX = Math.abs(this.mouse.offset.X);
                geY = Math.abs(gY);
            } else if(this.element.calcEdgeType == "mouseY"){
                geX = Math.abs(gX);
                geY = Math.abs(this.mouse.offset.Y);
            }
        }
        // if(this.imgRatio.X_Y * Math.abs(gY) <= Math.abs(gX) ){
        //     geX = Math.abs(this.mouse.offset.X);
        //     geY = Math.abs(gY);
        // } else {
        //     geX = Math.abs(gX);
        //     geY = Math.abs(this.mouse.offset.Y);
        // }
        return {X: geX, Y: geY};
    }
}