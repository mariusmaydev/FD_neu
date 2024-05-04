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
        let button_back = new SPLINT.DOMElement.Button(this.mainElement, "button_back");
            button_back.bindIcon("arrow_back");
            button_back.onclick = function(){
                this.parent.clear();
                CONVERTER_STORAGE.toolBar.blurAll();
            }.bind(this);

        let buttonsDiv = new SPLINT.DOMElement(this.id + "buttonsDiv", "div", this.mainElement);
            buttonsDiv.Class("buttonsDiv");
        
        // let button_settings = new SPLINT.DOMElement.Button(buttonsDiv, "button_settings");
        //     button_settings.bindIcon("tune");
        //     button_settings.onclick = function(){
        //         buttonsDiv.clear();
        //         button_back.onclick = function(){
        //             this.drawButtons();
        //         }.bind(this);
        //         this.drawButtonsSettings(buttonsDiv);
        //         // this.drawSlider(button_settings);
        //         // this.floatingDiv.onRemoveFloatingDiv = function(){
        //         //     button_settings.unsetActive();
        //         // }.bind(this);

        //     }.bind(this);
        let button_settings = new SPLINT.DOMElement.Button.Switch(buttonsDiv, "button_settings");
            button_settings.bindIcon("tune");
            button_settings.onactive = function(){
                this.drawSlider(button_settings);
                this.floatingDiv.onRemoveFloatingDiv = function(){
                    button_settings.unsetActive();
                }.bind(this);
            }.bind(this);

        this.PARTS.BT_copy(buttonsDiv);
        this.PARTS.BT_remove(buttonsDiv);
        this.PARTS.BT_flip("VERTICAL", buttonsDiv);
        this.PARTS.BT_flip("HORIZONTAL", buttonsDiv);
        
        let bt_rotation = new SPLINT.DOMElement.Button.Switch(buttonsDiv, "rotation", "bt1");
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
        let spinnerDiv = new SPLINT.DOMElement("spinnerDiv_slider_img", "div", this.floatingDiv.content);
            spinnerDiv.Class("spinnerDiv");
            let spinner = new SPLINT.DOMElement.Spinner(spinnerDiv, "test");

        let sl_contrast = this.PARTS.SL_contrast(this.floatingDiv.content, this.data.ImageFilter.contrast);
            sl_contrast.oninput = async function(e){
                spinnerDiv.state().setActive();
                this.data.ImageFilter.contrast = sl_contrast.value;
                await ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
                spinnerDiv.state().unsetActive();
            }.bind(this);

        let sl_sharpness = this.PARTS.SL_sharpness(this.floatingDiv.content, this.data.ImageFilter.sharpness);
            sl_sharpness.oninput = async function(e){
                spinnerDiv.state().setActive();
                this.data.ImageFilter.contrast = sl_sharpness.value;
                await ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
                spinnerDiv.state().unsetActive();
            }.bind(this);

        let sl_antialiasing = this.PARTS.SL_antialiasing(this.floatingDiv.content, this.data.ImageFilter.antialiasing);
            sl_antialiasing.oninput = async function(e){
                spinnerDiv.state().setActive();
                this.data.ImageFilter.antialiasing = sl_antialiasing.value;
                await ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
                spinnerDiv.state().unsetActive();
            }.bind(this);
        // let sliderDiv = new SPLINT.DOMElement(this.id + "_sliderDiv", "div", this.mainElement);
    }
    drawSliderRotate(){
        this.floatingDiv = new Converter_BottomBar_floatingDiv_block("slider");
        //Align
                let sl_rotationBody = new SPLINT.DOMElement(this.data.ImageID + "_rotationDiv", "div", this.floatingDiv.content);
                    sl_rotationBody.Class("rotationBody");
                    this.sl_rotation = new Slider(sl_rotationBody, "rotation_" + this.data.ImageID, "Drehung");
                    this.sl_rotation.drawTickMarks = false;
                    this.sl_rotation.min    = -180;
                    this.sl_rotation.max    = 180;
                    this.sl_rotation.value  = this.data.ImageAlign;
                    this.sl_rotation.oninput = function(value){
                        this.data.ImageAlign = value;
                        CONVERTER_STORAGE.canvasNEW.refreshData();
                        // ConverterHelper.filter(DSImage.getIndex(this.ImageID));
                    }.bind(this);
                    let rotationButtonsBody = new SPLINT.DOMElement(this.data.ImageID + "_rotationButtonsBody", "div", sl_rotationBody);
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