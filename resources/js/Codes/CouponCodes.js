class CouponCodes {
    static CHECK    = "CHECK";
    static GET      = "GET";
    static ADD      = "ADD";
    static REMOVE   = "REMOVE";

    static TYPE_PERSONAL    = "personal";
    static TYPE_IMPERSONAL  = "impersonal";

    static PATH = PATH.php.codes.coupon;

    static get(){
        let data = CallPHP_S.getCallObject(CouponCodes.GET);
        return CallPHP_S.call(CouponCodes.PATH, data).toObject();
    }
    static check(code){
        let data = CallPHP_S.getCallObject(CouponCodes.CHECK);
            data.code = code;
        return CallPHP_S.call(CouponCodes.PATH, data).toObject();
    }
    static add(code, type, condition){
        let data = CallPHP_S.getCallObject(CouponCodes.ADD);
            data.Code           = code;
            data.Type           = type;
            data.Conditions     = condition;
        CallPHP_S.call(this.PATH, data);
    }
    static remove(code){
        let data = CallPHP_S.getCallObject(CouponCodes.REMOVE);
            data.Code          = code;
        CallPHP_S.call(this.PATH, data);
    }
    static createObj(code, condition){
        let obj = new Object();
            obj.Code        = code;
            obj.Condition   = condition;
        return obj;
    }
}

class drawCouponCodeMenu {
    constructor(parent = document.body){
        this.id = "CouponCodeMenu_";
        this.parent = parent;
    }
    draw(){
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("CouponCodeMenuMain");
    }
}