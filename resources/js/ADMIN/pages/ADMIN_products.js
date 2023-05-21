
class ADMIN_products extends ADMIN_DrawTemplate {
    constructor(){
        super("products");
        this.mainElement.Class("ADMIN_productsMain");
    }
    draw(){
        this.newProductMain = new SPLINT.DOMElement("newProductBody", "div", this.mainElement);
        this.newProductMain.Class("newProductBody");
            let headline = new SPLINT.DOMElement.SpanDiv(this.newProductMain, "headline", "Produkt hinzufügen");
                headline.Class("head");
            let infoBody = new SPLINT.DOMElement("newProductInfo", "div", this.newProductMain);
                infoBody.Class("infoBody");
                let inputName = new SPLINT.EX.DOMElement.Input(infoBody, "Name");   
                    inputName.onEnter = function(){buttonSubmit.click()}; 

                let inputViewName = new SPLINT.EX.DOMElement.Input(infoBody, "ViewName");   
                    inputViewName.onEnter = function(){buttonSubmit.click()}; 

                let inputPrice = new SPLINT.EX.DOMElement.Input(infoBody, "Preis");  
                    inputPrice.onEnter = function(){buttonSubmit.click()};
            let sizeBody = new SPLINT.DOMElement("newProdcutSize", "div", this.newProductMain);
                sizeBody.Class("sizeBody");
                let sizeHeight = new SPLINT.EX.DOMElement.Input(sizeBody, "Höhe");
                    sizeHeight.onEnter = function(){buttonSubmit.click()};
                let sizeWidth = new SPLINT.EX.DOMElement.Input(sizeBody, "Breite");
                    sizeWidth.onEnter = function(){buttonSubmit.click()};
                let sizeDeep = new SPLINT.EX.DOMElement.Input(sizeBody, "Tiefe");
                    sizeDeep.onEnter = function(){buttonSubmit.click()};

            let l1 = new SPLINT.DOMElement.InputDynamic(this.newProductMain, "moreAttrs");
                l1.headline = "weitere Attribute";
                l1.template = function(contentElement, listElement, index, id){
                    let inputName = new SPLINT.DOMElement.InputDiv(contentElement, "name", "Eigenschaft");
                        inputName.Class("inputName");
                    let inputValue = new SPLINT.DOMElement.InputDiv(contentElement, "value", "beschreibung");
                        inputValue.Class("inputValue");
                }
                l1.draw();

            let buttonSubmit = new SPLINT.DOMElement.Button(this.newProductMain, "submit", "speichern");
                buttonSubmit.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
                buttonSubmit.onclick = async function(){
                    let attrs = [];
                    for(const e of l1.list){
                        if(e == null){
                            continue;
                        }
                        let iValue = e.contentElement.querySelector("input[name=value]");
                        let iName = e.contentElement.querySelector("input[name=name]");
                        let obj = new Object();
                            obj.name    = iName.value;
                            obj.value   = iValue.value;
                        attrs.push(obj)
                    }
                    let viewName = inputViewName.value;
                    let name = inputName.value;
                    let price = inputPrice.value;
                    let size = new Object();
                        size.width  = sizeWidth.value;
                        size.height = sizeHeight.value;
                        size.deep   = sizeDeep.value;
                    let flag = true;
                    if(viewName == ""){
                        inputViewName.invalid();
                        flag = false;
                    }
                    if(name == ""){
                        inputName.invalid();
                        flag = false;
                    }
                    if(price == ""){
                        inputPrice.invalid();
                        flag = false;
                    }
                    if(size.width == ""){
                        sizeWidth.invalid();
                        flag = false;
                    }
                    if(size.height == ""){
                        sizeHeight.invalid();
                        flag = false;
                    }
                    if(size.deep == ""){
                        sizeDeep.invalid();
                        flag = false;
                    }
                    if(flag){
                        let productData = await productHelper.newProduct(price, name, "test", size, viewName, attrs)
                        this.productList.draw();
                    }
                }.bind(this);

        this.productList = new AdminProductList(this.mainElement);
    }
    choosePage(){
    }
}