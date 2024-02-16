class CheckoutHelper {
  static ELE_MAIN         = "checkout_main";
  static ELE_WINDOW_MAIN  = "CheckoutWindow_div";
  static ELE_ADDRESS      = "checkout_address_main";
  static ELE_SENDING      = "checkout_sending_main";
  static ELE_PAYMENT      = "checkout_payment_main";
  static ELE_CHECKORDER   = "checkout_checkOrder_main";

  static ADDRESS          = "address";
  static SENDING          = "sending";
  static PAYMENT          = "payment";
  static CHECKORDER       = "checkOrder";

  static async progress(name = null){
    if(name != null){
      return  (await(new obj()).get()).includes(name);
    }
    function obj(){
      this.get = async function(){
        return SPLINT.SessionsPHP.get(Checkout.sessions.progress);
      }
      this.add = async function(name){
        if(name == undefined){
          name = S_Location.getHashes();
        }
        let data = await SPLINT.SessionsPHP.get(Checkout.sessions.progress);
        if(typeof data == 'object'){
          data = S_Tools.mergeToArray(data, name);
        } else {
          data = [];
          data.push(name);
        }
        await SPLINT.SessionsPHP.set(Checkout.sessions.progress, data);
      }
      this.remove = async function(value){
        let data;
        if(value != undefined){
          data = this.get();
          if(typeof data == 'object'){
            data.splice(data.indexOf(value), 1);
          }
        } else {
          data = "";
        }
        await SPLINT.SessionsPHP.set(Checkout.sessions.progress, data);
      }
    }
    return new obj();
  }
  static async goto(site){
    (await CheckoutHelper.progress()).add();
    window.location.hash = site;
  }
    static async finishCheckout(data){
        if(data.data.purchase_units[0].shipping != undefined) {
            let address = data.data.purchase_units[0].shipping.address;
            let fullName = data.data.purchase_units[0].shipping.name.full_name;

            let name = fullName.split(' ');

            let streetIn = address.address_line_1;
            let match = streetIn.match(/\d+/);

            let street = streetIn;
            let houseNumber = "";
            if(match != null){
                street = streetIn.substring(0, match.index);
                houseNumber = streetIn.substring(match.index);
            }

            let addressStorage = await SPLINT.SessionsPHP.get(Checkout.sessions.addresses);
                addressStorage.City = address.admin_area_2;
                addressStorage.Country = address.country_code;
                addressStorage.FirstName = name[0];
                addressStorage.LastName = name[1];
                addressStorage.Postcode = address.postal_code;
                addressStorage.Street = street;
                addressStorage.HouseNumber = houseNumber;
                addressStorage.Email = data.data.payer.email_address;

            await SPLINT.SessionsPHP.set(Checkout.sessions.addresses, addressStorage);
            if(await SPLINT.SessionsPHP.get(Checkout.sessions.invoiceType) == "identical"){
                await SPLINT.SessionsPHP.set(Checkout.sessions.invoiceAddress, addressStorage);
            }
        }
        let Items = (await ShoppingCart.get()).shoppingCart;
        for(const index in Items){
            let newProjectID = (await ProjectHelper.copy(Items[index].ProjectID));
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
            let orderObjExec = orderObj.get();
            let orderID = order.new(orderObjExec);
            await lexOffice.newInvoice(orderObjExec, orderID);
            await lexOffice.newDeliveryNote(orderObjExec, orderID);
            // await ShoppingCart.clear();
            SPLINT.Tools.Location.URL = PATH.location.paymentComplete;
            SPLINT.Tools.Location.setParams({"orderID": orderID}).call();
            // SPLINT.Tools.Location.call();
            // window.location.href = PATH.location.paymentComplete;
    }
}


