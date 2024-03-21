class ToolBar_TextElement {
    constructor(data){
        this.data = data;
        this.TextID = this.data.TextID;
        this.TOOLS = TextTools.getTextToolsForID(data.TextID);
        this.id = "ConverterToolBar_Text_ListElement_";
        this.mainElement = new SPLINT.DOMElement(this.id + data.TextID, "div", "ConverterToolBar_Text_main");
        this.mainElement.Class("ToolBar_ListElement");
        this.mainElement.Class("ToolBar_ListElement_Text");
        this.mainElement.setAttribute("ele-type", "txt");
        this.PARTS = new ToolBar_TextElement_parts(this.TOOLS, this.mainElement);
        this.draw();
    }
    draw(){
        this.expanderBody = new SPLINT.DOMElement(this.TextID + "_expanderBody", "div", this.mainElement);
        this.expanderBody.Class("expanderBody");
            this.expander = new SPLINT.DOMElement.Button.Switch(this.expanderBody, "Expander");
            this.expander.disableStandardSwitch();
            this.expander.button.Class("expander");
            this.expander.onactive = function(){
                this.expander.bindIcon("expand_less");
            }.bind(this);
            
            this.expander.onpassive = function(){
                this.expander.bindIcon("expand_more");
            }.bind(this);

            this.blur();
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
        this.input_text.textarea.onclick = function(e){
            e.preventDefault();
            e.stopPropagation();
            CONVERTER_STORAGE.toolBar.focusElement("txt", this.data.TextID)
            this.input_text.textarea.focus();
        }.bind(this)
        this.input_text.textarea.onmouseup = function(e){
            // e.preventDefault();

        }
        this.input_text.setValue(this.data.TextValue);
        // this.input_text.setLabel("text")

        
        this.toolsBody = new SPLINT.DOMElement(this.data.TextID + "_toolsBody", "div", this.mainElement);
        this.toolsBody.Class("toolsBody");

            this.firstToolContainer = new SPLINT.DOMElement(this.data.TextID + "_firstToolContainer", "div", this.toolsBody);
            this.firstToolContainer.Class("firstToolContainer");
                this.fontFamilyDropDownContainer = new SPLINT.DOMElement(this.data.TextID + "_fontFamilyDropDownContainer", "div", this.firstToolContainer);
                this.fontFamilyDropDownContainer.Class("FontFamilyContainer");
                    this.fontFamilyDropDown = new SPLINT.DOMElement.InputDropDown(this.fontFamilyDropDownContainer, "fontFamily" + this.data.TextID, "Schriftart");
                    let f = function(entry, value){
                        entry.span.style.fontFamily = value;
                    }

                    this.fontFamilyDropDown.addEntry("Arial", "arial", f);
                    this.fontFamilyDropDown.addEntry("Impact", "impact", f);
                    this.fontFamilyDropDown.addEntry("Verdana", "verdana", f);
                    this.fontFamilyDropDown.addEntry("Trebuchet MS", "Trebuchet MS", f);
                    this.fontFamilyDropDown.addEntry("Times New Roman", "Times New Roman", f);
                    this.fontFamilyDropDown.addEntry("Georgia", "Georgia", f);
                    this.fontFamilyDropDown.addEntry("Garamond", "Garamond", f);
                    this.fontFamilyDropDown.addEntry("Courier New", "Courier New", f);
                    this.fontFamilyDropDown.addEntry("Brush Script MT", "Brush Script MT", f);

                    this.fontFamilyDropDown.onValueChange = function(v){
                            this.TOOLS.fontFamily(v);
                        }.bind(this);

                    this.fontFamilyDropDown.value = this.data.FontFamily;

        this.drawButtons();

        this.drawSlider();


    }
    drawButtons(){
        let buttonsDiv = new SPLINT.DOMElement(this.TextID + "_buttonsDiv", "div", this.firstToolContainer);
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
        this.sl_lineHeight = new SPLINT.DOMElement.RangeSlider(this.toolsBody, "lineHeight_" + this.TextID, "Zeilenabstand");
        this.sl_lineHeight.drawTickMarks = false;
        this.sl_lineHeight.min    = 10;
        this.sl_lineHeight.max    = 100;
        this.sl_lineHeight.value  = this.data.TextLineHeight;
        this.sl_lineHeight.valueExtension = "px";
        this.sl_lineHeight.onDrawSign = function(signContent){
            signContent.value = this.sl_lineHeight.value + this.sl_lineHeight.valueExtension;
        }.bind(this);
        this.sl_lineHeight.oninput = function(value){
            this.data.TextLineHeight = value;
            CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        }.bind(this);

        //Font Weight
        this.sl_fontWeight = new SPLINT.DOMElement.RangeSlider(this.toolsBody, "fontWeight_" + this.TextID, "Schriftstärke");
        this.sl_fontWeight.drawTickMarks = false;
        this.sl_fontWeight.min    = 100;
        this.sl_fontWeight.step   = 100; 
        this.sl_fontWeight.max    = 1000;
        this.sl_fontWeight.value  = this.data.FontWeight;
        this.sl_fontWeight.valueExtension = "px";
        this.sl_fontWeight.onDrawSign = async function(signContent){
            this.sl_fontWeight.labelElement.span.style.fontFamily = "O-Arial"; 
            this.sl_fontWeight.labelElement.span.style.fontWeight = this.sl_fontWeight.value;
            let g = SPLINT.Tools.Fonts.getFontWeights("O-Arial");
            signContent.value = this.sl_fontWeight.value + this.sl_fontWeight.valueExtension;
        }.bind(this);
        this.sl_fontWeight.oninput = function(value){
            this.data.FontWeight = value;
            CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        }.bind(this);

        //Font Size
        this.sl_fontSize = new SPLINT.DOMElement.RangeSlider(this.toolsBody, "fontSize_" + this.TextID, "Schriftgröße");
        this.sl_fontSize.drawTickMarks = false;
        this.sl_fontSize.min            = 0.5;
        this.sl_fontSize.max            = 20;
        this.sl_fontSize.step           = 0.5; 
        this.sl_fontSize.value          = Math.round(MATH_convert.px2pt(S_Math.divide(this.data.FontSize, 10)) * 2) / 2;
        this.sl_fontSize.valueExtension = "";
        this.sl_fontSize.onDrawSign = function(signContent){
            signContent.value = this.sl_fontSize.value + this.sl_fontSize.valueExtension;
        }.bind(this);
        this.sl_fontSize.oninput = function(value){
            this.data.FontSize = Math.round(MATH_convert.pt2px(S_Math.multiply(value, 10)) * 2) / 2;
            CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        }.bind(this);
        
        //rotation
        this.sl_rotationBody = new SPLINT.DOMElement(this.TextID + "_rotationDiv", "div", this.toolsBody);
        this.sl_rotationBody.Class("rotationBody");
            this.sl_rotation = new SPLINT.DOMElement.RangeSlider(this.sl_rotationBody, "rotation_" + this.TextID, "Drehung");
            this.sl_rotation.drawTickMarks = false;
            this.sl_rotation.min    = -180;
            this.sl_rotation.max    = 180;
            this.sl_rotation.value  = this.data.TextAlign;
            this.sl_rotation.valueExtension = "deg";
            this.sl_rotation.onDrawSign = function(signContent){
                signContent.value = this.sl_rotation.value + this.sl_rotation.valueExtension;
            }.bind(this);
            this.sl_rotation.oninput = function(value){
                this.data.TextAlign = value;
                CONVERTER_STORAGE.canvasNEW.refreshData();
                // ConverterHelper.filter(DSImage.getIndex(this.ImageID));
            }.bind(this);
            let rotationButtonsBody = new SPLINT.DOMElement(this.TextID + "_rotationButtonsBody", "div", this.sl_rotationBody);
                rotationButtonsBody.Class("ContainerBody");
                let rotationButtonsContainer = new SPLINT.DOMElement(this.TextID + "_rotationButtonsContainer", "div", rotationButtonsBody);
                    rotationButtonsContainer.Class("container");

                    let buttonR90 = new SPLINT.DOMElement.Button(rotationButtonsContainer, "R90", "-90°");
                        buttonR90.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
                        buttonR90.onclick = function(){
                            this.data.TextAlign = -90;
                            this.sl_rotation.value = -90;
                            CONVERTER_STORAGE.canvasNEW.refreshData();
                        }.bind(this);
                    let buttonzero = new SPLINT.DOMElement.Button(rotationButtonsContainer, "reset", 0);
                        buttonzero.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
                        buttonzero.onclick = function(){
                            this.data.TextAlign = 0;
                            this.sl_rotation.value = 0;
                            CONVERTER_STORAGE.canvasNEW.refreshData();
                        }.bind(this);

                    let button90 = new SPLINT.DOMElement.Button(rotationButtonsContainer, "90", "+90°");
                        button90.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
                        button90.onclick = function(){
                            this.data.TextAlign = 90;
                            this.sl_rotation.value = 90;
                            CONVERTER_STORAGE.canvasNEW.refreshData();
                        }.bind(this);
                let rotationButtonsEmpty = new SPLINT.DOMElement(this.TextID + "_rotationsButtonEmpty", "div", rotationButtonsBody);
                    rotationButtonsEmpty.Class("empty");
    }
    blur(){
        this.mainElement.state().unsetActive();
        this.expander.unsetActive();
        document.getElementById("ConverterToolBar_Text_main").appendChild(this.mainElement);
        document.getElementById("ConverterToolBar_activeBody").state().unsetActive();
        if(this.sl_lineHeight != undefined){
            this.sl_lineHeight.hideSign();
            this.sl_fontSize.hideSign();
            this.sl_fontWeight.hideSign();
            this.sl_rotation.hideSign();
        }
    }
    focus(){
        CONVERTER_STORAGE.toolBar.blurElement("txt");
        this.mainElement.state().setActive();
        this.expander.setActive();
        CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        let ele = document.getElementById("ConverterToolBar_activeBody").childNodes[0];
        if(document.getElementById("ConverterToolBar_activeBody").childNodes.length > 0){
            if(ele.getAttribute("ele-type") == "txt"){
                document.getElementById("ConverterToolBar_Text_main").appendChild(ele);
                ele.state().unsetActive();
            } else {
                document.getElementById("ConverterToolBar_Image_main").appendChild(ele);
                ele.state().unsetActive();
            }
            document.getElementById("ConverterToolBar_activeBody").clear();
        }
        document.getElementById("ConverterToolBar_activeBody").state().setActive();
        document.getElementById("ConverterToolBar_activeBody").appendChild(this.mainElement);
        this.sl_lineHeight.updateSign();
        this.sl_fontSize.updateSign();
        this.sl_rotation.updateSign();
        this.sl_fontWeight.updateSign();
    }
}

