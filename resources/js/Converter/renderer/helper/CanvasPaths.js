
class canvasPaths {
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
            element.ctx_S.fill(path2);
            element.ctx.fill(path2);
    }
    static updatePointPath(element, width, height, index){
        let rotPointFunc = function(element, size, width, height){
            element.ctx.fillStyle = 'transparent';
            this.#getPointPath(element, 0 - size, -height /2 - (size*4), (size*2), (size*2), 8); 
            element.ctx.save();
            
            if(element.type == "img"){
                element.ctx.translate(element.data.ImagePosX, element.data.ImagePosY);
                element.ctx.rotate(element.data.ImageAlign * Math.PI / 180);
            } else {
                element.ctx.translate(element.data.TextPosX, element.data.TextPosY);
                element.ctx.rotate(element.data.TextAlign * Math.PI / 180);
            }
            element.ctx.fillStyle = 'transparent';
            element.ctx.drawImage(SVG_Loader.SVG.turn.src,0 - size , -height/2 - (size*4) , size*2, size*2); 
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
    static updateImgPath(element){
        this.updatePointPath(element, element.data.ImageWidth, element.data.ImageHeight);
        
        // element.ctx_S.translate(element.data.ImagePosX, element.data.ImagePosY);
        // element.ctx_S.rotate(element.data.ImageAlign * Math.PI/180);
        let mat = new DOMMatrix().translate(element.data.ImagePosX, element.data.ImagePosY).rotate(element.data.ImageAlign );
        
        let path = new Path2D();
            path.rect(-element.data.ImageWidth / 2, -element.data.ImageHeight / 2, element.data.ImageWidth, element.data.ImageHeight);

        let path2 = new Path2D();
            path2.addPath(path, mat);
                element.paths.rect = path2;
                element.ctx.fillStyle = 'transparent';
            element.ctx.fill(path2);
            
    }
    static updateImg(element){
        let ctx = element.ctx;

        let scale = 2;
        let img = element.src;
        ctx.save();
        ctx.translate(element.data.ImagePosX, element.data.ImagePosY);
        ctx.scale(1/scale, 1/scale);
        ctx.rotate(element.data.ImageAlign * Math.PI/180);
        ctx.filter = 'blur(1px)';
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality  = "high";
        ctx.globalAlpha = 1;
        // element.ctx.globalAlpha = 1;
        ctx.drawImage(img, 0, 0, parseInt(img.width), parseInt(img.height), -element.data.ImageWidth / (2/(scale)), -element.data.ImageHeight / (2/(scale)), element.data.ImageWidth * scale, element.data.ImageHeight * scale);
        ctx.drawImage(img, 0, 0, parseInt(img.width), parseInt(img.height), -element.data.ImageWidth / (2/(scale)), -element.data.ImageHeight / (2/(scale)), element.data.ImageWidth * scale, element.data.ImageHeight * scale);
        ctx.drawImage(img, 0, 0, parseInt(img.width), parseInt(img.height), -element.data.ImageWidth / (2/(scale)), -element.data.ImageHeight / (2/(scale)), element.data.ImageWidth * scale, element.data.ImageHeight * scale);

        // element.ctx.globalAlpha = 1;
        // // element.ctx.scale(10, 10);
        // ctx.rect(-element.data.ImageWidth / 2, -element.data.ImageHeight / 2, element.data.ImageWidth, element.data.ImageHeight);
        ctx.restore();
    }
    static updateTxtPath(element){
        this.updatePointPath(element, element.data.FrameWidth, element.data.FrameHeight, 8);
        
        // element.ctx_S.translate(element.data.ImagePosX, element.data.ImagePosY);
        // element.ctx_S.rotate(element.data.ImageAlign * Math.PI/180);
        let mat = new DOMMatrix().translate(element.data.TextPosX, element.data.TextPosY).rotate(element.data.TextAlign ).scale(2);
        
        let path = new Path2D();
            path.rect(-element.data.FrameWidth / 2, -element.data.FrameHeight / 2, element.data.FrameWidth, element.data.FrameHeight);

        let path2 = new Path2D();
            path2.addPath(path, mat);
                element.paths.rect = path2;
                element.ctx.fillStyle = 'transparent';
            element.ctx.fill(path2);
            
    }
    static updateTxt(element, renderFlag = false, thumbnailFlag = false){
        let ctx = element.ctx;
        // if(ctx == null){
        //     if(renderFlag){
        //       ctx = element.ctx_S;
        //     } else {
        //       ctx = element.ctx;
        //       ctx.shadowColor = DSProject.getColorFor(DSProject.Storage.EPType);
        //       ctx.shadowOffsetX = 0;
        //       ctx.shadowOffsetY = 0;
        //       ctx.shadowBlur = 2;
        //       // ctx.filter = 'blur(0.5px)';
        //     }
        //   }
          ctx.save();
          ctx.translate(element.data.TextPosX, element.data.TextPosY);
          ctx.scale(2, 2);
          ctx.rotate(S_Math.toRadians(element.data.TextAlign));
          element.ctx.globalAlpha = 1;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.textBaseline = "middle";
          if(thumbnailFlag){
              ctx.lineWidth = 1;
          } else {
              ctx.lineWidth = 1;
          }
          ctx.strokeStyle = DSProject.getColorFor(DSProject.Storage.EPType);
          ctx.fillStyle = DSProject.getColorFor(DSProject.Storage.EPType);
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
          if(renderFlag){
              drawFunc = function(){ctx.fillText(...arguments)};
          }
          for(let i = 0; i < lines.length; i++){
            if(element.data.TextOrientation == 'center'){
              drawFunc(lines[i], 0,  C_height + ((i ) * max_height) );
              drawFunc(lines[i], 0,  C_height + ((i ) * max_height) );
              // ctx.filter = 'blur(0.5px)';
              // ctx.strokeText(lines[i], 0,  C_height + ((i + 1) * max_height) );
              // ctx.strokeText(lines[i], 0,  C_height + ((i + 1) * max_height) );
              // // ctx.filter = 'blur(1px)';
              // ctx.strokeText(lines[i], 0,  C_height + ((i + 1) * max_height) );
            } else if(element.data.TextOrientation == 'right'){
              drawFunc(lines[i], +C_width,  C_height + ((i ) * max_height) );
              drawFunc(lines[i], +C_width,  C_height + ((i ) * max_height) );
            } else {
              drawFunc(lines[i], -C_width,  C_height + ((i ) * max_height) );
              drawFunc(lines[i], -C_width,  C_height + ((i ) * max_height) );
            }
          }
          // ctx.strokeStyle = "red";
          ctx.rect(-C_width, -((lines.length ) * max_height) / 2, max_width, (lines.length * max_height));
        //   ctx.strokeRect(-C_width, -((lines.length ) * max_height) / 2, max_width, (lines.length * max_height));
          
          element.data.FrameHeight     = ((lines.length) * (max_height));
          element.data.FrameWidth      = max_width;
          // element.data.TextLineHeight  = max_height;
  
          ctx.restore();
    }

}