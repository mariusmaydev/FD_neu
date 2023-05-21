
class lexOffice {
    static NEW_CONTACT          = "NEW_CONTACT";
    static EDIT_CONTACT         = "EDIT_CONTACT";
    static NEW_INVOICE          = "NEW_INVOICE";
    static NEW_DELIVERY_NOTE    = "NEW_DELIVERY_NOTE";
    
    static PATH = PATH.php.lexOffice;

    static newContact(){

    }
    static editContact(){
        
    }
    static newInvoice(orderData, orderID){
        let data = CallPHP_S.getCallObject(this.NEW_INVOICE);
            data.data = newInvoiceData(orderData, orderID);
            data.OrderID = orderID;
        return CallPHP_S.call(this.PATH, data).text;
    }
    static newDeliveryNote(orderData, orderID){
        let data = CallPHP_S.getCallObject(this.NEW_DELIVERY_NOTE);
            data.data = newDeliveryData(orderData, orderID);
            data.OrderID = orderID;
        return CallPHP_S.call(this.PATH, data).text;
    }
}