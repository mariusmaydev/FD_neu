
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
        } else if(hashes.includes("ADMINPLUS")){
            this.mainElement.Class("ADMINPLUS");
            this.drawButtonCreate();
        } else if(params.mode == "edit_cart"){
            this.drawButtonSave_editCartItem();
        } else {
            this.drawButtonToCart();
            this.drawButtonBuy();
        }
    }
    drawButtonCreate(){
        this.AdminBar = new ConverterAdminBar();
        let nameInput = new SPLINT.DOMElement.InputDiv(this.contentElement, "Projektname", "name");

        SPLINT.Data.Cookies.cookiesAccepted = 1;
        let switchBt = new SPLINT.DOMElement.Button.Radio(this.contentElement, "creationType");
            switchBt.dataObj.add("laser", "Laser");
            switchBt.dataObj.add("laserFlat", "LaserFlat");
            switchBt.dataObj.add("engraving","Gravur");
            switchBt.dataObj.add("SVG","SVG");
            switchBt.drawRadio();
            switchBt.onChange = function(e){
                SPLINT.Data.Cookies.set("ADMIN_edit_type", switchBt.Value);
                if(switchBt.Value == "SVG" || switchBt.Value == "laser" || switchBt.Value == "engraving"){
                    ConverterHelper.filerGrayscale(false);
                } else {
                    ConverterHelper.filerGrayscale();
                }
            }
            SPLINT.Data.Cookies.set("ADMIN_edit_type", "SVG"); 
        let button_create = new SPLINT.DOMElement.Button(this.contentElement, "create", "erstellen");
            button_create.Class("create");
            button_create.setStyleTemplate(S_Button.STYLE_NONE);
            button_create.onclick = async function(){
                await CONVERTER_STORAGE.canvasNEW.createTextData();
                await ProjectHelper.CONVERTER_closeProject();
                let sp = new SPLINT.DOMElement.Spinner(button_create.button, "test");
                let Args = new Object();
                    Args.type = switchBt.Value;
                    Args.PointZero = new Object();
                    Args.PointZero.X = DSProject.Storage[DSProject.SQUARE].PointZeroX;
                    Args.PointZero.Y = DSProject.Storage[DSProject.SQUARE].PointZeroY;
                    Args.CurrentConfig = ConverterHelper.getCurrentConfig();
                let res = (await ConverterHelper.createData((await SPLINT.SessionsPHP.get("USER_ID", false)), DSProject.Storage.ProjectID, Args));
                sp.remove();
            }

            let button_download_NC = new SPLINT.DOMElement.Button(this.contentElement, "downloadNC", "Model herunterladen");
                button_download_NC.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_NONE);
                let projectPATH = ProjectHelper.getPath2AdminProject(DSProject.Storage.ProjectID);
                button_download_NC.button.onclick = async function(){
                    if(await SPLINT.Utils.Files.doesExist(projectPATH + "/Full.nc", false)){
                        if(switchBt.Value == "SVG"){
                            SPLINT.Tools.download.download(projectPATH + "/Full.nc", "SVG_" + nameInput.value + "_Model.svg");
                        } else if(switchBt.Value == "laser"){
                            SPLINT.Tools.download.download(projectPATH + "/Full.nc", "Laser_" + nameInput.value + "_Model.nc");
                        } else if(switchBt.Value == "laserFlat"){
                            SPLINT.Tools.download.download(projectPATH + "/Full.nc", "LaserFlat_" + nameInput.value + "_Model.nc");
                        } else if(switchBt.Value == "engraving"){
                            SPLINT.Tools.download.download(projectPATH + "/Full.nc", "Gravur_" + nameInput.value + "_Model.nc");
                        }
                    } else {
                        let Args = new Object();
                            Args.type = switchBt.Value;
                        await ConverterHelper.createData((await SPLINT.SessionsPHP.get("USER_ID", false)), DSProject.Storage.ProjectID, Args);
                        if(switchBt.Value == "SVG"){
                            SPLINT.Tools.download.download(projectPATH + "/Full.nc", "SVG_" + nameInput.value + "_Model.svg");
                        } else if(switchBt.Value == "laser"){
                            SPLINT.Tools.download.download(projectPATH + "/Full.nc", "Laser_" + nameInput.value + "_Model.nc");
                        } else if(switchBt.Value == "laserFlat"){
                            SPLINT.Tools.download.download(projectPATH + "/Full.nc", "LaserFlat_" + nameInput.value + "_Model.nc");
                        } else if(switchBt.Value == "engraving"){
                            SPLINT.Tools.download.download(projectPATH + "/Full.nc", "Gravur_" + nameInput.value + "_Model.nc");
                        }
                    }
                }.bind(this);
                // if(!SPLINT.Utils.Files.doesExist(projectPATH + "/Full.nc", true)){
                //     button_download_NC.button.disabled  = true;
                // } else {
                //     button_download_NC.button.disabled  = false;
                // }
    }
    drawButtonSave(){
        let button_save = new SPLINT.DOMElement.Button(this.contentElement, "save", "speichern");
            button_save.Class("save");
            button_save.setStyleTemplate(S_Button.STYLE_NONE);
            button_save.onclick = async function(){
                await CONVERTER_STORAGE.canvasNEW.createTextData();
                ProjectHelper.CONVERTER_closeProject();
               SPLINT.Tools.Location_old.back();
            }
    }
    async drawButtonToCart(){
        
        let button_toCart_Div = new SPLINT.DOMElement("bt_toCart_div", "div", this.contentElement);
            button_toCart_Div.Class("toCart");
            let button_toCart = new SPLINT.DOMElement.Button(button_toCart_Div, "toCart");
                button_toCart.Class("toCart");
                button_toCart.bindIcon("add_shopping_cart");
                button_toCart.Class("cart");
                button_toCart.button.onclick = function(){
                    Converter_CloseOperations.toCart();
                }
                SPLINT.Events.onLoadingComplete = function(){
                    button_toCart_Div.setAttribute("loaded", true);
                };
                if(SPLINT.Events.onLoadingComplete.dispatched){
                    button_toCart_Div.setAttribute("loaded", true);
                }
                // if(!(await productHelper.isAvailable(DSProject.Storage.Product))){
                //     button_toCart.disabled = true;
                //     button_toCart.setTooltip("ausverkauft", "top")
                // }
    }
    async drawButtonBuy(){
        let button_finish_Div = new SPLINT.DOMElement("bt_finish_div", "div", this.contentElement);
            button_finish_Div.Class("buy");
            let button_finish = new SPLINT.DOMElement.Button(button_finish_Div, "finish", "Kaufen");
                let span1 = new SPLINT.DOMElement(button_finish.button.id + "span1", "span", button_finish.button);   
                    span1.innerHTML = "jetzt";
                button_finish.button.insertBefore(span1, button_finish.span);
                button_finish.Class("buy")
                button_finish.button.Class("buy");
                // button_finish.setStyleTemplate(Button.STYLE_NONE);
                button_finish.button.onclick = function(){
                    // SPLINT.SessionsPHP.showAll();
                    // ConverterHelper.createData(PHP_sessions_S.get(PHP_sessions_S.USER_ID, false), PHP_sessions_S.get(PHP_sessions_S.PROJECT_ID, false));
                    Converter_CloseOperations.Buy();
                }
                SPLINT.Events.onLoadingComplete = function(){
                    button_finish_Div.setAttribute("loaded", true);
                };
                if(SPLINT.Events.onLoadingComplete.dispatched){
                    button_finish_Div.setAttribute("loaded", true);
                }
                // if(!(await productHelper.isAvailable(DSProject.Storage.Product))){
                //     button_finish.disabled = true;
                //     button_finish.setTooltip("ausverkauft", "top")
                // }
    }
    drawButtonSave_editCartItem(){
        let button_finish_Div = new SPLINT.DOMElement("bt_finish_div", "div", this.contentElement);
            button_finish_Div.Class("buy");
            let button_finish = new SPLINT.DOMElement.Button(button_finish_Div, "finish", "speichern");
                button_finish.Class("buy");
                button_finish.setStyleTemplate(S_Button.STYLE_NONE);
                button_finish.onclick = function(){
                Converter_CloseOperations.save();
            }
            
            SPLINT.Events.onLoadingComplete = function(){
                button_finish_Div.setAttribute("loaded", true);
            };
            if(SPLINT.Events.onLoadingComplete.dispatched){
                button_finish_Div.setAttribute("loaded", true);
            }
    }
}

