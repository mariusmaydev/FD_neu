
class CheckoutMobileProductOverview {
    constructor(parent){
        this.parent = parent;
        this.id = "CheckoutMobileProductOverview_";
        this.init();
    }
    set price(v){
        this.productOverviewFullPrice.setPrice(v);
    }
    init(){
        this.Body_productOverview = new SPLINT.DOMElement(this.id + "productOverview", "div", this.parent);
        this.Body_productOverview.Class("productOverviewBody");
            let buttonBody_OP = new SPLINT.DOMElement(this.id + "buttonBodyProductOverview", "div", this.Body_productOverview);
                buttonBody_OP.Class("buttonBody");
              let button_openProductOverview = new SPLINT.DOMElement.Button.Switch(buttonBody_OP, "openProductOverview");
                  button_openProductOverview.Class("openButton");
                  button_openProductOverview.bindIcon("expand_more");
                  button_openProductOverview.onactive = function(){
                    expander_productOverview.state().setActive();
                    button_openProductOverview.bindIcon("chevron_right");
                  }
                  button_openProductOverview.onpassive = function(){
                    expander_productOverview.state().unsetActive();
                    button_openProductOverview.bindIcon("expand_more");
                  }
              let button_productOverview = new SPLINT.DOMElement.Button(buttonBody_OP, "productOverview", "Bestellzusammenfassung");
                  button_productOverview.button.Class("namedButton");
                  button_productOverview.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
                  button_productOverview.onclick = function(e){
                    // console.trace(e);
                    button_openProductOverview.toggle();
                  };

                this.productOverviewFullPrice = new SPLINT.DOMElement.PriceDiv(buttonBody_OP, "mobile", 12);
                this.productOverviewFullPrice.mainElement.onclick = function(){
                    button_openProductOverview.toggle();
              }
                    
              let expander_productOverview = new SPLINT.DOMElement(this.id + "expanderProductOverview", "div", this.Body_productOverview);
                  expander_productOverview.Class("expander"); 
                  
                    this.contentElement = new SPLINT.DOMElement(this.id + "contentElement", "div", expander_productOverview);
                    this.contentElement.Class("C_MobileProductOverviewMain"); 
                  // expander_productOverview.S_onStateChange = function(e, state){
                  //   if(state == 'passive'){
                  //     let mobileproductOverview = new CheckoutMobileProductOverview(expander_productOverview);
                  //   }
                  // }
                //   if(SPLINT.ViewPort.getSize() == "mobile-small"){
                //     let mobileproductOverview = this.draw();
                //     productOverviewFullPrice.setPrice(this.price);
                //   }
              document.body.addEventListener("click", function(e){
                if(button_openProductOverview.button.state().isActive() && !e.target.hasParentWithClass("productOverviewBody")){
                  button_openProductOverview.toggle();
                }
              })
        // this.draw();
    }

}