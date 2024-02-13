class Checkout {
  static sessions = {
                      addresses       : 'address',
                      invoiceAddress  : 'invoiceAddress',
                      sending         : 'sending',
                      paymentType     : 'paymentType',
                      progress        : 'progress',
                      couponCode      : 'couponCode'
                    };
  constructor(parent = document.body){
    this.parent = parent;
    this.id = "checkout_";
    this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
    this.mainElement.Class("CheckoutMain");
    this.mainElementLeft = new SPLINT.DOMElement(this.id + "mainLeft", "div", this.mainElement);
    this.mainElementLeft.Class("CheckoutLeftMain");
        this.linkImprint = new SPLINT.DOMElement.Button(this.mainElementLeft, "imprint", "Impressum");
        this.linkImprint.Class("linkImprint");
        this.linkImprint.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
        this.linkImprint.onclick = function(){
            S_Location.goto(PATH.location.imprint).call();
        }
    if(SPLINT.ViewPort.getSize() != "mobile-small" && SPLINT.ViewPort.getSize() != "mobile"){
        this.rightBar = new CheckoutRightBar(this.mainElement);
    }
    // this.mainElementRight = new SPLINT.DOMElement(this.id + "mainRight", "div", this.mainElement);
    // this.mainElementRight.Class("CheckoutRightMain");
    // this.drawRight();
    // window.location.hash = CheckoutHelper.ADDRESS;
    
    window.addEventListener("hashchange", function(){
      this.#checkHashes();
    }.bind(this));
    this.#checkHashes();
  }
  #checkHashes(){
    this.mainElementLeft.innerHTML = "";
    new CheckoutHead(this.mainElementLeft);
    switch(S_Location.getHashes()){
      case CheckoutHelper.ADDRESS     : this.drawAddressMenu(); break;
      case CheckoutHelper.SENDING     : CheckoutHead.refresh(0); this.drawSendingMenu(); break;
      case CheckoutHelper.PAYMENT     : CheckoutHead.refresh(1); this.drawPaymentMenu(); break;
      case CheckoutHelper.CHECKORDER  : CheckoutHead.refresh(2); this.drawOverview(); break;
      default : this.drawAddressMenu(); break;
    }
  }
//   async drawRight(){
//     let checkoutRight = new CheckoutRightBar(this.mainElementRight);
//     let contentDiv = new SPLINT.DOMElement(this.id + "right_content", "div", this.mainElementRight);
//         contentDiv.Class("ContentDiv");
//         // main.classList.add("ShoppingCart");
//         let cartData = (await ShoppingCart.get()).shoppingCart;
//         let ItemListMain = new SPLINT.DOMElement(this.id + "itemListMain", "div", contentDiv);
//             ItemListMain.Class("ItemList");
//             for(const index in cartData){
//               let itemData = cartData[index];
//               let projectData = (await ProjectHelper.get(itemData.ProjectID));
//               let listElement = new SPLINT.DOMElement(this.id + "right_listElement_" + index, "div", ItemListMain);
//                   let lighter = new drawLighter3D(listElement, "lighter_right_" + index, drawLighter3D.PROJECT, projectData.Thumbnail)
//             }
        
//         let conclusionDiv = getElement("CheckoutRightConclusionDiv", "div", contentDiv.id);
//             conclusionDiv.Class("RightDivConclusion");
//             drawFullPrice(conclusionDiv);
//         // drawCartCouponCode(conclusionDiv);

//         async function drawFullPrice(parent){
//           new SPLINT.DOMElement.HorizontalLine(parent);
//           let main = getElement("CheckoutPriceDivMain", "div", parent.id);
//               main.Class("PriceDiv");
//               let cartData = await ShoppingCart.get();
//               let price = 0;
//               for(let i = 0; i < cartData.length; i++){

