
class ProjectDetails {
    constructor(data, index, parent){
        this.parent = parent;
        this.id = "ProjectDetails_" + "_";
        this.data = data;
        this.mainElement = null;
        this.ele = null;
        this._onclose = function(){};
    }
    set onclose(v){
        this._onclose = v;
    }
    async show(drawButtons = true){
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            this.ele = new ProjectDetails_Mobile(this.data, 0, this.parent);
        } else {
            this.ele = new ProjectDetails_Desktop(this.data, 0, this.parent);
        }
        await this.ele.show(drawButtons);
        this.ele.onclose = this._onclose;
    }
    hide(){
        this.ele.hide();
    }
    drawInformation(){ 
        this.informationDiv = new SPLINT.DOMElement(this.id + "informationDiv", "div", this.contentElement);
        this.informationDiv.Class("informationDiv");
            let content = new SPLINT.DOMElement(this.id + "informationContent", "div", this.informationDiv);
                content.Class("informationContent");
                console.log(this.data);
                let headline = new SPLINT.DOMElement.SpanDiv(content, "headline", this.productData.viewName);
                    headline.Class("headline");

                    let informationTableBody = new SPLINT.DOMElement(this.id + "informationTableBody", "div", content);
                        informationTableBody.Class("informationTableBody");
                        let informationTableHeadline = new SPLINT.DOMElement.SpanDiv(informationTableBody, "headline", "Produktdetails");
                            informationTableHeadline.Class("headline");
                        let informationTable = new SPLINT.DOMElement.Table.TextTable(informationTableBody, "information");
                            informationTable.Class("informationTable");
                            for(const e of this.productData.attrs){
                                informationTable.addRow(e.name + ": ", e.value);
                            }

                
                let sizeBody = new SPLINT.DOMElement("sizeBody", "div", content);
                    sizeBody.Class("sizeBody");

                let priceBody = new SPLINT.DOMElement("priceBody", "div", content);
                    priceBody.Class("priceBody");
                    let priceElement = new SPLINT.DOMElement.PriceDiv(priceBody, "priceElement", this.productData.price);
                    let buttonSize = new SPLINT.DOMElement.Button.Switch(priceBody, "size", "Abmaße");
                        buttonSize.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT)
                        buttonSize.onactive = function(){
                            this.lighter.send("showDimensions", true);
                            this.lighter.canvas.setAttribute("showDimensions", "true")
                            this.lighter.div.setAttribute("showDimensions", "true")
                        }.bind(this);
                        buttonSize.onpassive = function(){
                            this.lighter.send("showDimensions", false);
                            this.lighter.canvas.setAttribute("showDimensions", "false")
                            this.lighter.div.setAttribute("showDimensions", "false")
                        }.bind(this);

                    // sizeBody.onmouseenter = function(){
                    //     this.lighter.send("showDimensions", true);
                    // }.bind(this);
                    // sizeBody.onmouseleave = function(){
                    //     this.lighter.send("showDimensions", false);
                    // }.bind(this);

    }
    async drawButtons(){
        let buttonDiv = new SPLINT.DOMElement(this.id + "_buttonDiv", "div", this.informationDiv);
            buttonDiv.Class("buttonDiv");

            if(this.data.Original != "true"){
                let button_edit = new SPLINT.DOMElement.Button(buttonDiv, "_edit");
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
                    let buttonContainer_Buy = new SPLINT.DOMElement(this.id + "_buttonContainer_Buy", "div", buttonDiv);
                        buttonContainer_Buy.Class("buttonContainer_Buy");
                        let amountInput = new SPLINT.DOMElement.InputAmount(buttonContainer_Buy, "amount", 1, "");
                        let button_toCart = new SPLINT.DOMElement.Button(buttonContainer_Buy, "_toCart");
                            button_toCart.bindIcon("add_shopping_cart");
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
                        let button_Buy = new SPLINT.DOMElement.Button(buttonContainer_Buy, "_Buy", "jetzt kaufen");
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
                // if(data.State == ProjectHelper.STATE_NORMAL){
                //     let button_copy = new SPLINT.DOMElement.Button(buttonDiv, "_copy");
                //         button_copy.bindIcon("content_copy");
                //         console.log(data);
                //         button_copy.onclick = async function(e){
                //             e.stopPropagation();
                //             await ProjectHelper.copy(data.ProjectID);
                //             this.data = (await ProjectHelper.getAll("NORMAL"));
                //             this.draw();
                //         }.bind(this);
                // }
                  
                if(this.data.State == ProjectHelper.STATE_NORMAL){
                    let button_remove = new SPLINT.DOMElement.Button(buttonDiv, "_remove");
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

            //       let button_edit = new SPLINT.DOMElement.Button(buttonDiv, this.id + "_edit");
            //       button_edit.bindIcon("edit");
            //       button_edit.setTooltip("bearbeiten", "top");
            //       button_edit.button.onclick = function(e){
            //         e.stopPropagation();
            //         if(this.isAdmin){
            //           let pID = ProjectHelper.copy(this.data.ProjectID, "ADMIN");
            //           if(this.data.State == ProjectHelper.STATE_CART){
            //             ProjectHelper.CONVERTER_startProject(pID, true);
            //           } else {
            //             ProjectHelper.CONVERTER_startProject(pID, false);
            //           }
            //         } else {
            //           if(this.data.State == ProjectHelper.STATE_CART){
            //             ProjectHelper.CONVERTER_startProject(this.data.ProjectID, true);
            //           } else {
            //             ProjectHelper.CONVERTER_startProject(this.data.ProjectID, false);
            //           }
            //         }
            //       }.bind(this);
            //   if(await SPLINT.SessionsPHP.get("ADMIN", false)){
            //     let button_remove = new SPLINT.DOMElement.Button(buttonDiv, this.id + "_remove");
            //         button_remove.bindIcon("delete");
            //         button_remove.setTooltip("löschen", "top");
            //         button_remove.onclick = function(e){
            //           e.stopPropagation();
            //           ProjectHelper.remove(this.data.ProjectID);
            //           if(this.data.State == ProjectHelper.STATE_CART){
            //             ShoppingCart.removeItem(this.data.ProjectID);
            //           }
            //           buttonDiv.parentNode.remove();
            //           // this.draw();
            //         }.bind(this);
            //   }
            //   let button_toCart = new SPLINT.DOMElement.Button(buttonDiv, this.id + "_toCart");
            //       button_toCart.bindIcon("add_shopping_cart");
            //       button_toCart.setTooltip("zur Auswahl hinzufügen", "top");
            //       button_toCart.button.onclick = async function(e){
            //           e.stopPropagation();
            //           let projectID = this.data.ProjectID;
            //           if(this.data.State != ProjectHelper.STATE_CART){
            //             projectID = ProjectHelper.copy(this.data.ProjectID, await SPLINT.SessionsPHP.get("USER_ID", false));
            //             ProjectHelper.changeState(projectID, ProjectHelper.STATE_CART);
            //           }
            //           if(this.data.EPType == "GOLD"){
            //             ShoppingCart.addItem(projectID, productHelper.LIGHTER_GOLD, 1);
            //           } else {
            //             ShoppingCart.addItem(projectID, productHelper.LIGHTER_CHROME, 1);
            //           }
            //       }.bind(this);
            //   let button_remove = new SPLINT.DOMElement.Button(buttonDiv, this.id + "_remove");
            //       button_remove.bindIcon("delete");
            //       button_remove.setTooltip("löschen", "top");
            //       button_remove.onclick = function(e){
            //         e.stopPropagation();
            //         ProjectHelper.remove(this.data.ProjectID);
            //         if(this.data.State == ProjectHelper.STATE_CART){
            //           ShoppingCart.removeItem(this.data.ProjectID);
            //         }
            //         this.parent.remove();
            //         this.mainElement.close();
            //         // this.draw();
            //       }.bind(this);
    }
}