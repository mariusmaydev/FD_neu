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
    async draw(){
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
                    this.fontFamilyDropDown.addEntry("Arial", "O-Arial", f);
                    this.fontFamilyDropDown.addEntry("Inter", "Inter", f);
                    this.fontFamilyDropDown.addEntry("Roboto", "Roboto", f);
                    this.fontFamilyDropDown.addEntry("Impact", "impact", f);
                    this.fontFamilyDropDown.addEntry("Verdana", "O-Verdana", f);
                    this.fontFamilyDropDown.addEntry("Trebuchet_MS", "O-Trebuchet_MS", f);
                    this.fontFamilyDropDown.addEntry("Times New Roman", "O-Times_New_Roman", f);
                    this.fontFamilyDropDown.addEntry("Teko", "Teko", f);
                    // this.fontFamilyDropDown.addEntry("Garamond", "Garamond", f);
                    // this.fontFamilyDropDown.addEntry("Courier New", "Courier New", f);
                    // this.fontFamilyDropDown.addEntry("Brush Script MT", "Brush Script MT", f);

                    this.fontFamilyDropDown.onValueChange = function(v){
                            this.TOOLS.fontFamily(v);
                            this.fontFamilyDropDown.input.input.style.fontFamily = v;
                            if(this.sl_fontWeight != undefined){
                                this.sl_fontWeight.updateDataList(false);
                            }
                        }.bind(this);

                    this.fontFamilyDropDown.value = this.data.FontFamily;

        this.drawButtons();

        await this.drawSlider();


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

    }
    async drawSlider(){
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
        
        this.sl_fontWeight = new SPLINT.DOMElement.datalistRangeSlider(this.toolsBody, "fontWeight_" + this.TextID, null, "Schriftstärke");
        this.sl_fontWeight.drawTickMarks = false;
        this.sl_fontWeight.updateDataList = async function(hideSign = true){
            let h1 = await SPLINT.Tools.Fonts.getFontWeights(this.data.FontFamily);
            let h2 = [];
            if(h1.length == 1){
                let r = h1[0].split(" ");
                if(r.length == 2){
                    let k = (r[1] - r[0]) / 100;
                    for(let i = 0; i <= k; i++){
                        h2.push(parseInt(r[0]) + (100 * i));
                    }
                } else {
                    h2 = h1;
                }
            } else {
                h2 = h1;
            }
            let l = [];
            let flag = true;
            for(const ele of h2){
                let asInt = parseInt(ele);
                let obj = new Object();
                    obj.value = asInt;
                    obj.label = SPLINT.Tools.Fonts.getNameFromWeight(asInt);
                    if(asInt == this.data.FontWeight){
                        flag = false;
                    }
                l.push(obj)
            }
            this.sl_fontWeight.dataList = l;
            if(flag){
                this.sl_fontWeight.value  = 400;
                this.data.FontWeight = this.sl_fontWeight.value;
                CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
            } else {
                this.sl_fontWeight.value  = this.data.FontWeight;
            }
            this.sl_fontWeight.draw();
            this.sl_fontWeight.value  = this.data.FontWeight;
            if(hideSign){
                this.sl_fontWeight.hideSign();
            }
        }.bind(this);

        this.sl_fontWeight.onDrawSign = async function(signContent){
            signContent.value = this.sl_fontWeight.dataList[this.sl_fontWeight.index].label;
        }.bind(this);
        this.sl_fontWeight.oninput = function(value){
            this.data.FontWeight = this.sl_fontWeight.dataList[this.sl_fontWeight.index].value;
            CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
        }.bind(this);

        this.sl_fontWeight.updateDataList();
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
        }
        if(this.sl_fontSize != undefined){
            this.sl_fontSize.hideSign();
        }
        if(this.sl_fontWeight != undefined){
            this.sl_fontWeight.hideSign();
        }
        if(this.sl_rotation != undefined){
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