//                 let productData = productHelper.getByName(cartData[i].ProductName);
//                 price += S_Math.multiply(cartData[i].amount, productData.price);
//               }
//               let priceElement = new priceDiv(main, price);
//               let priceLabel = new Label(main, priceElement.main, "Zwischensumme");
//                   priceLabel.before();

//           // breakHTML(main);
//       // let shippingCosts = PHP_sessions_S.checkout().sending().get();
//       // let shippingCostsDiv = new priceDiv(main, shippingCosts.price, "ShippingPrice");
//       //     let shippingCostsLabel = new Label(main, shippingCostsDiv.main, "Versand");
//       //         shippingCostsLabel.before();

//       // breakHTML(main);
//       // getHorizontalLine(main);
//       let FullPriceDiv = new priceDiv(main, price, "FullPrice");
//           FullPriceDiv.main.Class("Full");
//           let FullPriceLabel = new Label(main, FullPriceDiv.main, "Gesamt");
//               FullPriceLabel.element.Class("Full");
//               FullPriceLabel.before();
      
//       // breakHTML(main);
//       let tax = S_Math.multiply(price, 0.19);
//       let MwStLabel = new Label(main, "", "inkl. ");
//           MwStLabel.element.Class("Text-small_hint");
//           new PriceDiv_S(MwStLabel.element, "tax",tax);
//           MwStLabel.element.innerHTML += " MwSt.";
//           new SPLINT.DOMElement.HorizontalLine(main);
//     }
//   } 
  async drawAddressMenu(){
    this.addressMenuMainElement = new SPLINT.DOMElement(this.id + "addressMenuMain", "div", this.mainElementLeft);
    this.addressMenuMainElement.Class("AddressMain");
          
    if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
        let mobileProductOverview = new CheckoutMobileProductOverview(this.addressMenuMainElement);
        this.rightBar = new CheckoutRightBar(mobileProductOverview.contentElement, mobileProductOverview);
    }
    new SPLINT.API.Paypal.draw.fastCheckout(this.addressMenuMainElement);
    
        let addressInput = new SPLINT.DOMElement.InputAddress(this.addressMenuMainElement, "newAddress");
        
            addressInput.onsubmit = function(){
                let flag = false;
                if(addressInput.firstName_input.isEmpty()){
                    flag = true;
                    addressInput.firstName_input.invalid();
                }
                if(addressInput.lastName_input.isEmpty()){
                    flag = true;
                    addressInput.lastName_input.invalid();
                }
                if(addressInput.postcode_input.isEmpty()){
                    flag = true;
                    addressInput.postcode_input.invalid();
                }
                if(addressInput.city_input.isEmpty()){
                    flag = true;
                    addressInput.city_input.invalid();
                }
                if(addressInput.street_input.isEmpty()){
                    flag = true;
                    addressInput.street_input.invalid();
                }
                if(addressInput.housenumber_input.isEmpty()){
                    flag = true;
                    addressInput.housenumber_input.invalid();
                }
                if(addressInput.email_input.isEmpty()){
                    flag = true;
                    addressInput.email_input.invalid();
                }
                if(flag){
                    return false;
                }
                return true;
            }
        if(await SPLINT.SessionsPHP.get("address") != false){
            addressInput.value = (await SPLINT.SessionsPHP.get("address"));
        } else {
            addressInput.value = (new S_AddressObject(false));
        }
        let buttonDiv = new SPLINT.DOMElement(this.id + "buttonsDiv", "div", this.addressMenuMainElement);
            buttonDiv.Class("buttonsDiv");
            let buttonSubmit = new SPLINT.DOMElement.Button(buttonDiv, "submit", "weiter");
                buttonSubmit.button.Class("button_submit");
                buttonSubmit.setStyleTemplate(S_Button.STYLE_NONE);
                buttonSubmit.onclick = async function(){
                    if(!addressInput.submit()){
                        return;
                    }
                await SPLINT.SessionsPHP.set(Checkout.sessions.addresses, addressInput.value);
                (await CheckoutHelper.progress()).add(CheckoutHelper.ADDRESS);
                CheckoutHelper.goto(CheckoutHelper.SENDING);
                }
    
  }
  async drawSendingMenu(){
    this.sendingMenuMainElement = new SPLINT.DOMElement(this.id + "sendingMenuMain", "div", this.mainElementLeft);
    this.sendingMenuMainElement.Class("SendingMain");    
    if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
        let mobileProductOverview = new CheckoutMobileProductOverview(this.sendingMenuMainElement);
        this.rightBar = new CheckoutRightBar(mobileProductOverview.contentElement, mobileProductOverview);
    }
    await drawSavedInformation.address(this.sendingMenuMainElement);

    // DrawSendingChoiceMenu(this.sendingMenuMainElement);
    let obj = [];
        obj[0] = new Object();
        obj[0].id     = "Standart";
        obj[0].price  = 3.79;
        obj[0].data   = "2 bis 4 Werktage";
        obj[0].name   = "Standartversand";
    let RadioButton = new SPLINT.DOMElement.Button.Radio(this.sendingMenuMainElement, "SendingChoiceMenu");
        RadioButton.data = obj;
        RadioButton.drawRadio();

        let buttonDiv = new SPLINT.DOMElement(this.id + "buttonsDiv", "div", this.sendingMenuMainElement);
            buttonDiv.Class("buttonsDiv");
            let buttonSubmit = new SPLINT.DOMElement.Button(buttonDiv, "submit", "weiter zur Zahlung");
                buttonSubmit.button.Class("button_submit");
                buttonSubmit.setStyleTemplate(S_Button.STYLE_NONE);
                buttonSubmit.onclick = async function(){
                await SPLINT.SessionsPHP.set(Checkout.sessions.sending, RadioButton.Value);
                CheckoutHelper.goto(CheckoutHelper.PAYMENT);
                }
    function DrawSendingChoiceMenu(parent){
      let main = new SPLINT.DOMElement.SpanDiv(parent, "sendingChoiceMenu", "Versandart");
          main.div.Class("sendingChoiceDiv");

          let obj = [];
              obj[0] = new Object();
              obj[0].id     = "Standart";
              obj[0].price  = 3.79;
              obj[0].data   = "2 bis 4 Werktage";
              obj[0].name   = "Standartversand";
          let RadioButton = new S_radioButton(main.div, "SendingChoiceMenu");
              RadioButton.data = obj;
              RadioButton.drawRadio();
    }
  }
  async drawPaymentMenu(){
    this.paymentMenuMainElement = new SPLINT.DOMElement(this.id + "paymentMenuMain", "div", this.mainElementLeft);
    this.paymentMenuMainElement.Class("PaymentMain");
    if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
        let mobileProductOverview = new CheckoutMobileProductOverview(this.paymentMenuMainElement);
        this.rightBar = new CheckoutRightBar(mobileProductOverview.contentElement,mobileProductOverview);
    }

    await drawSavedInformation.address(this.paymentMenuMainElement);
    await drawSavedInformation.sending(this.paymentMenuMainElement);

    let radioPaymentMethod = new SPLINT.DOMElement.Button.Radio(this.paymentMenuMainElement, "PaymentMethod");
        radioPaymentMethod.Headline("Zahlungsart");
        radioPaymentMethod.dataObj.add("PAYPAL", "Paypal");
        radioPaymentMethod.dataObj.add("SEPA", "SEPA");
        radioPaymentMethod.dataObj.add("CREDITCARD", "Kreditkarte");
        radioPaymentMethod.drawRadio();
        radioPaymentMethod.onChange = async function(e){
          // console.log(e.target.value);
          await SPLINT.SessionsPHP.set(Checkout.sessions.paymentType, e.target.value);
        }
        radioPaymentMethod.setValue(await SPLINT.SessionsPHP.get(Checkout.sessions.paymentType));

    let radioInvoiceMethod = new S_radioButton(this.paymentMenuMainElement, "InvoiceMethod");
        radioInvoiceMethod.mainElement.Class("InvoiceMethodMain");
        radioInvoiceMethod.Headline("Rechnungsadresse");
        radioInvoiceMethod.dataObj.add("identical", "Identisch mit Lieferadresse");
        radioInvoiceMethod.dataObj.add("different", "Abweichend von Lieferadresse");
        radioInvoiceMethod.drawRadio();
        if(await SPLINT.SessionsPHP.get(Checkout.sessions.invoiceType) != false){
          radioInvoiceMethod.setValue(await SPLINT.SessionsPHP.get(Checkout.sessions.invoiceType));
        }

        let func = async function(){
          let displayDiv = radioInvoiceMethod.getDisplayDiv("different");
          if(radioInvoiceMethod.Value == "different"){
            await SPLINT.SessionsPHP.set(Checkout.sessions.invoiceType, "different");

            this.invoiceAddressMenu = new SPLINT.DOMElement.InputAddress(displayDiv, "invoiceAddress");
            this.invoiceAddressMenu.onsubmit = function(){
                    let flag = false;
                    if(this.invoiceAddressMenu.firstName_input.isEmpty()){
                        flag = true;
                        this.invoiceAddressMenu.firstName_input.invalid();
                    }
                    if(this.invoiceAddressMenu.lastName_input.isEmpty()){
                        flag = true;
                        this.invoiceAddressMenu.lastName_input.invalid();
                    }
                    if(this.invoiceAddressMenu.postcode_input.isEmpty()){
                        flag = true;
                        this.invoiceAddressMenu.postcode_input.invalid();
                    }
                    if(this.invoiceAddressMenu.city_input.isEmpty()){
                        flag = true;
                        this.invoiceAddressMenu.city_input.invalid();
                    }
                    if(this.invoiceAddressMenu.street_input.isEmpty()){
                        flag = true;
                        this.invoiceAddressMenu.street_input.invalid();
                    }
                    if(this.invoiceAddressMenu.housenumber_input.isEmpty()){
                        flag = true;
                        this.invoiceAddressMenu.housenumber_input.invalid();
                    }
                    if(this.invoiceAddressMenu.email_input.isEmpty()){
                        flag = true;
                        this.invoiceAddressMenu.email_input.invalid();
                    }
                    if(flag){
                        return false;
                    }
                    return true;
                }.bind(this);
                if(await SPLINT.SessionsPHP.get(Checkout.sessions.invoiceAddress) != false){
                    this.invoiceAddressMenu.value = (await SPLINT.SessionsPHP.get(Checkout.sessions.invoiceAddress));
                } else {
                    this.invoiceAddressMenu.value = (new S_AddressObject(false));
                }
          } else {
            await SPLINT.SessionsPHP.set(Checkout.sessions.invoiceType, "identical");
            await SPLINT.SessionsPHP.set(Checkout.sessions.invoiceAddress, await SPLINT.SessionsPHP.get(Checkout.sessions.addresses));
            displayDiv.innerHTML = "";
            delete this.invoiceAddressMenu;
          }
        }.bind(this);
        radioInvoiceMethod.onChange = func.bind(this);
        func();


        let buttonDiv = new SPLINT.DOMElement(this.id + "buttonsDiv", "div", this.paymentMenuMainElement);
            buttonDiv.Class("buttonsDiv");
            let buttonSubmit = new SPLINT.DOMElement.Button(buttonDiv, "submit", "Bestellung überprüfen");
                buttonSubmit.button.Class("button_submit");
                buttonSubmit.setStyleTemplate(S_Button.STYLE_NONE);
                buttonSubmit.button.onclick = async function(){
                    if(await SPLINT.SessionsPHP.get(Checkout.sessions.invoiceType) == "different"){
                        if(!this.invoiceAddressMenu.submit()){
                            return;
                        }
                        await SPLINT.SessionsPHP.set(Checkout.sessions.invoiceAddress, this.invoiceAddressMenu.value);
                    } else {
                        await SPLINT.SessionsPHP.set(Checkout.sessions.invoiceAddress, await SPLINT.SessionsPHP.get(Checkout.sessions.addresses));
                    }
                    await SPLINT.SessionsPHP.set(Checkout.sessions.paymentType, radioPaymentMethod.Value);
                    CheckoutHelper.goto(CheckoutHelper.CHECKORDER);
                }.bind(this);
  }
  async drawOverview(){
    this.overviewMenuMainElement = new SPLINT.DOMElement(this.id + "overviewMenuMain", "div", this.mainElementLeft);
    this.overviewMenuMainElement.Class("CheckOrderMain");
    if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
        let mobileProductOverview = new CheckoutMobileProductOverview(this.overviewMenuMainElement);
        this.rightBar = new CheckoutRightBar(mobileProductOverview.contentElement, mobileProductOverview);
    }
        await drawSavedInformation.address(this.overviewMenuMainElement);
        await drawSavedInformation.sending(this.overviewMenuMainElement);
        await drawSavedInformation.payment(this.overviewMenuMainElement);

        // Paypal.drawButtons(this.overviewMenuMainElement);

        let containerPaypal = new SPLINT.DOMElement(this.id + "paypalContainer", "div", this.overviewMenuMainElement);
            containerPaypal.Class("paypalContainer");
            SPLINT.API.Paypal.draw.Buttons.draw(containerPaypal);

        
        let buttonDiv = new SPLINT.DOMElement(this.id + "buttonsDiv", "div", this.overviewMenuMainElement);
            buttonDiv.Class("buttonsDiv");
            let buttonBuy = new SPLINT.DOMElement.Button(buttonDiv, "Buy", "jetzt kaufen");
                buttonBuy.button.Class("button_submit");
                buttonBuy.setStyleTemplate(S_Button.STYLE_NONE);
                buttonBuy.button.onclick = async function(){
                let Items = (await ShoppingCart.get()).shoppingCart;
                if(Items.length == 0){
                    return;
                }
                for(const index in Items){
                    let newProjectID = (await ProjectHelper.copy(Items[index].ProjectID));
                    // ProjectHelper.remove(Items[index].ProjectID)
                    // ShoppingCart.removeItem(Items[index].ProjectID);
                    Items[index].ProjectID = newProjectID;
                    await ProjectHelper.changeState(Items[index].ProjectID, ProjectHelper.STATE_ORDER);
                }

                let orderObj = new OrderObject();
                    orderObj.items = Items;
                    orderObj.sendingAddress = await SPLINT.SessionsPHP.get(Checkout.sessions.addresses);
                    orderObj.invoiceAddress = await SPLINT.SessionsPHP.get(Checkout.sessions.invoiceAddress);
                    orderObj.paymentMethod  = await SPLINT.SessionsPHP.get(Checkout.sessions.paymentType);
                    orderObj.UserID         = await SPLINT.SessionsPHP.get(SPLINT.SessionsPHP.USER_ID, false);
                    orderObj.couponCode     = await SPLINT.SessionsPHP.get(Checkout.sessions.couponCode);
                    let orderID = order.new(orderObj.get());
                    // let res = lexOffice.newInvoice(orderObj.get(), orderID);
                    // console.log(res);
                    // let res1 = lexOffice.newDeliveryNote(orderObj.get(), orderID);
                    // console.log(res1);
                    // ShoppingCart.clear();
                    // let orderobj = await preparePaypal();
                    // let sh = await ShoppingCart.get()
                    // console.dir(sh.shoppingCart)
                    // let Paypap = new Paypal(sh.shoppingCart, orderObj.sendingAddress);
                    //     let r = await Paypap.createOrder();
                    //     window.location.href = r.URL
                    //     // let r1 = await Paypal.capturePayment(r.accessToken);
                    // // Paypal.crea
                    // console.log(r)
                    // console.log(r1)

                }
  }
}
