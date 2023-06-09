var asyncProgress = false;


var cursorHandler = new CursorHandler();

let SVG_Loader = new SVG_preLoader();

const BufferStorage = new SPLINT.BufferStorage("FD", true);
function reload(){
  location.reload();
}

class Pages {
  static INDEX                = "IndexBODY";
  static CONVERTER_START      = "ConverterStartBODY";
  static CONVERTER            = "ConverterBODY";
  static CART                 = "CartBODY";
  static CHECKOUT             = "CheckoutBODY";
  static PAYMENT_COMPLETE     = "PaymentCompleteBODY";
  static IMPRINT              = "ImprintBODY";
  static PRODUCT_INFORMATION  = "ProductInformationBODY";

  constructor(){
    this.getActualPage();
  }
  static isSite(name){
    if(this.actualSite().id == name){
      return true;
    }
    return false;
  }
  static actualSite(){
    return document.getElementsByTagName("body")[0];
  }
  async getActualPage(){
    console.log(SPLINT.ViewPort.getSize())
    // BufferStorage.KEY = await SPLINT.SessionsPHP.getSessionID();

    // for(const e of Object.entries((await SPLINT.SessionsPHP.getAll()))){
    //     BufferStorage.setFromObject(e);
    // }
    await login.Login();
    // Cookie.showAll();
    // SPLINT.SessionsPHP.showAll();
    switch(Pages.actualSite().id){
      case Pages.CONVERTER            : this.converter(); break;
      case Pages.CONVERTER_START      : this.converterStart(); break;
      case Pages.INDEX                : this.index(); break;
      case Pages.CART                 : this.cart(); break;
      case Pages.CHECKOUT             : this.checkout(); break;
      case Pages.PAYMENT_COMPLETE     : this.paymentComplete(); break;
      case Pages.IMPRINT              : this.imprint(); break;
      case Pages.PRODUCT_INFORMATION  : this.productInformation(); break;
    }
  }
  converter(){
    new Converter();
  }
  async converterStart(){
    SPLINT.SessionsPHP.remove("PROJECT_ID", false);
    SPLINT.SessionsPHP.remove("PROJECT_NAME", false);
    new drawConverterStart();
  }
  index(){
    // console.log("load")
    new drawIndex();
  }
  cart(){
    let background = new drawBackground3D(document.body, "back3D");
    // this.background.div.before(this.mainElement);
    new drawCart();
  }
  checkout(){
    NavBar.hide();
    new Checkout();
  }
  paymentComplete(){
    new drawPaymentComplete();
  }
  imprint(){
    new drawImprint();
  }
  productInformation(){
    new drawProductInformation();
  }
}
SPLINT.Events.onInitComplete = function(){
    new Pages();
}.bind(this);