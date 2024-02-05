
class productHelper {
    static NEW      = "NEW";
    static REMOVE   = "REMOVE";
    static EDIT     = "EDIT";
    static GET      = "GET";
    static GET_DATA = "GET_DATA";

    static LIGHTER_GOLD     = "Lighter_Gold_custom";
    static LIGHTER_CHROME   = "Lighter_Chrome_custom";

    static PATH     = PATH.php.product;
    static LIST;
    static {
        this.LIST = new Object();
        this.MANAGER = new SPLINT.CallPHP.Manager(this.PATH, this);
    }
    constructor(){

    }
    static async getByName(name){
        if(productHelper.LIST[name] == undefined){
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
    static async newProduct(price, name, description, size, viewName, attrs = []){
        let call = this.MANAGER.call(productHelper.NEW);
            call.data.price       = price;
            call.data.description = description;
            call.data.name        = name;
            call.data.viewName    = viewName;
            call.data.size        = size;
            call.data.attrs       = attrs;
        return call.send();
    }
    static getProducts(price, name){
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
    static async editProduct(ID, price, name, description, size, viewName, attrs = []){
        let call = this.MANAGER.call(productHelper.EDIT);
            call.data.price       = price;
            call.data.description = description;
            call.data.name        = name;
            call.data.viewName    = viewName;
            call.data.size        = size;
            call.data.attrs       = attrs;
            call.data.ID          = ID;
        return call.send();
    }
    static getProductData(name){
        let call = this.MANAGER.call(productHelper.GET_DATA);
            call.data.name = name;
        return call.send();
    }
    static async remove(id){
        let call = this.MANAGER.call(productHelper.REMOVE);
            call.data.ID       = id;
        return call.send();
    }
}
