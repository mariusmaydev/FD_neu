

class ShoppingCart {
  static SET                    = "SHOPPINGCART_SET";
  static ADD                    = "CART_ADD";
  static GET                    = "CART_GET";
  static COPY_PROJECT           = "SHOPPINGCART_COPY_PROJECT";
  static CLEAR                  = "SHOPPINGCART_CLEAR";
  static REMOVE_ITEM            = "SHOPPINGCART_REMOVE_ITEM";
  static CHANGE_AMOUNT          = "SHOPPINGCART_CHANGE_AMOUNT";
  static REMOVE                 = "REMOVE";
  static PATH                   = PATH.php.userData;
  static MANAGER;

  static {
    this.MANAGER = new SPLINT.CallPHP.Manager(this.PATH);
  }
  static async set(obj, UserID = null){
    let call = this.MANAGER.call(ShoppingCart.SET);
        call.data.ShoppingCart = obj;
        call.data.UserID = UserID;
        call.keepalive = true;
    return call.send();
  }
  static {
    SPLINT.CallPHP.Manager.bind2class(this.PATH, this);
  }
  static async clear(UserID = null){
    let call = new SPLINT.CallPHP(this.PATH, this.CLEAR);
        call.data.UserID = UserID;
    return call.send();
  }
  static async get(UserID = null){
    let call = new SPLINT.CallPHP(this.PATH, this.GET);
        call.data.UserID = UserID;

        let res = await call.send();

        return res;
  }
  static async copyProject(projectID){
    let call = new SPLINT.CallPHP(this.PATH, ShoppingCart.COPY_PROJECT);
        call.data.ProjectID = projectID;
        return call.send();
    // CallPHP_S.call(ShoppingCart.PATH, data);
  }
  static callLocation(){
    SPLINT.Tools.Location_old.goto(PATH.location.cart).call();
  }  
  static async addItem(projectID, productName, amount, UserID = null){
        let call = new SPLINT.CallPHP(this.PATH, this.ADD);
            call.data.ProjectID = projectID;
            call.data.ProductName = productName;
            call.data.amount = amount;
            call.data.UserID = UserID;

        let res = await call.send();
        if(typeof NavBar !== 'undefined') {
            NavBar.updateCart(res);
        }
        return res;
  }
  static async N_changeAmount(ProjectID, value, UserID = null){
    let call = new SPLINT.CallPHP(this.PATH, this.CHANGE_AMOUNT);
        call.data.ProjectID = ProjectID;
        call.data.UserID = UserID;
        call.data.amount = value;
        return call.send();
  }
  static async removeItem(projectID, UserID = null){
    let call = new SPLINT.CallPHP(this.PATH, this.REMOVE_ITEM);
        call.data.ProjectID = projectID;
        call.data.UserID = UserID;
        let res = await call.send(); 
    if(typeof NavBar !== 'undefined') {
        NavBar.updateCart(res);
    }
    return res;
  }
  static async getFullPrice(cartObject){
    let fullPrice = 0;
    if(cartObject != null){
        for(const item of cartObject){
            let productData     = await productHelper.getByName(item.ProductName);
            fullPrice = SPLINT.Math.add(SPLINT.Math.multiply(productData.price, item.amount), fullPrice);
        }
    }
    return fullPrice;
  }
    static async drawPrices(cartData = null){
        if(cartData == null){
            cartData = (await ShoppingCart.get());
        }
        let fullPrice   = await ShoppingCart.getFullPrice(cartData);
        let endPrice    = await functionsCouponCodes.calcPrice(fullPrice);
        let priceCoupon = SPLINT.Math.add(fullPrice, -endPrice);
        SPLINT.DOMElement.PriceDiv.setValue("fullPrice", fullPrice);
        SPLINT.DOMElement.PriceDiv.setValue("fullPrice_coupon", -priceCoupon);
        SPLINT.DOMElement.PriceDiv.setValue("fullPrice_end", endPrice);
        return true;
    }
}