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
    // SPLINT.API.Paypal.load();
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
  async drawAddressMenu(){
    this.addressMenuMainElement = new SPLINT.DOMElement(this.id + "addressMenuMain", "div", this.mainElementLeft);
    this.addressMenuMainElement.Class("AddressMain");
          
    if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
        let mobileProductOverview = new CheckoutMobileProductOverview(this.addressMenuMainElement);
        this.rightBar = new CheckoutRightBar(mobileProductOverview.contentElement, mobileProductOverview);
    }
    let paypal_fastCheckout = new SPLINT.API.Paypal.draw.fastCheckout(this.addressMenuMainElement);
    let payment = await paypal_fastCheckout.draw();
    payment.onPaymentComplete = async function (data, status) {
        await CheckoutHelper.finishCheckout(data);
    };
    
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
        // radioPaymentMethod.dataObj.add("SOFORT", "Sofort");
        radioPaymentMethod.dataObj.add("CREDITCARD", "Kreditkarte");
        radioPaymentMethod.drawRadio();
        radioPaymentMethod.onChange = async function(e){
          // console.log(e.target.value);
          await SPLINT.SessionsPHP.set(Checkout.sessions.paymentType, e.target.value);
        }
        radioPaymentMethod.setValue(await SPLINT.SessionsPHP.get(Checkout.sessions.paymentType));
        // radioPaymentMethod.onChange = async function(){
        //     let displayDiv = radioPaymentMethod.getDisplayDiv(radioPaymentMethod.Value);
        //     if(radioPaymentMethod.Value == "CREDITCARD"){
        //         this.CreditCardContainer = new SPLINT.DOMElement("CreditCardContainer", "div", displayDiv);
        //         this.CreditCardContainer.Class("CreditCardContainer");

        //             let content = new SPLINT.DOMElement("CreditCardContainer_content", "div", this.CreditCardContainer);
        //                 content.Class("content");

        //                     let inpName_PPcontainer = new SPLINT.DOMElement("inpName_PPcontainer", "div", content);
        //                         inpName_PPcontainer.Class("PPcontainer");

        //                     let inpNumber_PPcontainer = new SPLINT.DOMElement("inpNumber_PPcontainer", "div", content);
        //                         inpNumber_PPcontainer.Class("PPcontainer");

        //                     let inpCVV_PPcontainer = new SPLINT.DOMElement("inpCVV_PPcontainer", "div", content);
        //                         inpCVV_PPcontainer.Class("PPcontainer");

        //                     let inpExpiry_PPcontainer = new SPLINT.DOMElement("inpExpiry_PPcontainer", "div", content);
        //                         inpExpiry_PPcontainer.Class("PPcontainer");

        //                 let bt = new SPLINT.DOMElement.Button(content, "BT_submit", "test");
        //                     bt.Class("submit");
        //                 SPLINT.API.Paypal.draw.Buttons.drawCard(bt.button, inpName_PPcontainer, inpNumber_PPcontainer, inpExpiry_PPcontainer, inpCVV_PPcontainer)
        //     }
        // }.bind(this);


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

        // let containerPaypal = new SPLINT.DOMElement(this.id + "paypalContainer", "div", this.overviewMenuMainElement);
        //     containerPaypal.Class("paypalContainer");
            // SPLINT.API.Paypal.draw.Buttons.draw(containerPaypal);

            let payment = null;
            let paymentType = await SPLINT.SessionsPHP.get(Checkout.sessions.paymentType);
            if(paymentType == "CREDITCARD"){
                
                this.CreditCardContainer = new SPLINT.DOMElement("CreditCardContainer", "div", this.overviewMenuMainElement);
                this.CreditCardContainer.Class("CreditCardContainer");

                    let content = new SPLINT.DOMElement("CreditCardContainer_content", "div", this.CreditCardContainer);
                        content.Class("content");

                        let inpName_PPcontainer = new SPLINT.DOMElement("inpName_PPcontainer", "div", content);
                            inpName_PPcontainer.Class("PPcontainer");
                        let inpNumber_PPcontainer = new SPLINT.DOMElement("inpNumber_PPcontainer", "div", content);
                            inpNumber_PPcontainer.Class("PPcontainer");
                        let inpCVV_PPcontainer = new SPLINT.DOMElement("inpCVV_PPcontainer", "div", content);
                            inpCVV_PPcontainer.Class("PPcontainer");
                        let inpExpiry_PPcontainer = new SPLINT.DOMElement("inpExpiry_PPcontainer", "div", content);
                            inpExpiry_PPcontainer.Class("PPcontainer");

                        let bt = new SPLINT.DOMElement.Button(content, "BT_submit", "test");
                            bt.Class("submit");
                            payment = await SPLINT.API.Paypal.draw.Buttons.drawCard(bt.button, inpName_PPcontainer, inpNumber_PPcontainer, inpExpiry_PPcontainer, inpCVV_PPcontainer)
            } else if(paymentType == "PAYPAL") {
                payment = await SPLINT.API.Paypal.draw.Buttons.drawButtons(this.overviewMenuMainElement, paymentType);
            }
        
            payment.onPaymentComplete = async function (data) {
                await CheckoutHelper.finishCheckout(data);
            };

        let buttonDiv = new SPLINT.DOMElement(this.id + "buttonsDiv", "div", this.overviewMenuMainElement);
            buttonDiv.Class("buttonsDiv");
            let buttonBuy = new SPLINT.DOMElement.Button(buttonDiv, "Buy", "jetzt kaufen");
                buttonBuy.button.Class("button_submit");
                buttonBuy.setStyleTemplate(S_Button.STYLE_NONE);
                buttonBuy.button.onclick = async function(){
                    payment.button.click();
                }
                if(paymentType != "CREDITCARD") {
                    buttonDiv.style.display = "none";
                }
  }
}
