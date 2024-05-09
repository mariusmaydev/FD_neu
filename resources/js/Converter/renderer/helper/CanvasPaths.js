
class canvasPaths {
    static async drawThumbnailTxt(element){
        debugger
        let ctx = element.ctx;
        ctx.save();
        ctx.translate(element.data.TextPosX, element.data.TextPosY);
        ctx.scale(2, 2);
        ctx.rotate(S_Math.toRadians(element.data.TextAlign));
        element.ctx.globalAlpha = 1;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
        ctx.font = element.data.FontWeight + " " + element.data.FontStyle + " " + element.data.FontSize + "px " + element.data.FontFamily;
          let metrics     = 0;
          let max_width   = 0;
          let height      = 0;
          let max_height  = 0;
          let lines = element.data.TextValue.split('\n');
          for(let i = 0; i < lines.length; i++){
            metrics = ctx.measureText(lines[i]);
            height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent + parseInt(element.data.TextLineHeight);
            let width = metrics.width;
            if(width > max_width){
              max_width = width;
            }
            if(height > max_height){
              max_height = height;
            }
          }
          ctx.textAlign = element.data.TextOrientation;
          ctx.textRendering  = "optimizeSpeed";
          let C_width = max_width / 2;
          let C_height = -((lines.length-1) * max_height) / 2;
          
          let drawFunc = function(){ctx.strokeText(...arguments)};
          for(let i = 0; i < lines.length; i++){
            if(element.data.TextOrientation == 'center'){
              drawFunc(lines[i], 0,  C_height + ((i ) * max_height) );
              drawFunc(lines[i], 0,  C_height + ((i ) * max_height) );
            } else if(element.data.TextOrientation == 'right'){
              drawFunc(lines[i], +C_width,  C_height + ((i ) * max_height) );
              drawFunc(lines[i], +C_width,  C_height + ((i ) * max_height) );
            } else {
              drawFunc(lines[i], -C_width,  C_height + ((i ) * max_height) );
              drawFunc(lines[i], -C_width,  C_height + ((i ) * max_height) );
            }
          }
          ctx.rect(-C_width, -((lines.length ) * max_height) / 2, max_width, (lines.length * max_height));
          
          element.data.FrameHeight     = parseInt((lines.length) * (max_height));
          element.data.FrameWidth      = parseInt(max_width)
  
          ctx.restore();
          return true
    }
    static #getPointPath(element, x, y, width, height, index) {
        let mat;
        if(element.type == "img"){
            mat = new DOMMatrix().translate(element.data.ImagePosX, element.data.ImagePosY).rotate(element.data.ImageAlign);
        } else {
            mat = new DOMMatrix().translate(element.data.TextPosX, element.data.TextPosY).rotate(element.data.TextAlign);
        }

        let path = new Path2D();
            path.rect(x, y, width, height);
        
