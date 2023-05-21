
class drawPaymentComplete extends Pages_template {
    constructor(){
        super("paymentComplete");
    }
    draw(){
        let a = Paypal.capturePayment(S_Location.getParams().token);
        console.log(a);
        SPLINT.Events.onLoadingComplete.dispatch();
    }
}