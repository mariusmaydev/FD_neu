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
    SL_contrast(parent = this.parent, value = null){             
        let sl_contrast = new Slider(parent, "contrast_" + parent.id, "Kontrast");
            sl_contrast.drawTickMarks = false;
            sl_contrast.min    = 0;
            sl_contrast.max    = 10;
            sl_contrast.value  = value;
        return sl_contrast;
    } 
    SL_antialiasing(parent = this.parent, value){              
        let sl = new Slider(parent, "antialiasing_" + parent.id, "Glättung");
            sl.drawTickMarks = false;
            sl.min      = 0;
            sl.max      = 10;
            sl.step     = 1;
            sl.value    = value;
        return sl;
    } 
    SL_sharpness(parent = this.parent, value){          
        let sl = new Slider(parent, "sharpness_" + parent.id, "Schärfe");
            sl.drawTickMarks = false;
            sl.min      = 0;
            sl.max      = 10;
            sl.step     = 1;
            sl.value    = value;
        return sl;
    } 
}