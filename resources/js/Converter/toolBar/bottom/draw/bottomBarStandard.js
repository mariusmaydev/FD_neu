class BottomBar_Standard {
    constructor(parent) {
        this.parent = parent;
        this.id = "BottomBar_Standard_";
    }
    draw(){
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("conv_bottom_bar_std");
        this.parent.setAttribute("name", "std");
        this.buttonAddElement();
        this.buttonNewText();
        this.buttonColor();
        this.buttonProductInformation();
        this.buttonFinish();
    } 
    buttonUploadImage(){
        this.button_UploadImage = new SPLINT.DOMElement.Button(this.mainElement, "button_UploadImage");
        this.button_UploadImage.Class("button_UploadImage");
        this.button_UploadImage.bindIcon("add");
        this.button_UploadImage.Description = "Bild hochladen";
        this.button_UploadImage.onclick = function(){

        }.bind(this);

    }
    buttonFromUnsplash(){
        this.button_FromUnsplash = new SPLINT.DOMElement.Button(this.mainElement, "button_FromUnsplash");
        this.button_FromUnsplash.Class("button_FromUnsplash");
        this.button_FromUnsplash.bindIcon("add");
        this.button_FromUnsplash.Description = "Bild auswählen";
        this.button_FromUnsplash.onclick = function(){

        }.bind(this);
    }
    buttonNewText(){
        this.button_NewText = new SPLINT.DOMElement.Button(this.mainElement, "button_NewText");
        this.button_NewText.Class("button_NewText");
        this.button_NewText.bindIcon("add");
        this.button_NewText.Description = "Text hinzufügen";
        this.button_NewText.onclick = async function(){
            let res = await ConverterHelper.addText();
            let SubWindow = new SPLINT.DOMElement.popupWindow("editText", true, true);
            SubWindow.buttonClose.bindIcon("check");
            SubWindow.Class("editText_mobile");
            SubWindow.onclose = function(){
                CONVERTER_STORAGE.toolBar.focusElement("txt", res[0].TextID);
            }
            let headline = new SPLINT.DOMElement.SpanDiv(SubWindow.content, "headline", "Verfasse einen Text.");
                headline.Class("headline");
            let textInput = new SPLINT.DOMElement.InputText(SubWindow.content, "editTextInputDiv", "test"); 
                textInput.textarea.focus();
                textInput.setValue(res[0].TextValue);
                textInput.oninput = function(){
                    let TOOLS = TextTools.getTextToolsForID(res[0].TextID);
                        TOOLS.setValue(textInput.Value);
                }.bind(this);
        }.bind(this);
    }
    buttonAddElement(){
      this.button_AddElement = new SPLINT.DOMElement.Button(this.mainElement, "AddElement_button");
      this.button_AddElement.Class("AddElement");
      this.button_AddElement.bindIcon("add");
      this.button_AddElement.Description = "Bild hinzufügen";
      this.button_AddElement.onclick = function(e){
            this.button_AddElement.button.state().setActive();
          let t = new Converter_BottomBar_floatingDiv_block("buttons");
          t.body.before(this.button_AddElement.span);
          
          this.button_upload = new SPLINT.DOMElement.Button.FileUpload(t.content, "ImageUploadInput", "image/*", ConverterHelper.CONVERTER_IMG);
          this.button_upload.bindIcon("upload_file");
            let spanText_btUpload = new SPLINT.DOMElement(this.button_upload.button.id + "spanText", "span", this.button_upload.button);  
                spanText_btUpload.Class("text");
                spanText_btUpload.innerHTML = "Bild hochladen";
          this.button_upload.button.setTooltip("Bild hochladen", "top");
            this.button_upload.button.ontouchend = function(event){
                event.preventDefault();
                event.stopPropagation();
                this.button_upload.button.click();
                this.button_AddElement.button.state().unsetActive();
            }.bind(this);
          this.button_upload.onsuccess = function(data){
            ConverterHelper.uploadImage(data);
          }.bind(this);

          this.button_ImageMenu = new SPLINT.DOMElement.Button(t.content, "OpenImageMenu");
          this.button_ImageMenu.bindIcon("image_search");
            let spanText_btImgMenu = new SPLINT.DOMElement(this.button_ImageMenu.button.id + "spanText", "span", this.button_ImageMenu.button);  
                spanText_btImgMenu.Class("text");
                spanText_btImgMenu.innerHTML = "Bild finden";
          this.button_ImageMenu.button.setTooltip("Bild laden", "top");
          this.button_ImageMenu.button.onclick = function(){
                this.button_AddElement.button.state().unsetActive();
                ConverterHelper.openImageMenu();
              }.bind(this);
            this.button_ImageMenu.button.ontouchend = function(event){
                event.preventDefault();
                event.stopPropagation();
                this.button_ImageMenu.button.click();
                this.button_AddElement.button.state().unsetActive();
            }.bind(this);
        }.bind(this);
    }
    buttonColor(){
      this.button_Color = new SPLINT.DOMElement.Button(this.mainElement, "ChangeColor_button");
      this.button_Color.bindIcon("auto_awesome");
      this.button_Color.Class("Color");
      this.button_Color.Description = "Farbe";
      this.button_Color.onclick = async function(){
        let floatingDiv = new Converter_BottomBar_floatingDiv_block("buttons_Color");
            floatingDiv.body.before(this.button_Color.span);

            let colors = await productHelper.getColors();
            for(const [key, value] of Object.entries(colors)){
                let product = await productHelper.getProduct_ColorEPType(key, DSProject.Storage.EPType);

                if(product == false){
                   continue;
                }
                let btColor = new SPLINT.DOMElement.Button(floatingDiv.content, "btColor_" + key, value.name )
                    btColor.Class("btColor");
                    btColor.setAttribute("colorid", key);
                    btColor.span.style.color = key;
                    btColor.button.style.backgroundColor = value.hex.replace('0x', '#');
                    if(key == "base"){
                        btColor.button.style.backgroundImage = "url(" + SPLINT.projectRootPath + "../data/images/LighterBaseColor.png)";
                        btColor.span.style.color = "gray";
                    }
                    btColor.button.ontouchend = async function(event){
                        // event.preventDefault();
                        event.stopPropagation();
                        CONVERTER_STORAGE.lighter3D.send("changeColor", value);
                        DSProject.Storage.Product = product.name;
                        DSProject.Storage.Color = key;
                        await DSProject.saveAsync();
                        // this.drawEPTypeMenu();
                    }.bind(this);
            }

            // let div_Gold = new SPLINT.DOMElement(floatingDiv.content.id + "_BodyGold", "div", floatingDiv.content);
            //     div_Gold.setAttribute("value", "GOLD");
            //     let bt_Gold     = new SPLINT.DOMElement.Button.Switch(div_Gold, 'gold', "Gold");
            //         bt_Gold.onactive = function(){
            //             ConverterHelper.setEPType("GOLD");
            //             div_Chrome.state().unsetActive();
            //             bt_Chrome.unsetActive();
            //         }.bind(this);
            //         bt_Gold.onchange = function(state, e){
            //             e.stopPropagation();
            //         }

            // let div_Chrome = new SPLINT.DOMElement(floatingDiv.content.id + "_BodyChrome", "div", floatingDiv.content);
            //     div_Chrome.setAttribute("value", "CHROME");
            //     let bt_Chrome   = new SPLINT.DOMElement.Button.Switch(div_Chrome, 'chrome', "Chrome");
            //         bt_Chrome.onactive = function(){
            //             ConverterHelper.setEPType("CHROME");
            //             div_Gold.state().unsetActive();
            //             bt_Gold.unsetActive();
            //         }.bind(this);
            //         bt_Chrome.onchange = function(state, e){
            //             e.stopPropagation();
            //         }

            // if(DSProject.Storage.EPType == "CHROME"){
            //     bt_Chrome.setActive();
            // } else {
            //     bt_Gold.setActive();
            // }
        }.bind(this);
      }
      buttonProductInformation(){
        this.button_ProductInformation = new SPLINT.DOMElement.Button(this.mainElement, "ProductInformation");
        this.button_ProductInformation.bindIcon("info");
        this.button_ProductInformation.Description = "Informationen";
        this.button_ProductInformation.button.onclick = async function(){
            let data = await ProjectHelper.get();
                data.Thumbnail = data.Thumbnail + "?" + Math.round(Math.random() * 1000);
                
            let projectDetails = new ProjectDetails(data, document.body);
                projectDetails.show();
        //  SPLINT.Tools.Location_old.goto(PATH.location.productInfo).setHash("ssadf").call();
        }
      }
      buttonFinish(){
        this.button_finish = new SPLINT.DOMElement.Button(this.mainElement, "Finish");
        this.button_finish.bindIcon("check");
        this.button_finish.Class("finish");
        this.button_finish.Description = "Fertig";
        this.button_finish.button.onclick = function(){
            this.button_finish.button.state().setActive();
            let floatingDiv = new Converter_BottomBar_floatingDiv_block("buttons_finish");
                floatingDiv.body.before(this.button_finish.span);
                Converter_closeButtons.draw(floatingDiv.content, "bottomBar", false);
        //  SPLINT.Tools.Location_old.goto(PATH.location.productInfo).setHash("ssadf").call();
        }.bind(this);

      }
    //   buttonListElements() {
    //     this.button_ListElements = new SPLINT.DOMElement.Button(this.mainElement, "ListElements");
    //     this.button_ListElements.bindIcon("info");
    //     this.button_ListElements.Description = "Elemente";
    //     this.button_ListElements.button.onclick = function(){
    //      SPLINT.Tools.Location_old.goto(PATH.location.productInfo).setHash("ssadf").call();
    //     }

    //   }
}