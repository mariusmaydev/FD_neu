class drawCheckoutAddress {
    constructor(parent) {
        this.parent = parent;
        this.id = this.parent.id + "_AddressMenuNew_";
        this.mainElement = new SPLINT.DOMElement(this.id + "Body", "div", this.parent);
        this.mainElement.Class("AddressMenuNew_Body");
        this.draw();
    }
    draw(){
        this.addressMenuNew = new drawAddressMenu_NEW(this.mainElement, "newAddress", "test");
        this.addressMenuNew.DrawSubmit(false);

    }
}