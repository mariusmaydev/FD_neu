
class drawCheckoutProgress {
    constructor(parent){
        this.parent = parent;
        this.id = "checkoutProgress_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
        this.mainElement.Class("checkoutProgressBarMain");
        this.draw();
    }
    draw(){
        this.progressDiv1 = new SPLINT.DOMElement(this.id + "progressPart_1", "div", this.mainElement);
        this.button1 = new SPLINT.DOMElement.Button(this.mainElement, "bt1", "test");

    }
    
}