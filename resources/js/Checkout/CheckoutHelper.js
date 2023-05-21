class CheckoutHelper {
  static ELE_MAIN         = "checkout_main";
  static ELE_WINDOW_MAIN  = "CheckoutWindow_div";
  static ELE_ADDRESS      = "checkout_address_main";
  static ELE_SENDING      = "checkout_sending_main";
  static ELE_PAYMENT      = "checkout_payment_main";
  static ELE_CHECKORDER   = "checkout_checkOrder_main";

  static ADDRESS          = "address";
  static SENDING          = "sending";
  static PAYMENT          = "payment";
  static CHECKORDER       = "checkOrder";

  static progress(name = null){
    if(name != null){
      return (new obj()).get().includes(name);
    }
    function obj(){
      this.get = async function(){
        return SPLINT.SessionsPHP.get(Checkout.sessions.progress);
      }
      this.add = async function(name){
        if(name == undefined){
          name = S_Location.getHashes();
        }
        let data = await SPLINT.SessionsPHP.get(Checkout.sessions.progress);
        if(typeof data == 'object'){
          data = S_Tools.mergeToArray(data, name);
        } else {
          data = [];
          data.push(name);
        }
        await SPLINT.SessionsPHP.set(Checkout.sessions.progress, data);
      }
      this.remove = async function(value){
        let data;
        if(value != undefined){
          data = this.get();
          if(typeof data == 'object'){
            data.splice(data.indexOf(value), 1);
          }
        } else {
          data = "";
        }
        await SPLINT.SessionsPHP.set(Checkout.sessions.progress, data);
      }
    }
    return new obj();
  }
  static goto(site){
    CheckoutHelper.progress().add();
    window.location.hash = site;
  }
}


