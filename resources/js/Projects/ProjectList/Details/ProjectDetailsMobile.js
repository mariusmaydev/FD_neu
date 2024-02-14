
class ProjectDetails_Mobile {
    constructor(data, index, parent){
        this.parent = parent;
        this.id = "ProjectDetails_" + "_";
        this.data = data;
        this.mainElement = null;
        this._onclose = function(){};
    }
    set onclose(v){
        this._onclose = v;
        this.mainElement.onclose = v;
    }
    async show(drawButtons = true){
        this.productData = await productHelper.getProductData(this.data.Product);
        this.mainElement = new SPLINT.DOMElement.popupWindow(this.id, true)
        this.mainElement.onclose = this._onclose;
        this.mainElement.close = function(){
            this._onclose();
            this.mainElement.content.startAnimation_str("translateProjectDetails_close 0.3s ease forwards", 0.3);
            this.mainElement.background.startAnimation_str("translateProjectDetailsBackground_close 0.3s ease forwards", 0.3).then(function(){
                this.mainElement.element.remove();
            }.bind(this));
        }.bind(this);
        this.contentElement = this.mainElement.content;
        this.contentElement.classList.add("converterStart");
        if(drawButtons){
            this.drawButtons();

        }
            let container = new SPLINT.DOMElement(this.id + "container", "div", this.contentElement);
                container.Class("container");

                // let buttonPrevImg = new SPLINT.DOMElement.Button(container, "PrevImg", "P");
                // buttonPrevImg.Class("PrevImg");
                let data = new SPLINT.Types.autoObject();
            this.lighter = new drawLighter3D(container, this.id, drawLighter3D.PROJECT, this.data.Thumbnail, true, true);
            this.lighter.canvas.setAttribute("showDimensions", false);
            this.lighter.saveContext = false;
            
            // let buttonNextImg = new SPLINT.DOMElement.Button(container, "NextImg", "N");
            //     buttonNextImg.Class("NextImg");
            // this.lighter.canvas.setAttribute("showDimensions", true);
                this.drawInformation();
            
            // listElement.lighter = lighter;
            // listElement.setAttribute("state", data.State);
    }
    hide(){
        if(this.mainElement != null){
            this.mainElement.close();
        }
    }
    drawInformation(){ 
        this.informationDiv = new SPLINT.DOMElement(this.id + "informationDiv", "div", this.contentElement);
        this.informationDiv.Class("informationDiv");
            let content = new SPLINT.DOMElement(this.id + "informationContent", "div", this.informationDiv);
                content.Class("informationContent");
                
                this.buttonSizeMain = new SPLINT.DOMElement.Button.Switch(content, "size", "Maße anzeigen");
                this.buttonSizeMain.Class("buttonSize")
                this.buttonSizeMain.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT)
                this.buttonSizeMain.onactive = function(){
                    this.lighter.send("showDimensions", true);
                    this.lighter.canvas.setAttribute("showDimensions", "true")
                    this.lighter.div.setAttribute("showDimensions", "true")
                    this.buttonSizeSmall.setActive();
                }.bind(this);
                this.buttonSizeMain.onpassive = function(){
                    this.lighter.send("showDimensions", false);
                    this.lighter.canvas.setAttribute("showDimensions", "false")
                    this.lighter.div.setAttribute("showDimensions", "false")
                    this.buttonSizeSmall.unsetActive();
                }.bind(this);

                console.log(this.data);
                let headline = new SPLINT.DOMElement.SpanDiv(content, "headline", this.productData.viewName);
                    headline.Class("headline");

