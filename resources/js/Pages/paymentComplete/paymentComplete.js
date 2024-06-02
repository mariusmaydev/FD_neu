
class drawPaymentComplete extends Pages_template {
    constructor(){
        super("paymentComplete");
        SPLINT.Events.onLoadingComplete.dispatch();
        this.draw1();
    }
    async draw1(){
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            NavBar.setInParts();
        } else {
            Footer.desktop();
        }
        this.contentDiv = new SPLINT.DOMElement("Pcontent", "div", this.mainElement);
        this.contentDiv.Class("content");
            let headline = new SPLINT.DOMElement.SpanDiv(this.contentDiv, "headline", "Bestellung abgeschlossen");
                headline.Class("headline");
            let BTSymbol = new SPLINT.DOMElement.Button(this.contentDiv, "BTSymbol");
                BTSymbol.bindIcon("done")


            let codeh = new SPLINT.DOMElement.SpanDiv(this.contentDiv, "codeH", "Dein Bestellcode:");
                codeh.Class("codeH");
            let orderID = SPLINT.Tools.Location.getParams().orderID;
            let code = new SPLINT.DOMElement.SpanDiv(this.contentDiv, "code", orderID);
                code.Class("code");
                
            this.#removeSessions();
            // let spinner = new SPLINT.DOMElement.Spinner(this.contentDiv, "spinner");
            //     spinner.show();
        // setTimeout(()=> {
        //     let a = Paypal.capturePayment(.getParams().token);
        //     console.log(a);
        //     SPLINT.Events.onLoadingComplete.dispatch();

        // }, 5000);
    }
    async #removeSessions(){
        SPLINT.SessionsPHP.remove(Checkout.sessions.addresses);
        SPLINT.SessionsPHP.remove(Checkout.sessions.invoiceAddress);
        SPLINT.SessionsPHP.remove(Checkout.sessions.sending);
        SPLINT.SessionsPHP.remove(Checkout.sessions.paymentType);
        SPLINT.SessionsPHP.remove(Checkout.sessions.progress);
        SPLINT.SessionsPHP.remove(Checkout.sessions.couponCode);
        SPLINT.SessionsPHP.remove(Checkout.sessions.invoiceType);
    }
}