class BottomBar_Standard {
    constructor(parent) {
        this.parent = parent;
        this.id = "BottomBar_Standard_";
    }
    draw(){
        console.log("std")
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("conv_bottom_bar_std");
        this.parent.setAttribute("name", "std");
        this.buttonAddElement();
        this.buttonEPType();
        this.buttonProductInformation();
        this.closeButtonsContainer = new SPLINT.DOMElement(this.id + "close_buttons_container", "div", this.mainElement);
        this.closeButtonsContainer.Class("close_buttons_container");
        Converter_closeButtons.draw(this.closeButtonsContainer, "bottomBar", false);
    } 
    buttonAddElement(){
      this.button_AddElement = new SPLINT.DOMElement.Button(this.mainElement, "AddElement_button");
      this.button_AddElement.Class("AddElement");
      this.button_AddElement.bindIcon("add");
      this.button_AddElement.onclick = function(){
          let t = new Converter_BottomBar_floatingDiv_block("buttons");
          t.body.before(this.button_AddElement.span);

          this.button_upload = new FileUploadButton(t.content, "ImageUploadInput", "image/*", FileUpload.CONVERTER_IMG);
          this.button_upload.bindIcon("upload_file");
            let spanText_btUpload = new SPLINT.DOMElement(this.button_upload.button.id + "spanText", "span", this.button_upload.button);  
                spanText_btUpload.Class("text");
                spanText_btUpload.innerHTML = "Bild hochladen";
        //   this.button_upload.button.insertBefore(span1, this.button_upload.span);
          this.button_upload.button.setTooltip("Bild hochladen", "top");
          this.button_upload.onsuccess = function(data){
            ConverterHelper.uploadImage(data);
          }  

          this.button_ImageMenu = new SPLINT.DOMElement.Button(t.content, "OpenImageMenu");
          this.button_ImageMenu.bindIcon("image_search");
            let spanText_btImgMenu = new SPLINT.DOMElement(this.button_ImageMenu.button.id + "spanText", "span", this.button_ImageMenu.button);  
                spanText_btImgMenu.Class("text");
                spanText_btImgMenu.innerHTML = "Bild finden";
          this.button_ImageMenu.button.setTooltip("Bild laden", "top");
          this.button_ImageMenu.button.onclick = function(){
            ConverterHelper.openImageMenu();
              }

          this.button_NewText = new SPLINT.DOMElement.Button(t.content, "CreateText");
          this.button_NewText.bindIcon("format_shapes");
            let spanText_btNewText = new SPLINT.DOMElement(this.button_NewText.button.id + "spanText", "span", this.button_NewText.button);  
                spanText_btNewText.Class("text");
                spanText_btNewText.innerHTML = "Text einfügen";
          this.button_NewText.button.setTooltip("Text einfügen", "top");
          this.button_NewText.button.onclick = function(){
            ConverterHelper.addText();
          }
        }.bind(this);
    }
    buttonEPType(){
      this.button_EPType = new SPLINT.DOMElement.Button(this.mainElement, "ChangeEPtype_button");
      this.button_EPType.bindIcon("auto_awesome");
      this.button_EPType.onclick = function(){
        let floatingDiv = new Converter_BottomBar_floatingDiv_block("buttons_EP");
            floatingDiv.body.before(this.button_EPType.span);
          let bt_Gold     = new S_switchButton(floatingDiv.content, 'gold', "Gold");
              bt_Gold.onactive = function(){
                  ConverterHelper.setEPType("GOLD");
                  bt_Chrome.unsetActive();
              }.bind(this);
          let bt_Chrome   = new S_switchButton(floatingDiv.content, 'chrome', "Chrome");
              bt_Chrome.onactive = function(){
                  ConverterHelper.setEPType("CHROME");
                  bt_Gold.unsetActive();
              }.bind(this);

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
        this.button_ProductInformation.button.onclick = function(){
          S_Location.goto(PATH.location.productInfo).setHash("ssadf").call();
        }
      }
}