class functionsCouponCodes {
    static CHECK    = "CHECK";
    static GET      = "GET";
    static ADD      = "ADD";
    static REMOVE   = "REMOVE";

    static TYPE_percent     = "percent";
    static TYPE_euro        = "euro";

    static PATH = PATH.php.codes.coupon;
    static {
        SPLINT.CallPHP.Manager.bind2class(this.PATH, functionsCouponCodes);
    }

    static get(code = null, type = null){
        let call = this.callPHP(this.GET);
            call.data.code = code;
            call.data.type = type;
        return call.send();
    }
    static check(code){
        let call = this.callPHP(this.CHECK);
            call.data.code = code;
        return call.send();
    }
    static add(code, type, value){
        let call = this.callPHP(this.ADD);
            call.data.code           = code;
            call.data.type           = type;
            call.data.value          = value;
        return call.send();
    }
    static remove(code){
        let call = this.callPHP(this.REMOVE);
            call.data.code          = code;
        return call.send();
    }
    static createObj(code, value){
        let obj = new Object();
            obj.code        = code;
            obj.value       = value;
        return obj;
    }
    static async activateForUser(code){
        if(code == null){
            await SPLINT.SessionsPHP.set("CouponCode", undefined);
        } else {
            let codeEle = new Object();
                codeEle.code = (await this.get(code))[0];
                codeEle.expTime = SPLINT.Tools.DateTime.Helper.getTime();
            await SPLINT.SessionsPHP.set("CouponCode", codeEle);
        }
        SPLINT.SessionsPHP.showAll();
        return code;
    }
    static async getActive(){
        let code = await SPLINT.SessionsPHP.get("CouponCode", true);
            if(code == null){
                return null;
            } else {
                if(Math.floor(Date.now() / 1000) - Math.floor(code.expTime / 1000) > 3600){             
                    this.activateForUser();   
                    return null;    
                }
                return code;
            }
        return code;
    }
    static calcPrice(priceIn){
        let code = functionsCouponCodes.getActive(); 
        if(code != null && code.code != null){ 
            code = code.code;
            if(code.type == "percent"){
                return S_Math.add(priceIn, -S_Math.multiply(priceIn, S_Math.divide(code.value, 100)));
            } else {
                let val = S_Math.add(priceIn, -code.value);
                    if(val < 0){
                        val = 0;
                    }
                return val
            }
        } else {
            return priceIn;
        }
    }
}