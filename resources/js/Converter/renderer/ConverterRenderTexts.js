
class ConverterRenderTexts {
    static drawText(element){
        let ctx     = element.ctx_S;
        let ctx_S   = element.ctx_S;
        let data    = element.data;
        
        ctx.save();
        ctx.beginPath();
        // ctx.translate(data.TextPosX, data.TextPosY);
        // ctx.rotate(MATH.toRadians(data.TextAlign));
        // ctx.scale(2, 2);
        ctx.drawImage(element.canvas_S, data.FrameWidth, data.FrameHeight);
        ctx.closePath();
        ctx.restore();
    }
    static drawEdges(){

    }
    static renderText(element){
        let ctx     = element.ctx;
        let ctx_S   = element.ctx_S;
        let data    = element.data;

          ctx.save();
          ctx.beginPath();
          ctx.translate(element.data.TextPosX, element.data.TextPosY);
          ctx.scale(2, 2);
          ctx.rotate(S_Math.toRadians(element.data.TextAlign));
          // element.ctx.globalAlpha = 1;
          ctx.strokeStyle = DSProject.getColorFor(DSProject.Storage.EPType);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.lineWidth = 0.5;
          ctx.font = element.data.FontWeight + " " + element.data.FontStyle + " " + element.data.FontSize + "px " + element.data.FontFamily;
          let metrics     = 0;
          let max_width   = 0;
          let height      = 0;
          let max_height  = 0;
          let lines = element.data.TextValue.split('\n');
          for(let i = 0; i < lines.length; i++){
            metrics = ctx.measureText(lines[i]);
            height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            let width = metrics.width;
            if(width > max_width){
              max_width = width;
            }
            if(height > max_height){
              max_height = height;
            }
          }
          ctx.textAlign = element.data.TextOrientation;
          for(let i = 0; i < lines.length; i++){
            if(element.data.TextOrientation == 'center'){
              ctx.strokeText(lines[i], 0,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.strokeText(lines[i], 0,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.filter = 'blur(0.5px)';
              ctx.strokeText(lines[i], 0,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.strokeText(lines[i], 0,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.filter = 'blur(1px)';
              ctx.strokeText(lines[i], 0,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
            } else if(element.data.TextOrientation == 'right'){
              ctx.strokeText(lines[i], +max_width / 2,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.strokeText(lines[i], +max_width / 2,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.filter = 'blur(0.5px)';
              ctx.strokeText(lines[i], +max_width / 2,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.strokeText(lines[i], +max_width / 2,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.filter = 'blur(1px)';
              ctx.strokeText(lines[i], +max_width / 2,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
            } else {
              ctx.strokeText(lines[i], -max_width / 2,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.strokeText(lines[i], -max_width / 2,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.filter = 'blur(0.5px)';
              ctx.strokeText(lines[i], -max_width / 2,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.strokeText(lines[i], -max_width / 2,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
              ctx.filter = 'blur(1px)';
              ctx.strokeText(lines[i], -max_width / 2,  -(lines.length * max_height) / 2 + ((i + 1) * max_height) );
            }
          }
          
          // ctx.clip();
          ctx.rect(-max_width / 2, -((lines.length ) * max_height) / 2, max_width, (lines.length * max_height));
          
          element.data.FrameHeight     = ((lines.length) * max_height);
          element.data.FrameWidth      = max_width;
          element.data.TextLineHeight  = max_height;
          ctx.closePath();
          ctx.restore();
    }
    static renderEdges(){

    }
}