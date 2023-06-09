
class CheckoutRightBar {
  constructor(parent, instance = null){
    this.parent = parent;
    this.instance = instance;
    this.id     = "CheckoutRight_";
    this.mainElement = new SPLINT.DOMElement(this.id + "mainRight", "div", this.parent);
    this.mainElement.Class("CheckoutRightMain");
    this.price = 0;
    this.drawList();
    this.drawConclusion();
  }
  async update(){
    this.mainElement.clear();
    this.drawList();
    this.drawConclusion();
    if(this.instance != null){
        this.instance.price = this.price;
    }
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
                  let priceDiv = new PriceDiv_S(priceDivBody, "price_" + index, (product.price * item.amount));
                      // priceDiv.
    }
  }
  async drawConclusion(){
    let couponCode = await SPLINT.SessionsPHP.get(Checkout.sessions.couponCode);
    if(!couponCode){
      SPLINT.SessionsPHP.set(Checkout.sessions.couponCode, null);
    }
    this.cartData = (await ShoppingCart.get()).shoppingCart;
    let fullPrice = 0;
    for(const e of this.cartData){
        let productPrice = (await productHelper.getByName(e.ProductName)).price;
        fullPrice = fullPrice + (e.amount * productPrice);
    }
    this.conclusionMain = new SPLINT.DOMElement(this.id + "conclusionMain", "div", this.mainElement);
    this.conclusionMain.Class("conclusionMain");

        let couponCodeDiv = new SPLINT.DOMElement(this.id + "couponCodeInput", "div", this.conclusionMain);
            couponCodeDiv.Class("couponCodeContainer");
            let couponCodeInput = new SPLINT.DOMElement.InputDiv(couponCodeDiv, "couponCodeInput", "Rabattcode");
                couponCodeInput.onEnter = function(){button_submitCode.click()};
            let button_submitCode = new SPLINT.DOMElement.Button(couponCodeDiv, "submit_couponCode", "Code prüfen");
                button_submitCode.button.Class("submitCode");
                button_submitCode.setStyleTemplate(S_Button.STYLE_DEFAULT);
                button_submitCode.onclick = async function(){
                    if(couponCodeInput.value == ""){
                        return;
                    }
                    let res = await functionsCouponCodes.check(couponCodeInput.value);
                    if(typeof res == 'object' && res != null){
                        await SPLINT.SessionsPHP.set(Checkout.sessions.couponCode, res);
                        couponCodeInput.valid();
                        this.update();
                    } else {
                        couponCodeInput.invalid("Rabattcode nicht gefunden.");
                    }
                }.bind(this);
      // let fullPriceDiv = new 
          // button_submitCode.bindIcon
          // couponCodeDiv.

        let PriceDiv = new SPLINT.DOMElement(this.id + "conclusionPriceDiv", "div", this.conclusionMain);
            PriceDiv.Class("priceContainer");
            let table = new SPLINT.DOMElement.Table.Grid(PriceDiv, "productList", 4, 2);
                // table.getHead();
                let gen = SPLINT.DOMElement.SpanDiv.get;
                gen(table.getData(0, 0), "", "Zwischensumme");
                let pD1 = new PriceDiv_S(table.getData(0, 1), "", fullPrice)
                // gen(table.getData(0, 1), "", fullPrice);
                gen(table.getData(1, 0), "", "Versand");
                gen(table.getData(1, 1), "", "kostenlos");
                
                if(couponCode != false && couponCode != null){
                    gen(table.getData(2, 0), "", "Coupon");
                    let displayPrice = 0;
                    if(couponCode.type == "percent"){
                        gen(table.getData(2, 1), "", "-" + couponCode.value + "%");
                        displayPrice = fullPrice - (fullPrice / 100 * parseFloat(couponCode.value));
                    } else {
                        gen(table.getData(2, 1), "", "-" + couponCode.value + "€");
                        displayPrice = fullPrice - couponCode.value;
                    }
                
                    gen(table.getData(3, 0), "", "Summe");
                    this.price = S_Math.roundFX(displayPrice, 2, true);
                    let pD2 = new PriceDiv_S(table.getData(3, 1), "", this.price)
                } else {
                
                    gen(table.getData(2, 0), "", "Summe");
                    this.price = S_Math.roundFX(fullPrice, 2, true);
                    let pD2 = new PriceDiv_S(table.getData(2, 1), "", this.price);
                }
                if(this.instance != null){
                    this.instance.price = this.price;
                }
                // gen(table.getData2Head(1), "", "Name");
                // gen(table.getData2Head(2), "", "Preis");
                // gen(table.getData2Head(3), "", "Abmaße (in mm)");
                // gen(table.getData2Head(4), "", "andere Eigenschaften");
                // gen(table.getData2Head(5), "", "");
            // this.table.draw();
            // let table = new SPLINT.DOMElement.Table.TextTable(PriceDiv, "conclusionPrice");
            //     table.addRow("Zwischensumme: ", fullPrice);
            //     table.addRow("Versand: ", "kosstenlos");
            //     table.addRow("Summe: ", fullPrice);

  
  }
}