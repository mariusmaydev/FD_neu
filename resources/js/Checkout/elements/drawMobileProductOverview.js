
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
              let button_openProductOverview = new S_switchButton(buttonBody_OP, "openProductOverview");
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
                  button_productOverview.setStyleTemplate(S_Button.STYLE_DEFAULT);
                  button_productOverview.onclick = function(){
                    button_openProductOverview.toggle();
                  };

                this.productOverviewFullPrice = new PriceDiv_S(buttonBody_OP, "mobile", 12);
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
    // draw(){
    //     this.listMain = new SPLINT.DOMElement(this.id + "listMain", "div", this.contentElement);
    //     this.listMain.Class("listMain");
    
    //     this.cartData = ShoppingCart.get().shoppingCart;
    //     console.log(this.cartData);
    //     for(const index in this.cartData){
    //       let item = this.cartData[index];
    //       let projectData = ProjectHelper.get(item.ProjectID);
    //       let product;
    //       if(projectData.EPType == "GOLD"){
    //         product = productHelper.getByName(productHelper.LIGHTER_GOLD);
    //       } else if(projectData.EPType == "CHROME"){
    //         product = productHelper.getByName(productHelper.LIGHTER_CHROME);
    //       }
    //       this.price += S_Math.multiply(product.price, item.amount);
    //       let listElement = new SPLINT.DOMElement(this.id + "listElement_" + index, "div", this.listMain);
    //           listElement.Class("listElement");
    //           let lighter = new drawLighter3D(listElement, "lighter_mobile_" + index, drawLighter3D.PROJECT, projectData.Thumbnail)
    //               let amountDiv = new SPLINT.DOMElement.SpanDiv(lighter.div, this.id + "amountDiv_" + index, item.amount);
    
    //           let informationDiv = new SPLINT.DOMElement(this.id + "informationDiv" + index, "div", listElement);
    //               informationDiv.Class("informationDiv");
    //               // console.log(product)
    //               let nameDiv = new SPLINT.DOMElement.SpanDiv(informationDiv, "name_" + index, product.name);
    //                   nameDiv.Class("name").set();
    //               let priceDivBody = new SPLINT.DOMElement("priceBody_" + index, "div", informationDiv);
    //                   priceDivBody.Class("price");
    //                   let priceDiv = new PriceDiv_S(priceDivBody, "price_" + index, S_Math.multiply(product.price, item.amount));
    //                       // priceDiv.
    //     }
    //     this.drawConclusion();
    // }
    // drawConclusion(){
    //   this.conclusionMain = new SPLINT.DOMElement(this.id + "conclusionMain", "div", this.contentElement);
    //   this.conclusionMain.Class("conclusionMain");
  
    //     let couponCodeDiv = new SPLINT.DOMElement.InputDiv(this.conclusionMain, "couponCodeInput_mobile", "Rabattcode");
    //     let button_submitCode = new SPLINT.DOMElement.Button(this.conclusionMain, "submit_couponCode_mobile", "Code prüfen");
    //           button_submitCode.button.Class("submitCode");
    //         button_submitCode.setStyleTemplate(S_Button.STYLE_DEFAULT);
    //     // let fullPriceDiv = new 
    //         // button_submitCode.bindIcon
    //         // couponCodeDiv.
    
    //   console.log(this.price);
    // }
}