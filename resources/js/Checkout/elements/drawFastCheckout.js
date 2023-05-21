class fastCheckout {
    constructor(parent){
      this.id = "fastCheckout_";
      this.parent = parent;
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
      this.mainElement.Class("fastCheckout");
      Paypal.drawButtons(this.mainElement);
    }
  }