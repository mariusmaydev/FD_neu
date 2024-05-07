
class Converter_BottomBar_floatingDiv_aligned {
    constructor(parent, name = ""){
        this.parent = parent;
        this.name = name;
        this.id = "Converter_BottomBar_floatingDiv_" + name + "_";
        this.onRemoveFloatingDiv = function(){};
        this.draw();
    }
    draw(){
        this.body = new SPLINT.DOMElement(this.id + "body", "div", this.parent);
        this.body.Class("converter-bottomBar-floatingDiv");
        this.body.classList.add("aligned");
        this.body.setAttribute("name", this.name);
        this.content = new SPLINT.DOMElement(this.id + "content", "div", this.body);

        window.onmousedown = function(e){
            if(!e.target.hasParentWithClass("converter-bottomBar-floatingDiv")){
                this.remove();
            }
        }.bind(this);

        return this.floatingDiv;
    }
    remove(){
        this.body.remove();
        this.onRemoveFloatingDiv();
    }
}

class Converter_BottomBar_floatingDiv_block {
    constructor(name = "", preventFastDraw = false, autoClose = true){
        this.name = name;
        this.autoClose = autoClose;
        this.parent = document.getElementById("ConverterToolBar_main");
        this.id = "Converter_BottomBar_floatingDiv_" + name + "_";
        this.onRemoveFloatingDiv = function(){};
        this.isDrawn = false;
        if(!preventFastDraw){
            this.draw();
        }
    }
    #handle = function (controller, e){
        // this.onRemoveFloatingDiv(this.name);
        e.stopPropagation();
        e.preventDefault();
        if(!e.target.hasParentWithClass("converter-bottomBar-floatingDiv")){
            this.remove();
            controller.abort();
        }
    }
    set autoClose(v){
        if(v){
            let controller = new AbortController();

            window.addEventListener("mousedown", this.#handle.bind(this, controller), { signal: controller.signal });
            window.removeEventListener("mousedown", this.#handle.bind(this, controller), false);
        }
    }
    draw(name = this.name){
        this.name = name;
        this.isDrawn = true;
        this.body = new SPLINT.DOMElement(this.id + "body", "div", this.parent);
        this.body.Class("converter-bottomBar-floatingDiv");
        this.body.classList.add("block");
        this.body.setAttribute("name", name);
        this.content = new SPLINT.DOMElement(this.id + "content", "div", this.body);

        this.body.before(this.parent.firstChild);
        return this.floatingDiv;
    }
    clear(){
        this.content.clear();
    }
    remove(){
        if(this.isDrawn){
            this.body.remove();
            this.isDrawn = false;
            this.onRemoveFloatingDiv(this);
        }
    }
}

// class Converter_BottomBar_DrawHelper {
//     constructor(parent){
//         this.parent = parent;
//         this.id = "ConverterBottomBar_DrawHelper_";
//         this.onRemoveFloatingDiv = function(){};
//     }
//     drawFloatingDiv(parent, name = ""){
//         this.floatingDiv_Body = new SPLINT.DOMElement(this.id + "floatingDiv_Body", "div", parent);
//         this.floatingDiv_Body.Class("conv_BottomBar_floatingDiv");
//         this.floatingDiv_Body.setAttribute("name", name);
//         this.floatingDiv_content = new SPLINT.DOMElement(this.id + "floatingDiv_contentinnerDiv", "div", this.floatingDiv_Body);

//         window.onmousedown = function(e){
//             if(!e.target.hasParentWithClass("conv_BottomBar_floatingDiv")){
//                 this.removeFloatingDiv();
//             }
//         }.bind(this);

//         return this.floatingDiv;
//     }
//     removeFloatingDiv(){
//         this.floatingDiv_Body.remove();
//         this.onRemoveFloatingDiv();
//     }
// }