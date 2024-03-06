
class productHelper {
    static NEW      = "NEW";
    static REMOVE   = "REMOVE";
    static EDIT     = "EDIT";
    static GET      = "GET";
    static GET_DATA = "GET_DATA";
    static REMOVE_IMG = "REMOVE_IMG";

    static LIGHTER_GOLD     = "Lighter_Gold_custom";
    static LIGHTER_CHROME   = "Lighter_Chrome_custom";

    static PATH     = PATH.php.product;
    static LIST     = null;
    static COLOR_LIST = null;
    static EPTYPE_LIST = null;
    static {
        this.MANAGER = new SPLINT.CallPHP.Manager(this.PATH, this);
    }
    constructor(){

    }
    static async getByName(name){
        if(productHelper.LIST == null || productHelper.LIST[name] == undefined){
            await this.getProducts()        
        }
        return productHelper.LIST[name];
    }
    static #getProductObject(name, price){
        let obj = new Object();
            obj.name = name;
            obj.price = price;
        return obj;
    }
    static async newProduct(price, name, description, size, viewName, colorID, EPType, attrs = []){
        let call = this.MANAGER.call(productHelper.NEW);
            call.data.price       = price;
            call.data.description = description;
            call.data.name        = name;
            call.data.viewName    = viewName;
            call.data.size        = size;
            call.data.attrs       = attrs;
            call.data.colorID     = colorID;
            call.data.EPType      = EPType;
        return call.send();
    }
    static async getProducts(price, name, reload = false){
        if(this.LIST != null && !reload) {
            return this.LIST;
        }
        let call = this.MANAGER.call(productHelper.GET);
            call.data.price      = price;
            call.data.name       = name;
        return new Promise(async function(resolve){
            let res = await call.send();
                if(res == null){
                    resolve(this.LIST);
                    return this.LIST;
                }
                this.LIST = new Object();

                for(const e of res){
                    this.LIST[e.name] = e;
                    delete e.name;
                }
                resolve(this.LIST);
            return this.LIST;
        }.bind(this));
    }
    static async editProduct(ID, price, name, description, size, viewName, colorID, EPType, attrs = []){
        let call = this.MANAGER.call(productHelper.EDIT);
            call.data.price       = price;
            call.data.description = description;
            call.data.name        = name;
            call.data.viewName    = viewName;
            call.data.size        = size;
            call.data.attrs       = attrs;
            call.data.colorID     = colorID;
            call.data.EPType      = EPType;
            call.data.ID          = ID;
        return call.send();
    }
    static async getProduct_ColorEPType(colorID, eptype){
        if(this.LIST != null){
            for(const [key, value] of Object.entries(this.LIST)){
                if(value.EPType == eptype && value.colorID == colorID){
                    value.name = key;
                    return value;
                }
            }
            return false;
        } else {
            let call = this.MANAGER.call(productHelper.GET_DATA);
                call.data.colorName  = colorID;
                call.data.EPType     = eptype;
            return call.send();
        }
    }
    static getProductData(name){
        let call = this.MANAGER.call(productHelper.GET_DATA);
            call.data.name = name;
        return call.send();
    }
    static async removeImage(productID, imgID){
        let call = this.MANAGER.call(productHelper.REMOVE_IMG);
            call.data.ID       = productID;
            call.data.ImageID  = imgID;
        return call.send();
    }
    static async remove(id){
        let call = this.MANAGER.call(productHelper.REMOVE);
            call.data.ID       = id;
        return call.send();
    }
    
    static async getColors(reload = false){
        if(reload || productHelper.COLOR_LIST == null) {
            productHelper.COLOR_LIST = SPLINT.DataStorage.get("/productData/colors.json");
        }
        return productHelper.COLOR_LIST;
    }
    static saveColors(data){
        return SPLINT.DataStorage.edit("/productData/colors.json", JSON.stringify(data));
    }
    static async getColorForID(colorID){
        let r = await productHelper.getColors();
        return r[colorID];
    }
    static async getEPTypes(reload = false){
        if(reload || productHelper.EPTYPE_LIST == null) {
            productHelper.EPTYPE_LIST = SPLINT.DataStorage.get("/productData/EPtype.json");
        }
        return productHelper.EPTYPE_LIST;
    }
    static saveEPTypes(data){
        return SPLINT.DataStorage.edit("/productData/EPtype.json", JSON.stringify(data));
    }
    static async getEPTypeForID(EPTypeID){
        let r = await productHelper.getEPType();
        return r[EPTypeID];
    }
}
