
class drawPaymentComplete extends Pages_template {
    constructor(){
        super("paymentComplete");
        SPLINT.Events.onLoadingComplete.dispatch();
        this.draw1();
    }
    async draw1(){
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            Footer.mobile();
        } else {
            Footer.desktop();
        }
        this.contentDiv = new SPLINT.DOMElement("Pcontent", "div", this.mainElement);
        this.contentDiv.Class("content");
            let headline = new SPLINT.DOMElement.SpanDiv(this.contentDiv, "headline", "Bestellung abgeschlossen");
                headline.Class("headline");
            let BTSymbol = new SPLINT.DOMElement.Button(this.contentDiv, "BTSymbol");
                BTSymbol.bindIcon("done")

            // let spinner = new SPLINT.DOMElement.Spinner(this.contentDiv, "spinner");
            //     spinner.show();
        // setTimeout(()=> {
        //     let a = Paypal.capturePayment(S_Location.getParams().token);
        //     console.log(a);
        //     SPLINT.Events.onLoadingComplete.dispatch();

        // }, 5000);
    }
}