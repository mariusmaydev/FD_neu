
class productFunctions {
    static NEW      = "NEW";
    static REMOVE   = "REMOVE";
    static edit     = "EDIT";
    static GET      = "GET";
    static GET_DATA = "GET_DATA";

    // static LIGHTER_GOLD     = "LIGHTER_GOLD";
    // static LIGHTER_CHROME   = "LIGHTER_CHROME";

    static PATH     = PATH.php.product;

    constructor(){

    }
    static getByName(name){
        if(name == productFunctions.LIGHTER_CHROME){
            return productFunctions.getLighterChrome();
        } else if(name == productFunctions.LIGHTER_GOLD){
            return productFunctions.getLighterGold();
        }
    }
    static getLighterGold(){
        return productFunctions.getProductObject("Lighter_GOLD", 24.99);
    }
    static getLighterChrome(){
        return productFunctions.getProductObject("Lighter_CHROME", 19.99);
    }
    static getProductObject(name, price){
        let obj = new Object();
            obj.name = name;
            obj.price = price;
        return obj;
    }
    static newProduct(price, name, description, size){
        let data = CallPHP_S.getCallObject(productFunctions.NEW);
            data.price       = price;
            data.description = description;
            data.name        = name;
            data.size        = size;
        return CallPHP_S.call(productFunctions.PATH, data).text;
    }
    static getProducts(price, name){
        let data = CallPHP_S.getCallObject(productFunctions.GET);
            data.price      = price;
            data.name       = name;
        return CallPHP_S.call(productFunctions.PATH, data).toObject();
    }
    static getProductData(name){
        let data = CallPHP_S.getCallObject(productFunctions.GET_DATA);
            data.name = name;
        return CallPHP_S.call(productFunctions.PATH, data).toObject();
    }
    static remove(id){
        let data = CallPHP_S.getCallObject(productFunctions.REMOVE);
            data.ID       = id;
        return CallPHP_S.call(productFunctions.PATH, data).toObject();
    }
}
