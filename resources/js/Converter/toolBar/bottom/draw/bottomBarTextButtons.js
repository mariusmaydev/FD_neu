

class BottomBar_Text_Button_FontSize {
    constructor(parent, tools, data){
        this.parent = parent;
        this.TOOLS = tools;
        this.data = data;
        this.draw();
    }
    draw(){
        this.button = new SPLINT.DOMElement.Button.Switch(this.parent, "fontSize");
        this.button.bindIcon("format_size");
        this.button.Description = "Schriftgröße";
        this.button.onactive = function(){
            this.drawSlider();
            this.floatingDiv.onRemoveFloatingDiv = function(){
            }.bind(this);
        }.bind(this);
        this.button.button.onclick = function(){
            this.button.toggle();
        }.bind(this);
    }
    drawSlider(){
        this.floatingDiv = new Converter_BottomBar_floatingDiv_block("fontSizeSlider");
        
            this.sl = new SPLINT.DOMElement.RangeSlider(this.floatingDiv.content, "contrast_" + this.floatingDiv.content.id, "Schriftgröße");
            this.sl.drawTickMarks = false;
            this.sl.min    = 0.5;
            this.sl.max    = 40;
            this.sl.step   = 0.5;
            this.sl.value          = Math.round(SPLINT.Math.convert.px2pt(SPLINT.Math.divide(this.data.FontSize, 10)) * 2) / 2;
            this.sl.valueExtension = "";
            this.sl.onDrawSign = function(signContent){
                signContent.value = this.sl.value + this.sl.valueExtension;
            }.bind(this);
            this.sl.oninput = function(value){
                this.data.FontSize = Math.round(SPLINT.Math.convert.pt2px(SPLINT.Math.multiply(value, 10)) * 2) / 2;
                CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt", true);
            }.bind(this);
            // this.sl_contrast.drawValueOutput = false;
            // this.sl.value  = parseInt(this.data.ImageFilter.contrast);
            // this.sl.onDrawSign = function(signContent){
            //     signContent.value = SPLINT.Tools.Math.roundFX(this.sl_contrast.valuePercent, 0, true) + this.sl_contrast.valueExtension;
            // }.bind(this);
            // this.sl_contrast.oninputFinished = function(value){
            //     this.data.ImageFilter.contrast = value;
            //     ConverterHelper.filter(DSImage.getIndex(this.data.ImageID));
            // }.bind(this);
            // let sl = new SPLINT.DOMElement.Slider(this.floatingDiv.content, "sl_fontSize_" + this.floatingDiv.content.id, "Schriftgröße");
            //     sl.min    = 100;
            //     sl.max    = 1000;
            //     sl.step   = 100;
            //     sl.value  = this.data.FontSize;
                
            //     sl.oninput = function(e){
            //         this.data.FontSize = sl.value;
            //         CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt");
            //     }.bind(this);
    }
}

class BottomBar_Text_Button_FontWeight {
    constructor(parent, tools, data){
        this.parent = parent;
        this.TOOLS = tools;
        this.data = data;
        this.draw();
    }
    draw(){
        
        this.button = new SPLINT.DOMElement.Button.Switch(this.parent, "fontWeight");
        this.button.bindIcon("format_bold");
        this.button.Description = "Schriftstärke";
        this.button.onactive = function(){
            this.drawSlider();
            this.floatingDiv.onRemoveFloatingDiv = function(){
            }.bind(this);
        }.bind(this);
        this.button.button.onclick = function(e){
            this.button.toggle();
        }.bind(this);
    }
    drawSlider(){
        this.floatingDiv = new Converter_BottomBar_floatingDiv_block("fontWeightSlider");

        let sl_fontWeight = new SPLINT.DOMElement.Slider(this.floatingDiv.content, "sl_fontWeight_" + this.floatingDiv.content.id, "Schriftstärke");
            sl_fontWeight.min    = 100;
            sl_fontWeight.max    = 1000;
            sl_fontWeight.step   = 100;
            sl_fontWeight.value  = this.data.FontWeight;
            
            sl_fontWeight.oninput = function(e){
                this.data.FontWeight = sl_fontWeight.value;
                CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt", true);
            }.bind(this);

    }
}

class BottomBar_Text_Button_TextAlign {
    constructor(parent, tools, data){
        this.parent = parent;
        this.TOOLS = tools;
        this.data = data;
        this.draw();
    }
    draw(){
        this.button = new SPLINT.DOMElement.Button.Switch(this.parent, "textAlign");
        this.button.bindIcon("format_align_center");
        this.button.Description = "Ausrichtung";
        this.button.onactive = function(){
            this.drawSlider();
            this.floatingDiv.onRemoveFloatingDiv = function(){
                this.button.unsetActive();
            }.bind(this);
        }.bind(this);
    }
    drawSlider(){
        this.floatingDiv = new Converter_BottomBar_floatingDiv_block("textAlignSlider");

            this.button_left = new SPLINT.DOMElement.Button.Switch(this.floatingDiv.content, "textAlign_left");
            this.button_left.bindIcon("format_align_left");
            this.button_left.Description = "Linksbündig";
            this.button_left.onactive = function(){
                    this.TOOLS.align('left');
                    this.button_right.unsetActive();
                    this.button_center.unsetActive();
                }.bind(this);

            this.button_center = new SPLINT.DOMElement.Button.Switch(this.floatingDiv.content, "textAlign_center");
            this.button_center.bindIcon("format_align_center");
            this.button_center.Description = "Zentriert";
            this.button_center.onactive = function(){
                    this.TOOLS.align('center');
                    this.button_left.unsetActive();
                    this.button_right.unsetActive();
                }.bind(this);

            this.button_right = new SPLINT.DOMElement.Button.Switch(this.floatingDiv.content, "textAlign_right");
            this.button_right.bindIcon("format_align_right");
            this.button_right.Description = "Rechtsbündig";
            this.button_right.onactive = function(){
                    this.TOOLS.align('right');
                    this.button_left.unsetActive();
                    this.button_center.unsetActive();
                }.bind(this);

        if(this.data.TextOrientation == "center"){
            this.button_center.setActive();
        } else if(this.data.TextOrientation == "left"){
            this.button_left.setActive();
        } else if(this.data.TextOrientation == "right"){
            this.button_right.setActive();
        }
    }
}