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
        let button_back = new SPLINT.DOMElement.Button(this.mainElement, "button_back");
            button_back.bindIcon("arrow_back");
            button_back.onclick = function(){
                this.parent.clear();
                CONVERTER_STORAGE.toolBar.blurAll();
            }.bind(this);

        let buttonsDiv = new SPLINT.DOMElement(this.id + "buttonsDiv", "div", this.mainElement);
            buttonsDiv.Class("buttonsDiv");

        let button_settings = new S_switchButton(buttonsDiv, "button_settings");
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
    }
    drawSlider(parent){
        this.floatingDiv = new Converter_BottomBar_floatingDiv_block("slider");
        // this.floatingDiv.body.before(parent.span);

        let sl_contrast = this.PARTS.SL_contrast(this.floatingDiv.content, this.data.ImageFilter.contrast);
            sl_contrast.oninput = function(e){
                console.log(this.data)
                this.data.ImageFilter.contrast = sl_contrast.value;
                ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
            }.bind(this);

        let sl_sharpness = this.PARTS.SL_sharpness(this.floatingDiv.content, this.data.ImageFilter.sharpness);
            sl_sharpness.oninput = function(e){
                this.data.ImageFilter.contrast = sl_sharpness.value;
                ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
            }.bind(this);

        let sl_antialiasing = this.PARTS.SL_antialiasing(this.floatingDiv.content, this.data.ImageFilter.antialiasing);
            sl_antialiasing.oninput = function(e){
                this.data.ImageFilter.antialiasing = sl_antialiasing.value;
                ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
            }.bind(this);
        // let sliderDiv = new SPLINT.DOMElement(this.id + "_sliderDiv", "div", this.mainElement);
    }
}