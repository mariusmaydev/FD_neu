class BottomBar_Image {
    constructor(parent) {
        this.parent = parent;
        this.id = "BottomBar_Image_";
    }
    draw(data){
        this.data = data;
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("converter-bottom-bar-image-main");
        this.parent.setAttribute("name", "image");
        this.drawHelper = CONVERTER_STORAGE.toolBar.drawHelper;
        this.TOOLS = ImageTools.getImageToolsForID(data.ImageID);
        this.PARTS = new ToolBar_ImageElement_parts(this.TOOLS, this.mainElement);
        this.drawButtons();
        // this.drawSlider();
    }
    drawButtons(){
        this.mainElement.clear();
        
        this.button_back = new SPLINT.DOMElement.Button(this.mainElement, "button_back");
        this.button_back.bindIcon("arrow_back");
        this.button_back.onclick = function(){
                this.parent.clear();
                CONVERTER_STORAGE.toolBar.blurAll();
            }.bind(this);

        this.buttonsDiv = new SPLINT.DOMElement(this.id + "buttonsDiv", "div", this.mainElement);
        this.buttonsDiv.Class("buttonsDiv");
        
        let button_settings = new SPLINT.DOMElement.Button.Switch(this.buttonsDiv, "button_settings");
            button_settings.bindIcon("tune");
            button_settings.Description = "anpassen";
            button_settings.onactive = function(){
                let filter = new BottomBarImageFilterMenu(this);//.draw()
                // this.drawSlider(button_settings);
                // this.floatingDiv.onRemoveFloatingDiv = function(){
                    button_settings.unsetActive();
                // }.bind(this);
            }.bind(this);
            button_settings.button.onclick = function(e){
                // e.preventDefault();
                // e.stopPropagation();
                button_settings.toggle();
            }

        this.PARTS.BT_copy(this.buttonsDiv);
        this.PARTS.BT_remove(this.buttonsDiv);
        this.PARTS.BT_flip("VERTICAL", this.buttonsDiv);
        this.PARTS.BT_flip("HORIZONTAL", this.buttonsDiv);
        
        let bt_rotation = new SPLINT.DOMElement.Button.Switch(this.buttonsDiv, "rotation", "bt1");
            bt_rotation.bindIcon("rotate_left");
            bt_rotation.Description = "Drehung";
            bt_rotation.onactive = function(){
                this.drawSliderRotate(bt_rotation);
                
                this.floatingDiv.onRemoveFloatingDiv = function(){
                    bt_rotation.unsetActive();
                }.bind(this);
            }.bind(this);
    }
    drawSlider(parent){
        this.floatingDiv = new Converter_BottomBar_floatingDiv_block("slider");
        
        //Contrast
        this.sl_contrast = new SPLINT.DOMElement.RangeSlider(this.floatingDiv.content, "contrast_" + this.data.ImageID, "Kontrast");
        this.sl_contrast.drawTickMarks = false;
        this.sl_contrast.min    = 0;
        this.sl_contrast.max    = 10;
        this.sl_contrast.valueExtension = "%";
        this.sl_contrast.value  = parseInt(this.data.ImageFilter.contrast);
        this.sl_contrast.onDrawSign = function(signContent){
            signContent.value = SPLINT.Tools.Math.roundFX(this.sl_contrast.valuePercent, 0, true) + this.sl_contrast.valueExtension;
        }.bind(this);
        this.sl_contrast.oninputFinished = function(value){
            this.data.ImageFilter.contrast = value;
            ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
        }.bind(this);
 
        //Antialiasing
        this.sl_antialiasing = new SPLINT.DOMElement.RangeSlider(this.floatingDiv.content, "antialiasing_" + this.data.ImageID, "Glättung");
        this.sl_antialiasing.drawTickMarks = false;
        this.sl_antialiasing.min    = 0;
        this.sl_antialiasing.max    = 10;
        this.sl_antialiasing.valueExtension = "%";
        this.sl_antialiasing.value  = this.data.ImageFilter.antialiasing;
        this.sl_antialiasing.onDrawSign = function(signContent){
            signContent.value = SPLINT.Tools.Math.roundFX(this.sl_antialiasing.valuePercent, 0, true) + this.sl_antialiasing.valueExtension;
        }.bind(this);
        this.sl_antialiasing.oninputFinished = function(value){
            this.data.ImageFilter.antialiasing = value;
            ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
        }.bind(this);

        //Sharpness
        this.sl_sharpness = new SPLINT.DOMElement.RangeSlider(this.floatingDiv.content, "sharpness_" + this.data.ImageID, "Schärfe");
        this.sl_sharpness.drawTickMarks = false;
        this.sl_sharpness.min    = 0;
        this.sl_sharpness.max    = 10;
        this.sl_sharpness.valueExtension = "%";
        this.sl_sharpness.value  = this.data.ImageFilter.sharpness;
        this.sl_sharpness.onDrawSign = function(signContent){
            signContent.value = SPLINT.Tools.Math.roundFX(this.sl_sharpness.valuePercent, 0, true) + this.sl_sharpness.valueExtension;
        }.bind(this);
        this.sl_sharpness.oninputFinished = function(value){
            this.data.ImageFilter.sharpness = value;
            ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
        }.bind(this);

        //lineWidth
        this.sl_lineWidth = new SPLINT.DOMElement.RangeSlider(this.floatingDiv.content, "lineWidth_" + this.data.ImageID, "Linienstärke");
        this.sl_lineWidth.drawTickMarks = false;
        this.sl_lineWidth.min    = 1;
        this.sl_lineWidth.max    = 3;
        this.sl_lineWidth.valueExtension = "";
        this.sl_lineWidth.value  = parseInt(this.data.ImageFilter.lineWidth);
        this.sl_lineWidth.onDrawSign = function(signContent){
            signContent.value = this.sl_lineWidth.value;//SPLINT.Tools.Math.roundFX(this.sl_lineWidth.valuePercent, 0, true) + this.sl_lineWidth.valueExtension;
        }.bind(this);
        this.sl_lineWidth.oninputFinished = function(value){
            this.data.ImageFilter.lineWidth = value;
            ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
        }.bind(this);

        this.sl_contrast.updateSign();
        this.sl_sharpness.updateSign();
        this.sl_antialiasing.updateSign();
        this.sl_lineWidth.updateSign();
    }
    drawSliderRotate(){
        this.floatingDiv = new Converter_BottomBar_floatingDiv_block("slider");
        //Align
        this.sl_rotationBody = new SPLINT.DOMElement(this.data.ImageID + "_rotationDiv", "div", this.floatingDiv.content);
        this.sl_rotationBody.Class("rotationBody");
            // this.sl_rotation = new SPLINT.DOMElement.RangeSlider(this.sl_rotationBody, "rotation_" + this.data.ImageID, "Drehung");
            // this.sl_rotation.drawTickMarks = false;
            // this.sl_rotation.min    = -180;
            // this.sl_rotation.max    = 180;
            // this.sl_rotation.valueExtension = "deg";
            // this.sl_rotation.value  = this.data.ImageAlign;
            // this.sl_rotation.onDrawSign = function(signContent){
            //     signContent.value = this.sl_rotation.value + this.sl_rotation.valueExtension;
            // }.bind(this);
            // this.sl_rotation.oninput = function(value){
            //     this.data.ImageAlign = value;
            //     CONVERTER_STORAGE.canvasNEW.refreshData();
            //     // ConverterHelper.filter(DSImage.getIndex(this.ImageID));
            // }.bind(this);
            let rotationButtonsBody = new SPLINT.DOMElement(this.data.ImageID + "_rotationButtonsBody", "div", this.sl_rotationBody);
                rotationButtonsBody.Class("ContainerBody");
                let rotationButtonsContainer = new SPLINT.DOMElement(this.data.ImageID + "_rotationButtonsContainer", "div", rotationButtonsBody);
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
                let rotationButtonsEmpty = new SPLINT.DOMElement(this.data.ImageID + "_rotationsButtonEmpty", "div", rotationButtonsBody);
                    rotationButtonsEmpty.Class("empty");

    }
}