                    let informationTableBody = new SPLINT.DOMElement(this.id + "informationTableBody", "div", content);
                        informationTableBody.Class("informationTableBody");
                        // let informationTableHeadline = new SPLINT.DOMElement.SpanDiv(informationTableBody, "headline", "Produktdetails");
                        //     informationTableHeadline.Class("headline");
                        let informationTable = new SPLINT.DOMElement.Table.TextTable(informationTableBody, "information");
                            informationTable.Class("informationTable");
                            // informationTable.addRow("erstellt", this.data.First_Time);
                            // informationTable.addRow("zuletzt bearbeitet", this.data.Last_Time);
                            console.log(this.productData)
                            for(const e of this.productData.attrs){
                                informationTable.addRow(e.name + ": ", e.value);
                            }
                    // informationTable.addRow("Farbe", this.data.color);
                    // informationTable.addRow("zuletzt bearbeitet", this.data.Last_Time);

                
                // let sizeBody = new SPLINT.DOMElement("sizeBody", "div", content);
                //     sizeBody.Class("sizeBody");
                    // let headline_size = new SPLINT.DOMElement.SpanDiv(sizeBody, "size_headline", "Abmaße");
                    //     headline_size.Class("headline_size");
                    // let sizeContent = new SPLINT.DOMElement("sizeContent", "div", sizeBody);
                    //     sizeContent.Class("sizeContent");
                    //     let sizeHeight = new SPLINT.DOMElement.SpanDiv(sizeContent, "size_height", this.productData.size.height);
                    //         let sizeHeightLabel = new SPLINT.DOMElement.Label(sizeContent, sizeHeight.div, "Höhe");
                    //             sizeHeightLabel.before();
                    //     let sizeWidth = new SPLINT.DOMElement.SpanDiv(sizeContent, "size_width", this.productData.size.width);
                    //         let sizeWidthLabel = new SPLINT.DOMElement.Label(sizeContent, sizeWidth.div, "Breite");
                    //             sizeWidthLabel.before();
                    //     let sizeDeep = new SPLINT.DOMElement.SpanDiv(sizeContent, "size_deep", this.productData.size.deep);
                    //         let sizeDeepLabel = new SPLINT.DOMElement.Label(sizeContent, sizeDeep.div, "Tiefe");
                    //             sizeDeepLabel.before();


                let priceBody = new SPLINT.DOMElement("priceBody", "div", content);
                    priceBody.Class("priceBody");

            let priceElement = new SPLINT.DOMElement.PriceDiv(priceBody, "priceElement", this.productData.price);
            this.drawBuyBody();

