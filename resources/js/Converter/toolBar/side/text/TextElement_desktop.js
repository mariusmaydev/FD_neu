class ToolBar_TextElement {
    constructor(data){
        this.data = data;
        this.TextID = this.data.TextID;
        this.TOOLS = TextTools.getTextToolsForID(data.TextID);
        this.id = "ConverterToolBar_Text_ListElement_";
        this.mainElement = new SPLINT.DOMElement(this.id + data.TextID, "div", "ConverterToolBar_Text_main");
        this.mainElement.Class("ToolBar_ListElement");
        this.mainElement.Class("ToolBar_ListElement_Text");
        this.PARTS = new ToolBar_TextElement_parts(this.TOOLS, this.mainElement);
        this.draw();
    }
    draw(){
        this.expanderBody = new SPLINT.DOMElement(this.TextID + "_expanderBody", "div", this.mainElement);
        this.expanderBody.Class("expanderBody");
            this.expander = new S_switchButton(this.expanderBody, "Expander");
            this.expander.disableStandardSwitch();
            this.expander.button.Class("expander");
            this.expander.onactive = function(){
                this.expander.bindIcon("expand_less");
            }.bind(this);
            
            this.expander.onpassive = function(){
                this.expander.bindIcon("expand_more");
            }.bind(this);

            this.expander.onchange = function(state){
                if(state == "passive"){
                    this.blur();
                } else {
                    this.focus();
                }
            }.bind(this);
            this.expander.unsetActive();
        //Text Input

        this.input_text = new SPLINT.DOMElement.InputText(this.mainElement, this.data.TextID + "_textInput", "Text");//new InputDiv_S(s.main, ID + "_textInput", "test");
        this.input_text.oninput = function(){
          this.TOOLS.setValue(this.input_text.Value);
        }.bind(this);
        this.input_text.setValue(this.data.TextValue);

        

        this.fontFamilyDropDown = new SPLINT.DOMElement.InputDropDown(this.mainElement, "Schriftart");
        this.fontFamilyDropDown.addEntry("Arial", "arial");
        this.fontFamilyDropDown.addEntry("Impact", "impact");

        this.fontFamilyDropDown.onValueChange = function(v){
                this.TOOLS.fontFamily(v);
            }.bind(this);

        this.fontFamilyDropDown.value = this.data.FontFamily;

        this.drawButtons();

        this.drawSlider();


    }
    drawButtons(){
        let buttonsDiv = new SPLINT.DOMElement(this.TextID + "_buttonsDiv", "div", this.mainElement);
            buttonsDiv.Class("buttonsDiv");
            this.PARTS.BT_remove(buttonsDiv);
            let bt_italic = this.PARTS.BT_italic(buttonsDiv);
                if(this.data.FontStyle == "italic"){
                    bt_italic.setActive();
                }
            this.PARTS.BT_copy(buttonsDiv);

            let alignDiv = new SPLINT.DOMElement(this.TextID + "_AlignDiv", "div", buttonsDiv);
                alignDiv.Class("AlignDiv");

                let bt_left     = this.PARTS.BT_align('left', alignDiv);
                    bt_left.onactive = function(){
                        this.TOOLS.align('left');
                        bt_center.unsetActive();
                        bt_right.unsetActive();
                    }.bind(this);

                let bt_center   = this.PARTS.BT_align('center', alignDiv);
                    bt_center.onactive = function(){
                        this.TOOLS.align('center');
                        bt_right.unsetActive();
                        bt_left.unsetActive();
                    }.bind(this);

                let bt_right    = this.PARTS.BT_align('right', alignDiv);
                    bt_right.onactive = function(){
                        this.TOOLS.align('right');
                        bt_center.unsetActive();
                        bt_left.unsetActive();
                    }.bind(this);

                if(this.data.TextOrientation == "center"){
                    bt_center.setActive();
                } else if(this.data.TextOrientation == "left"){
                    bt_left.setActive();
                } else if(this.data.TextOrientation == "right"){
                    bt_right.setActive();
                }
                    // if(this.data.)

                

        //underline
        // this.bt_underline = new Button(this.mainElement, "bt_underline");
        // this.bt_underline.bindIcon("test");
        // this.bt_underline.button.onclick = function(){
        //     // this.data.TextLineHeight = "50";
        //     this.TOOLS.setLineHeight(50);
        //     // this.TOOLS.remove();
        //     // CONVERTER_STORAGE.toolBar.update();
        // }.bind(this);

    }
    drawSlider(){
        //Line Height
        this.sl_lineHeight = new Slider(this.mainElement, "lineHeight_" + this.TextID, "Zeilenabstand");
        this.sl_lineHeight.drawTickMarks = false;
        this.sl_lineHeight.min    = 10;
        this.sl_lineHeight.max    = 100;
        this.sl_lineHeight.value  = this.data.TextLineHeight;
        this.sl_lineHeight.oninput = function(value){
            this.data.TextLineHeight = value;
            CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        }.bind(this);

        //Font Weight
        this.sl_fontWeight = new Slider(this.mainElement, "fontWeight_" + this.TextID, "Schriftstärke");
        this.sl_fontWeight.drawTickMarks = false;
        this.sl_fontWeight.min    = 100;
        this.sl_fontWeight.step   = 100; 
        this.sl_fontWeight.max    = 1000;
        this.sl_fontWeight.value  = this.data.FontWeight;
        this.sl_fontWeight.oninput = function(value){
            this.data.FontWeight = value;
            CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        }.bind(this);

        //Font Size
        this.sl_fontSize = new Slider(this.mainElement, "fontSize_" + this.TextID, "Schriftgröße");
        this.sl_fontSize.drawTickMarks = false;
        this.sl_fontSize.min            = 0.5;
        this.sl_fontSize.max            = 20;
        this.sl_fontSize.step           = 0.5; 
        this.sl_fontSize.value          = Math.round(MATH_convert.px2pt(S_Math.divide(this.data.FontSize, 10)) * 2) / 2;
        this.sl_fontSize.valueExtension = "pt";
        this.sl_fontSize.oninput = function(value){
            this.data.FontSize = Math.round(MATH_convert.pt2px(S_Math.multiply(value, 10)) * 2) / 2;
            CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        }.bind(this);
    }
    blur(){
        this.mainElement.state().unsetActive();
        this.expander.unsetActive();
    }
    focus(){
        CONVERTER_STORAGE.toolBar.blurElement("txt");
        this.mainElement.state().setActive();
        this.expander.setActive();
        CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
    }
}

