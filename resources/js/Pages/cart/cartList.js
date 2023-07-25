
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
        if(this.data.length == 0){
            SPLINT.Events.onLoadingComplete.dispatch();
        }
        this.listHead = new SPLINT.DOMElement(this.id + "ItemListHead", "div", this.listBody);
        this.listHead.Class("itemListHead");
        SPLINT.Events.onLoadingComplete = function(){
            this.listHead.setAttribute("loaded", true);;
        }.bind(this);
            let descDiv = this.listHead.newDiv("ItemList_head_description", "description");
                new SPLINT.DOMElement.SpanDiv(descDiv, "inner", "Beschreibung");

            let itemPriceDiv = this.listHead.newDiv("ItemList_head_itemPrice", "itemPrice");
                new SPLINT.DOMElement.SpanDiv(itemPriceDiv, "inner", "Stückpreis");

            let amountDiv = this.listHead.newDiv("ItemList_head_amount", "amount");
                new SPLINT.DOMElement.SpanDiv(amountDiv, "inner", "Anzahl");

            let priceDivEle = this.listHead.newDiv("ItemList_head_price", "price");
                new SPLINT.DOMElement.SpanDiv(priceDivEle, "inner", "Preis");
        this.list = new Table(this.listBody, "ItemList", this.data);
        // this.list.func_drawFirstListElement = function(listElement){
        //     let descDiv = listElement.newDiv("ItemList_head_description", "description");
        //         new SPLINT.DOMElement.SpanDiv(descDiv, "inner", "Beschreibung");

        //     let itemPriceDiv = listElement.newDiv("ItemList_head_itemPrice", "itemPrice");
        //         new SPLINT.DOMElement.SpanDiv(itemPriceDiv, "inner", "Stückpreis");

        //     let amountDiv = listElement.newDiv("ItemList_head_amount", "amount");
        //         new SPLINT.DOMElement.SpanDiv(amountDiv, "inner", "Anzahl");

        //     let priceDiv = listElement.newDiv("ItemList_head_price", "price");
        //         new SPLINT.DOMElement.SpanDiv(priceDiv, "inner", "Preis");
        // }
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
                let lighter = new drawLighter3D(lighterEle, lighterEle.id, "PROJECT", data.Thumbnail);
            })

            let infoDivInner = infoEle.newDiv("/ID/info_inner", "inner");
                let infoText = new SPLINT.DOMElement.SpanDiv(infoDivInner, "text", "123456789-123456789");
                    infoText.div.Class("text");
                let info_buttons = infoDivInner.newDiv("/ID/info_buttons", "buttons");

            let itemPriceDivInner = itemPriceDiv.newDiv("/ID/item_price_inner", "inner");
            console.dir(productData);
            productData.then(function(data){
                console.log(parseInt(data.price))
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
                // let bt_edit = new Button(ButtonsInner, "edit");
                //     bt_edit.bindIcon("edit");
                //     bt_edit.onclick = function(){
                //         Project.CONVERTER_startProject(projectData.ProjectID, true);
                //     }
                //     bt_edit.button.setTooltip("bearbeiten", "top");
                    
                // let bt_info = new Button(ButtonsInner, "info");
                //     bt_info.bindIcon("info");
                //     bt_info.onclick = function(){
                //         Project.CONVERTER_startProject(projectData.ProjectID, true);
                //     }
                //     bt_info.button.setTooltip("details", "top");
                let buttonEdit = new SPLINT.DOMElement.Button(ButtonsInner, "edit");
                    buttonEdit.bindIcon("edit");
                    buttonEdit.button.Class("edit");
                    buttonEdit.button.setTooltip("bearbeiten", "top");
                    buttonEdit.onclick = function(){
                        ProjectHelper.CONVERTER_startProject(item.ProjectID, true);
                    }
                let buttonRemove = new SPLINT.DOMElement.Button(ButtonsInner, "remove");
                buttonRemove.bindIcon("delete");
                buttonRemove.button.Class("remove");
                buttonRemove.onclick = async function(){
                    await ShoppingCart.removeItem(item.ProjectID);
                    ShoppingCart.drawPrices();
                    console.log(ShoppingCart.get())
                    listElement.remove();
                }.bind(this);
                buttonRemove.button.setTooltip("entfernen", "top");

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
