
class ADMIN_products extends ADMIN_DrawTemplate {
    constructor(){
        super("products");
        this.mainElement.Class("ADMIN_productsMain");
    }
    draw(editProductData = null){
        this.newProductMain = new SPLINT.DOMElement("newProductBody", "div", this.mainElement);
        this.newProductMain.Class("newProductBody");
            this.newProductMain.clear();
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

            let descriptionBody = new SPLINT.DOMElement("newProductDescription", "div", this.newProductMain);
                descriptionBody.Class("descriptionBody");
                let headlineContainer = new SPLINT.DOMElement("newProductDescriptionHeadlineContainer", "div", descriptionBody);
                    headlineContainer.Class("headlineContainer");
                    let headlineDesc = new SPLINT.DOMElement.SpanDiv(headlineContainer, "headline", "Beschreibung");
                        headlineDesc.Class("headline");
                    let hr = new SPLINT.DOMElement.HorizontalLine(headlineContainer);
                let descriptionInput = new SPLINT.DOMElement.InputText(descriptionBody, "description", "");
                    descriptionInput.Class("descriptionInput");
                    // descriptionInput.setLabel("Beschreibung");

            let l1 = new SPLINT.DOMElement.InputDynamic(this.newProductMain, "moreAttrs");
                l1.headline = "weitere Attribute";
                l1.template = function(contentElement, listElement, index, id, ...args){
                    let inputName = new SPLINT.DOMElement.InputDiv(contentElement, "name", "Eigenschaft");
                        inputName.Class("inputName");
                    let inputValue = new SPLINT.DOMElement.InputDiv(contentElement, "value", "beschreibung");
                        inputValue.Class("inputValue");
                        if(args.length != 0){
                            inputName.value = args[0];
                            inputValue.value = args[1];
                        }
                }
                l1.draw();

                if(editProductData != null){
                    inputName.readOnly = true;
                    inputName.value = editProductData.name;
                    inputViewName.value = editProductData.viewName;
                    inputPrice.value = editProductData.price;
                    sizeHeight.value = editProductData.size.height;
                    sizeWidth.value = editProductData.size.width;
                    sizeDeep.value = editProductData.size.deep;

                    descriptionInput.setValue(editProductData.description);
                    for(const key in editProductData.attrs){
                        l1.add(key, ...Object.values(editProductData.attrs[key]));
                    }
                }

            let buttonsDiv = new SPLINT.DOMElement("newProductButtonsDiv", "div", this.newProductMain);
                buttonsDiv.Class("buttonsDiv");
                if(editProductData != null){
                    let buttonCancleEdit = new SPLINT.DOMElement.Button(buttonsDiv, "cancleEdit", "abbrechen");
                        buttonCancleEdit.onclick = function(){
                            this.draw();
                        }.bind(this);
                }
                let buttonClear = new SPLINT.DOMElement.Button(buttonsDiv, "clear", "löschen");
                    buttonClear.onclick = function(){
                        inputName.clear();
                        inputViewName.clear()
                        inputPrice.clear()
                        sizeHeight.clear()
                        sizeWidth.clear()
                        sizeDeep.clear()
                        descriptionInput.setValue("");
                        l1.clear();
                    }.bind(this);

                let buttonSubmit = new SPLINT.DOMElement.Button(buttonsDiv, "submit", "speichern");
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
                        let description = descriptionInput.Value;
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
                            if(editProductData != null){
                                await productHelper.editProduct(editProductData.ID, price, name, description, size, viewName, attrs);
                                this.draw();
                            } else {
                                let productData = await productHelper.newProduct(price, name, description, size, viewName, attrs);
                                if(typeof productData != "string"){
                                    console.warn("Product with name " + productData[0].name + " already exists")
                                } else {
                                    this.productList.draw();
                                }
                            }
                        }
                    }.bind(this);

            this.productList = new AdminProductList(this.mainElement, this);
        
    }
    choosePage(){
    }
}