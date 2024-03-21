
class ProjectDetails_Desktop {
    constructor(data, parent, lighterParent = null){
        this.lighterParent = lighterParent;
        this.parent = parent;
        this.id = "ProjectDetails_" + "_";
        this.data = data;
        this.mainElement = null;
        this._onclose = function(){};
        this.HELPER = new ProjectDetailsHelper(this);
    }
    set onclose(v){
        this._onclose = v;
        this.mainElement.onclose = v;
    }
    async show(drawButtons = true){
        this.colorList = await productHelper.getColors();
        this.productDataFull = await productHelper.getProducts();
        // console.dir(this.data.Product)
        this.productData = this.productDataFull[this.data.Product]
        this.mainElement = new SPLINT.DOMElement.popupWindow(this.id, true)
        this.mainElement.onclose = this._onclose;
        this.mainElement.close = async function(){
            this._onclose();
            if(this.lighterParent != null){
                productHelper.getColorForID(this.data.Color).then(function(color){
                    this.lighterParent.send("changeColor", color);
                    this.lighterParent.send("changeEPType", this.data.EPType);
                }.bind(this));
            }
            this.mainElement.content.startAnimation_str("translateProjectDetails_close 0.3s ease forwards", 0.3);
            this.mainElement.background.startAnimation_str("translateProjectDetailsBackground_close 0.3s ease forwards", 0.3).then(function(){
                this.mainElement.element.remove();
                // this.lighterParent.send("changeColor", this.color);
                // console.log(this.productData, )
            }.bind(this));
        }.bind(this);
        this.contentElement = this.mainElement.content;
        this.contentElement.classList.add("converterStart");

            this.headContainer = new SPLINT.DOMElement(this.id + "headContainer", "div", this.contentElement);
            this.headContainer.Class("headContainer")
                let headContainerContent = new SPLINT.DOMElement.SpanDiv(this.headContainer, "headline", this.productData.viewName);
                    headContainerContent.Class("headline");


            this.mainContainer = new SPLINT.DOMElement(this.id + "mainContainer", "div", this.contentElement);
            this.mainContainer.Class("mainContainer");

                this.drawLeftPart();
                this.drawInformation();
                if(drawButtons){
                    this.drawBuyBody();
                    this.drawButtons();
                }

                let buttonDivLeft = new SPLINT.DOMElement(this.id + "-ButtonDivLeft", "div", this.contentElement);
                    buttonDivLeft.Class("buttonDivLeft");
                    // let buttonSize  = this.HELPER.drawButtonSize(buttonDivLeft);
                    // let buttonColor = this.HELPER.drawButtonColor(buttonDivLeft);
                    // let buttonEdit  = this.HELPER.drawButtonEdit(buttonDivLeft);
    }
    drawLeftPart(){
        let ImageContainerMain = new SPLINT.DOMElement(this.id + "ImageContainerMain", "div", this.mainContainer);
            ImageContainerMain.Class("ImageContainerMain");

        let ImageContainerScroll = new SPLINT.DOMElement(this.id + "ImageContainerScroll", "div", ImageContainerMain);
            ImageContainerScroll.Class("ImageContainerScroll");
            let ImageContainerInner = new SPLINT.DOMElement(this.id + "ImageContainerInner", "div", ImageContainerScroll);
                ImageContainerInner.Class("ImageContainerInner");

                if(this.lighter != undefined) {
                    this.lighter.div.remove();
                    this.lighter = undefined;
                }
                this.lighter = new drawLighter3D(ImageContainerInner, this.id, drawLighter3D.PROJECT, this.data.Thumbnail, true, true, this.data.EPType);
                this.lighter.canvas.setAttribute("showDimensions", false);
                this.lighter.canvas.setAttribute("changeColor", "base");
                this.lighter.saveContext = false;
                this.lighter.div.state().setActive();

                this.lighter.promise.then(function(){
                    let color = this.colorList[this.data.Color];
                    if(color == null || color == undefined){
                        color = "base";
                        return;
                    }
                    this.lighter.send("changeColor", color);
                }.bind(this))
                this.drawImageMain(ImageContainerInner);

        let buttonsContainer = new SPLINT.DOMElement(this.id + "buttonsContainer", "div", ImageContainerMain);
            buttonsContainer.Class("buttonsContainer");
            
        let ImageContainerBT_left = new SPLINT.DOMElement.Button(buttonsContainer, "ImageContainerBT_left");
            ImageContainerBT_left.Class("btLeft");
            ImageContainerBT_left.bindIcon("chevron_left");
            ImageContainerBT_left.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_NONE)

            let ImagePreviewContainer = new SPLINT.DOMElement(this.id + "imagePreviewContainer", "div", buttonsContainer);
                ImagePreviewContainer.Class("imagePreviewContainer");

                let imgEleBody = new SPLINT.DOMElement(this.id + "PrevimgDiv_3D", "div", ImagePreviewContainer);
                    imgEleBody.Class("imgEleBody");
                    imgEleBody.classList.add("L3D");