        let path2 = new Path2D();
            path2.addPath(path, mat);
            if(index != -1){
                element.paths.edges[index] = path2;
            }
            element.ctx.fill(path2);
    }
    static updatePointPath(element, width = null, height = null, index = null){
        if(SPLINT.ViewPort.isMobile()){
            return;
        }
        if(width == null || height == null){
            if(element.type == "txt"){
                width = element.data.FrameWidth;
                height = element.data.FrameHeight;
            } else {
                width = element.data.ImageWidth;
                height = element.data.ImageHeight;
            }
        }
        if(element.type == "txt"){
            index = 8;
        }
        let rotPointFunc = function(element, size, width, height){
            element.ctx.fillStyle = 'transparent';
            
            if(element.type == "img"){
                this.#getPointPath(element, 0 - size, -height /2 - (size*4), (size*2), (size*2), 8); 
                element.ctx.save();
                element.ctx.translate(element.data.ImagePosX, element.data.ImagePosY);
                element.ctx.rotate(element.data.ImageAlign * Math.PI / 180);
                element.ctx.fillStyle = 'transparent';
                element.ctx.drawImage(SVG_Loader.SVG.turn.src,0 - size , -height / 2- (size*4) , size*2, size*2); 
            } else {
                this.#getPointPath(element, 0 - size, -height  - (size*4), (size*2), (size*2), 8); 
                element.ctx.save();
                element.ctx.translate(element.data.TextPosX, element.data.TextPosY);
                element.ctx.rotate(element.data.TextAlign * Math.PI / 180);
                element.ctx.fillStyle = 'transparent';
                element.ctx.drawImage(SVG_Loader.SVG.turn.src,0 - size , -height - (size*4) , size*2, size*2); 
            }
            element.ctx.restore();
        }.bind(this);
        let size = 48;
        element.ctx.fillStyle = 'black';
        switch(index){
          case 0: this.#getPointPath(element, -width / 2 - size, -height / 2 - size, size, size, 0); break;
          case 1: this.#getPointPath(element, 0 - size / 2, -height / 2 - size, size, size, 1); break;
          case 2: this.#getPointPath(element, width / 2 , -height / 2 - size, size, size, 2); break;
          case 3: this.#getPointPath(element, width / 2, 0 - size / 2, size, size, 3); break;
          case 4: this.#getPointPath(element, width / 2 , height / 2, size, size, 4); break;
          case 5: this.#getPointPath(element, 0 - size / 2, height / 2, size, size, 5); break;
          case 6: this.#getPointPath(element, -width / 2 - size, height / 2, size, size, 6); break;
          case 7: this.#getPointPath(element, -width / 2 - size, 0 - size / 2, size, size, 7); break;
          case 8: {
            rotPointFunc(element, size, width, height);
           } break;
          default: {
            this.#getPointPath(element, -width / 2 - size, -height / 2 - size, size, size, 0);
            this.#getPointPath(element, width / 2 , -height / 2 - size, size, size, 2);
            
            this.#getPointPath(element, -width / 2 - size, height / 2, size, size, 6);
            this.#getPointPath(element, width / 2 , height / 2, size, size, 4);
          
            this.#getPointPath(element, 0 - size / 2, -height / 2 - size, size, size, 1);
            this.#getPointPath(element, 0 - size / 2, height / 2, size, size, 5);
            
            this.#getPointPath(element, width / 2, 0 - size / 2, size, size, 3);
            this.#getPointPath(element, -width / 2 - size, 0 - size / 2, size, size, 7);
    
            rotPointFunc(element, size, width, height);
          } break;
        }
    }
    static getColorFor(color){
        if(color == "CHROME"){
          return "#eff8ff";
        }
        return "#e8b000"//"#ffd700";
      }
    static updateImageBuffer(element, renderMode = false){
        let img = element.src;
        element.canvasBuffer = new OffscreenCanvas(img.width, img.height);
        let ctx = element.canvasBuffer.getContext("2d");


        ctx.save();
        // ctx.scale(2,2)
                //     ctx.imageSmoothingEnabled = true;
                //     ctx.imageSmoothingQuality = "high";
                //     ctx.drawImage(img, 0, 0, Math.abs(img.width), Math.abs(img.height));
                //     ctx.globalCompositeOperation = "source-in";
                // //     if(DSProject.Storage.grayscale != true){
                //         ctx.fillStyle = color;
                //         ctx.fillRect(0, 0, img.width, img.height);
                // //     }
                //     ctx.globalCompositeOperation = "source-over";
        let color = "white";
        if(!renderMode){
            color = this.getColorFor(DSProject.Storage.EPType);
            ctx.filter = 'blur(1px)drop-shadow(0px 0px 1px ' + color + ')';
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality  = "high";
        }
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

        if(!renderMode){
            ctx.save();
                ctx.globalCompositeOperation = "source-atop";
                ctx.filter = 'opacity(80%) brightness(100%) ';
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, img.width, img.height);
            ctx.restore();
                ctx.globalCompositeOperation = "source-atop";
                ctx.filter = 'opacity(40%) brightness(160%) '
                ctx.globalAlpha = 0.5;
                ctx.drawImage(this.im, 0, 0, img.width, img.height)
                ctx.globalCompositeOperation="source-over";
        }

            ctx.closePath();
        ctx.restore();
        return this.drawImageBuffer(element, renderMode);
    }
    static drawImageBuffer(element, renderMode = false){
        let ctx = element.ctx;
        let b = element.canvasBuffer; 
        if(b == undefined || element.needsUpdate == true){
            element.needsUpdate = false;
            return this.updateImageBuffer(element, renderMode);
        }
        ctx.save();
            // ctx.scale(2, 2);
        ctx.translate(element.data.ImagePosX, element.data.ImagePosY);
            ctx.rotate(S_Math.toRadians(element.data.ImageAlign));
            
          ctx.beginPath();
          ctx.fillStyle = 'transparent';
          ctx.drawImage(b, 0, 0, b.width, b.height, -element.data.ImageWidth/2, -element.data.ImageHeight /2, element.data.ImageWidth, element.data.ImageHeight)
          ctx.rect(-element.data.ImageWidth / 2, -element.data.ImageHeight / 2, element.data.ImageWidth, element.data.ImageHeight);
          ctx.closePath();
          ctx.fill();
        ctx.restore();
        return element;
    }
    static #measureText(element){
        let c = new OffscreenCanvas(12, 12);
        let ctx = c.getContext("2d");
          ctx.textBaseline = "middle";
          ctx.lineWidth = element.data.LineWidth;
          ctx.font = element.data.FontWeight + " " + element.data.FontStyle + " " + element.data.FontSize + "px " + element.data.FontFamily;
          let metrics     = 0;
          let max_width   = 0;
          let height      = 0;
          let max_height  = 0;
          let lines = element.data.TextValue.split('\n');

          for(let i = 0; i < lines.length; i++){
            metrics = ctx.measureText(lines[i]);
            height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent + parseInt(element.data.TextLineHeight)-(element.data.FontSize/4);
            let width = metrics.width;
            if(width > max_width){
              max_width = width;
            }
            if(height > max_height){
              max_height = height;
            }
          }
          element.data.FrameHeight     = ((lines.length) * (max_height));
          element.data.FrameWidth      = max_width;

        let res = new Object();
            res.max_width = max_width;
            res.max_height = max_height;
            res.lines = lines;
        return res;
    }
    static updateTextBuffer(element, renderMode = false){
        let measures = this.#measureText(element);
        element.canvasBuffer = new OffscreenCanvas(element.data.FrameWidth*2, element.data.FrameHeight*2);
        let ctx = element.canvasBuffer.getContext("2d");
          
          ctx.save();
          ctx.translate(element.canvasBuffer.width / 2, element.canvasBuffer.height / 2);
          ctx.scale(2, 2);
          ctx.globalAlpha = 1;
          ctx.textBaseline = "middle";
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.lineWidth = element.data.LineWidth;
          let color = "white";
          if(!renderMode) {
                color = this.getColorFor(DSProject.Storage.EPType);
                ctx.filter = 'blur(1px) drop-shadow(0px 0px 1px ' + color + ')';
          }
          ctx.strokeStyle = color;
          ctx.font = element.data.FontWeight + " " + element.data.FontStyle + " " + element.data.FontSize + "px " + element.data.FontFamily;
          let max_width   = measures.max_width;
          let max_height  = measures.max_height;
          let lines = measures.lines;

          ctx.textAlign = element.data.TextOrientation;
          ctx.textRendering  = "optimizeSpeed";
          let C_width = max_width /2;
          let C_height = -((lines.length-1) * max_height) /2;
          
          let drawFunc = function(){ctx.strokeText(...arguments)};
          for(let i = 0; i < lines.length; i++){
            if(element.data.TextOrientation == 'center'){
              drawFunc(lines[i], 0,  C_height + ((i ) * max_height) );
              drawFunc(lines[i], 0,  C_height + ((i ) * max_height) );
            } else if(element.data.TextOrientation == 'right'){
              drawFunc(lines[i], +C_width,  C_height + ((i ) * max_height) );
              drawFunc(lines[i], +C_width,  C_height + ((i ) * max_height) );
            } else {
              drawFunc(lines[i], -C_width,  C_height + ((i ) * max_height) );
              drawFunc(lines[i], -C_width,  C_height + ((i ) * max_height) );
            }
          }
          if(!renderMode){
            ctx.globalCompositeOperation="source-atop";
            ctx.filter = 'opacity(50%) brightness(160%) '//blur(1px) drop-shadow(0px 0px 5px ' + this.getColorFor(DSProject.Storage.EPType) + ')';
            ctx.globalAlpha = 0.5;
            ctx.drawImage(this.im, -C_width, -((lines.length ) * max_height) / 2, max_width, (lines.length * max_height))
            ctx.globalCompositeOperation="source-over";
          }

          ctx.rect(-C_width, -((lines.length ) * max_height) / 2, max_width, (lines.length * max_height));
        // let mat = new DOMMatrix().translate(element.data.TextPosX, element.data.TextPosY).rotate(element.data.TextAlign ).scale(2);
        
        // let path = new Path2D();
        //     path.rect(-C_width, -((lines.length ) * max_height) / 2, max_width, (lines.length * max_height));
        //   ctx.strokeRect(-C_width, -((lines.length ) * max_height) / 2, max_width, (lines.length * max_height));

        ctx.restore();  
        return this.drawTextBuffer(element, renderMode);
    }
    static drawTextBuffer(element, renderMode = false) { 
        let ctx = element.ctx;
        let b = element.canvasBuffer; 
        if(b == undefined || element.needsUpdate == true) {
            element.needsUpdate = false;
            return this.updateTextBuffer(element, renderMode);
        }
        ctx.save();
            ctx.translate(element.data.TextPosX, element.data.TextPosY);
            ctx.scale(2, 2);
            ctx.rotate(S_Math.toRadians(element.data.TextAlign));
            
            
          ctx.beginPath();
          ctx.fillStyle = 'transparent';
          ctx.drawImage(b, 0, 0, b.width, b.height, -element.data.FrameWidth / 2, -element.data.FrameHeight / 2, element.data.FrameWidth, element.data.FrameHeight)
          ctx.rect(-element.data.FrameWidth / 2, -element.data.FrameHeight / 2, element.data.FrameWidth, element.data.FrameHeight);
          ctx.closePath();
          ctx.fill();
        ctx.restore();
        return element;
    }
    static updateBuffer(element){
        if(element.type == "txt"){
            this.updateTextBuffer(element)
        } else {
            this.updateImageBuffer(element)
        }
        if(element.drawEdge){
            this.updatePointPath(element)
        }
    }
    static drawBuffer(element){
        if(element.type == "txt"){
            this.drawTextBuffer(element)
        } else {
            this.drawImageBuffer(element)
        }
        if(element.drawEdge){
            this.updatePointPath(element)
        }
    }
    static updatePoints(element){
        this.updatePointPath(element)
    }

    static im;
    static {
        if(self["Image"] != undefined){
            this.im = new Image();
            this.im.src = "https://www.shutterstock.com/shutterstock/videos/1066111828/thumb/1.jpg?ip=x480"
            this.im.setAttribute("crossOrigin", '')
        }
    }

}
