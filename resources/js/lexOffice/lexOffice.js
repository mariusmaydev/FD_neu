
class lexOffice {
    static NEW_CONTACT          = "NEW_CONTACT";
    static EDIT_CONTACT         = "EDIT_CONTACT";
    static NEW_INVOICE          = "NEW_INVOICE";
    static NEW_DELIVERY_NOTE    = "NEW_DELIVERY_NOTE";
    
    static PATH = PATH.php.lexOffice;

    static async newInvoice(orderData, orderID){
        let call = new SPLINT.CallPHP(this.PATH, this.NEW_INVOICE);
            call.data.data = await lexOfficeObjectGenerator.newInvoiceData(orderData, orderID);
            call.data.OrderID = orderID;
            console.dir(call);
            debugger
        return call.send();
    }
    static async newDeliveryNote(orderData, orderID){
        let call = new SPLINT.CallPHP(this.PATH, this.NEW_DELIVERY_NOTE);
            call.data.data = await lexOfficeObjectGenerator.newDeliveryData(orderData, orderID);
            call.data.OrderID = orderID;
        return call.send();
    }
}