            let DescriptionBody = new SPLINT.DOMElement(this.id + "DescriptionBody", "div", this.informationDiv);
                DescriptionBody.Class("descriptionBody");
                let DescriptionContent = new SPLINT.DOMElement.SpanDiv(DescriptionBody, "descriptionContent", this.productData.description);
                    // sizeBody.onmouseenter = function(){
                    //     this.lighter.send("showDimensions", true);
                    // }.bind(this);
                    // sizeBody.onmouseleave = function(){
                    //     this.lighter.send("showDimensions", false);
                    // }.bind(this);

    }
    async drawBuyBody(){
        this.buyBody = new SPLINT.DOMElement(this.id + "_buyBody", "div", this.informationDiv);
        this.buyBody.Class("buyBody");
            // let priceElement = new SPLINT.DOMElement.PriceDiv(this.buyBody, "priceElement", this.productData.price);
            // let buttonContainer_Buy = new SPLINT.DOMElement(this.id + "_buttonContainer_Buy", "div", buttonDiv);
            // buttonContainer_Buy.Class("buttonContainer_Buy");
            let amountInputContainer = new SPLINT.DOMElement(this.id + "_amountInputContainer", "div", this.buyBody);
                amountInputContainer.Class("amountInputContainer");
                let amountInputDesc = new SPLINT.DOMElement.SpanDiv(amountInputContainer, "amountInputDesc", "Anzahl");
                    amountInputDesc.Class("amountInputDesc");
                let amountInput = new SPLINT.DOMElement.InputAmount(amountInputContainer, "amount", 1, "");
            
            let container = new SPLINT.DOMElement("buyBody_container", "div", this.buyBody);
                container.Class("container");
                let buttonContainer_cart = new SPLINT.DOMElement("buttonContainer_cart", "div", container);
                    buttonContainer_cart.Class("buttonContainer_cart")
                    let button_toCart = new SPLINT.DOMElement.Button(buttonContainer_cart, "_toCart", "in den Warenkorb");
                        // button_toCart.bindIcon("add_shopping_cart");
                        button_toCart.onclick = async function(e){
                            e.stopPropagation();
                            let projectID = this.data.ProjectID;
                            if(this.data.State != ProjectHelper.STATE_CART){
                                if(this.data.State == "ADMIN"){
                                    projectID = await ProjectHelper.copy(this.data.ProjectID, "admin");
                                } else {
                                    projectID = await ProjectHelper.copy(this.data.ProjectID);
                                }
                                await ProjectHelper.changeState(projectID, ProjectHelper.STATE_CART);
                            }
                            ShoppingCart.addItem(projectID, this.data.Product, amountInput.amount);
                    }.bind(this);

                let buttonContainer_buy = new SPLINT.DOMElement("buttonContainer_buy", "div", container);
                    buttonContainer_buy.Class("buttonContainer_buy")
                    let button_Buy = new SPLINT.DOMElement.Button(buttonContainer_buy, "_Buy", "jetzt kaufen");
                        // button_Buy.bindIcon("add_shopping_cart");
                        button_Buy.onclick = async function(e){
                            e.stopPropagation();
                            let projectID = this.data.ProjectID;
                            if(this.data.State != ProjectHelper.STATE_CART){
                                if(this.data.State == "ADMIN"){
                                    projectID = await ProjectHelper.copy(this.data.ProjectID, "admin");
                                } else {
                                    projectID = await ProjectHelper.copy(this.data.ProjectID);
                                }
                                await ProjectHelper.changeState(projectID, ProjectHelper.STATE_CART);
                            }
                            await ShoppingCart.addItem(projectID, this.data.Product, amountInput.amount);
                            ShoppingCart.callLocation();
                    }.bind(this);

    }
    async drawButtons(){
        let buttonDiv = new SPLINT.DOMElement(this.id + "_buttonDiv", "div", this.contentElement);
            buttonDiv.Class("buttonDiv");
            let buttonContainer = new SPLINT.DOMElement(this.id + "_buttonContainer", "div", buttonDiv);
                buttonContainer.Class("buttonContainer");

            if(this.data.Original != "true"){
                let button_edit = new SPLINT.DOMElement.Button(buttonContainer, "_edit");
                    if(this.data.State == "ADMIN"){
                        button_edit.value = "verwenden";
                    } else {
                        button_edit.bindIcon("edit");
                    }
                    button_edit.button.onclick = async function(e){
                        e.stopPropagation();
                        if(this.data.State == ProjectHelper.STATE_NORMAL){
                            ProjectHelper.CONVERTER_startProject(this.data.ProjectID, false);
                        } else if(this.data.State == "ADMIN"){
                            let projectID = await ProjectHelper.copy(this.data.ProjectID, "admin");
                            ProjectHelper.CONVERTER_startProject(projectID, false);
                        }
                    }.bind(this);
                  }

                  
                if(this.data.State == ProjectHelper.STATE_NORMAL){
                    let button_remove = new SPLINT.DOMElement.Button(buttonContainer, "_remove");
                        button_remove.bindIcon("delete");
                        button_remove.onclick = function(e){
                            e.stopPropagation();
                            if(this.data.State == ProjectHelper.STATE_NORMAL){
                                ProjectHelper.remove(this.data.ProjectID);
                                // buttonDiv.parentNode.parentNode.remove();
                                // buttonDiv.parentNode.remove();
                                
                                this.parent.remove();
                                this.mainElement.close();
                            }
                        }.bind(this);
                }
                
                this.buttonSizeSmall = new SPLINT.DOMElement.Button.Switch(buttonContainer, "size", "");
                this.buttonSizeSmall.bindIcon("square_foot");
                this.buttonSizeSmall.Class("buttonSize")
                    // buttonSize.button.classList.remove("button_Default");
                    // buttonSize.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT)
                this.buttonSizeSmall.onactive = function(){
                        // this.lighter.send("showDimensions", true);
                        // this.lighter.canvas.setAttribute("showDimensions", "true")
                        // this.lighter.div.setAttribute("showDimensions", "true")
                        this.buttonSizeMain.setActive();
                    }.bind(this);
                this.buttonSizeSmall.onpassive = function(){
                        // this.lighter.send("showDimensions", false);
                        // this.lighter.canvas.setAttribute("showDimensions", "false")
                        // this.lighter.div.setAttribute("showDimensions", "false")
                        this.buttonSizeMain.unsetActive();
                    }.bind(this);

    }
}