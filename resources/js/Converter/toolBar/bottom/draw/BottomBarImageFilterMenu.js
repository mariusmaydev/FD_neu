
class BottomBarImageFilterMenu {
    constructor(instance){
        this.instance = instance;
        this.data = instance.data;
        this.buttonBack = instance.button_back;
        this.buttonBack_stdFunc = instance.button_back.onclick.bind(instance);
        this.container = instance.buttonsDiv;
        this.draw();
    }
    draw(){
        this.buttonBack.onclick = function(){
            this.container.clear();
            this.instance.drawButtons();
            // this.buttonBack.onclick = this.buttonBack_stdFunc;
        }.bind(this);
        this.container.clear();
        this.floatingDiv = new Converter_BottomBar_floatingDiv_block("slider", true, true);

        let bt_contrast = new SPLINT.DOMElement.Button.Switch(this.container, "bt_contrast");
            bt_contrast.bindIcon("tune");
            bt_contrast.Description = "Kontrast";
            bt_contrast.onactive = function(){
                this.drawSliderContrast();
                this.floatingDiv.onRemoveFloatingDiv = function(inst){
                    if(inst.name == "contrast"){
                        bt_contrast.unsetActive();
                    }
                }.bind(this);
            }.bind(this);
            bt_contrast.button.onclick = function(e){
                bt_contrast.toggle();
            }
            
        let bt_sharpness = new SPLINT.DOMElement.Button.Switch(this.container, "bt_sharpness");
            bt_sharpness.bindIcon("tune");
            bt_sharpness.Description = "Schärfe";
            bt_sharpness.onactive = function(){
                this.drawSliderSharpness();
                this.floatingDiv.onRemoveFloatingDiv = function(inst){
                    if(inst.name == "sharpness"){
                        bt_sharpness.unsetActive();
                    }
                }.bind(this);
            }.bind(this);
            bt_sharpness.button.onclick = function(e){
                bt_sharpness.toggle();
            }
            
        let bt_antialias = new SPLINT.DOMElement.Button.Switch(this.container, "bt_antialias");
            bt_antialias.bindIcon("tune");
            bt_antialias.Description = "Glättung";
            bt_antialias.onactive = function(){
                this.drawSliderAntialias();
                this.floatingDiv.onRemoveFloatingDiv = function(inst){
                    if(inst.name == "antialias"){
                        bt_antialias.unsetActive();
                    }
                }.bind(this);
            }.bind(this);
            bt_antialias.button.onclick = function(e){
                bt_antialias.toggle();
            }
            
        let bt_lineWidth = new SPLINT.DOMElement.Button.Switch(this.container, "bt_lineWidth");
            bt_lineWidth.bindIcon("tune");
            bt_lineWidth.Description = "Linienstärke";
            bt_lineWidth.onactive = function(){
                this.drawSliderLineWidth();
                this.floatingDiv.onRemoveFloatingDiv = function(inst){
                    if(inst.name == "lineWidth"){
                        bt_lineWidth.unsetActive();
                    }
                }.bind(this);
            }.bind(this);
            bt_lineWidth.button.onclick = function(e){
                bt_lineWidth.toggle();
            }
    }
    drawSliderContrast(){
        this.floatingDiv.remove();
        this.floatingDiv.draw("contrast");
        this.floatingDiv.autoClose = true;

        let sl = new SPLINT.DOMElement.RangeSlider(this.floatingDiv.content, "contrast_" + this.data.ImageID, "Kontrast");
            sl.drawTickMarks = false;
            sl.min    = 0;
            sl.max    = 10;
            sl.valueExtension = "%";
            sl.value  = parseInt(this.data.ImageFilter.contrast);
            sl.onDrawSign = function(signContent){
                signContent.value = SPLINT.Tools.Math.roundFX(sl.valuePercent, 0, true) + sl.valueExtension;
            }.bind(this);
            sl.oninputFinished = function(value){
                this.data.ImageFilter.contrast = value;
                ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
            }.bind(this);
    }
    drawSliderSharpness(){
        this.floatingDiv.remove();
        this.floatingDiv.draw("sharpness");
        this.floatingDiv.autoClose = true;

        let sl = new SPLINT.DOMElement.RangeSlider(this.floatingDiv.content, "sharpness_" + this.data.ImageID, "Schärfe");
            sl.drawTickMarks = false;
            sl.min    = 0;
            sl.max    = 10;
            sl.valueExtension = "%";
            sl.value  = this.data.ImageFilter.sharpness;
            sl.onDrawSign = function(signContent){
                signContent.value = SPLINT.Tools.Math.roundFX(sl.valuePercent, 0, true) + sl.valueExtension;
            }.bind(this);
            sl.oninputFinished = function(value){
                this.data.ImageFilter.sharpness = value;
                ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
            }.bind(this);
    }
    drawSliderAntialias(){
        this.floatingDiv.remove();
        this.floatingDiv.draw("antialias");
        this.floatingDiv.autoClose = true;

        let sl = new SPLINT.DOMElement.RangeSlider(this.floatingDiv.content, "antialias_" + this.data.ImageID, "Glättung");
            sl.drawTickMarks = false;
            sl.min    = 0;
            sl.max    = 10;
            sl.valueExtension = "%";
            sl.value  = this.data.ImageFilter.antialiasing;
            sl.onDrawSign = function(signContent){
                signContent.value = SPLINT.Tools.Math.roundFX(sl.valuePercent, 0, true) + sl.valueExtension;
            }.bind(this);
            sl.oninputFinished = function(value){
                this.data.ImageFilter.antialiasing = value;
                ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
            }.bind(this);
    }
    drawSliderLineWidth(){
        this.floatingDiv.remove();
        this.floatingDiv.draw("lineWidth");
        this.floatingDiv.autoClose = true;

        let sl = new SPLINT.DOMElement.RangeSlider(this.floatingDiv.content, "lineWidth_" + this.data.ImageID, "Linienstärke");
            sl.drawTickMarks = false;
            sl.min    = 1;
            sl.max    = 3;
            sl.valueExtension = "%";
            sl.value  = this.data.ImageFilter.TextLineWidth;
            sl.onDrawSign = function(signContent){
                signContent.value = SPLINT.Tools.Math.roundFX(sl.valuePercent, 0, true) + sl.valueExtension;
            }.bind(this);
            sl.oninputFinished = function(value){
                this.data.ImageFilter.TextLineWidth = value;
                ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
            }.bind(this);
    }
}