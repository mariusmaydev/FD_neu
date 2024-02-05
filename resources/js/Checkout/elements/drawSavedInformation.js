
class drawSavedInformation{
    static createMainDiv(parent){
      let main = new SPLINT.DOMElement("SavedInformationMainDiv", "div", parent);
          main.Class("SavedInformationMain");
      return main;
    }
    static async address(parent){
        return new Promise(async function(resolve, reject) {
      let main = drawSavedInformation.createMainDiv(parent);
      let address = await SPLINT.SessionsPHP.get(Checkout.sessions.addresses);
      if(address.Phone != undefined && address.Phone != ""){
        let phoneDivMain = new SPLINT.DOMElement("checkoutphoneDivMain", "div", main);
            phoneDivMain.Class("element");
            let phoneDiv = new SPLINT.DOMElement.SpanDiv(phoneDivMain, "phone", address.Phone);
                let phoneLabel = new SPLINT.DOMElement.Label(phoneDivMain, phoneDiv.div, "Telefonnummer");
                    phoneLabel.before();
      }
  
      // getHorizontalLine(main, "horizontalLine");
  
      let emailDivMain = new SPLINT.DOMElement("checkoutEmailDivMain", "div", main);
          emailDivMain.Class("element");
          let emailDiv = new SPLINT.DOMElement.SpanDiv(emailDivMain, "email", address.Email);
              let emailLabel = new SPLINT.DOMElement.Label(emailDivMain, emailDiv.div, "Emailadresse");
                  emailLabel.before();
  
          let buttonChangeContact = new SPLINT.DOMElement.Button(emailDivMain, "change", "ändern");
              buttonChangeContact.button.Class("simple");
              buttonChangeContact.button.Class("middle");
              buttonChangeContact.button.onclick = function(){
                window.location.hash = CheckoutHelper.ADDRESS;
              }
  
              new SPLINT.DOMElement.HorizontalLine(main, "horizontalLine");
  
      let addressDiv = new SPLINT.DOMElement("CheckoutSendingAddressDiv", "div", main);
          addressDiv.Class("element");
          let contentDiv = new SPLINT.DOMElement("CheckoutSendingAddressContentDiv", "div", addressDiv);
              contentDiv.Class("contentDiv");
              let addressContentDivLabel = new Label(addressDiv, contentDiv, "Liefern an");
                  addressContentDivLabel.before();
  
              if(address.Title != ""){
                let Title       = new SPLINT.DOMElement.SpanDiv(contentDiv, "Title", address.Title);
                drawSimpleElement(contentDiv, " ");
              }
              let FirstName   = new SPLINT.DOMElement.SpanDiv(contentDiv, "FirstName", address.FirstName);
              drawSimpleElement(contentDiv, " ");
              let LastName    = new SPLINT.DOMElement.SpanDiv(contentDiv, "LastName", address.LastName);
              drawSimpleElement(contentDiv, ", ");
        
              let Street      = new SPLINT.DOMElement.SpanDiv(contentDiv, "Street", address.Street);
              drawSimpleElement(contentDiv, " ");
              let HouseNumber = new SPLINT.DOMElement.SpanDiv(contentDiv, "HouseNumber", address.HouseNumber);
        
              drawSimpleElement(contentDiv, ", ");
              let PostCode    = new SPLINT.DOMElement.SpanDiv(contentDiv, "Postcode", address.Postcode);
              drawSimpleElement(contentDiv, " ");
              let City        = new SPLINT.DOMElement.SpanDiv(contentDiv, "City", address.City);
              drawSimpleElement(contentDiv, ", ");
              let Country     = new SPLINT.DOMElement.SpanDiv(contentDiv, "Country", address.Country);
  
          let buttonChangeAddress = new SPLINT.DOMElement.Button(addressDiv, "change", "ändern");
              buttonChangeAddress.Class("simple");
              buttonChangeAddress.onclick = function(){
                window.location.hash = CheckoutHelper.ADDRESS;
              }
              resolve();
            }.bind(this));
    }
    static async sending(parent){
        return new Promise(async function(resolve, reject) {
      let main = drawSavedInformation.createMainDiv(parent);
    //   new SPLINT.DOMElement.HorizontalLine(main);
      let sending = await SPLINT.SessionsPHP.get(Checkout.sessions.addresses);
          let sendingDiv = new SPLINT.DOMElement("CheckoutSendingConditionsDiv", "div", main);
              sendingDiv.Class("element");
  
              let contentDiv = new SPLINT.DOMElement("checkoutSendingContentDiv", "div", sendingDiv);
                  contentDiv.Class("contentDiv");
                  let label = new SPLINT.DOMElement.Label(sendingDiv, contentDiv, "Versand");
                      label.before(); 
                  
                  let typeSpan = new SPLINT.DOMElement.SpanDiv(contentDiv, "type", sending.type);
                  drawSimpleElement(contentDiv);
                  let hypenElement = drawSimpleElement(contentDiv, "-");
                      hypenElement.span.Class("bold");
                  drawSimpleElement(contentDiv);
                  // DrawPrice(contentDiv, sending.price, "ConclusionSendingPrice");
              let buttonChangeSending = new SPLINT.DOMElement.Button(sendingDiv, "change", "ändern");
                  buttonChangeSending.button.Class("simple");
                  buttonChangeSending.button.style.visibility = "hidden";
                  buttonChangeSending.button.onclick = function(){
                    window.location.hash = CheckoutHelper.SENDING;
                  }
                  resolve();
                }.bind(this));
    }
  
