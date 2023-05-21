
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
    constructor(name = ""){
        this.name = name;
        this.parent = document.getElementById("ConverterToolBar_main");
        this.id = "Converter_BottomBar_floatingDiv_" + name + "_";
        this.onRemoveFloatingDiv = function(){};
        this.draw();
    }
    draw(){
        this.body = new SPLINT.DOMElement(this.id + "body", "div", this.parent);
        this.body.Class("converter-bottomBar-floatingDiv");
        this.body.classList.add("block");
        this.body.setAttribute("name", this.name);
        this.content = new SPLINT.DOMElement(this.id + "content", "div", this.body);

        window.onmousedown = function(e){
            if(!e.target.hasParentWithClass("converter-bottomBar-floatingDiv")){
                this.remove();
            }
        }.bind(this);

        this.body.before(this.parent.firstChild);
        return this.floatingDiv;
    }
    remove(){
        this.body.remove();
        this.onRemoveFloatingDiv();
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