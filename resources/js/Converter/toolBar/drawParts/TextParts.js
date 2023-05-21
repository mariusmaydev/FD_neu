class ToolBar_TextElement_parts {
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
    BT_italic(parent = this.parent){
        let buttonItalic = new S_switchButton(parent, "Italic");
            buttonItalic.bindIcon("format_italic");

            buttonItalic.onactive = function(){
                    this.TOOLS.fontStyle('italic');
                }.bind(this);

            buttonItalic.onpassive = function(){
                    this.TOOLS.fontStyle('normal');
                }.bind(this);
        return buttonItalic;
    }
    BT_align(type, parent = this.parent){
        let button = new S_switchButton(parent, "Align_" + type);
            button.bindIcon("format_align_" + type);
            button.button.onclick = function(){
                button.setActive();
            }.bind(this);

        return button;
    }  
    SL_fontWeight(parent = this.parent){ 
        let sl_fontWeight = new Slider_S(parent, "sl_fontWeight_" + parent.id);
            sl_fontWeight.min    = 100;
            sl_fontWeight.max    = 1000;
            sl_fontWeight.step   = 100;
            sl_fontWeight.draw();

            
            sl_fontWeight.setLabel("Schriftstärke");
        return sl_fontWeight;
    }  
    drawSlider(){
        // //Line Height
        // this.sl_lineHeight = new Slider_S(this.mainElement, "sl_lineHeight_" + this.TextID);
        // this.sl_lineHeight.min    = 10;
        // this.sl_lineHeight.max    = 100;
        // this.sl_lineHeight.step   = 1;
        // this.sl_lineHeight.value  = this.data.TextLineHeight;
        // this.sl_lineHeight.draw();

        // this.sl_lineHeight.oninput = function(e){
        //     this.data.TextLineHeight = this.sl_lineHeight.value;
        //     CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        // }.bind(this);
        // this.sl_lineHeight.setLabel("Zeilenabstand");

        //Font Weight
        this.sl_fontWeight = new Slider_S(this.mainElement, "sl_fontWeight_" + this.TextID);
        this.sl_fontWeight.min    = 100;
        this.sl_fontWeight.max    = 1000;
        this.sl_fontWeight.step   = 100;
        this.sl_fontWeight.value  = this.data.FontWeight;
        this.sl_fontWeight.draw();

        this.sl_fontWeight.oninput = function(e){
            this.data.FontWeight = this.sl_fontWeight.value;
            CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        }.bind(this);
        this.sl_fontWeight.setLabel("Schriftstärke");

        //Font Size
        this.sl_fontSize = new Slider_S(this.mainElement, "sl_fontSize_" + this.TextID);
        this.sl_fontSize.min    = 0.5;
        this.sl_fontSize.max    = 20;
        this.sl_fontSize.step   = 0.5;
        this.sl_fontSize.value  = MATH_convert.px2pt(S_Math.divide(this.data.FontSize, 10));
        this.sl_fontSize.draw();

        this.sl_fontSize.oninput = function(e){
            this.data.FontSize = MATH_convert.pt2px(S_Math.multiply(this.sl_fontSize.value, 10));
            CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        }.bind(this);
        this.sl_fontSize.setLabel("Schriftgröße");
    }
}