                    imgEleBody.onclick = function(){
                        let all = ImageContainerInner.children;
                        for(const ele of all){
                            ele.state().unsetActive();
                        }
                        let all2 = ImagePreviewContainer.children;
                        for(const ele of all2){
                            ele.state().unsetActive();
                        }
                        let ele = this.lighter.div;
                            ele.state().setActive();
                            imgEleBody.state().setActive();
                    }.bind(this)
                    let canvasEleImage = new SPLINT.DOMElement(this.id + "PrevimgEle_3D", "img", imgEleBody);

                        this.lighter.promise.then(async function(){
                            let data = this.lighter.canvas.toDataURL("image/png", 1);
                            canvasEleImage.src = data;
                        }.bind(this))

                        this.drawImageList(ImagePreviewContainer);
        
            ImageContainerBT_left.onclick = function(){
                let dif = ImagePreviewContainer.scrollWidth / ImagePreviewContainer.children.length;
                let aim = ImagePreviewContainer.scrollLeft - dif;
                console.dir(ImagePreviewContainer.children)
                let an = function(){
                    if(ImagePreviewContainer.scrollLeft > aim && ImagePreviewContainer.scrollLeft > 0){
                        ImagePreviewContainer.scrollLeft -= 5
                        requestAnimationFrame(an);
                    }
                }
                an();
            }

