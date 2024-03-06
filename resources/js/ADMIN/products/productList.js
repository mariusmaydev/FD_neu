
class AdminProductList {
    constructor(parent, ADMIN_productsInstance = null){
        this.Instance = ADMIN_productsInstance;
        this.parent = parent;
        this.id = "AdminProductList_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("ProductsList")
        this.draw();
    }
    async draw(){
        this.mainElement.innerHTML = "";
        let dataIn = await productHelper.getProducts();
        console.log(dataIn);
        if(dataIn == null){
            return;
        }
        let headLine = new SPLINT.DOMElement.SpanDiv(this.mainElement, "headline", "Produktliste");
            headLine.Class("headline");
        this.table = new SPLINT.DOMElement.Table.Grid(this.mainElement, "productList", Object.entries(dataIn).length, 6);
        this.table.getHead();
        let gen = SPLINT.DOMElement.SpanDiv.get;
        gen(this.table.getData2Head(0), "", "Bild");
        gen(this.table.getData2Head(1), "", "Name");
        gen(this.table.getData2Head(2), "", "Preis");
        gen(this.table.getData2Head(3), "", "Abmaße (in mm)");
        gen(this.table.getData2Head(4), "", "Farbe");
        gen(this.table.getData2Head(5), "", "andere Eigenschaften");
        gen(this.table.getData2Head(6), "", "Verkäufe");
        gen(this.table.getData2Head(7), "", "");
        this.table.draw();
        let index = 0;
        for(const entry in dataIn){
                let data = dataIn[entry];
                let nameDiv = new SPLINT.DOMElement(this.table.getData(index, 1).id + "nameBody", "div", this.table.getData(index, 1));
                    nameDiv.Class("nameContainer");
                    gen(nameDiv, "nameView", data.viewName);
                    gen(nameDiv, "name", entry);
                gen(this.table.getData(index, 2), "price", data.price + "€");
                let sizeBody = new SPLINT.DOMElement(this.table.getData(index, 3).id + "sizeBody", "div", this.table.getData(index, 3));
                    let sizeHeight = new SPLINT.DOMElement.SpanDiv(sizeBody, "size_height", data.size.height);
                        let sizeHeightLabel = new SPLINT.DOMElement.Label(sizeBody, sizeHeight.div, "Höhe");
                            sizeHeightLabel.before();
                    let sizeWidth = new SPLINT.DOMElement.SpanDiv(sizeBody, "size_width", data.size.width);
                        let sizeWidthLabel = new SPLINT.DOMElement.Label(sizeBody, sizeWidth.div, "Breite");
                            sizeWidthLabel.before();
                    let sizeDeep = new SPLINT.DOMElement.SpanDiv(sizeBody, "size_deep", data.size.deep);
                        let sizeDeepLabel = new SPLINT.DOMElement.Label(sizeBody, sizeDeep.div, "Tiefe");
                            sizeDeepLabel.before();

                let colorBody = new SPLINT.DOMElement(this.table.getData(index, 4).id + "colorBody", "div", this.table.getData(index, 4));
                    let colorName = new SPLINT.DOMElement.SpanDiv(colorBody, "color_name", data.colorName);
                    let colorHex = new SPLINT.DOMElement.SpanDiv(colorBody, "color_hex", data.colorHex);
                    let EPType = new SPLINT.DOMElement.SpanDiv(colorBody, "EPType", data.EPType);

                let attrBody = new SPLINT.DOMElement(this.table.getData(index, 5).id + "attrBody", "div", this.table.getData(index, 5));
                    let attrTable = new SPLINT.DOMElement.Table.TextTable(attrBody, "attrs_" + index);
                    for(const e of data.attrs){
                        attrTable.addRow(e.name, e.value);
                    }

                    gen(this.table.getData(index, 6), "sales", data.sales);
                
                let buttonRemove = new SPLINT.DOMElement.Button(this.table.getData(index, 7), "remove");
                    buttonRemove.bindIcon("delete");
                    buttonRemove.setTooltip("Produkt entfernen", "bottom");
                    buttonRemove.onclick = function(){
                        let popup = new SPLINT.DOMElement.popupWindow("remove");
                            popup.Class("popup_removeProduct");
                            let inner = new SPLINT.DOMElement.SpanDiv(popup.content, "remove", "Bist du dir sicher das du das Produkt entfernen willst?");    
                            let buttonBreak = new SPLINT.DOMElement.Button(popup.content, "remove_break", "abbrechen");
                                buttonBreak.Class("break");
                                buttonBreak.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT)
                                buttonBreak.onclick = function(){
                                    popup.close();
                                }
                            let buttonSubmit = new SPLINT.DOMElement.Button(popup.content, "remove_submit", "löschen");
                                buttonSubmit.Class("submit");
                                buttonSubmit.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT)
                                buttonSubmit.onclick = async function(){
                                    await productHelper.remove(data.ID);
                                    popup.close();
                                    this.draw();
                                }.bind(this);
                            // popup.content
                    }.bind(this);
                
                
                let buttonEdit = new SPLINT.DOMElement.Button(this.table.getData(index, 7), "edit");
                    buttonEdit.bindIcon("edit");
                    buttonEdit.setTooltip("bearbeiten", "bottom");
                    buttonEdit.onclick = function(){
                        data.name = entry;
                        this.Instance.draw(data);
                    }.bind(this);
                    index++;
        }
        // this.table = new SPLINT.DOMElement.Table.List(this.mainElement, "productList", dataIn);
        // this.table.func_drawListElement = function(data, index, listElement){
        //         console.log(data);
        //     let nameDiv = new SPLINT.DOMElement.SpanDiv(listElement, "name", data.name);
        //     let priceDiv = new SPLINT.DOMElement.SpanDiv(listElement, "price", data.price + "€");
        //     let sizeBody = new SPLINT.DOMElement(listElement.id + "sizeBody", "div", listElement);
        //         let sizeHeight = new SPLINT.DOMElement.SpanDiv(listElement, "size_height", data.size.height);
        //         let sizeWidth = new SPLINT.DOMElement.SpanDiv(listElement, "size_width", data.size.width);
        //         let sizeDeep = new SPLINT.DOMElement.SpanDiv(listElement, "size_deep", data.size.deep);
        // }.bind(this);
        // this.table.draw();
    }
}