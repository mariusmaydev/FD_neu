
class drawPaymentComplete extends Pages_template {
    constructor(){
        super("paymentComplete");
        console.log("aaaa")
        this.draw1();
    }
    async draw1(){
        setTimeout(()=> {
            let a = Paypal.capturePayment(S_Location.getParams().token);
            console.log(a);
            SPLINT.Events.onLoadingComplete.dispatch();

        }, 5000);
    }
}