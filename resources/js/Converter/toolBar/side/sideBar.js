
class Converter_ToolBar_side {
    static TYPE_IMG = "img";
    static TYPE_TXT = "txt";
    constructor(parent) {
        this.ELEMENTS = [];
        this.parent = parent;
        this.id = "ConverterToolBar_";
        this.type = "side";
        this.lighterSettingsBody = new SPLINT.DOMElement(this.id + "lighterSettingsBody", "div", this.parent);
        this.lighterSettingsBody.Class("ToolBar_LighterSettingsBody");
        this.lighterSettings = new ToolBar_LighterSettings(this.lighterSettingsBody);
        this.activeBody = new SPLINT.DOMElement(this.id + "activeBody", "div", this.parent);
        this.activeBody.Class("ToolBar_ActiveBody");
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("ToolBar_Main");
        this.imageBar = new ToolBar_Image(this.mainElement);
        this.textBar = new ToolBar_Text(this.mainElement);
        this.update();
    }
    addText(data){
        this.textBar.addElement(data);
    }
    addImage(data){
        this.imageBar.addElement(data);
    }
    getElement(type, ID){
        if(type == Converter_ToolBar_side.TYPE_IMG){
            this.imageBar.getElement(ID);
        } else if(type == Converter_ToolBar_side.TYPE_TXT){
            this.textBar.getElement(ID);
        }
    }
    focusElement(type, ID){
        if(type == Converter_ToolBar_side.TYPE_IMG){
            this.imageBar.focusElement(ID);
        } else if(type == Converter_ToolBar_side.TYPE_TXT){
            this.textBar.focusElement(ID);
        }
    }
    blurElement(type, ID){
        if(type == Converter_ToolBar_side.TYPE_IMG){
            this.imageBar.blurElement(ID);
        } else if(type == Converter_ToolBar_side.TYPE_TXT){
            this.textBar.blurElement(ID);
        }
    }
    blurAll(event = null){
        this.imageBar.blurElement();
        this.textBar.blurElement();
        if(event == null || !event.srcElement.hasParentWithClass("ToolBar_LighterSettingsBody")){
            this.lighterSettings.blur();
        } else if(event.srcElement.hasParentWithClass("expanderBody")){

        }
    }
    update(){
        this.textBar.clear();
        for(let i = 0; i < DSText.length(); i++){
            this.addText(DSText.get(i));
        }
        this.imageBar.clear();
        for(let i = 0; i < DSImage.length(); i++){
            this.addImage(DSImage.get(i));
        }
    }
}