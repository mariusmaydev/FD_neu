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
        // this.buttonFromUnsplash();
        this.buttonNewText();
        this.buttonEPType();
        this.buttonProductInformation();
        this.buttonFinish();
        // this.closeButtonsContainer = new SPLINT.DOMElement(this.id + "close_buttons_container", "div", this.mainElement);
        // this.closeButtonsContainer.Class("close_buttons_container");
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
            console.log(res)
            let SubWindow = new SPLINT.DOMElement.popupWindow("editText", true);
            SubWindow.buttonClose.bindIcon("check");
            SubWindow.Class("editText_mobile");
            SubWindow.content.onclick = function(e){
                if(e.srcElement.id == SubWindow.content.id){
                    SubWindow.close();
                }
            }
            let headline = new SPLINT.DOMElement.SpanDiv(SubWindow.content, "headline", "Verfasse einen Text.");
                headline.Class("headline");
            let textInput = new SPLINT.DOMElement.InputText(SubWindow.content, "editTextInputDiv", "test");
                // console.log(this.data)    
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

          this.button_upload = new FileUploadButton(t.content, "ImageUploadInput", "image/*", FileUpload.CONVERTER_IMG);
          this.button_upload.bindIcon("upload_file");
            let spanText_btUpload = new SPLINT.DOMElement(this.button_upload.button.id + "spanText", "span", this.button_upload.button);  
                spanText_btUpload.Class("text");
                spanText_btUpload.innerHTML = "Bild hochladen";
        //   this.button_upload.button.insertBefore(span1, this.button_upload.span);
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

        //   this.button_NewText = new SPLINT.DOMElement.Button(t.content, "CreateText");
        //   this.button_NewText.bindIcon("format_shapes");
        //     let spanText_btNewText = new SPLINT.DOMElement(this.button_NewText.button.id + "spanText", "span", this.button_NewText.button);  
        //         spanText_btNewText.Class("text");
        //         spanText_btNewText.innerHTML = "Text einfügen";
        //   this.button_NewText.button.setTooltip("Text einfügen", "top");
        //   this.button_NewText.button.onclick = function(){
        //     ConverterHelper.addText();
        //   }
        }.bind(this);
    }
    buttonEPType(){
      this.button_EPType = new SPLINT.DOMElement.Button(this.mainElement, "ChangeEPtype_button");
      this.button_EPType.bindIcon("auto_awesome");
      this.button_EPType.Description = "Farbe";
      this.button_EPType.onclick = function(){
        let floatingDiv = new Converter_BottomBar_floatingDiv_block("buttons_EP");
            floatingDiv.body.before(this.button_EPType.span);
          let bt_Gold     = new SPLINT.DOMElement.Button.Switch(floatingDiv.content, 'gold', "Gold");
              bt_Gold.onactive = function(){
                  ConverterHelper.setEPType("GOLD");
                  bt_Chrome.unsetActive();
              }.bind(this);
              bt_Gold.onchange = function(){
                floatingDiv.remove();
              }
          let bt_Chrome   = new SPLINT.DOMElement.Button.Switch(floatingDiv.content, 'chrome', "Chrome");
              bt_Chrome.onactive = function(){
                  ConverterHelper.setEPType("CHROME");
                  bt_Gold.unsetActive();
              }.bind(this);
              bt_Chrome.onchange = function(){
                floatingDiv.remove();
              }

            if(DSProject.Storage.EPType == "CHROME"){
                bt_Chrome.setActive();
            } else {
                bt_Gold.setActive();
            }
        }.bind(this);
      }
      buttonProductInformation(){
        this.button_ProductInformation = new SPLINT.DOMElement.Button(this.mainElement, "ProductInformation");
        this.button_ProductInformation.bindIcon("info");
        this.button_ProductInformation.Description = "test";
        this.button_ProductInformation.button.onclick = function(){
          S_Location.goto(PATH.location.productInfo).setHash("ssadf").call();
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
        //   S_Location.goto(PATH.location.productInfo).setHash("ssadf").call();
        }.bind(this);

      }
    //   buttonListElements() {
    //     this.button_ListElements = new SPLINT.DOMElement.Button(this.mainElement, "ListElements");
    //     this.button_ListElements.bindIcon("info");
    //     this.button_ListElements.Description = "Elemente";
    //     this.button_ListElements.button.onclick = function(){
    //       S_Location.goto(PATH.location.productInfo).setHash("ssadf").call();
    //     }

    //   }
}