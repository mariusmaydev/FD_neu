
class ADMIN_products extends ADMIN_DrawTemplate {
    static PRODUCT_IMG = "PRODUCT_IMG";
    constructor(){
        super("products");
        this.colors = null;
        this.EPTypes = null;
        this.mainElement.Class("ADMIN_productsMain");
        this.drawHead();
    }
    async getEPTypes(){
        if(this.EPTypes == null){
            this.EPTypes = await productHelper.getEPTypes();
        }
        return this.EPTypes;
    }
    async getColors(){
        if(this.colors == null){
            this.colors = await productHelper.getColors();
        }
        return this.colors;
    }
    drawHead(){
        this.ColorMenu  = new AdminProductColorMenu(this);
        this.EPTypeMenu = new AdminProductEPTypeMenu(this);
    }
    async draw(editProductData = null){
        await this.getColors();
        await this.getEPTypes();
        this.newProductMain = new SPLINT.DOMElement("newProductBody", "div", this.mainElement);
        this.newProductMain.Class("newProductBody");
            this.newProductMain.clear();
            let headline = new SPLINT.DOMElement.SpanDiv(this.newProductMain, "headline", "Produkt hinzufügen");
                headline.Class("head");
                if(editProductData != null) {
                    headline.value = "Produkt bearbeiten";
                }
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
            
            let colorBody = new SPLINT.DOMElement("newProdcutColor", "div", this.newProductMain);
                colorBody.Class("colorBody");
                let ddColor = new SPLINT.DOMElement.InputDropDown(colorBody, "EditProduct_Color", "Farbe");
                    ddColor.closeDropDown();
                    for(const [key, value] of Object.entries(this.colors)){
                        let entry = ddColor.addEntry(key, value.name);
                            entry.div.style.backgroundColor = value.hex.replace('0x', '#');
                    }

                let ddEPType = new SPLINT.DOMElement.InputDropDown(colorBody, "EditProduct_EPType", "Galvanisierung");
                    ddEPType.closeDropDown();
                    for(const [key, value] of Object.entries(this.EPTypes)){
                        let entry = ddEPType.addEntry(key, value.name);
                            entry.div.style.backgroundColor = value.hex.replace('0x', '#');
                    }
            
            // let EPTypeBody = new SPLINT.DOMElement("newProdcutEPType", "div", this.newProductMain);
            //     EPTypeBody.Class("EPTypeBody");

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
                    console.log(editProductData)
                    inputName.readOnly = true;
                    inputName.value = editProductData.name;
                    inputViewName.value = editProductData.viewName;
                    inputPrice.value = editProductData.price;
                    sizeHeight.value = editProductData.size.height;
                    sizeWidth.value = editProductData.size.width;
                    sizeDeep.value = editProductData.size.deep;
                    ddColor.value = this.colors[editProductData.colorID].name;
                    ddEPType.value = this.EPTypes[editProductData.EPType].name;

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
                let buttonUploadImage = new SPLINT.DOMElement.Button.FileUpload(buttonsDiv, "imageUpload", "image/*", ADMIN_products.PRODUCT_IMG, true);
                    buttonUploadImage.bindIcon("upload_file");
                    buttonUploadImage.Class("uploadImage");
                    buttonUploadImage.Description = "Bild hochladen";
                    buttonUploadImage.saveProductImages = function(productID){
                        if(buttonUploadImage.file_data == null){
                            return;
                        }
                        for(const d of buttonUploadImage.file_data){
                            let callback = function(res){

                            }
                            let form = new FormData();
                                form.append("ID", productID);
                            SPLINT.FileUpload.direct(d, ADMIN_products.PRODUCT_IMG, callback, form)
                        }
                    }
                console.log(editProductData);
                let buttonShowImages = new SPLINT.DOMElement.Button(buttonsDiv, "showImages", "Produktbilder verwalten");
                    buttonShowImages.Class("showImages");
                    buttonShowImages.onclick = function(){
                        console.log(editProductData);
                        let imgEle = [];
                        let ImagesPopup = new SPLINT.DOMElement.popupWindow("EditProductImages", true, true);
                            let id = ImagesPopup.id + "_";
                            let container = new SPLINT.DOMElement(id + "_container", "div", ImagesPopup.content);
                                container.Class("container");

                            for(const [name, url] of Object.entries(editProductData.ImgPath)) {
                                console.log(name, url)
                                imgEle[name] = new Object();
                                imgEle[name].Body = new SPLINT.DOMElement(id + "imgDiv_" + name, "div", container);
                                imgEle[name].Body.Class("imgEleBody");
                                    imgEle[name].image = new SPLINT.DOMElement(id + "imgEle_" + name, "img", imgEle[name].Body);
                                    imgEle[name].image.src = url;

                                    imgEle[name].btRemove = new SPLINT.DOMElement.Button(imgEle[name].Body, "remove_" + name);
                                    imgEle[name].btRemove.bindIcon("delete");
                                    imgEle[name].btRemove.Class("btRemove");
                                    imgEle[name].btRemove.onclick = async function (){
                                        let r = await productHelper.removeImage(editProductData.ID, name);
                                        imgEle[name].Body.remove();
                                        delete imgEle[name];
                                        console.log(r);
                                    }.bind(this);
                            }
                    }.bind(this);



                //     console.log(editProductData);
                // let bt_test = new SPLINT.DOMElement.Button(buttonsDiv, "test", "test");
                //     bt_test.onclick = async function(){



                //     }
                let buttonClear = new SPLINT.DOMElement.Button(buttonsDiv, "clear", "löschen");
                    buttonClear.onclick = function(){
                        inputName.clear();
                        inputViewName.clear()
                        inputPrice.clear()
                        sizeHeight.clear()
                        sizeWidth.clear()
                        sizeDeep.clear();
                        inputColorName.clear();
                        inputColorHex.clear();
                        descriptionInput.setValue("");
                        inputEPType.clear();
                        ddColor.value = "";
                        ddEPType.value = "";
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
                        let colorID = null;
                        let EPType  = null;

                        let flag = true;
                        
                        if(ddColor.value == ""){
                            flag = false;
                        } else {
                            for(const [key, value] of Object.entries(this.colors)){
                                if(value.name == ddColor.value) {
                                    colorID = key;
                                    break;
                                }
                            }
                            if(colorID == null){
                                flag = false;
                            }
                        }
                        if(ddEPType.value == ""){
                            flag = false;
                        } else {
                            for(const [key, value] of Object.entries(this.EPTypes)){
                                if(value.name == ddEPType.value) {
                                    EPType = key;
                                    break;
                                }
                            }
                            if(EPType == null){
                                flag = false;
                            }
                        }
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
                        let nameOUT = "LIGHTER_" + colorID.toUpperCase() + "_" + EPType.toUpperCase() + "_" + name;
                        if(flag){
                            if(editProductData != null){
                                console.log(editProductData.ID, price, nameOUT, description, size, viewName, colorID, EPType, attrs)
                                buttonUploadImage.saveProductImages(editProductData.ID);
                                await productHelper.editProduct(editProductData.ID, price, nameOUT, description, size, viewName, colorID, EPType, attrs);
                                this.draw();
                            } else {
                                let productData = await productHelper.newProduct(price, nameOUT, description, size, viewName, colorID, EPType, attrs);
                                if(typeof productData != "string"){
                                    let popup = new SPLINT.DOMElement.popupWindow("productExist", true, false);
                                        popup.Class("alertPopup", "productAlreadyExist");
                                        let text = new SPLINT.DOMElement.SpanDiv(popup.content, "alert", "Das Produkt existiert bereits");
                                            text.Class("alert");

                                        let buttonSubmit = new SPLINT.DOMElement.Button(popup.content, "closeProductExist", "schließen");
                                            buttonSubmit.Class("buttonSubmit");
                                            buttonSubmit.onclick = function(){
                                                popup.close();
                                            }.bind(this);
                                    console.warn("Product with name " + productData[0].name + " already exists")
                                } else {
                                    buttonUploadImage.saveProductImages(productData);
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