class Converter_CloseOperations {
    static #editItem(){
  
    }
    static async toCart(){
        let projectID = DSProject.Storage.ProjectID;
        await CONVERTER_STORAGE.canvasNEW.createTextData();
        await DSText.save();
        DSController.saveAll();
        if(DSProject.get().State != ProjectHelper.STATE_CART){
            projectID = await ProjectHelper.copy(DSProject.Storage.ProjectID);
            console.log(projectID);
            await ProjectHelper.changeState(projectID, ProjectHelper.STATE_CART);
        }
        await ShoppingCart.addItem(projectID, DSProject.Storage.Product, 1);
    }
    static async Buy(){
        let projectID = DSProject.Storage.ProjectID;
        await CONVERTER_STORAGE.canvasNEW.createTextData();
        await DSText.save();
        await DSController.saveAll();
        if(DSProject.get().State != ProjectHelper.STATE_CART){
            projectID = (await ProjectHelper.copy(DSProject.Storage.ProjectID));
            await ProjectHelper.changeState(projectID, ProjectHelper.STATE_CART);
        }
        await ShoppingCart.addItem(projectID, DSProject.Storage.Product, 1);
        ShoppingCart.callLocation();

  
    }
    static async save(){
        let projectID = DSProject.Storage.ProjectID;
        await CONVERTER_STORAGE.canvasNEW.createTextData();
        await ProjectHelper.CONVERTER_closeProject();
        // await ShoppingCart.editItem(projectID, DSProject.Storage.Product);
        ShoppingCart.callLocation();
  
    }
  }
  