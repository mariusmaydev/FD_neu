

importScripts(location.origin + "/Splint/js/Tools/math.js");

class ConverterWorkerHelper {
    static drawThumbnailImg(element){
        let ctx = element.ctx;
        let scale = 2;
        let img = element.src;
        ctx.save();
        ctx.translate(element.data.ImagePosX, element.data.ImagePosY);
        ctx.scale(1/scale, 1/scale);
        ctx.rotate(element.data.ImageAlign * Math.PI/180);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality  = "high";
        ctx.globalAlpha = 1;
        ctx.drawImage(img, 0, 0, parseInt(img.width), parseInt(img.height), -element.data.ImageWidth / (2/(scale)), -element.data.ImageHeight / (2/(scale)), element.data.ImageWidth * scale, element.data.ImageHeight * scale);

        ctx.restore();
    }
    
    static drawThumbnailTxt(element){
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
        //   if(renderFlag){
        //       drawFunc = function(){ctx.fillText(...arguments)};
        //   }
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