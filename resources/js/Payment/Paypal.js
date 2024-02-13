class Paypal {
  /* TestDaten
    Email:  sb-43mtmn17849463@personal.example.com
    Pw:     2=d3tW^N
  */

  static CREATE_ORDER     = "CREATE_ORDER";
  static CAPTURE_PAYMENT  = "CAPTURE_PAYMENT";

  static Session_OrderID  = "Paypal_orderID";

  static PATH = PATH.php.paypal;

  constructor(shoppingCart, address){
    this.shoppingCart = shoppingCart;
    this.address      = address;
    this.return_url   = PATH.location.paymentComplete;
    this.cancel_url   = "";
    this.purchaseUnits = "purchaseUnits";
  }
  async createOrder(){
    let response = this.#call(Paypal.CREATE_ORDER);
    console.log(response);
    await SPLINT.SessionsPHP.set(Paypal.Session_OrderID, response.orderID);
    // Location_S.goto(response.URL).call();
    return response;
  }
  static async capturePayment(token){
    let data = SPLINT.Data.CallPHP_OLD.getCallObject(Paypal.CAPTURE_PAYMENT);
        data.token    = token;
        data.orderID  = await SPLINT.SessionsPHP.get(Paypal.Session_OrderID);
        console.log(data)
    return SPLINT.Data.CallPHP_OLD.call(Paypal.PATH, data);
  }
  #call(method){
    this.#prepare();
    let data = CallPHP_S.getCallObject(method);
        data.Storage = this.data;
        console.dir(data);
    return CallPHP_S.call(Paypal.PATH, data).toObject(true);
  }
  #prepare(){
    this.data = new Object();
    this.data.shoppingCart      = this.shoppingCart;
    this.data.shippingAddress   = this.address;
    this.data.return_url        = this.return_url;
    this.data.cancel_url        = this.cancel_url;
    this.data.purchaseUnits     = this.purchaseUnits;
  }
  //sb-43mtmn17849463@personal.example.com
  //2=d3tW^N
//   static async drawButtons(parent){
//     let button = new SPLINT.DOMElement("paypal-button-container", "div", parent);
//     let orderObject = await preparePaypal();

//     paypal.Buttons({
//         style: {
//           layout: 'horizontal',
//           color: 'gold',
//           shape: 'rect',
//           label: 'paypal',
//           tagline: 'false'
//         },
//         createOrder: (data, actions) => {
//             return actions.order.create(orderObject);
//           },
//         onApprove: (data, actions) => {
//           return actions.order.capture().then(function(orderData) {
//             console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
//             const transaction = orderData.purchase_units[0].payments.captures[0];
  
//             console.log(transaction);
//             // S_Location.goto(PATH.location.paymentComplete).call();
//             alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
//           });
//         },
//         onCancel: function (data) {
//           // Show a cancel page, or return to cart
//         },
//         onError: function (err) {
//           // For example, redirect to a specific error page
//           window.location.href = "/your-error-page-here";
//         }
//       }).render('#paypal-button-container');

//   }
}

async function preparePaypal(){
    let CouponObj = null;
    let Items = (await ShoppingCart.get()).shoppingCart;
    let FullPrice = 0;
    let productsData = await productHelper.getProducts();
    console.log(Items)
    console.dir(await productHelper.getProducts());
    for(const item of Items){
        item.price = parseFloat(productsData[item.ProductName].price);
        FullPrice += S_Math.multiply(item.price, item.amount);
    }
    let orderObject = '{' +
      '"purchase_units": [{' +
         '"amount": {' +
           '"currency_code": "EUR",' +
           '"value": "' + FullPrice + '",' +
           '"breakdown": {' +
             '"item_total": {' +
               '"currency_code": "EUR",' +
               '"value": "' + FullPrice + '"' +
             '}' +
           '}' +
         '},' +
         '"items": [';

    for(let i = 0; i < Items.length; i++){
      orderObject +=
       '{' +
         '"name": "' + Items[i].ProductName + '",';
      if(CouponObj != null){
        orderObject +=   '"description": "CouponCode:' + CouponObj.code + '  Wert: ' + CouponObj.value + '  Für alle Produkte: ' + CouponObj.eachItem + '",';
      } else {
        orderObject +=   '"description": "",';
      }
      orderObject +=
         '"unit_amount": {' +
           '"currency_code": "EUR",' +
           '"value": "' + Items[i].price + '"' +
         '},' +
         '"quantity": "' + Items[i].amount + '"' +
       '}';
      if(i < Items.length - 1){
        orderObject += ',';
      }
    }

    orderObject += ']}]}';
    orderObject = JSON.parse(orderObject);
    return orderObject;
}