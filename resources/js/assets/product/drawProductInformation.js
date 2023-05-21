
class ProductInformation {
    constructor(name){
        this.name = name;
        this.mainElement = new SPLINT.DOMElement.popupWindow(name);
        this.mainElement.Class("ProductInformationMain");
        this.draw();
    }
    draw(){
        this.contentElement = this.mainElement.content;
        this.lighter = new drawLighter3D(this.contentElement, this.name, drawLighter3D.PROJECT);

        // this.mainElement.content
    }
}