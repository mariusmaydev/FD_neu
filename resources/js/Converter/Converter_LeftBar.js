
class Converter_LeftBar {
  constructor(parent){
    this.mainElement = new SPLINT.DOMElement("LeftBar_div", "div", document.getElementById("ConverterMainElement"));
    this.mainElement.Class("leftBar");
    SPLINT.Events.onLoadingComplete = function(){
      this.mainElement.setAttribute("loaded", true);
    }.bind(this)
    if(SPLINT.Events.onLoadingComplete.dispatched == true){
        this.mainElement.setAttribute("loaded", true);

    }
    this.contentElement = new SPLINT.DOMElement("LeftBar_content_div", "div", this.mainElement);
    this.contentElement.Class("content");
    this.buttonImageMenu();
    let hr1 = new SPLINT.DOMElement.HorizontalLine(this.contentElement);
    this.buttonImageUpload();
    let hr2 = new SPLINT.DOMElement.HorizontalLine(this.contentElement);
    this.buttonNewText();
    let hr3 = new SPLINT.DOMElement.HorizontalLine(this.contentElement);
    // this.buttonEPType();
    this.buttonProductInformation();
    
        
    // Footer.desktop();
    //this.blockEPType();
  }
  buttonImageMenu(){
    this.button_ImageMenu = new SPLINT.DOMElement.Button(this.contentElement, "OpenImageMenu");
    this.button_ImageMenu.bindIcon("image_search");
    this.button_ImageMenu.Description = "Bilder finden";
    this.button_ImageMenu.button.setTooltip("Bild laden", "right");
    this.button_ImageMenu.button.onclick = function(){
      ConverterHelper.openImageMenu();
        }
  }
  buttonImageUpload(){
    this.button_upload = new SPLINT.DOMElement.Button.FileUpload(this.contentElement, "ImageUploadInput", "image/*", ConverterHelper.CONVERTER_IMG);
    this.button_upload.bindIcon("upload_file");
    this.button_upload.Description = "Bild hochladen";
    this.button_upload.button.setTooltip("Bild hochladen", "right");
    this.button_upload.onsuccess = function(data){
      ConverterHelper.uploadImage(data);
    }
  }
  buttonNewText(){
    this.button_NewText = new SPLINT.DOMElement.Button(this.contentElement, "CreateText");
    this.button_NewText.bindIcon("format_shapes");
    this.button_NewText.Description = "Text einfügen";
    this.button_NewText.button.setTooltip("Text einfügen", "right");
    this.button_NewText.button.onclick = function(){
      
      ConverterHelper.addText();
    }
  }
  buttonEPType(){
    this.button_EPType = new SPLINT.DOMElement.Button(this.contentElement, "ChangeEPtype_button");
    this.button_EPType.bindIcon("auto_awesome");
    this.button_EPType.Description = "Farbe ändern";
    this.button_EPType.button.setTooltip("Veredelung", "right");
    this.button_EPType.bindDropdown(function(parent){
          let div = new SPLINT.DOMElement("dropDownDiv_changeEPType", "div", parent);
      
              let RadioButton = new SPLINT.DOMElement.Button.Radio(div, "changeEPType");
              RadioButton.onChange = function(event){
                ConverterHelper.setEPType(event.target.value);
              }
              RadioButton.dataObj.add("GOLD", "Gold");
              RadioButton.dataObj.add("CHROME", "Chrome");
              RadioButton.drawRadio();
              RadioButton.setValue(DSProject.Storage.EPType);
        });
        this.button_EPType.button.onclick = function(){
          this.button_EPType.toggleDropdown();
        }.bind(this);
  }
  buttonProductInformation(){
    this.button_ProductInformation = new SPLINT.DOMElement.Button(this.contentElement, "ProductInformation");
    this.button_ProductInformation.bindIcon("info");
    this.button_ProductInformation.Description = "Informationen";
    this.button_ProductInformation.button.onclick = async function(){
       await DSController.createThumbnail();
        await ProjectHelper.edit(DSProject.Storage, false);
        let data = await ProjectHelper.get();
            data.Thumbnail = data.Thumbnail + "?" + Math.round(Math.random() * 1000);
            
        let projectDetails = new ProjectDetails(data, 0, document.body);
            projectDetails.show();
    }
  }
  blockEPType(){
    this.block_EPType = new SPLINT.DOMElement(this.mainElement.id + "Block_EPType", "div", this.mainElement);
    this.block_EPType.Class("content");
    this.block_EPType.classList.add("content1");
        let headline = new SPLINT.DOMElement.SpanDiv(this.block_EPType, "headline", "Farbe");
            headline.Class("headline");
        let swButton = new SPLINT.DOMElement.Button.Toggle(this.block_EPType, "EPTypeSW");
            // swButton.Class("swButton");
            swButton.addElement("value","name");
            swButton.addElement("value1","name1");
            
  }
}