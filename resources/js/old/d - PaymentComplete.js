
class PaymentComplete {
  constructor(){
    this.parent = document.body;
    this.id = "paymentComplete_";
    this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
    this.draw();
  }
  draw(){
    console.log("complete");
    Paypal.capturePayment(S_Location.getParams().token);
  }
}