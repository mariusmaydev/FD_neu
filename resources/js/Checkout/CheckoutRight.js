
class CheckoutRightBar {
  constructor(parent){
    this.parent = parent;
    this.id     = "CheckoutRight_";
    this.mainElement = new SPLINT.DOMElement(this.id + "mainRight", "div", this.parent);
    this.mainElement.Class("CheckoutRightMain");
    this.price = 0;
    this.drawList();
    this.drawConclusion();
  }
  async drawList(){
    this.listMain = new SPLINT.DOMElement(this.id + "listMain", "div", this.mainElement);
    this.listMain.Class("listMain");

    this.cartData = (await ShoppingCart.get()).shoppingCart;
    for(const index in this.cartData){
      let item = this.cartData[index];
      let projectData = (await ProjectHelper.get(item.ProjectID));
      let product;
      if(projectData.EPType == "GOLD"){
        product = await productHelper.getByName(productHelper.LIGHTER_GOLD);
      } else if(projectData.EPType == "CHROME"){
        product = await productHelper.getByName(productHelper.LIGHTER_CHROME);
      }
      console.dir(projectData);
      this.price += product.price;
      let listElement = new SPLINT.DOMElement(this.id + "listElement_" + index, "div", this.listMain);
          listElement.Class("listElement");
          let lighter = new drawLighter3D(listElement, "lighter_right_" + index, drawLighter3D.PROJECT, projectData.Thumbnail)
          SPLINT.Events.onLoadingComplete = function(){
            lighter.sendToRenderer({"turn": true})
          }
              let amountDiv = new SPLINT.DOMElement.SpanDiv(lighter.div, this.id + "amountDiv_" + index, item.amount);

          let informationDiv = new SPLINT.DOMElement(this.id + "informationDiv" + index, "div", listElement);
              informationDiv.Class("informationDiv");
              // console.log(product)
              let nameDiv = new SPLINT.DOMElement.SpanDiv(informationDiv, "name_" + index, product.name);
                  nameDiv.Class("name");
              let priceDivBody = new SPLINT.DOMElement("priceBody_" + index, "div", informationDiv);
                  priceDivBody.Class("price");
                  let priceDiv = new PriceDiv_S(priceDivBody, "price_" + index, product.price);
                      // priceDiv.
    }
  }
  async drawConclusion(){
    if(!await SPLINT.SessionsPHP.get(Checkout.sessions.couponCode)){
      SPLINT.SessionsPHP.set(Checkout.sessions.couponCode, null);
    }
    this.conclusionMain = new SPLINT.DOMElement(this.id + "conclusionMain", "div", this.mainElement);
    this.conclusionMain.Class("conclusionMain");

      let couponCodeDiv = new SPLINT.DOMElement.InputDiv(this.conclusionMain, "couponCodeInput", "Rabattcode");
      let button_submitCode = new SPLINT.DOMElement.Button(this.conclusionMain, "submit_couponCode", "Code prüfen");
        	button_submitCode.button.Class("submitCode");
          button_submitCode.setStyleTemplate(S_Button.STYLE_DEFAULT);
          button_submitCode.onclick = async function(){
            let res = CouponCodes.check(couponCodeDiv.value);
            if(typeof res == 'object'){
              await SPLINT.SessionsPHP.set(Checkout.sessions.couponCode, res);
              couponCodeDiv.valid();
            } else {
              couponCodeDiv.invalid("Rabattcode nicht gefunden.");
            }
          }.bind(this);
      // let fullPriceDiv = new 
          // button_submitCode.bindIcon
          // couponCodeDiv.
  
    console.log(this.price);
  }
}