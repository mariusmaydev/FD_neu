
class ConverterDrawHelper {
    static updateImage(element, color){
        let ctx = element.ctx;
        let scale = 2;
        let img = element.src;
        ctx.save();
        ctx.translate(element.data.ImagePosX, element.data.ImagePosY);
        ctx.scale(1/scale, 1/scale);
        ctx.rotate(element.data.ImageAlign * Math.PI/180);
        ctx.filter = 'blur(1px) drop-shadow(0px 0px 1px ' + color + ')';
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality  = "high";
        ctx.globalAlpha = 1;
        ctx.drawImage(img, 0, 0, parseInt(img.width), parseInt(img.height), -element.data.ImageWidth / (2/(scale)), -element.data.ImageHeight / (2/(scale)), element.data.ImageWidth * scale, element.data.ImageHeight * scale);
        ctx.drawImage(img, 0, 0, parseInt(img.width), parseInt(img.height), -element.data.ImageWidth / (2/(scale)), -element.data.ImageHeight / (2/(scale)), element.data.ImageWidth * scale, element.data.ImageHeight * scale);

        ctx.restore();
    }
    
    static get Text(){
        return class {
            static updatePointInPath(element, index) {
                console.trace();
                canvasPaths.updatePointPath(element, element.data.FrameWidth, element.data.FrameHeight, 8);
            }
            static updateText(element, renderFlag){
                canvasPaths.updateTxt(element, renderFlag);
            }
            static edge(element, flag = false, index){
                if(flag){
                    // CanvasHelper.drawEdges(element, element.data.FrameWidth, element.data.FrameHeight, index);
                } else {
                    // CanvasHelper.drawEdges(element, element.data.FrameWidth, element.data.FrameHeight, index);
                }
            }
        }
    }
    // static get Image() {
    //     return class {
    //         static drawEdge(ctx) {

    //             function obj(ctx){
    //                 this.edge = function(element, flag = false, index){
    //                   if(flag){
              
    //                     CanvasHelper.drawEdges(element, element.data.ImageWidth, element.data.ImageHeight, index);
    //                   } else {
    //                   //   element.ctx.save();
    //                   //   element.ctx.beginPath();
    //                   //   element.ctx.fillStyle = 'black';
    //                   //   element.ctx.translate(element.data.ImagePosX, element.data.ImagePosY);
    //                   //   element.ctx.rotate(element.data.ImageAlign * Math.PI / 180);
              
    //                     CanvasHelper.drawEdges(element, element.data.ImageWidth, element.data.ImageHeight);
    //                   //   element.ctx.closePath();
    //                   //   element.ctx.restore();
    //                   }
    //                 }
    //                 this.draw = function(element, pointFlag = true, black = false){    
    //                   if(pointFlag){
    //                       canvasPaths.updatePointPath(element, element.data.ImageWidth, element.data.ImageHeight);
    //                   }
    //                   canvasPaths.updateImg(element, black);
    //                 }
    //               }
    //         }
    //     }
    // }
}