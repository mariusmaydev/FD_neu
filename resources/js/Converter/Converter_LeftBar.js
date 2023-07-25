
class Converter_LeftBar {
  constructor(parent){
    this.mainElement = new SPLINT.DOMElement("LeftBar_div", "div", document.getElementById("ConverterMainElement"));
    this.mainElement.Class("leftBar");
    SPLINT.Events.onLoadingComplete = function(){
      this.mainElement.setAttribute("loaded", true);
    }.bind(this)
    this.contentElement = new SPLINT.DOMElement("LeftBar_content_div", "div", this.mainElement);
    this.contentElement.Class("content");
    this.buttonImageMenu();
    this.buttonImageUpload();
    this.buttonNewText();
    this.buttonEPType();
    this.buttonProductInformation();
  }
  buttonImageMenu(){
    this.button_ImageMenu = new SPLINT.DOMElement.Button(this.contentElement, "OpenImageMenu");
    this.button_ImageMenu.bindIcon("image_search");
    this.button_ImageMenu.button.setTooltip("Bild laden", "right");
    this.button_ImageMenu.button.onclick = function(){
      ConverterHelper.openImageMenu();
        }
  }
  buttonImageUpload(){
    this.button_upload = new FileUploadButton(this.contentElement, "ImageUploadInput", "image/*", FileUpload.CONVERTER_IMG);
    this.button_upload.bindIcon("upload_file");
    this.button_upload.button.setTooltip("Bild hochladen", "right");
    this.button_upload.onsuccess = function(data){
      ConverterHelper.uploadImage(data);
    }
  }
  buttonNewText(){
    this.button_NewText = new SPLINT.DOMElement.Button(this.contentElement, "CreateText");
    this.button_NewText.bindIcon("format_shapes");
    this.button_NewText.button.setTooltip("Text einfügen", "right");
    this.button_NewText.button.onclick = function(){
      
      ConverterHelper.addText();
    }
  }
  buttonEPType(){
    this.button_EPType = new SPLINT.DOMElement.Button(this.contentElement, "ChangeEPtype_button");
    this.button_EPType.bindIcon("auto_awesome");
    this.button_EPType.button.setTooltip("Veredelung", "right");
    this.button_EPType.bindDropdown(function(parent){
          let div = new SPLINT.DOMElement("dropDownDiv_changeEPType", "div", parent);
      
              let RadioButton = new S_radioButton(div, "changeEPType");
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
    this.button_ProductInformation.button.onclick = async function(){
        let UserID = (await SPLINT.SessionsPHP.get("USER_ID", false));
        let data = DSProject.Storage;
            data.Thumbnail = ProjectHelper.getPath2Project(UserID, DSProject.Storage.ProjectID, false) + "/thumbnail.png";
        let p = new ProjectDetails(data, null, document.body);
            p.show(false);
        // let projectDetails = new ProjectDetails(data, index, listElement);
        //   listElement.onclick = function(){
        //     projectDetails.show();
        //   }
        // let productInformation = new ProductInformation("converter");
    }
  }
}