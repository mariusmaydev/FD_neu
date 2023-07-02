
class ConverterCanvasHelper {
    static computeEdges(element, inst){
        // let a = element.data.ImagePosX;
        // let b = element.data.ImagePosY;
        let data = element.data;
        let canvas = element.canvas;
        let c_OmaxX = canvas.offsetWidth;
        let c_OmaxY = canvas.offsetHeight;
        let c_maxX = canvas.width;
        let c_maxY = canvas.height;

        let a = c_OmaxX / c_maxX * data.ImagePosX;
        console.log(a);
        if(element.type == "img"){
          let offsetX = (-element.data.ImagePosX + ((inst.mouse.X * inst.ratio.X) + element.offset.X)) * 2;
          let offsetY = (-element.data.ImagePosY + ((inst.mouse.Y * inst.ratio.Y) + element.offset.Y)) * 2; 
          let wb = element.widthBase;
          let hb = element.heightBase;
          let size = {width: wb, height: hb};
          switch(element.dragEdge){
            case 0: size = S_Math.getNewSize(-offsetX, -offsetY, hb, wb); break;
            case 1: size = {width: wb, height: hb - offsetY}; break;
            case 2: size = S_Math.getNewSize(offsetX, -offsetY, hb, wb); break;
            case 3: size = {width: wb + offsetX, height: hb}; break;
            case 4: size = S_Math.getNewSize(offsetX, offsetY, hb, wb); break;
            case 5: size = {width: wb, height: hb + offsetY}; break;
            case 6: size = S_Math.getNewSize(-offsetX, offsetY, hb, wb); break;
            case 7: size = {width: wb - offsetX, height: hb}; break;
            case 8: {
              let a = element.data.ImagePosX - (inst.mouse.X * inst.ratio.X);
              let b = element.data.ImagePosY - (inst.mouse.Y * inst.ratio.Y);
              let c = S_Math.pytagoras(a, b);
              if(a < 0 ){
                element.data.ImageAlign = S_Math.toDegrees(Math.acos(b / c)) ;
              } else {
                element.data.ImageAlign = -S_Math.toDegrees(Math.acos(b / c));
              }
            } break;
            default: break;
          }
        //   console.log(size, hb, offsetY, inst.ratio.X);
          // element.src.width   = size.width;
          // element.src.height  = size.height;
        //   element.data.ImageWidth  = size.width;
        //   element.data.ImageHeight = size.height;
        } else {
          // CanvasHelper.Text().edge(element, false, 2);
          CanvasHelper.Text().edge(element, false, 8);
          if(element.dragEdge == 2){
            element.data.TextPosX = inst.mouse.X * inst.ratio.X + element.offset.X;
            element.data.TextPosY = inst.mouse.Y * inst.ratio.Y + element.offset.Y;
          } else {
            let a = element.data.TextPosX - (inst.mouse.X * inst.ratio.X);
            let b = element.data.TextPosY - (inst.mouse.Y * inst.ratio.Y);
            let c = S_Math.pytagoras(a, b);
            if(a < 0 ){
              element.data.TextAlign = S_Math.toDegrees(Math.acos(b / c)) ;
            } else {
              element.data.TextAlign = -S_Math.toDegrees(Math.acos(b / c));
            }
          }
        }
    
        inst.draw(element);
      }
}