
class ConverterDOMRendererHelper {
    constructor(instance) {
        this.instance_main = instance;
    }
    ScaleUp(value){
        return S_Math.multiply(value, this.instance_main.ratio);
    }
    ScaleDown(value){
        return S_Math.divide(value, this.instance_main.ratio);
    }
    getMousePos(e){
        let offset = $("#" + "DOMConverterMAIN_DIV").offset();
        let pos = new Object();
            pos.X = e.pageX - (offset.left);
            pos.Y = e.pageY - (offset.top);
        return pos;
    }
    getEdge(imgObj, type){
        let parent = imgObj.DOMElements.edgesDiv;
        let ed = new SPLINT.DOMElement(parent.id + "_EDGE_" + type, "div", parent);
            ed.Class("DOMConverterEdge");
            ed.setAttribute("direction", type);
            ed.onclick = function(e){
                // e.stopPropagation();
                e.preventDefault();
                imgObj.startDrag(e);
            }

        return ed;

    }
}