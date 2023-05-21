
class ConverterDOMRenderer {
    static SCALE = 50;
    constructor(parent) {
        this.parent = parent;
        this.id = "DOMConverter";
        this.elements = [];
        this.size = new Object();
        this.HELPER = new ConverterDOMRendererHelper(this);
        this.HELPER_IMG = new ConverterDOMRendererImageHelper(this);
        this.HELPER_ELESTACK = new CDOMR_elementStackHelper(this);
    }
    init(){
        this.mainDiv = new SPLINT.DOMElement(this.id + "MAIN_DIV", "div", this.parent);
        this.mainDiv.Class("DOMConverterMAINDIV");
        this.adjustSize();
    }
    adjustSize(){
        this.size.X = ConverterDOMRenderer.SCALE * LighterWidth;
        this.size.Y = ConverterDOMRenderer.SCALE * LighterHeight; 
        this.ratio = this.size.X / this.mainDiv.offsetWidth;
    }
    update(){
        console.log(this.HELPER);
        for(const index in DSImage.Storage){
            let data = DSImage.Storage[index];
            if(this.HELPER_ELESTACK.getImgIndexByID(data.ImageID) === false){
                this.HELPER_IMG.addImage(data);
            } else {
                this.HELPER_IMG.editImage(data);
            }
        }
        // this.newImage(DSImage.Storage[0]);
    }
    removeImage(){

    }
    newText(){

    }
    removeText(){

    }
}