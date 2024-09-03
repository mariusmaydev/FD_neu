
class drawCartRight {
    constructor(parent){
        this.parent = parent;
        this.id = "cartRight_";
        this.mainElement = parent.newDiv(this.id + "main", "cartRightMain");
        this.rightBody = this.mainElement.newDiv("/ID/rightBody", "RightBody");
        this.price = 0;
        this.draw();
    }
    draw(){
        let conclusionDiv = this.rightBody.newDiv("conclusion", "conclusion");
            // SPLINT.Events.onLoadingComplete = function(){
                conclusionDiv.setAttribute("loaded", true);
            // }
            // SPLINT.Events.onLoadingComplete.dispatch();
            let sumBody = conclusionDiv.newDiv("conclusion_price_body", "sumBody");
                let conclusionHeadline = new SPLINT.DOMElement.SpanDiv(sumBody, "conclusion_Headline", "Zusammenfassung");
                    conclusionHeadline.Class("headline");
                let horizontalLine = new SPLINT.DOMElement.HorizontalLine(sumBody);
                let priceTable = new SPLINT.DOMElement.Table.Grid(sumBody, "conclusion_price_table", 3, 2);
                    new SPLINT.DOMElement.SpanDiv(priceTable.getData(0, 0), "fullPrice_label", "Zwischensumme");
                    new SPLINT.DOMElement.PriceDiv(priceTable.getData(0, 1), "fullPrice", this.price);

                    new SPLINT.DOMElement.SpanDiv(priceTable.getData(1, 0), "fullPrice_coupon_label", "Rabatt");
                    new SPLINT.DOMElement.PriceDiv(priceTable.getData(1, 1), "fullPrice_coupon", 0);

                    new SPLINT.DOMElement.SpanDiv(priceTable.getData(2, 0), "fullPrice_end_label", "gesammt");
                    new SPLINT.DOMElement.PriceDiv(priceTable.getData(2, 1), "fullPrice_end", this.price);

            let mwstDiv = new SPLINT.DOMElement.SpanDiv(conclusionDiv, "conclusion_price_mwst", "inkl. MwSt");
                mwstDiv.div.Class("mwstBody");
            
            let buttonBody = new SPLINT.DOMElement(this.id + "buttonBody", "div", conclusionDiv);
                buttonBody.Class("buttonBody");
                let buttonBuy = new SPLINT.DOMElement.Button(buttonBody, "buy", "jetzt kaufen");
                    buttonBuy.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
                    buttonBuy.onclick = function(){
                        // SPLINT.Tools.Location.URL = PATH.location.checkout;
                        // SPLINT.Tools.Location.addHash("address").call();
                        LoaderMain.goto("checkout", "address");
                        //SPLINT.Tools.Location_old.goto(PATH.location.checkout).call();
                    }

        let codeDiv = this.rightBody.newDiv("code", "code");
        SPLINT.Events.onLoadingComplete = function(){
            codeDiv.setAttribute("loaded", true);
        }
            let codeInput = new SPLINT.EX.DOMElement.Input(codeDiv, "Rabattcode");
                let activeCouponCode = functionsCouponCodes.getActive();
                if(activeCouponCode != null && activeCouponCode.code != null){
                    codeInput.value = activeCouponCode.code.code;
                }
            let bt_check = new SPLINT.DOMElement.Button(codeDiv, "checkCode", "Code prüfen");
                bt_check.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
                bt_check.onclick = async function(){
                    let result = await functionsCouponCodes.check(codeInput.value);
                    console.log(result);
                    if(result == null){
                        codeInput.invalid("Code nicht korrekt");
                        return;
                    } 
                    functionsCouponCodes.activateForUser(codeInput.value);
                    
                    ShoppingCart.drawPrices();
                };
                codeInput.onEnter = function(){
                    codeInput.input
                };
    }
    setPrice(price){
        this.price = price;
        this.draw();
    }
}