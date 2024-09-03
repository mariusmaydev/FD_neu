// // const TouchEmulator = require("hammer-touchemulator");

// var asyncProgress = false;

// let SVG_Loader = new SPLINT.SVG.Loader();
// // function reload(){
// //   location.reload();
// // }
// // import("../../../Splint/lib/threeJS/build/three.js");

// class Pages {
//   static INDEX                = "IndexBODY";
//   static CONVERTER_START      = "ConverterStartBODY";
//   static CONVERTER            = "ConverterBODY";
//   static CART                 = "CartBODY";
//   static CHECKOUT             = "CheckoutBODY";
//   static PAYMENT_COMPLETE     = "PaymentCompleteBODY";
//   static IMPRINT              = "ImprintBODY";
//   static PRODUCT_INFORMATION  = "ProductInformationBODY";
//   static AGBs                 = "AGBsBODY";
//   static DATA_PROTECTION      = "DataProtectionBODY";

//   constructor(){
//     this.getActualPage();
//   }
//   static isSite(name){
//     if(this.actualSite().id == name){
//       return true;
//     }
//     return false;
//   }
//   static actualSite(){
//     return document.getElementsByTagName("body")[0];
//   }
//   async getActualPage(){
//     console.log(SPLINT.ViewPort.getSize())
//     await login.Login();
//     SPLINT.SessionsPHP.showAll();
//     switch(Pages.actualSite().id){
//       case Pages.CONVERTER            : this.converter(); break;
//       case Pages.CONVERTER_START      : this.converterStart(); break;
//       case Pages.INDEX                : this.index(); break;
//       case Pages.CART                 : this.cart(); break;
//       case Pages.CHECKOUT             : this.checkout(); break;
//       case Pages.PAYMENT_COMPLETE     : this.paymentComplete(); break;
//       case Pages.IMPRINT              : this.imprint(); break;
//       case Pages.PRODUCT_INFORMATION  : this.productInformation(); break;
//       case Pages.AGBs                 : this.AGBs(); break;
//       case Pages.DATA_PROTECTION      : this.dataProtection(); break;
//     }
//   }
//   converter(){
//     new Converter();
//   }
//   async converterStart(){
//     SPLINT.SessionsPHP.remove("PROJECT_ID", false);
//     SPLINT.SessionsPHP.remove("PROJECT_NAME", false);
//     new drawConverterStart();
//   }
//   index(){
//     if(SPLINT.ViewPort.isTouchDevice()){
//         SPLINT.Utils.TouchEmulator.start();
//     }
//     SPLINT.ViewPort.onViewPortChanged = function(){ 
//         if(SPLINT.ViewPort.isTouchDevice()){
//             SPLINT.Utils.TouchEmulator.start();
//         } else {
//             SPLINT.Utils.TouchEmulator.remove();
//         }
//     }
//     new drawIndex();
//   }
//   cart(){
//   }
//   async checkout(){
//     // let cart = (await ShoppingCart.get());
//     // console.log(cart)
//     // if(cart.shoppingCart.length == 0){
//     //     SPLINT.Tools.Location.Direct(PATH.location.cart);
//     // }
//     NavBar.hide();
//     new Checkout();
//   }
//   paymentComplete(){
//     // new drawCart();
//     let r = "";
//     for(const e of SPLINT_Loader.LOADED_DOCS){
//         r += "'" + e.path + "',\r\n";
//     }
//     console.dir(r)
//     new drawPaymentComplete();
//   }
//   imprint(){
//     new drawImprint();
//   }
//   AGBs(){
//     new drawAGBs();
//   }
//   dataProtection(){
//     new drawDataProtection();
//   }
// //   productInformation(){
// //     new drawProductInformation();
// //   }
// }
// SPLINT.Events.onInitComplete = function(){
//     new Pages();
// }.bind(this);

// SPLINT.Events.onLoadingComplete = function(){
//     // SPLINT.Data.Cookies.requestUserPermision();
// }.bind(this);