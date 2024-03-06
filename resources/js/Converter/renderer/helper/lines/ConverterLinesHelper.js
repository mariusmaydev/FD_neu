
class ConverterLinesHelper {
    static lineElements = new Object();
    static instance     = null;
    static ctx          = null;

    static addLine(lineElement){
        lineElement.ctx = this.ctx;
        ConverterLinesHelper.lineElements[lineElement.id] = lineElement;
    }
    static removeLine(id){
        delete ConverterLinesHelper.lineElements[id];
        // for(const lineElement of ConverterLinesHelper.lineElements) {
        //     if(lineElement.id == id){
        //         console.log(lineElement);
        //     }
        // }
    }
    static drawLine(id){
        let ele = ConverterLinesHelper.lineElements[id];
        ele.draw();
    }
    static drawAllLines(){
        for(const [key, ele] of Object.entries(ConverterLinesHelper.lineElements)) {
            ele.draw();
        }
    }
    static checkLines(x, y, data){
        for(const [key, ele] of  Object.entries(ConverterLinesHelper.lineElements)) {
            if(this.ctx.isPointInPath(ele.Path2D, x, y)){
                ele.draw();
                return ele.getSnapPoint(x, y, data);
            }
        }
    }
}