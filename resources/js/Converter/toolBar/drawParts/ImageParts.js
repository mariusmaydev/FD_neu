class ToolBar_ImageElement_parts {
    constructor(tools, parent){
        this.TOOLS = tools;
        this.parent = parent;
    }
    BT_remove(parent = this.parent){
        let bt_remove = new SPLINT.DOMElement.Button(parent, "bt_remove");
            bt_remove.bindIcon("delete");
            bt_remove.button.onclick = function(){
                this.TOOLS.remove();
            }.bind(this);
        return bt_remove;
    }
    BT_copy(parent = this.parent){
        let button = new SPLINT.DOMElement.Button(parent, "bt_copy");
            button.bindIcon("content_copy");
            button.button.onclick = function(){
                this.TOOLS.copy();
            }.bind(this);
        return button;
    }
    BT_flip(type, parent = this.parent){
        let button = new SPLINT.DOMElement.Button(parent, "bt_flip_" + type);
            button.bindIcon("flip");
            if(type == "VERTICAL"){
                button.span.classList.add("rotate90");
            }
            button.button.onclick = function(){
                this.TOOLS.flip(type);
            }.bind(this);
        return button;
    } 
    SL_contrast(parent = this.parent, value){ 
        let sl1 = new Slider("sl_contrast_" + parent.id, parent, "Kontrast", 0, 10, value);
            sl1.draw();
        // let sl = new Slider_S(parent, "sl_contrast_" + parent.id);
        //     sl.min      = 0;
        //     sl.max      = 10;
        //     sl.step     = 1;
        //     sl.value    = value;
        //     sl.draw();

        //     sl.setLabel("Kontrast");
        return sl1.get();
    } 
    SL_antialiasing(parent = this.parent, value){ 
        let sl = new Slider_S(parent, "sl_antialiasing_" + parent.id);
            sl.min    = 0;
            sl.max    = 10;
            sl.step   = 1;
            sl.value    = value;
            sl.draw();

            sl.setLabel("Glättung");
        return sl;
    } 
    SL_sharpness(parent = this.parent, value){ 
        let sl = new Slider_S(parent, "sl_sharpness_" + parent.id);
            sl.min    = 0;
            sl.max    = 10;
            sl.step   = 1;
            sl.value    = value;
            sl.draw();

            sl.setLabel("Schärfe");
        return sl;
    } 
}