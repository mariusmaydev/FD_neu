function newContactData(){
  let isCustomer = true;
  let response = new Object();
      response.version            = 0;    // Version ändert sich bei jeder Änderung
      response.roles = new Object();
      if(isCustomer){
          response.roles.customer = new Object();
      } else {
          response.roles.vendor = new Object();
      }

      response.company = new Object();
      response.company.name                   = "test";             // Name des Unternehmens
      response.company.taxNumber              = "523462345";             // Steuernummer des Unternehmens
      response.company.vatRegistrationId      = "DE123456789";             // Umsatzsteuer ID
      response.company.allowTaxFreeInvoices   = true;           // Bool; Steuerfreihe Rechnungen erlauben
      response.company.contactPersons = [];
      response.company.contactPersons[0] = new Object();
      response.company.contactPersons[0].salutation  = "Herr";
      response.company.contactPersons[0].firstName   = "Max";
      response.company.contactPersons[0].lastName    = "Mustermann";
      response.company.contactPersons[0].primary     = true;
      response.company.contactPersons[0].emailAdress = "";
      response.company.contactPersons[0].phoneNumber = "";

      response.addresses = new Object();
      response.addresses.billing = [];
      response.addresses.billing[0] = new Object();
      response.addresses.billing[0].supplement = "Rechnungsadresszusatz";    //Rechnungsadresszusatz
      response.addresses.billing[0].street   = "Straße";                     // Straße
      response.addresses.billing[0].zip = "7983465389";                      // PLZ
      response.addresses.billing[0].city = "Penig";                          // Stadt
      response.addresses.billing[0].countryCode = "DE";                      
      response.addresses.shipping = [];
      response.addresses.shipping[0] = new Object();
      response.addresses.shipping[0].supplement = "Lieferadresszusatz";      // Lieferadresszusatz
      response.addresses.shipping[0].street      = "Straße";                 // Starße
      response.addresses.shipping[0].zip         = "678234";                 // PLZ
      response.addresses.shipping[0].city        = "Lunzeuan";               // Stadt
      response.addresses.shipping[0].countryCode = "DE";                 

      response.xRechnung = new Object();
      response.xRechnung.buyerReference = "345234353";
      response.xRechnung.vendorNumberAtCustomer = "5234";

      response.emailAdresses = new Object();
      response.emailAdresses.business = [];
      response.emailAdresses.business[0]      = "email@email";
      response.emailAdresses.office = [];
      response.emailAdresses.office[0]        = "email@email";
      response.emailAdresses.private = [];
      response.emailAdresses.private[0]       = "email@email";
      response.emailAdresses.other = [];
      response.emailAdresses.other[0]         = "email@email";

      
      response.phoneNumbers = new Object();
      response.phoneNumbers.business = [];
      response.phoneNumbers.business[0]       = "345";
      response.phoneNumbers.office = [];
      response.phoneNumbers.office[0]         = "52345234345";
      response.phoneNumbers.private = [];
      response.phoneNumbers.private[0]        = "23455234";
      response.phoneNumbers.fax = [];
      response.phoneNumbers.fax[0]            = "52342345";
      response.phoneNumbers.other = [];
      response.phoneNumbers.other[0]          = "52342345";

      response.note = "Notitzen";
      response.archived = false;

      return JSON.stringify(response);
      console.log(JSON.stringify(response));
  }

