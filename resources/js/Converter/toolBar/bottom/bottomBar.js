
class Converter_ToolBar_bottom {
    constructor() {
        this.ELEMENTS = [];
        this.parent = document.getElementById("ConverterBottomBar");
        this.id = "ConverterToolBar_";
        this.type = "bottom";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("conv_BottomBar_Main");
        // this.drawHelper = new Converter_BottomBar_DrawHelper(this.mainElement);
        this.drawBar = new BottomBar_Draw(this.mainElement);
        this.update();
    }
    addText(data){
        if(CONVERTER_STORAGE.canvasNEW.activeElement != null){
            this.focusElement("txt", data.TextID);
        }
    }
    addImage(data){
        if(CONVERTER_STORAGE.canvasNEW.activeElement != null){
            this.focusElement("img", data.ImageID);
        }
    }
    block(ImageID){
        // this.imageBar.blockElement(ImageID);
    }
    unBlock(ImageID){
        // this.imageBar.unBlockElement(ImageID);
    }
    // getElement(type, ID){
    //     if(type == Converter_ToolBar_bottom.TYPE_IMG){
    //         this.imageBar.getElement(ID);
    //     } else if(type == Converter_ToolBar_bottom.TYPE_TXT){
    //         this.textBar.getElement(ID);
    //     }
    // }
    focusElement(type, ID){
        if(type == Converter_ToolBar.TYPE_IMG){
            this.drawBar.focusElement(ID);
        } else if(type == Converter_ToolBar.TYPE_TXT){
            this.drawBar.focusElement(ID);
        }
    }
    blurElement(type, ID){
        if(type == Converter_ToolBar.TYPE_IMG){
            this.drawBar.blurElement(ID);
        } else if(type == Converter_ToolBar.TYPE_TXT){
            this.drawBar.blurElement(ID);
        }
    }
    blurAll(){
        this.drawBar.unsetFocus();
    }
    update(){
        this.drawBar.clear();
        for(let i = 0; i < DSText.length(); i++){
            this.addText(DSText.get(i));
        }
        this.drawBar.clear();
        for(let i = 0; i < DSImage.length(); i++){
            this.addImage(DSImage.get(i));
        }
    }
    hide(){
        this.mainElement.style.display = "none"
    }
    unhide(){
        this.mainElement.style.display = "block"
    }
}