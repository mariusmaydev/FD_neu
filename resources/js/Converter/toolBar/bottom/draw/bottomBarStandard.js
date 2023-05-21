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
        this.buttonEPType();
        this.buttonProductInformation();
        Converter_closeButtons.draw(this.mainElement, "bottomBar", false);
    } 
    buttonAddElement(){
      this.button_AddElement = new SPLINT.DOMElement.Button(this.mainElement, "AddElement_button");
      this.button_AddElement.bindIcon("add");
      this.button_AddElement.onclick = function(){
          let t = new Converter_BottomBar_floatingDiv_aligned(this.button_AddElement.button, "buttons");
          t.body.before(this.button_AddElement.span);

          this.button_upload = new FileUploadButton(t.content, "ImageUploadInput", "image/*", FileUpload.CONVERTER_IMG);
          this.button_upload.bindIcon("upload_file");
          this.button_upload.button.setTooltip("Bild hochladen", "right");
          this.button_upload.onsuccess = function(data){
            ConverterHelper.uploadImage(data);
          }  

          this.button_ImageMenu = new SPLINT.DOMElement.Button(t.content, "OpenImageMenu");
          this.button_ImageMenu.bindIcon("image_search");
          this.button_ImageMenu.button.setTooltip("Bild laden", "right");
          this.button_ImageMenu.button.onclick = function(){
            ConverterHelper.openImageMenu();
              }

          this.button_NewText = new SPLINT.DOMElement.Button(t.content, "CreateText");
          this.button_NewText.bindIcon("format_shapes");
          this.button_NewText.button.setTooltip("Text einfügen", "right");
          this.button_NewText.button.onclick = function(){
            ConverterHelper.addText();
          }
        }.bind(this);
    }
    buttonEPType(){
      this.button_EPType = new SPLINT.DOMElement.Button(this.mainElement, "ChangeEPtype_button");
      this.button_EPType.bindIcon("auto_awesome");
      this.button_EPType.onclick = function(){
        let floatingDiv = new Converter_BottomBar_floatingDiv_aligned(this.button_EPType.button, "buttons_Text");
            floatingDiv.body.before(this.button_EPType.span);
          let bt_Gold     = new S_switchButton(floatingDiv.content, 'gold', "Gold");
              bt_Gold.onactive = function(){
                  // bt_Gold.setActive();
                  ConverterHelper.setEPType("GOLD");
                  bt_Chrome.unsetActive();
              }.bind(this);
          let bt_Chrome   = new S_switchButton(floatingDiv.content, 'chrome', "Chrome");
              bt_Chrome.onactive = function(){
                  // bt_Chrome.setActive();
                  ConverterHelper.setEPType("CHROME");
                  bt_Gold.unsetActive();
              }.bind(this);
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