
class ADMIN_StripeSuccess extends ADMIN_DrawTemplate {
    static key_public = "pk_test_51Oj1TcCFoYzhepR8dQA91dPhw7IGJQtLbrsLCoxAvQPTrCZtIJPEvaIA867zPL3NCL8t6glG1Za8MJ2ABbKhS8XK00Ozs77LhH";
    static key_private = "sk_test_51Oj1TcCFoYzhepR8tg2ad3XERJwcH5UR1byzBQQZtjNvrvOjNN8i9hIkCkAPpfqtvrzSaBcelfNAOlYhX59TGL1T00Kn0ILGpK";
    constructor(){
      super("stripeSuccess");
    //   ADMIN_loginFuncs.check_redirect();
    console.log("ok")
    this.draw1();
    }
    async draw1(){
        // let stripe = Stripe(ADMIN_Stripe.key_public);
        // console.dir(stripe);
        // var elements = stripe.elements({
        //     mode: 'payment',
        //     currency: 'usd',
        //     amount: 1099,
        //   });

        //   console.dir(elements);
        // //   elements.update({locale: 'fr'});
        // //   elements.fetchUpdates()
        // //     .then(function(result) {
        // //         console.dir(result);
        // //     });
        //     var expressCheckoutElement = elements.create('expressCheckout');
        //     console.dir(expressCheckoutElement);
        //   let r = new SPLINT.CallPHP(PATH.php.stripe);
        //     r.redirect = "follow";
        //     r.referrerPolicy = "origin"
        //     r.credentials = "omit"
        //     let g = await r.send();
        //   console.log(g);
        //   window.location.href = g.url;
        //   console.log(g.url);
        //   SPLINT.Tools.Location.call();

    }
    
  }