    static async payment(parent){
        return new Promise(async function(resolve, reject) {
      let main = drawSavedInformation.createMainDiv(parent);
      new SPLINT.DOMElement.HorizontalLine(main, "horizontalLine");
          let paymentMethod = await SPLINT.SessionsPHP.get(Checkout.sessions.paymentType);
          let invoiceAddress = SPLINT.SessionsPHP.get(Checkout.sessions.invoiceAddress);
          
          let paymentDiv = new SPLINT.DOMElement("CheckoutPaymentConditionsDiv", "div", main);
              paymentDiv.Class("element");
              
              let contentDiv = new SPLINT.DOMElement("CheckoutPaymentContentDiv", "div", paymentDiv);
                  contentDiv.Class("contentDiv");
                  let label = new Label(paymentDiv, contentDiv, "Zahlung");
                      label.before();
            console.log(paymentMethod)
                  let methodSpan = new SPLINT.DOMElement.SpanDiv(contentDiv, "method", paymentMethod);
              let buttonChangePaymentMethod = new SPLINT.DOMElement.Button(paymentDiv, "change", "ändern");
                  buttonChangePaymentMethod.button.Class("simple");
                  buttonChangePaymentMethod.button.onclick = function(){
                    window.location.hash = CheckoutHelper.PAYMENT;
                  }
  
          if(Object.keys(invoiceAddress).length !== 0){
            new SPLINT.DOMElement.HorizontalLine(main);
            let invoiceAddressDiv = new SPLINT.DOMElement("CheckoutInvoiceAddressDiv", "div", main);
                invoiceAddressDiv.Class("element");
  
                let invoiceContentDiv = new SPLINT.DOMElement("CheckoutInvoiceAddressContentDiv", "div", invoiceAddressDiv);
                    invoiceContentDiv.Class("contentDiv");
                    let invoiceLabel = new Label(invoiceAddressDiv, invoiceContentDiv, "Rechnungsadresse");
                        invoiceLabel.before();
  
                        if(invoiceAddress.Title != ""){
                          let Title       = new SPLINT.DOMElement.SpanDiv(invoiceContentDiv, "Title", invoiceAddress.Title);
                          drawSimpleElement(invoiceContentDiv, " ");
                        }
                        let FirstName   = new SPLINT.DOMElement.SpanDiv(invoiceContentDiv, "FirstName", invoiceAddress.FirstName);
                        drawSimpleElement(invoiceContentDiv, " ");
                        let LastName    = new SPLINT.DOMElement.SpanDiv(invoiceContentDiv, "LastName", invoiceAddress.LastName);
                        drawSimpleElement(invoiceContentDiv, ", ");
                  
                        let Street      = new SPLINT.DOMElement.SpanDiv(invoiceContentDiv, "Street", invoiceAddress.Street);
                        drawSimpleElement(invoiceContentDiv, " ");
                        let HouseNumber = new SPLINT.DOMElement.SpanDiv(invoiceContentDiv, "HouseNumber", invoiceAddress.HouseNumber);
                  
                        drawSimpleElement(invoiceContentDiv, ", ");
                        let PostCode    = new SPLINT.DOMElement.SpanDiv(invoiceContentDiv, "Postcode", invoiceAddress.Postcode);
                        drawSimpleElement(invoiceContentDiv, " ");
                        let City        = new SPLINT.DOMElement.SpanDiv(invoiceContentDiv, "City", invoiceAddress.City);
                        drawSimpleElement(invoiceContentDiv, ", ");
                        let Country     = new SPLINT.DOMElement.SpanDiv(invoiceContentDiv, "Country", invoiceAddress.Country);
            
                        let buttonChangeInvoiceAddress = new SPLINT.DOMElement.Button(invoiceAddressDiv, "change", "ändern");
                            buttonChangeInvoiceAddress.button.Class("simple");
                            buttonChangeInvoiceAddress.button.onclick = function(){
                              window.location.hash = CheckoutHelper.PAYMENT;
                            }
            }
            resolve();
        }.bind(this));
    }
  }