function newInvoiceData(orderData, orderID){
    let sendingPrice = 3.75;
    let couponCode = orderData.couponCode;
    let shoppingCart = orderData.Items;
    console.log(shoppingCart);
    let shippingAddress = orderData.Address.sending;
    let invoiceAddress = orderData.Address.invoice;
    if(orderData.invoiceAddress == ""){
        invoiceAddress = JSON.parse(orderData.invoiceAddress);
    }
    let FullPrice = 0;

    let response = new Object();
        response.language       = "de";
        response.archived       = false;
        //response.voucherStatus  = "draft";
        response.voucherDate    = createVoucherDate();
        //response.dueDate        = "yyyy-MM-ddTHH:mm:ss.SSSXXX";         //Zahlungsfrisst
        response.address = new Object();
        //response.adresses.contactId     = "nul3l";
        response.address.name          = "Rechnung - " + orderID;
        response.address.supplement    = null;
        response.address.street        = invoiceAddress.Street + invoiceAddress.HouseNumber;
        response.address.city          = invoiceAddress.City;
        response.address.zip           = invoiceAddress.Postcode;
        if(invoiceAddress.Country == "Deutschland"){
            response.address.countryCode   = "DE";
        } else {
            response.address.countryCode   = "AU";
        }
        //response.xRechnung = null;

        response.lineItems = [];
        for(let i = 0; i < shoppingCart.length; i++){
            response.lineItems[i] = new Object();
            //response.lineItems[0].id = "1";
            response.lineItems[i].type = "custom";
            response.lineItems[i].name = "Feuerzeug";
            response.lineItems[i].description = "Beschreibung";
            response.lineItems[i].quantity = shoppingCart[i].amount;
            response.lineItems[i].unitName = "Stück";
            response.lineItems[i].unitPrice = new Object();
            response.lineItems[i].unitPrice.currency = "EUR";
            response.lineItems[i].unitPrice.netAmount = parseFloat(productHelper.getByName(shoppingCart[i].ProductName).price);      //Netto
            FullPrice += parseFloat(productHelper.getByName(shoppingCart[i].ProductName).price);
            //response.lineItems[0].unitPrice.grossAmount = 4.99;    //Brutto
            response.lineItems[i].unitPrice.taxRatePercentage = 0;
            if(typeof couponCode == 'object'){
                response.lineItems[i].discountPercentage = couponCode.value;
            }
        }
        response.lineItems[shoppingCart.length] = new Object();
        response.lineItems[shoppingCart.length].type = "custom";
        response.lineItems[shoppingCart.length].name = "Versand";
        response.lineItems[shoppingCart.length].description = "orderData.shippingMethod";
        response.lineItems[shoppingCart.length].quantity = 1;
        response.lineItems[shoppingCart.length].unitName = "Stück";
        response.lineItems[shoppingCart.length].unitPrice = new Object();
        response.lineItems[shoppingCart.length].unitPrice.currency = "EUR";
        response.lineItems[shoppingCart.length].unitPrice.netAmount = sendingPrice;      //Netto
        FullPrice += sendingPrice;
        response.lineItems[shoppingCart.length].unitPrice.taxRatePercentage = 0;
        if(typeof couponCode == 'object' && couponCode.freeSending == true){
            response.lineItems[shoppingCart.length].discountPercentage = 100;
        } else {
            response.lineItems[shoppingCart.length].discountPercentage = 0;
        }

        //response.lineItems[0].lineItemAmount = 4.99;

        response.totalPrice = new Object();
        response.totalPrice.currency = "EUR";
        // response.totalPrice.totalNetAmount = 4.99;
        // response.totalPrice.totalGrossAmount = 4.99;
        // response.totalPrice.totalTaxAmount = 0;
        // response.totalPrice.totalDiscountAbsolute = 0;
        // response.totalPrice.totalDiscountPercentage = 0;

        response.taxConditions = new Object();
        response.taxConditions.taxType = "vatfree";
        //response.taxConditions.taxTypeNote = null;

        response.paymentConditions = new Object();
        response.paymentConditions.paymentTermLabel = "Bezahlt mit " + orderData.paymentMethod;
        //response.paymentConditions.paymentTermLabelTemplate = "{discountRange} Tage -{discount}, {paymentRange} Tage netto";
        response.paymentConditions.paymentTermDuration = 0;
        response.paymentConditions.paymentDiscountConditions = new Object();
        response.paymentConditions.paymentDiscountConditions.discountPercentage = 0;
        response.paymentConditions.paymentDiscountConditions.discountRange = 0;

        response.shippingConditions = new Object();
        response.shippingConditions.shippingDate = null;
        response.shippingConditions.shippingEndDate = null;
        response.shippingConditions.shippingType = "none";

        //response.closingInvoice         = true;         //Ob letzte Rechnung oder nicht 
        //response.claimedGrossAMount     = null;     //restlicher Betrag der offen ist, wenn mehrere Rechnungen
        //response.downPaymentDeductions  = null;  //Anzahlung
        //response.recurringTemplateId    = null;
        //response.relatedVouchers = [];
        response.title = "Rechnung";
        response.introduction = "Ihre bestellten Positionen stellen wir Ihnen hiermit in Rechnung";
        response.remark = "Vielen Dank für Ihren Einkauf";
        //response.files = new Object();
        //response.files.documentFileId = "234234234";

      return response;
  }

  function newDeliveryData(orderData, orderID){
    let sendingPrice = 3.75;
    let couponCode = orderData.couponCode;
    let shoppingCart = orderData.Items;
    let shippingAddress = orderData.Address.sending;
    let invoiceAddress = orderData.Address.invoice;
    if(orderData.invoiceAddress == ""){
        invoiceAddress = JSON.parse(orderData.invoiceAddress);
    }
    let FullPrice = 0;

    let response = new Object();
        response.language       = "de";
        response.archived       = false;
        //response.voucherStatus  = "draft";
        response.voucherDate = createVoucherDate();
        //response.dueDate        = "yyyy-MM-ddTHH:mm:ss.SSSXXX";         //Zahlungsfrisst
        response.address = new Object();
        //response.adresses.contactId     = "nul3l";
        response.address.name          = "Rechnung - " + orderID;
        response.address.supplement    = null;
        response.address.street        = invoiceAddress.Street + invoiceAddress.HouseNumber;
        response.address.city          = invoiceAddress.City;
        response.address.zip           = invoiceAddress.Postcode;
        if(invoiceAddress.Country == "Deutschland"){
            response.address.countryCode   = "DE";
        } else {
            response.address.countryCode   = "AU";
        }
        //response.xRechnung = null;

        response.lineItems = [];
        for(let i = 0; i < shoppingCart.length; i++){
            response.lineItems[i] = new Object();
            //response.lineItems[0].id = "1";
            response.lineItems[i].type = "custom";
            response.lineItems[i].name = "Feuerzeug";
            response.lineItems[i].description = "Beschreibung";
            response.lineItems[i].quantity = shoppingCart[i].amount;
            response.lineItems[i].unitName = "Stück";
            response.lineItems[i].unitPrice = new Object();
            response.lineItems[i].unitPrice.currency = "EUR";
            response.lineItems[i].unitPrice.netAmount = parseFloat(productHelper.getByName(shoppingCart[i].ProductName).price);      //Netto
            response.lineItems[i].unitPrice.taxRatePercentage = 0;
        }
        response.lineItems[shoppingCart.length] = new Object();
        response.lineItems[shoppingCart.length].type = "custom";
        response.lineItems[shoppingCart.length].name = "Versand";
        response.lineItems[shoppingCart.length].description = "orderData.shippingMethod";
        response.lineItems[shoppingCart.length].quantity = 1;
        response.lineItems[shoppingCart.length].unitName = "Stück";
        response.lineItems[shoppingCart.length].unitPrice = new Object();
        response.lineItems[shoppingCart.length].unitPrice.currency = "EUR";
        response.lineItems[shoppingCart.length].unitPrice.netAmount = 3.75;      //Netto
        response.lineItems[shoppingCart.length].unitPrice.taxRatePercentage = 0;

        //response.lineItems[0].lineItemAmount = 4.99;

        response.totalPrice = new Object();
        response.totalPrice.currency = "EUR";
        // response.totalPrice.totalNetAmount = 4.99;
        // response.totalPrice.totalGrossAmount = 4.99;
        // response.totalPrice.totalTaxAmount = 0;
        // response.totalPrice.totalDiscountAbsolute = 0;
        // response.totalPrice.totalDiscountPercentage = 0;

        response.taxConditions = new Object();
        response.taxConditions.taxType = "vatfree";
        //response.taxConditions.taxTypeNote = null;

        response.paymentConditions = new Object();
        response.paymentConditions.paymentTermLabel = "Bezahlt mit " + orderData.paymentMethod;
        //response.paymentConditions.paymentTermLabelTemplate = "{discountRange} Tage -{discount}, {paymentRange} Tage netto";
        response.paymentConditions.paymentTermDuration = 0;
        response.paymentConditions.paymentDiscountConditions = new Object();
        response.paymentConditions.paymentDiscountConditions.discountPercentage = 0;
        response.paymentConditions.paymentDiscountConditions.discountRange = 0;

        response.shippingConditions = new Object();
        response.shippingConditions.shippingDate = null;
        response.shippingConditions.shippingEndDate = null;
        response.shippingConditions.shippingType = "none";

        //response.closingInvoice         = true;         //Ob letzte Rechnung oder nicht 
        //response.claimedGrossAMount     = null;     //restlicher Betrag der offen ist, wenn mehrere Rechnungen
        //response.downPaymentDeductions  = null;  //Anzahlung
        //response.recurringTemplateId    = null;
        //response.relatedVouchers = [];
        response.title = "Lieferschein";
        response.introduction = "Ihre bestellten Positionen stellen wir Ihnen hiermit in Rechnung";
        response.remark = "Vielen Dank für Ihren Einkauf";
        //response.files = new Object();
        //response.files.documentFileId = "234234234";

      return response;
  }