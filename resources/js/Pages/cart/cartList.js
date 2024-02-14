
class drawCartList {
    constructor(parent){
        this.parent = parent;
        this.id = "cartList_";
        this.mainElement = parent.newDiv(this.id + "main", "cartListMain");
        this.listBody = this.mainElement.newDiv("/ID/listBody", "ListBody");
        this.draw();
    }
    async draw(){
        this.data = (await ShoppingCart.get()).shoppingCart;
        console.log(this.data);
        this.emptyBody = new SPLINT.DOMElement(this.id + "emptyBody", "div", this.mainElement);
        this.emptyBody.Class("emptyBody");
            let bt_emptyBody = new SPLINT.DOMElement.Button(this.emptyBody, "BT_EmptyBody");
                bt_emptyBody.bindIcon("production_quantity_limits")
                bt_emptyBody.Description = "Warenkorb ist leer";
        if(this.data.length == 0){
            this.emptyBody.state().setActive();
            SPLINT.Events.onLoadingComplete.dispatch();
        }
        // this.listHead = new SPLINT.DOMElement(this.id + "ItemListHead", "div", this.listBody);
        // this.listHead.Class("itemListHead");
        // SPLINT.Events.onLoadingComplete = function(){
        //     this.listHead.setAttribute("loaded", true);;
        // }.bind(this);
        //     let descDiv = this.listHead.newDiv("ItemList_head_description", "description");
        //         new SPLINT.DOMElement.SpanDiv(descDiv, "inner", "Beschreibung");

        //     let itemPriceDiv = this.listHead.newDiv("ItemList_head_itemPrice", "itemPrice");
        //         new SPLINT.DOMElement.SpanDiv(itemPriceDiv, "inner", "Stückpreis");

        //     let amountDiv = this.listHead.newDiv("ItemList_head_amount", "amount");
        //         new SPLINT.DOMElement.SpanDiv(amountDiv, "inner", "Anzahl");

        //     let priceDivEle = this.listHead.newDiv("ItemList_head_price", "price");
        //         new SPLINT.DOMElement.SpanDiv(priceDivEle, "inner", "Preis");
        this.list = new Table(this.listBody, "ItemList", this.data);
        this.list.func_drawFirstListElement = function(listElement){
            let header = new SPLINT.DOMElement.SpanDiv(listElement, "headline_cart", "Warenkorb");
                header.Class("headline_cart");
        }
        this.list.func_drawListElement = function(item, index, listElement){
            console.log(item)
            let projectData     = ProjectHelper.get(item.ProjectID);
            let productData     = productHelper.getByName(item.ProductName);
            let lighterEle      = listElement.newDiv(null, "lighter");
            let rightDiv        = listElement.newDiv(null, "right");
            let infoEle         = rightDiv.newDiv(null, "info");
            let itemPriceDiv    = rightDiv.newDiv(null, "itemPrice");
            let amountEle       = rightDiv.newDiv(null, "amount");
            let priceEle        = rightDiv.newDiv(null, "price");
            let buttonsEle      = rightDiv.newDiv(null, "buttons");
            
            projectData.then(function(data){
                let lighter = new drawLighter3D(lighterEle, lighterEle.id, "PROJECT", data.Thumbnail, false, false, data.EPType);
            })

            let infoDivInner = infoEle.newDiv("/ID/info_inner", "inner");
                let infoText = new SPLINT.DOMElement.SpanDiv(infoDivInner, "text", "vergoldetes Feuerzeug");
                    infoText.div.Class("text");
                    let horizontalLine = new SPLINT.DOMElement.HorizontalLine(infoDivInner);
                let informationTableBody = new SPLINT.DOMElement(infoDivInner.id + "informationTableBody", "div", infoDivInner);
                    informationTableBody.Class("informationTableBody");
                    // let informationTableHeadline = new SPLINT.DOMElement.SpanDiv(informationTableBody, infoDivInner.id + "headline", "Produktdetails");
                    //     informationTableHeadline.Class("headline");
                    let informationTable = new SPLINT.DOMElement.Table.TextTable(informationTableBody, infoDivInner.id + "information");
                        informationTable.Class("informationTable");
                        // informationTable.addRow("erstellt", this.data.First_Time);
                        // informationTable.addRow("zuletzt bearbeitet", this.data.Last_Time);
                        productData.then(function(data){
                            console.dir(data);
                            for(const e of data.attrs){
                                informationTable.addRow(e.name + " ", e.value);
                            }
                        });

            let itemPriceDivInner = itemPriceDiv.newDiv("/ID/item_price_inner", "inner");
            productData.then(function(data){
                infoText.value = data.viewName;
                // let priceDivItem = new PriceDiv_S(itemPriceDivInner, index, "25.55");
            });
            let priceDiv
            let amountDivInner = amountEle.newDiv("/ID/amount_inner", "inner");
            let amountDiv = new SPLINT.DOMElement.InputAmount(amountDivInner, amountDivInner.id, item.amount, "");
            productData.then(function(data){
                amountDiv.oninput = async function(amount){
                    priceDiv.setPrice(S_Math.multiply(data.price, amount));
                    await ShoppingCart.setAmount(index, amount);
                    ShoppingCart.drawPrices();
                }.bind(this);
            }.bind(this));

                
            let PriceDivInner = priceEle.newDiv("/ID/full_price_inner", "inner");
            productData.then(function(data){
                priceDiv = new PriceDiv_S(PriceDivInner, index, S_Math.multiply(data.price, item.amount));
            });

            let ButtonsInner = buttonsEle.newDiv("/ID/buttons_inner", "inner");
                    
                let bt_info = new SPLINT.DOMElement.Button(ButtonsInner, "info");
                    bt_info.bindIcon("info");
                    bt_info.Class("info");
                    bt_info.onclick = function(){
                        projectData.then(async function(data){
                            NavBar.grow();
                            let p = new ProjectDetails(data, 1, document.body);
                            p.onclose = function(){
                                console.log("ok")
                                NavBar.shrink();
                            }
                                p.show(true);
                        });
                        // Project.CONVERTER_startProject(projectData.ProjectID, true);
                    }
                    bt_info.button.setTooltip("details", "top");
                let buttonEdit = new SPLINT.DOMElement.Button(ButtonsInner, "edit");
                    buttonEdit.bindIcon("edit");
                    buttonEdit.button.Class("edit");
                    buttonEdit.setTooltip("bearbeiten", "top");
                    buttonEdit.onclick = function(){
                        ProjectHelper.CONVERTER_startProject(item.ProjectID, true);
                    }
                let buttonRemove = new SPLINT.DOMElement.Button(ButtonsInner, "remove");
                buttonRemove.bindIcon("delete");
                buttonRemove.button.Class("remove");
                buttonRemove.onclick = async function(){
                    await ShoppingCart.removeItem(item.ProjectID);
                    ShoppingCart.drawPrices();
                    let cart = await ShoppingCart.get()
                    if(cart.shoppingCart.length == 0){
                        this.emptyBody.state().setActive();
                    }
                    listElement.remove();
                }.bind(this);
                buttonRemove.setTooltip("entfernen", "top");

        }.bind(this);
        this.list.draw();
        ShoppingCart.drawPrices();
        // let code = functionsCouponCodes.getActive(); 
        // if(code != null){ 
        //     if(code.type == "percent"){
        //         PriceDiv_S.setValue("fullPrice", MATH.multiply(ShoppingCart.getFullPrice(this.data), (code.value / 100)));
        //     } else {
        //         let val = MATH.sub(ShoppingCart.getFullPrice(this.data), code.value);
        //             if(val < 0){
        //                 val = 0;
        //             }
        //         PriceDiv_S.setValue("fullPrice", val);
        //     }
        // } else {
        //     PriceDiv_S.setValue("fullPrice", ShoppingCart.getFullPrice(this.data));
        // }
    }
}
