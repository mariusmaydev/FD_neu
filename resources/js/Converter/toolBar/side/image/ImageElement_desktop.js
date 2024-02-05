class ToolBar_ImageElement {
    constructor(data){
        this.data = data;
        this.ImageID = this.data.ImageID;
        this.TOOLS = ImageTools.getImageToolsForID(data.ImageID);
        this.id = "ConverterToolBar_Image_ListElement_";
        this.mainElement = new SPLINT.DOMElement(this.id + data.ImageID, "div", "ConverterToolBar_Image_main");
        this.mainElement.Class("ToolBar_ListElement");
        this.mainElement.Class("ToolBar_ListElement_Image");
        this.mainElement.setAttribute("ele-type", "img");
        // this.mainElement.
        this.PARTS = new ToolBar_ImageElement_parts(this.TOOLS, this.mainElement);
        this.draw();
    }
    set block(val){
        if(val == true){
            this.sl_antialiasing.inputElement.disabled = true;
            this.sl_sharpness.inputElement.disabled = true;
            this.sl_contrast.inputElement.disabled = true;
            this.spinner.show();
        } else {
            this.sl_antialiasing.inputElement.disabled = false;
            this.sl_sharpness.inputElement.disabled = false;
            this.sl_contrast.inputElement.disabled = false;
            this.spinner.hide();
        }
    }
    get block(){
        return this.block;
    }
    draw(){      
        
        this.expanderBody = new SPLINT.DOMElement(this.ImageID + "_expanderBody", "div", this.mainElement);
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

        this.topDiv = new SPLINT.DOMElement(this.ImageID + "_topDiv", "div", this.mainElement);
        this.topDiv.Class("topDiv");
            // this.topDiv.appendChild(this.imgEle);
            // this.topDiv.appendChild(this.buttonsDiv);
            // this.mainElement.insertBefore(this.topDiv, this.mainElement.childNodes[0]);
        this.imgEle = new SPLINT.DOMElement(this.ImageID + "_imgDiv", "div", this.topDiv);  
        this.imgEle.Class("imgDiv");
            this.img = new SPLINT.DOMElement(this.ImageID + "_img", "img", this.imgEle);
            this.img.src = this.data.images.scale;
            
        this.toolsBody = new SPLINT.DOMElement(this.ImageID + "_toolsBody", "div", this.mainElement);
        this.toolsBody.Class("toolsBody");

        this.drawButtons();
        this.drawSlider();
        this.drawSpinner();
    }
    drawButtons(){
        
        this.buttonsDiv = new SPLINT.DOMElement(this.ImageID + "_buttonsDiv", "div", this.topDiv);
        this.buttonsDiv.Class("buttonsDiv");
            this.PARTS.BT_remove(this.buttonsDiv);
            this.PARTS.BT_copy(this.buttonsDiv);
            this.PARTS.BT_flip("HORIZONTAL", this.buttonsDiv);
            this.PARTS.BT_flip("VERTICAL", this.buttonsDiv);
    }
    drawSlider(){
        //Contrast
        this.sl_contrast = new SPLINT.DOMElement.Slider(this.toolsBody, "contrast_" + this.ImageID, "Kontrast");
        this.sl_contrast.drawTickMarks = false;
        this.sl_contrast.min    = 0;
        this.sl_contrast.max    = 10;
        this.sl_contrast.value  = this.data.ImageFilter.contrast;
        this.sl_contrast.oninputFinished = function(value){
            this.data.ImageFilter.contrast = value;
            ConverterHelper.filter(DSImage.getIndex(this.ImageID));
        }.bind(this);

        //Antialiasing
        this.sl_antialiasing = new SPLINT.DOMElement.Slider(this.toolsBody, "antialiasing_" + this.ImageID, "Glättung");
        this.sl_antialiasing.drawTickMarks = false;
        this.sl_antialiasing.min    = 0;
        this.sl_antialiasing.max    = 10;
        this.sl_antialiasing.value  = this.data.ImageFilter.antialiasing;
        this.sl_antialiasing.oninputFinished = function(value){
            this.data.ImageFilter.antialiasing = value;
            ConverterHelper.filter(DSImage.getIndex(this.ImageID));
        }.bind(this);

        //Sharpness
        this.sl_sharpness = new SPLINT.DOMElement.Slider(this.toolsBody, "sharpness_" + this.ImageID, "Schärfe");
        this.sl_sharpness.drawTickMarks = false;
        this.sl_sharpness.min    = 0;
        this.sl_sharpness.max    = 10;
        this.sl_sharpness.value  = this.data.ImageFilter.sharpness;
        this.sl_sharpness.oninputFinished = function(value){
            this.data.ImageFilter.sharpness = value;
            ConverterHelper.filter(DSImage.getIndex(this.ImageID));
        }.bind(this);

        //Align
        this.sl_rotationBody = new SPLINT.DOMElement(this.ImageID + "_rotationDiv", "div", this.toolsBody);
        this.sl_rotationBody.Class("rotationBody");
            this.sl_rotation = new SPLINT.DOMElement.Slider(this.sl_rotationBody, "rotation_" + this.ImageID, "Drehung");
            this.sl_rotation.drawTickMarks = false;
            this.sl_rotation.min    = -180;
            this.sl_rotation.max    = 180;
            this.sl_rotation.value  = this.data.ImageAlign;
            this.sl_rotation.oninput = function(value){
                this.data.ImageAlign = value;
                CONVERTER_STORAGE.canvasNEW.refreshData();
                // ConverterHelper.filter(DSImage.getIndex(this.ImageID));
            }.bind(this);
            let rotationButtonsBody = new SPLINT.DOMElement(this.ImageID + "_rotationButtonsBody", "div", this.sl_rotationBody);
                rotationButtonsBody.Class("ContainerBody");
                let rotationButtonsContainer = new SPLINT.DOMElement(this.ImageID + "_rotationButtonsContainer", "div", rotationButtonsBody);
                    rotationButtonsContainer.Class("container");

                    let buttonR90 = new SPLINT.DOMElement.Button(rotationButtonsContainer, "R90", "-90°");
                        buttonR90.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
                        buttonR90.onclick = function(){
                            this.data.ImageAlign = -90;
                            this.sl_rotation.value = -90;
                            CONVERTER_STORAGE.canvasNEW.refreshData();
                        }.bind(this);
                    let buttonzero = new SPLINT.DOMElement.Button(rotationButtonsContainer, "reset", 0);
                        buttonzero.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
                        buttonzero.onclick = function(){
                            this.data.ImageAlign = 0;
                            this.sl_rotation.value = 0;
                            CONVERTER_STORAGE.canvasNEW.refreshData();
                        }.bind(this);

                    let button90 = new SPLINT.DOMElement.Button(rotationButtonsContainer, "90", "+90°");
                        button90.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
                        button90.onclick = function(){
                            this.data.ImageAlign = 90;
                            this.sl_rotation.value = 90;
                            CONVERTER_STORAGE.canvasNEW.refreshData();
                        }.bind(this);
                let rotationButtonsEmpty = new SPLINT.DOMElement(this.ImageID + "_rotationsButtonEmpty", "div", rotationButtonsBody);
                    rotationButtonsEmpty.Class("empty");

    }
    blur(){
        this.mainElement.state().unsetActive();
        this.expander.unsetActive();
        document.getElementById("ConverterToolBar_Image_main").appendChild(this.mainElement);
    }
    focus(){
        CONVERTER_STORAGE.toolBar.blurElement("img");
        this.mainElement.state().setActive();
        this.expander.setActive();
        CONVERTER_STORAGE.canvasNEW.setActive(this.data, "img");


        let ele = document.getElementById("ConverterToolBar_activeBody").childNodes[0];
        if(document.getElementById("ConverterToolBar_activeBody").childNodes.length > 0){
            if(ele.getAttribute("ele-type") == "txt"){
                document.getElementById("ConverterToolBar_Text_main").appendChild(ele);
                ele.state().unsetActive();
            } else {
                document.getElementById("ConverterToolBar_Image_main").appendChild(ele);
                // this.mainElement.insertBefore(tD, this.mainElement.childNodes[0]);
                ele.state().unsetActive();
            }
            document.getElementById("ConverterToolBar_activeBody").clear();
        }
        document.getElementById("ConverterToolBar_activeBody").appendChild(this.mainElement);
    }
    drawSpinner(){
        this.spinnerBody = new SPLINT.DOMElement(this.ImageID + "_Spinner", "div", this.imgEle);
        this.spinnerBody.Class("spinner");
            this.spinner = new SPLINT.DOMElement.Spinner(this.spinnerBody, this.ImageID);
            this.spinner.hide();
    }
}

