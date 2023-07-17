
class Converter_closeButtons {
    constructor(parent, name = "", withBody = true){
        this.parent = parent;
        this.name = name;
        this.id = "ConverterCloseButtons_" + name + "_";
        if(withBody){
            this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
            this.mainElement.Class("ConverterMainButtons");
        } else {
            this.mainElement = this.parent;
        }
        this.contentElement = new SPLINT.DOMElement(this.id + "content", "div", this.mainElement);
        this.contentElement.Class("content");
        this.draw();
    }
    static draw(parent, name = "", withBody = true){
        new Converter_closeButtons(parent, name, withBody);
        return;
    }
    async draw(){
        let hashes = SPLINT.Tools.Location.getHashes();
        let params = SPLINT.Tools.Location.getParams();
        if(hashes.includes("ADMIN")){
            this.drawButtonSave();
        } else if(params.mode == "edit_cart"){
            this.drawButtonSave_editCartItem();
        } else {
            this.drawButtonToCart();
            this.drawButtonBuy();
        }
    }
    drawButtonSave(){
        let button_save = new SPLINT.DOMElement.Button(this.contentElement, "save", "speichern");
            button_save.Class("save");
            button_save.setStyleTemplate(S_Button.STYLE_NONE);
            button_save.onclick = async function(){
                await CONVERTER_STORAGE.canvasNEW.createTextData();
                // console.dir(DSText);
                ProjectHelper.CONVERTER_closeProject();
                S_Location.back();
            }
    }
    drawButtonToCart(){
        let button_toCart = new SPLINT.DOMElement.Button(this.contentElement, "toCart");
            button_toCart.Class("toCart");
            button_toCart.bindIcon("add_shopping_cart");
            button_toCart.Class("cart");
            button_toCart.button.onclick = function(){
                Converter_CloseOperations.toCart();
            }
            SPLINT.Events.onLoadingComplete = function(){
              button_toCart.button.setAttribute("loaded", true);
            };
            if(SPLINT.Events.onLoadingComplete.dispatched){
                button_toCart.button.setAttribute("loaded", true);
            }
    }
    drawButtonBuy(){
        let button_finish = new SPLINT.DOMElement.Button(this.contentElement, "finish", "Kaufen");
            button_finish.Class("buy")
            button_finish.button.Class("buy");
            // button_finish.setStyleTemplate(Button.STYLE_NONE);
            button_finish.button.onclick = function(){
                // SPLINT.SessionsPHP.showAll();
                // ConverterHelper.createData(PHP_sessions_S.get(PHP_sessions_S.USER_ID, false), PHP_sessions_S.get(PHP_sessions_S.PROJECT_ID, false));
                Converter_CloseOperations.Buy();
            }
            SPLINT.Events.onLoadingComplete = function(){
                button_finish.button.setAttribute("loaded", true);
            };
            if(SPLINT.Events.onLoadingComplete.dispatched){
                button_finish.button.setAttribute("loaded", true);
            }
    }
    drawButtonSave_editCartItem(){
        let button_finish = new SPLINT.DOMElement.Button(this.contentElement, "finish", "speichern");
            button_finish.Class("buy");
            button_finish.setStyleTemplate(S_Button.STYLE_NONE);
            button_finish.onclick = function(){
            Converter_CloseOperations.save();
        }
        
        SPLINT.Events.onLoadingComplete = function(){
            button_finish.button.setAttribute("loaded", true);
        };
        if(SPLINT.Events.onLoadingComplete.dispatched){
            button_finish.button.setAttribute("loaded", true);
        }
    }
}

class Converter_CloseOperations {
    static #editItem(){
  
    }
    static async toCart(){
      let projectID = DSProject.Storage.ProjectID;
      CONVERTER_STORAGE.canvasNEW.createTextData();
      DSText.save();
      if(DSProject.get().State != ProjectHelper.STATE_CART){
        projectID = await ProjectHelper.copy(DSProject.Storage.ProjectID);
        await ProjectHelper.changeState(projectID, ProjectHelper.STATE_CART);
      }
      if(DSProject.Storage.EPType == "GOLD"){
        ShoppingCart.addItem(projectID, productHelper.LIGHTER_GOLD, 1);
      } else {
        ShoppingCart.addItem(projectID, productHelper.LIGHTER_CHROME, 1);
      }
    }
    static async Buy(){
      let projectID = DSProject.Storage.ProjectID;
      CONVERTER_STORAGE.canvasNEW.createTextData();
    //   CONVERTER_STORAGE.canvasNEW.createData();
    //   await DSController.saveAll();
    //   await DSText.save();
      DSText.save();
    //   CONVERTER_STORAGE.canvasNEW.createData(1);
      
      DSImage.save();
    //   DSText.save();
      DSProject.save();
            if(DSProject.get().State != ProjectHelper.STATE_CART){
                projectID = (await ProjectHelper.copy(DSProject.Storage.ProjectID));
                await ProjectHelper.changeState(projectID, ProjectHelper.STATE_CART);
            }
            if(DSProject.Storage.EPType == "GOLD"){
                ShoppingCart.addItem(projectID, productHelper.LIGHTER_GOLD, 1);
            } else {
                ShoppingCart.addItem(projectID, productHelper.LIGHTER_CHROME, 1);
            }
 
    //   console.dir(ShoppingCart.get());
      ShoppingCart.callLocation();
  
    }
    static save(){
      let projectID = DSProject.Storage.ProjectID;
      CONVERTER_STORAGE.canvasNEW.createTextData();
      DSText.save();
      ProjectHelper.CONVERTER_closeProject();
      if(DSProject.Storage.EPType == "GOLD"){
        ShoppingCart.editItem(projectID, productHelper.LIGHTER_GOLD);
      } else {
        ShoppingCart.editItem(projectID, productHelper.LIGHTER_CHROME);
      }
    //   ShoppingCart.callLocation();
  
    }
  }
  