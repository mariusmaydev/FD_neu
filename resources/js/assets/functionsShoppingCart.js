

class ShoppingCart {
  static SET          = "SHOPPINGCART_SET";
  static GET          = "SHOPPINGCART_GET";
  static COPY_PROJECT = "SHOPPINGCART_COPY_PROJECT";
  static REMOVE       = "REMOVE";
  static PATH           = PATH.php.userData;
  static MANAGER;

  static {
    this.MANAGER = new SPLINT.CallPHP.Manager(this.PATH);
  }
  static async set(obj){
    let call = this.MANAGER.call(ShoppingCart.SET);
        call.data.ShoppingCart = obj;
        call.keepalive = true;
    return call.send();
  }
  static {
    SPLINT.CallPHP.Manager.bind2class(this.PATH, this);
  }
  static async clear(){
    async function f(cart){
        for(const e of cart){
            ProjectHelper.remove(e.ProjectID);
        }
    }
    return new Promise(async function(resolve){
        let cart = (await this.get()).shoppingCart;
            f(cart);
        await ShoppingCart.set(JSON.stringify([]));
        NavBar.updateCart([]);
        resolve(true);
    }.bind(this));
  }
  static get(){
    return new Promise(async function(resolve){

      let call = this.callPHP(ShoppingCart.GET);
      let cart = await call.send();
      let obj = new Object();
      if(typeof cart == 'object' && cart != null){
        if(cart.ShoppingCartFromGuest != ""){
          obj.shoppingCart_GUEST = JSON.parse(cart.ShoppingCartFromGuest);
        }
        if(cart.ShoppingCart != ""){
          obj.shoppingCart = JSON.parse(cart.ShoppingCart);
        }
        resolve(obj);
      }
      resolve("null");
    }.bind(this));
  }
  static copyProject(projectID){
    let data = CallPHP_S.getCallObject(ShoppingCart.COPY_PROJECT);
        data.ProjectID = projectID;
    CallPHP_S.call(ShoppingCart.PATH, data);
  }
  static callLocation(){
    S_Location.goto(PATH.location.cart).call();
  }  
  static async addItem(projectID, productName, amount){
    return new Promise(async function(resolve){
        let cartData = (await ShoppingCart.get()).shoppingCart;
        if(cartData == null){
        cartData = [];
        }
        let flag = true;
        for(const index in cartData){
        let item = cartData[index];
        if(item.ProjectID == projectID){
                cartData[index].amount += amount;
            flag = false;
        }
        }
        if(flag){
        let itemObj = new Object();
            itemObj.ProjectID   = projectID;
            itemObj.ProductName = productName;
            itemObj.amount      = amount;
        cartData.push(itemObj);
        }
        NavBar.updateCart(cartData);
        resolve(cartData);
    }).then(function(cartData){
        return ShoppingCart.set(JSON.stringify(cartData));
    });
  }
  static async changeAmount(index, value){
    let cart = (await ShoppingCart.get()).shoppingCart;
        cart[index].amount += value;
        ShoppingCart.set(JSON.stringify(cart));
    return cart;
  }
  static async setAmount(index, value){
    return new Promise(async function(resolve){
        let cart = (await ShoppingCart.get()).shoppingCart;
            cart[index].amount = value;
            await ShoppingCart.set(JSON.stringify(cart));
        resolve(cart);
    });
  }
  static async editItem(projectID, productName, amount = null){
    let cartData = (await ShoppingCart.get()).shoppingCart;
    if(cartData == null){
      cartData = [];
    }
    for(const index in cartData){
      let item = cartData[index];
      if(item.ProjectID == projectID){
        if(amount != null){
        	cartData[index].amount = amount;
        }
        cartData[index].ProductName = productName;
      }
    }
    NavBar.updateCart(cartData);
    ShoppingCart.set(JSON.stringify(cartData));
    return cartData;
  }
  static async removeItem(projectID){
    let cartData = (await ShoppingCart.get()).shoppingCart;
    if(cartData == null){
      cartData = [];
    }
    for(const index in cartData){
      let item = cartData[index];
      if(item.ProjectID == projectID){
        cartData.splice(index, 1);
      }
    }
    NavBar.updateCart(cartData);
    ShoppingCart.set(JSON.stringify(cartData));
    ProjectHelper.remove(projectID);
  }
  static async getFullPrice(cartObject){
    let fullPrice = 0;
    if(cartObject != null){
        for(const item of cartObject){
        let productData     = await productHelper.getByName(item.ProductName);
        fullPrice = S_Math.add(S_Math.multiply(productData.price, item.amount), fullPrice);
        }
    }
    return fullPrice;
  }
    static async drawPrices(cartData = null){
        if(cartData == null){
            cartData = (await ShoppingCart.get()).shoppingCart;
        }
        let fullPrice   = await ShoppingCart.getFullPrice(cartData);
        let endPrice    = functionsCouponCodes.calcPrice(fullPrice);
        let priceCoupon = S_Math.add(fullPrice, -endPrice);
        PriceDiv_S.setValue("fullPrice", fullPrice);
        PriceDiv_S.setValue("fullPrice_coupon", -priceCoupon);
        PriceDiv_S.setValue("fullPrice_end", endPrice);
        return true;
    }
}