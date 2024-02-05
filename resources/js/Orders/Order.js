
class order {
    static NEW              = 'NEW';
    static REMOVE           = 'REMOVE';
    static EDIT             = 'EDIT';
    static GET              = 'GET';
    static FINISH           = 'FINISH';
    static CREATE_ZIP       = 'CREATE_ZIP';
    static GET_FROM_ARCHIVE = 'GET_FROM_ARCHIVE';
    static SET_STATE        = 'SET_STATE';
        static STATE_OPEN   = 'STATE_OPEN';
        static STATE_CLOSED = 'STATE_CLOSED';

    static PATH = PATH.php.order;

    static {
        SPLINT.CallPHP.Manager.bind2class(PATH.php.order, this);
    }
    constructor(){

    }
    static call(data){
        
        console.log(login.PATH, data)
        return SPLINT.Data.CallPHP_OLD.call(order.PATH, data);
    }
    static async getFromArchive(orderID = null, UserID = null){
        let call = this.callPHP(order.GET_FROM_ARCHIVE);
            call.data.OrderID   = orderID;
            call.data.UserID    = UserID;
            return order.parse(await call.send());
    }
    static edit(orderObj){
        console.log(orderObj);
        orderObj.METHOD = order.EDIT;
        return order.call(orderObj).text;
    }
    static new(orderObj){
        console.log(orderObj);
        orderObj.METHOD = order.NEW;
        return order.call(orderObj).text;
    }
    static remove(orderID){
        let data = CallPHP_S.getCallObject(order.REMOVE);
            data.OrderID = orderID;
        order.call(data);
    }
    static setState(orderID, state){
        let data = CallPHP_S.getCallObject(order.SET_STATE);
            data.State      = state;
            data.OrderID    = orderID;
        order.call(data);
    }
    static createAddressCSV(orderID, address){
        let data = CallPHP_S.getCallObject(order.CREATE_ZIP);
            data.OrderID = orderID;
            data.Address = address;
        return order.call(data).text;
    }
    static async get(orderID = null, UserID = null){
        let call = this.callPHP(order.GET);
            call.data.OrderID    = orderID;
            call.data.UserID     = UserID;
        return order.parse(await call.send());
    }
    static async parse(data){
        for(const index in data){
            let item = data[index];
            data[index].Address = JSON.parse(item.Address);
            data[index].Items   = JSON.parse(item.Items);
        }
        return data;
    }
    static async finish(orderObj){
        let call = this.callPHP(order.FINISH);
            call.data = orderObj;
        return call.send();
    }
}

class OrderObject {
    constructor(items, sendingAddress, invoiceAddress, paymentMethod, userID, couponCode = null){
      this.items            = items;
      this.sendingAddress   = sendingAddress;
      this.invoiceAddress   = invoiceAddress;
      this.paymentMethod    = paymentMethod;
      this.UserID           = userID;
      this.couponCode       = couponCode;
    }
    get(){
      let obj = new Object();
          obj.Items = this.items;
          obj.Address = new Object();
          obj.Address.sending = this.sendingAddress;
          obj.Address.invoice = this.invoiceAddress;
          obj.paymentMethod   = this.paymentMethod;
          obj.UserID          = this.UserID;
          obj.couponCode      = this.couponCode;
      return obj;
    }
}