        let ImageContainerBT_right = new SPLINT.DOMElement.Button(buttonsContainer, "ImageContainerBT_right");
            ImageContainerBT_right.Class("btRight");
            ImageContainerBT_right.bindIcon("chevron_right");
            ImageContainerBT_right.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_NONE);
            ImageContainerBT_right.onclick = function(){
                let dif = ImagePreviewContainer.scrollWidth / ImagePreviewContainer.children.length;
                let aim = ImagePreviewContainer.scrollLeft + dif;
                console.dir(ImagePreviewContainer)
                let maxScroll = ImagePreviewContainer.scrollWidth - ImageContainerScroll.clientWidth;
                console.log(maxScroll)
                let an = function(){
                    if(ImagePreviewContainer.scrollLeft <= aim && ImagePreviewContainer.scrollLeft <= maxScroll+5){
                        ImagePreviewContainer.scrollLeft += 5
                        requestAnimationFrame(an);
                    }
                }
                an();
            }
    }
    clearImages(){
        let eles = document.getElementsByClassName("stdImgContainer");
        for(const ele of Object.values(eles)){
            ele.remove();
        }
    }
    drawImageMain(parent = document.getElementById(this.id + "ImageContainerInner")){
        for(const [name, url] of Object.entries(this.productData.ImgPath)){
            let imgEleBody = new SPLINT.DOMElement(this.id + "imgDiv_" + name, "div", parent);
                imgEleBody.Class("imgEleBody");
                imgEleBody.classList.add("stdImgContainer");
                let imgEleImage = new SPLINT.DOMElement(this.id + "imgEle_" + name, "img", imgEleBody);
                    imgEleImage.src = url;
        }
    }
    drawImageList(parent = document.getElementById(this.id + "imagePreviewContainer")){
        for(const [name, url] of Object.entries(this.productData.ImgPath)){
            let imgEleBody = new SPLINT.DOMElement(this.id + "PrevimgDiv_" + name, "div", parent);
                imgEleBody.Class("imgEleBody");
                imgEleBody.classList.add("stdImgContainer");
                let imgEleImage = new SPLINT.DOMElement(this.id + "PrevimgEle_" + name, "img", imgEleBody);
                    imgEleImage.src = url;

                    imgEleBody.onclick = function(){
                        let all = document.getElementById(this.id + "ImageContainerInner").children;
                        for(const ele of all){
                            ele.state().unsetActive();
                        }
                        let all2 = document.getElementById(this.id + "imagePreviewContainer").children;
                        for(const ele of all2){
                            ele.state().unsetActive();
                        }
                        let ele = document.getElementById(this.id + "imgDiv_" + name);
                            ele.state().setActive();
                            imgEleBody.state().setActive();
                    }.bind(this)
        }
    }
    hide(){
        if(this.mainElement != null){
            this.mainElement.close();
        }
    }
    drawInformation(){ 
        this.informationDiv = new SPLINT.DOMElement(this.id + "informationDiv", "div", this.mainContainer);
        this.informationDiv.Class("informationDiv");
            let content = new SPLINT.DOMElement(this.id + "informationContent", "div", this.informationDiv);
                content.Class("informationContent");
                let headline = new SPLINT.DOMElement.SpanDiv(content, "headline", this.productData.viewName);
                    headline.Class("headline");

                let horizontalLine = new SPLINT.DOMElement.HorizontalLine(content);

                let priceBody = new SPLINT.DOMElement("priceBody", "div", content);
                    priceBody.Class("priceBody");
                    this.priceElement = new SPLINT.DOMElement.PriceDiv(priceBody, "priceElement", this.productData.price);

                new SPLINT.DOMElement.HorizontalLine(content);


                let descBody = new SPLINT.DOMElement("descriptionBody_details", "div", content);
                    descBody.Class("descBody");
                    let descHeadline = new SPLINT.DOMElement.SpanDiv(descBody, "headline", "Beschreibung");
                        descHeadline.Class("headline");
                    let descContent = new SPLINT.DOMElement.SpanDiv(descBody, "descriptionContent", this.productData.description);
                        descContent.Class("descContent");

                let horizontalLine0 = new SPLINT.DOMElement.HorizontalLine(content);

                let EPTypeContainer = new SPLINT.DOMElement(this.id + "EPTypeContainer", "div", content);
                    EPTypeContainer.Class("EPTypeContainer");
                    let EPTypeContainerHeadline = new SPLINT.DOMElement.SpanDiv(EPTypeContainer, "headline", "Beschichtung");
                        EPTypeContainerHeadline.Class("headline");
                    let EPTypeContainerContent = new SPLINT.DOMElement(this.id + "EPTypeContainerContent", "div", EPTypeContainer);
                        EPTypeContainerContent.Class("contentElement");
                    
                    this.HELPER.drawEPTypeMenu(EPTypeContainerContent);

                    let horizontalLine1 = new SPLINT.DOMElement.HorizontalLine(content);
                let ColorContainer = new SPLINT.DOMElement(this.id + "colorContainer", "div", content);
                    ColorContainer.Class("colorContainer");
                    let ColorContainerHeadline = new SPLINT.DOMElement.SpanDiv(ColorContainer, "headline", "Farbe");
                        ColorContainerHeadline.Class("headline");
                    let ColorContainerContent = new SPLINT.DOMElement(this.id + "colorContainerContent", "div", ColorContainer);
                        ColorContainerContent.Class("contentElement");

                    this.HELPER.drawColorMenu(ColorContainerContent)

                    let horizontalLine2 = new SPLINT.DOMElement.HorizontalLine(content);

                let informationTableBody = new SPLINT.DOMElement(this.id + "informationTableBody", "div", content);
                    informationTableBody.Class("informationTableBody");
                    let informationTableHeadline = new SPLINT.DOMElement.SpanDiv(informationTableBody, "headline", "Merkmale");
                        informationTableHeadline.Class("headline");
                    let informationTable = new SPLINT.DOMElement.Table.TextTable(informationTableBody, "information");
                        informationTable.Class("informationTable");
                        for(const e of this.productData.attrs){
                            informationTable.addRow(e.name + " ", e.value);
                        }

    }
    async drawButtons(){
        let parent = this.informationDiv;
        if(this.buyBody != undefined){
            parent = this.buyBody;
        }
        let buttonDiv = new SPLINT.DOMElement(this.id + "_buttonDiv", "div", parent);
            buttonDiv.Class("buttonDiv");
            if(this.buyBody != undefined){
                buttonDiv.before(parent.children[0])
            }

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
                let button_toCart = new SPLINT.DOMElement.Button(buttonDiv, "_toCart");
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
                        ShoppingCart.addItem(projectID, this.data.Product, 1);
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
                  
                // if(this.data.State == ProjectHelper.STATE_NORMAL){
            let buttonSize = new SPLINT.DOMElement.Button.Switch(buttonDiv, "size", "Maße anzeigen");
                buttonSize.Class("size");
                buttonSize.bindIcon("straighten");
                // buttonSize.setStyleTemplate(SPLINT.DOMElement.Button.STATE_NORMAL)
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
                // }
    }
    
    async drawBuyBody(){
        this.buyBody = new SPLINT.DOMElement(this.id + "_buyBody", "div", this.informationDiv);
        this.buyBody.Class("buyBody");
            // let priceElement = new SPLINT.DOMElement.PriceDiv(this.buyBody, "priceElement", this.productData.price);
            // let buttonContainer_Buy = new SPLINT.DOMElement(this.id + "_buttonContainer_Buy", "div", buttonDiv);
            // buttonContainer_Buy.Class("buttonContainer_Buy");
            // let amountInputContainer = new SPLINT.DOMElement(this.id + "_amountInputContainer", "div", this.buyBody);
            //     amountInputContainer.Class("amountInputContainer");
            //     let amountInputDesc = new SPLINT.DOMElement.SpanDiv(amountInputContainer, "amountInputDesc", "Anzahl");
            //         amountInputDesc.Class("amountInputDesc");
            //     let amountInput = new SPLINT.DOMElement.InputAmount(amountInputContainer, "amount", 1, "");
            
            let container = new SPLINT.DOMElement("buyBody_container", "div", this.buyBody);
                container.Class("container");
                let buttonContainer_cart = new SPLINT.DOMElement("buttonContainer_cart", "div", container);
                    buttonContainer_cart.Class("buttonContainer_cart")
                    let button_toCart = new SPLINT.DOMElement.Button(buttonContainer_cart, "_toCart");
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
                            ShoppingCart.addItem(projectID, this.data.Product, 1);
                    }.bind(this);

                let buttonContainer_buy = new SPLINT.DOMElement("buttonContainer_buy", "div", container);
                    buttonContainer_buy.Class("buttonContainer_buy")
                    let button_Buy = new SPLINT.DOMElement.Button(buttonContainer_buy, "_Buy", "jetzt kaufen");
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

}