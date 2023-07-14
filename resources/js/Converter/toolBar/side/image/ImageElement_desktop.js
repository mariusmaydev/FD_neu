class ToolBar_ImageElement {
    constructor(data){
        this.data = data;
        this.ImageID = this.data.ImageID;
        this.TOOLS = ImageTools.getImageToolsForID(data.ImageID);
        this.id = "ConverterToolBar_Image_ListElement_";
        this.mainElement = new SPLINT.DOMElement(this.id + data.ImageID, "div", "ConverterToolBar_Image_main");
        this.mainElement.Class("ToolBar_ListElement");
        this.mainElement.Class("ToolBar_ListElement_Image");
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

        this.imgEle = new SPLINT.DOMElement(this.ImageID + "_imgDiv", "div", this.mainElement);  
        this.imgEle.Class("imgDiv");
            this.img = new SPLINT.DOMElement(this.ImageID + "_img", "img", this.imgEle);
            this.img.src = this.data.images.scale;
        this.drawButtons();
        this.drawSlider();
        this.drawSpinner();
    }
    drawButtons(){
        
        let buttonsDiv = new SPLINT.DOMElement(this.ImageID + "_buttonsDiv", "div", this.mainElement);
            buttonsDiv.Class("buttonsDiv");
            this.PARTS.BT_remove(buttonsDiv);
            this.PARTS.BT_copy(buttonsDiv);
            this.PARTS.BT_flip("HORIZONTAL", buttonsDiv);
            this.PARTS.BT_flip("VERTICAL", buttonsDiv);
    }
    drawSlider(){
        //Contrast
        this.sl_contrast = new Slider(this.mainElement, "contrast_" + this.ImageID, "Kontrast");
        this.sl_contrast.drawTickMarks = false;
        this.sl_contrast.min    = 0;
        this.sl_contrast.max    = 10;
        this.sl_contrast.value  = this.data.ImageFilter.contrast;
        this.sl_contrast.oninputFinished = function(value){
            this.data.ImageFilter.contrast = value;
            ConverterHelper.filter(DSImage.getIndex(this.ImageID));
        }.bind(this);

        //Antialiasing
        this.sl_antialiasing = new Slider(this.mainElement, "antialiasing_" + this.ImageID, "Glättung");
        this.sl_antialiasing.drawTickMarks = false;
        this.sl_antialiasing.min    = 0;
        this.sl_antialiasing.max    = 10;
        this.sl_antialiasing.value  = this.data.ImageFilter.antialiasing;
        this.sl_antialiasing.oninputFinished = function(value){
            this.data.ImageFilter.antialiasing = value;
            ConverterHelper.filter(DSImage.getIndex(this.ImageID));
        }.bind(this);

        //Sharpness
        this.sl_sharpness = new Slider(this.mainElement, "sharpness_" + this.ImageID, "Schärfe");
        this.sl_sharpness.drawTickMarks = false;
        this.sl_sharpness.min    = 0;
        this.sl_sharpness.max    = 10;
        this.sl_sharpness.value  = this.data.ImageFilter.sharpness;
        this.sl_sharpness.oninputFinished = function(value){
            this.data.ImageFilter.sharpness = value;
            ConverterHelper.filter(DSImage.getIndex(this.ImageID));
        }.bind(this);

        //Align
        this.sl_rotation = new Slider(this.mainElement, "rotation_" + this.ImageID, "Drehung");
        this.sl_rotation.drawTickMarks = false;
        this.sl_rotation.min    = -180;
        this.sl_rotation.max    = 180;
        this.sl_rotation.value  = this.data.ImageAlign;
        this.sl_rotation.oninput = function(value){
            console.log("a")
            this.data.ImageAlign = value;
            CONVERTER_STORAGE.canvasNEW.refreshData();
            // ConverterHelper.filter(DSImage.getIndex(this.ImageID));
        }.bind(this);
    }
    blur(){
        this.mainElement.state().unsetActive();
        this.expander.unsetActive();
    }
    focus(){
        CONVERTER_STORAGE.toolBar.blurElement("img");
        this.mainElement.state().setActive();
        this.expander.setActive();
        CONVERTER_STORAGE.canvasNEW.setActive(this.data, "img");
    }
    drawSpinner(){
        this.spinnerBody = new SPLINT.DOMElement(this.ImageID + "_Spinner", "div", this.imgEle);
        this.spinnerBody.Class("spinner");
            this.spinner = new Spinner1(this.spinnerBody, this.ImageID);
            this.spinner.hide();
    }
}

