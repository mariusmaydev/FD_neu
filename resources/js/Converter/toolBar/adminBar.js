
class ConverterAdminBar {
    constructor() {
        this.parent = document.getElementById("NavigationBar");
        this.parent.classList.add("ADMINPLUS");
        this.id = "ConverterAdminBar_";
        this.contentElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.contentElement.Class("content");
        this.data = null;
        this.draw();
    }  
    draw(){
        let params = SPLINT.Tools.Location.getParams();
        let name = "";
        if(params.name == undefined){
            name = "converterProcess";
            SPLINT.Tools.Location.setParams({"name": name}).call(false);
        } else {
            name = params.name;
        }
        this.currentConfig = name;
        this.getData(name).then(function (data) {
            this.contentElement.clear();
                this.data = data;
                console.log(this.data, DSProject.Storage);
                this.drawSizing();
                this.drawPointZero();
                this.drawGrayscaleButton();
                this.drawgenFrameButton();
        }.bind(this));

    }
    getData(name){
        return SPLINT.DataStorage.get("/converterSettings/" + name + ".json");
    }
    saveData(name, data){
        return SPLINT.DataStorage.edit("/converterSettings/" + name + ".json", JSON.stringify(data));
    }
    removeData(name){
        return SPLINT.DataStorage.remove("/converterSettings/" + name + ".json");
    }
    getPaths(){
        return SPLINT.DataStorage.getPaths("/converterSettings/");
    }

    drawSizing(parent = this.contentElement, name = ""){
        let id = this.id + "_" + name;
        let container = new SPLINT.DOMElement(id + "sizing_Container", "div", parent);
            container.Class("sizing_Container");

            let label = new SPLINT.DOMElement.SpanDiv(container, "headline", "Größe");
                label.Class("label");

            let inputXContainer = new SPLINT.DOMElement(id + "inputXContainer", "div", container);
                inputXContainer.Class("inputContainer");
                let inputX = new SPLINT.DOMElement.InputAmount(inputXContainer, "inputX", DSProject.Storage[DSProject.SQUARE].widthMM, "mm", 2);
                    inputX.oninput = function(amount){
                        LighterWidth = amount;
                        DSProject.Storage[DSProject.SQUARE].width = amount *16.4;
                        DSProject.Storage[DSProject.SQUARE].widthMM = amount;
                        DSProject.save();
                        Converter.AdjustSquareBorder();
                    }.bind(this);
                let labelInputX = new SPLINT.DOMElement.Label(inputXContainer, inputX.mainElement, "X" );
                    labelInputX.before();

            let inputYContainer = new SPLINT.DOMElement(id + "inputYContainer", "div", container);
                inputYContainer.Class("inputContainer");
                let inputY = new SPLINT.DOMElement.InputAmount(inputYContainer, "inputY", DSProject.Storage[DSProject.SQUARE].heightMM, "mm", 2);
                    inputY.oninput = function(amount){
                        LighterHeight = amount;
                        DSProject.Storage[DSProject.SQUARE].height = amount *16.4;
                        DSProject.Storage[DSProject.SQUARE].heightMM = amount;
                        DSProject.save();
                        Converter.AdjustSquareBorder();
                    }
                let labelInputY = new SPLINT.DOMElement.Label(inputYContainer, inputY.mainElement, "Y" );
                    labelInputY.before();

                LighterWidth    = DSProject.Storage[DSProject.SQUARE].widthMM;
                LighterHeight   = DSProject.Storage[DSProject.SQUARE].heightMM;
                Converter.AdjustSquareBorder();
    }
    drawPointZero(parent = this.contentElement, name = ""){
        let id = this.id + "_" + name;
        let type = SPLINT.Data.Cookies.get("ADMIN_edit_type");
        let container = new SPLINT.DOMElement(id + "X0_Container", "div", parent);
            container.Class("X0_Container");

            let label = new SPLINT.DOMElement.SpanDiv(container, "headline", "Nullpunkt");
                label.Class("label");

            let inputXContainer = new SPLINT.DOMElement(id + "inputX0Container", "div", container);
                inputXContainer.Class("inputContainer");
                let inputX = new SPLINT.DOMElement.InputAmount(inputXContainer, "inputX0", this.data[type].zero.X, "mm", 2);
                    inputX.min = 0;
                    inputX.oninput = function(amount){
                        this.data[type].zero.X = amount;
                        DSProject.Storage[DSProject.SQUARE].PointZeroX = amount *16.4;
                        DSProject.save();
                        this.saveData(this.currentConfig, this.data)
                    }.bind(this);
                let labelInputX = new SPLINT.DOMElement.Label(inputXContainer, inputX.mainElement, "X" );
                    labelInputX.before();

            let inputYContainer = new SPLINT.DOMElement(id + "inputY0Container", "div", container);
                inputYContainer.Class("inputContainer");
                let inputY = new SPLINT.DOMElement.InputAmount(inputYContainer, "inputY0", this.data[type].zero.Y, "mm", 2);
                    inputY.min = 0;
                    inputY.oninput = function(amount){
                        this.data[type].zero.Y = amount;
                        DSProject.Storage[DSProject.SQUARE].PointZeroY = amount *16.4;
                        DSProject.save();
                        this.saveData(this.currentConfig, this.data)
                    }.bind(this);
                let labelInputY = new SPLINT.DOMElement.Label(inputYContainer, inputY.mainElement, "Y" );
                    labelInputY.before();
            
            DSProject.Storage[DSProject.SQUARE].PointZeroX = inputX.amount *16.4;
            DSProject.Storage[DSProject.SQUARE].PointZeroY = inputY.amount *16.4;

    }
    drawIntensity(parent = this.contentElement, name = ""){
        let id = this.id + "_" + name;
        let container = new SPLINT.DOMElement(id + "Intensity_Container", "div", parent);
            container.Class("Intensity_Container");

            let type = SPLINT.Data.Cookies.get("ADMIN_edit_type");

            let label = new SPLINT.DOMElement.SpanDiv(container, "headline", "Spanne");
                label.Class("label");

            let inputIntensity_minContainer = new SPLINT.DOMElement(id + "inputIntensity_minContainer", "div", container);
                inputIntensity_minContainer.Class("inputContainer");
                let inputIntensity_min = new SPLINT.DOMElement.InputAmount(inputIntensity_minContainer, "inputIntensity_min", parseInt(this.data[type].intensity.min / 10), "%");
                    inputIntensity_min.min = 0;
                    inputIntensity_min.max = 100;
                    inputIntensity_min.oninput = function(amount){
                        this.data[type].intensity.min = amount * 10;
                    }.bind(this);
                let labelInputIntensity_min = new SPLINT.DOMElement.Label(inputIntensity_minContainer, inputIntensity_min.mainElement, "min" );
                    labelInputIntensity_min.before();

            let inputIntensity_maxContainer = new SPLINT.DOMElement(id + "inputIntensity_maxContainer", "div", container);
                inputIntensity_maxContainer.Class("inputContainer");
                let inputIntensity_max = new SPLINT.DOMElement.InputAmount(inputIntensity_maxContainer, "inputIntensity_max", parseInt(this.data[type].intensity.max / 10), "%");
                    inputIntensity_max.min = 0;
                    inputIntensity_max.max = 100;
                    inputIntensity_max.oninput = function(amount){
                        this.data[type].intensity.max = amount * 10;
                    }.bind(this);
                let labelInputIntensity_max = new SPLINT.DOMElement.Label(inputIntensity_maxContainer, inputIntensity_max.mainElement, "max" );
                    labelInputIntensity_max.before();

            
            let IntensityBtContainer = new SPLINT.DOMElement(id + "IntensityBtContainer", "div", container);
                IntensityBtContainer.Class("IntensityBtContainer");
                let btBinary = new SPLINT.DOMElement.Button.Switch(IntensityBtContainer, "BTBinary", "Binär");
                    btBinary.onchange = function(state){
                        if(state == "active"){
                            this.data[type].intensity.binary = true;
                        } else {
                            this.data[type].intensity.binary = false;
                        }
                    }.bind(this);
                    if(this.data[type].intensity.binary){
                        btBinary.setActive();
                        btBinary.onchange(btBinary.button.state().get());
                    } else {
                        btBinary.unsetActive();
                        btBinary.onchange(btBinary.button.state().get());
                    }
                let btRenderRow = new SPLINT.DOMElement.Button.Switch(IntensityBtContainer, "BTRenderRow", "Reihen");
                    btRenderRow.onchange = function(state){
                        if(state == "active"){
                            this.data[type].rendering.row = true;
                        } else {
                            this.data[type].rendering.row = false;
                        }
                    }.bind(this);
                    if(this.data[type].rendering.row){
                        btRenderRow.setActive();
                        btRenderRow.onchange(btRenderRow.button.state().get());
                    } else {
                        btRenderRow.unsetActive();
                        btRenderRow.onchange(btRenderRow.button.state().get());
                    }
                let btRenderCol = new SPLINT.DOMElement.Button.Switch(IntensityBtContainer, "BTRenderCol", "Spalten");
                    btRenderCol.onchange = function(state){
                        if(state == "active"){
                            this.data[type].rendering.col = true;
                        } else {
                            this.data[type].rendering.col = false;
                        }
                    }.bind(this);
                    if(this.data[type].rendering.col){
                        btRenderCol.setActive();
                        btRenderCol.onchange(btRenderCol.button.state().get());
                    } else {
                        btRenderCol.unsetActive();
                        btRenderCol.onchange(btRenderCol.button.state().get());
                    }
    }
    drawPower(parent = this.contentElement, name = ""){
        let id = this.id + "_" + name;
        let container = new SPLINT.DOMElement(id + "Power_Container", "div", parent);
            container.Class("Power_Container");

            let type = SPLINT.Data.Cookies.get("ADMIN_edit_type");

            let label = new SPLINT.DOMElement.SpanDiv(container, "headline", "S");
                label.Class("label");

            let inputSWorkContainer = new SPLINT.DOMElement(id + "inputSWorkContainer", "div", container);
                inputSWorkContainer.Class("inputContainer");
                let inputSWork = new SPLINT.DOMElement.InputAmount(inputSWorkContainer, "inputSWork", parseInt(this.data[type].workTravel.S / 10), "%");
                    inputSWork.min = 0;
                    inputSWork.max = 100;
                    inputSWork.oninput = function(amount){
                        this.data[type].workTravel.S = amount * 10;
                    }.bind(this);
                let labelInputSWork = new SPLINT.DOMElement.Label(inputSWorkContainer, inputSWork.mainElement, "work" );
                    labelInputSWork.before();

            let inputSTravelContainer = new SPLINT.DOMElement(id + "inputSTravelContainer", "div", container);
                inputSTravelContainer.Class("inputContainer");
                let inputSTravel = new SPLINT.DOMElement.InputAmount(inputSTravelContainer, "inputSTravel", parseInt(this.data[type].fastTravel.S / 10), "%");
                    inputSTravel.min = 0;
                    inputSTravel.max = 100;
                    inputSTravel.oninput = function(amount){
                        this.data[type].fastTravel.S = amount * 10;
                    }.bind(this);
                let labelInputSTravel = new SPLINT.DOMElement.Label(inputSTravelContainer, inputSTravel.mainElement, "travel" );
                    labelInputSTravel.before();
    }
    drawSpeed(parent = this.contentElement, name = ""){
        let id = this.id + "_" + name;
        let container = new SPLINT.DOMElement(id + "Speed_Container", "div", parent);
            container.Class("Speed_Container");

            let type = SPLINT.Data.Cookies.get("ADMIN_edit_type");
            console.log(type);

            let label = new SPLINT.DOMElement.SpanDiv(container, "headline", "F");
                label.Class("label");

            let inputFWorkContainer = new SPLINT.DOMElement(id + "inputFWorkContainer", "div", container);
                inputFWorkContainer.Class("inputContainer");
                let inputFWork = new SPLINT.DOMElement.InputAmount(inputFWorkContainer, "inputFWork", this.data[type].workTravel.F, "mm/min");
                    inputFWork.oninput = function(amount){
                        this.data[type].workTravel.F = amount;
                    }.bind(this);
                let labelInputFWork = new SPLINT.DOMElement.Label(inputFWorkContainer, inputFWork.mainElement, "work" );
                    labelInputFWork.before();

            let inputFTravelContainer = new SPLINT.DOMElement(id + "inputFTravelContainer", "div", container);
                inputFTravelContainer.Class("inputContainer");
                let inputFTravel = new SPLINT.DOMElement.InputAmount(inputFTravelContainer, "inputFTravel", this.data[type].fastTravel.F, "mm/min");
                    inputFTravel.oninput = function(amount){
                        this.data[type].fastTravel.F = amount;
                    }.bind(this);
                let labelInputFTravel = new SPLINT.DOMElement.Label(inputFTravelContainer, inputFTravel.mainElement, "travel" );
                    labelInputFTravel.before();
    }
    drawGrayscaleButton(){
        let container = new SPLINT.DOMElement(this.id + "grayscaleButtonContainer", "div", this.contentElement);
            let button = new SPLINT.DOMElement.Button(container, "grayscale", "Graustufen");
                button.onclick = function(){
                    ConverterHelper.filerGrayscale();
                }.bind(this);
    }
    async drawGenFramePopup() {
        let type = SPLINT.Data.Cookies.get("ADMIN_edit_type");
        let popUp = new SPLINT.DOMElement.popupWindow("genFrame", true, true);
            popUp.Class("genFramePopup");
            popUp.onclose = function() {
                this.draw();
            }.bind(this);
            let HeadContainer = new SPLINT.DOMElement(this.id + "genFrameHeadContainer", "div", popUp.content);
                HeadContainer.Class("genFrameHeadContainer");
                let HeadContainerHeadline = new SPLINT.DOMElement.SpanDiv(HeadContainer, "headline", "Config Manager");
                    HeadContainerHeadline.Class("headline");

                let switchBt = new SPLINT.DOMElement.Button.Radio(HeadContainer, "creationType_genFrame");
                    switchBt.dataObj.add("laser", "Laser");
                    switchBt.dataObj.add("laserFlat", "LaserFlat");
                    switchBt.dataObj.add("engraving","Gravur");
                    switchBt.dataObj.add("SVG","SVG");
                    switchBt.drawRadio();
                    switchBt.setValue(type)
                    switchBt.onChange = async function(e){
                        SPLINT.Data.Cookies.set("ADMIN_edit_type", switchBt.Value);
                        switchBt.setValue(switchBt.Value, "creationType");
                        popUp.content.clear();
                        this.drawGenFramePopup();
                    }.bind(this);

            let ContainerManagement = new SPLINT.DOMElement(this.id + "genFrameContainerManagement", "div", popUp.content);
                ContainerManagement.Class("ContainerManagement");
                let headlineContainerManagement = new SPLINT.DOMElement.SpanDiv(ContainerManagement, "headline", "Config laden und Speichern");
                    headlineContainerManagement.Class("headline");
                    
            let paths = this.getPaths();
                paths.then(function(path){
                    let tableConfigs = new SPLINT.DOMElement.Table.List(ContainerManagement, "configs", Object.keys(path));
                        tableConfigs.func_drawListElement = function(data, index, listElement) {
                            let sp = new SPLINT.DOMElement.SpanDiv(listElement, "sp" + index, data)
                            let btLoad = new SPLINT.DOMElement.Button(listElement, "load" + index, "laden");
                                btLoad.onclick = async function(){
                                    SPLINT.Tools.Location.removeParams("name").setParams({"name": data}).call(true);
                                }.bind(this);
                            if(data != "converterProcess"){
                                let btRemove = new SPLINT.DOMElement.Button(listElement, "remove" + index);
                                    btRemove.bindIcon("delete");
                                    btRemove.onclick = async function(){
                                        this.removeData(data);
                                        if(this.currentConfig == data){
                                            SPLINT.Tools.Location.removeParams("name").setParams({"name": "converterProcess"}).call(true);
                                        } else {
                                            window.location.reload();
                                        }
                                    }.bind(this);
                            }
                            if(this.currentConfig == data) {
                                listElement.state().setActive();
                                listElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                            }
                        }.bind(this);
                        tableConfigs.draw();
                }.bind(this));
                
            this.drawPointZero(popUp.content, "popUp");
            this.drawSizing(popUp.content, "popUp");
            this.drawSpeed(popUp.content, "popUp");
            this.drawPower(popUp.content, "popUp");
            

            let containerOther = new SPLINT.DOMElement(this.id + "containerOther", "div", popUp.content);
                containerOther.Class("containerOther");


                let labelOther = new SPLINT.DOMElement.SpanDiv(containerOther, "headline", "sonstiges");
                    labelOther.Class("label");
                let inputDigitsContainer = new SPLINT.DOMElement(this.id + "inputDigitsContainer", "div", containerOther);
                    inputDigitsContainer.Class("inputContainer");
                    let inputDigits = new SPLINT.DOMElement.InputAmount(inputDigitsContainer, "inputDigits", this.data.digits, "");
                        inputDigits.oninput = function(amount){
                            this.data.digits = amount;
                        }.bind(this);
                    let labelInputDigits = new SPLINT.DOMElement.Label(inputDigitsContainer, inputDigits.mainElement, "digits" );
                        labelInputDigits.before();

                if(type == "laserFlat"){
                    let inputQualityContainer = new SPLINT.DOMElement(this.id + "inputQualityContainer", "div", containerOther);
                        inputQualityContainer.Class("inputContainer");
                        let inputQuality = new SPLINT.DOMElement.InputAmount(inputQualityContainer, "inputQuality", this.data[type].quality_PpMM, "pixel/mm");
                            inputQuality.oninput = function(amount){
                                this.data[type].quality_PpMM = amount;
                            }.bind(this);
                        let labelInputQuality = new SPLINT.DOMElement.Label(inputQualityContainer, inputQuality.mainElement, "Qualität" );
                            labelInputQuality.before();

                    this.drawIntensity(popUp.content, "popUp");
                }

                if(type == "laser" || type == "laserFlat"){
                    let switchBt_M3M4 = new SPLINT.DOMElement.Button.Radio(containerOther, "switchBt_M3M4");
                        switchBt_M3M4.dataObj.add("M3", "M3");
                        switchBt_M3M4.dataObj.add("M4", "M4");
                        switchBt_M3M4.drawRadio();
                        switchBt_M3M4.setValue(this.data[type]["M4orM3"]);
                        switchBt_M3M4.onChange = function(e){
                            this.data[type]["M4orM3"] = switchBt_M3M4.Value;
                        }.bind(this);
                }





                if(this.data[type].offsetFrame == null || this.data[type].offsetFrame == undefined){
                    this.data[type].offsetFrame = new Object();
                    this.data[type].offsetFrame.left     = 0;
                    this.data[type].offsetFrame.right    = 0;
                    this.data[type].offsetFrame.top      = 0;
                    this.data[type].offsetFrame.bottom   = 0;
                    this.data[type].offsetFrame.active   = true;
                }

            let OffsetFrameContainer = new SPLINT.DOMElement(this.id + "offsetFrameContainer", "div", popUp.content);
                OffsetFrameContainer.Class("offsetFrameContainer");

                let labelOffsetFrame = new SPLINT.DOMElement.SpanDiv(OffsetFrameContainer, "headline", "Offset-Rahmen");
                    labelOffsetFrame.Class("label");

                let inputLeftContainer = new SPLINT.DOMElement(this.id + "inputLeftContainer", "div", OffsetFrameContainer);
                    inputLeftContainer.Class("inputContainer");
                    let inputLeft = new SPLINT.DOMElement.InputAmount(inputLeftContainer, "inputLeft", this.data[type].offsetFrame.left, "mm", 2);
                        inputLeft.min = 0;
                        inputLeft.oninput = function(amount){
                            this.data[type].offsetFrame.left = amount;
                        }.bind(this);
                    let labelInputLeft = new SPLINT.DOMElement.Label(inputLeftContainer, inputLeft.mainElement, "links" );
                        labelInputLeft.before();

                let inputRightContainer = new SPLINT.DOMElement(this.id + "inputRightContainer", "div", OffsetFrameContainer);
                    inputRightContainer.Class("inputContainer");
                    let inputRight = new SPLINT.DOMElement.InputAmount(inputRightContainer, "inputRight", this.data[type].offsetFrame.right, "mm", 2);
                        inputRight.min = 0;
                        inputRight.oninput = function(amount){
                            this.data[type].offsetFrame.right = amount;
                        }.bind(this);
                    let labelInputRight = new SPLINT.DOMElement.Label(inputRightContainer, inputRight.mainElement, "rechts" );
                        labelInputRight.before();

                let inputTopContainer = new SPLINT.DOMElement(this.id + "inputTopContainer", "div", OffsetFrameContainer);
                    inputTopContainer.Class("inputContainer");
                    let inputTop = new SPLINT.DOMElement.InputAmount(inputTopContainer, "inputTop", this.data[type].offsetFrame.top, "mm", 2);
                        inputTop.min = 0;
                        inputTop.oninput = function(amount){
                            this.data[type].offsetFrame.top = amount;
                        }.bind(this);
                    let labelInputTop = new SPLINT.DOMElement.Label(inputTopContainer, inputTop.mainElement, "oben" );
                        labelInputTop.before();

                let inputBottomContainer = new SPLINT.DOMElement(this.id + "inputBottomContainer", "div", OffsetFrameContainer);
                    inputBottomContainer.Class("inputContainer");
                    let inputBottom = new SPLINT.DOMElement.InputAmount(inputBottomContainer, "inputBottom", this.data[type].offsetFrame.bottom, "mm", 2);
                        inputBottom.min = 0;
                        inputBottom.oninput = function(amount){
                            this.data[type].offsetFrame.bottom = amount;
                        }.bind(this);
                    let labelInputBottom = new SPLINT.DOMElement.Label(inputBottomContainer, inputBottom.mainElement, "unten" );
                        labelInputBottom.before();
                
                let OffsetFrame_btContainer = new SPLINT.DOMElement(this.id + "OffsetFrame_btContainer", "div", OffsetFrameContainer);
                    OffsetFrame_btContainer.Class("buttonsContainer");
                    let btInnerActive = new SPLINT.DOMElement.Button.Switch(OffsetFrame_btContainer, "BTinnerActive", "Offset-Rahmen zeichnen");
                        btInnerActive.onchange = function(state){
                            if(state == "active"){
                                this.data[type].offsetFrame.active = true;
                                inputBottomContainer.setAttribute("disabled", false);
                                inputTopContainer.setAttribute("disabled", false);
                                inputRightContainer.setAttribute("disabled", false);
                                inputLeftContainer.setAttribute("disabled", false);
                            } else {
                                inputBottomContainer.setAttribute("disabled", true);
                                inputTopContainer.setAttribute("disabled", true);
                                inputRightContainer.setAttribute("disabled", true);
                                inputLeftContainer.setAttribute("disabled", true);
                                this.data[type].offsetFrame.active = false;
                            }
                        }.bind(this);
                        if(this.data[type].offsetFrame.active){
                            btInnerActive.setActive();
                            btInnerActive.onchange(btInnerActive.button.state().get());
                        } else {
                            btInnerActive.unsetActive();
                            btInnerActive.onchange(btInnerActive.button.state().get());
                        }

            let btContainer = new SPLINT.DOMElement(this.id + "genFrameBTContainer", "div", popUp.content);
                btContainer.Class("buttonsContainer");
                let btSave = new SPLINT.DOMElement.Button(btContainer, "btSave", "speichern");
                    btSave.onclick = async function(){
                        await this.saveData(this.currentConfig, this.data);
                        window.location.reload();
                    }.bind(this);
                let btSaveAs = new SPLINT.DOMElement.Button(btContainer, "btSaveAs", "speichern als");
                    btSaveAs.onclick = function(){
                        let popUpName = new SPLINT.DOMElement.popupWindow("nameNewConfig", true, false);
                            let nameInput = new SPLINT.DOMElement.InputDiv(popUpName.content, "nameInpNewConfig", "neueConfig");
                            
                            let btSave = new SPLINT.DOMElement.Button(popUpName.content, "nameNewConfigSubmit", "speichern");
                                btSave.onclick = async function(){
                                    await this.saveData(nameInput.value, this.data);
                                    popUpName.close();
                                    SPLINT.Tools.Location.removeParams("name").setParams({"name": nameInput.value}).call(true);

                                }.bind(this);

                            let btCancle = new SPLINT.DOMElement.Button(popUpName.content, "nameNewConfigCancle", "abbrechen");
                                btCancle.onclick = function(){
                                    popUpName.close();
                                }.bind(this);
                        this.saveData(this.currentConfig, this.data)
                    }.bind(this);

                let btGen = new SPLINT.DOMElement.Button(btContainer, "BTGen", "Rahmen generieren");
                    btGen.onclick = async function(){
                        let type = SPLINT.Data.Cookies.get("ADMIN_edit_type");
                        let Args = new Object();
                            Args.PointZero = new Object();
                            Args.PointZero.X = DSProject.Storage[DSProject.SQUARE].PointZeroX;
                            Args.PointZero.Y = DSProject.Storage[DSProject.SQUARE].PointZeroY;
                            Args.offsetFrame = this.data[type].offsetFrame;
                            Args.workTravel = this.data[type].workTravel;
                            Args.fastTravel = this.data[type].fastTravel;
                            Args.CurrentConfig = ConverterHelper.getCurrentConfig();
                        let g = (await ConverterHelper.genFrame((await SPLINT.SessionsPHP.get("USER_ID", false)), DSProject.Storage.ProjectID, Args));
                        let projectPATH = ProjectHelper.getPath2AdminProject(DSProject.Storage.ProjectID);
                        SPLINT.Tools.download.download(projectPATH + "/Frame.nc", "LaserFrame__Xn" + Args.PointZero.X/ 16.4 + "_Yn" + Args.PointZero.Y/ 16.4 + "__X" + DSProject.Storage.Square.widthMM + "_Y" + DSProject.Storage.Square.heightMM +  ".nc");
                    }.bind(this);
    }
    drawgenFrameButton(){
        let container = new SPLINT.DOMElement(this.id + "genFrameButtonContainer", "div", this.contentElement);
            let button = new SPLINT.DOMElement.Button(container, "genFrame", "Frame");
                button.onclick = async function(){
                    this.drawGenFramePopup();
                    // let Args = new Object();
                    //     Args.PointZero = new Object();
                    //     Args.PointZero.X = DSProject.Storage[DSProject.SQUARE].PointZeroX;
                    //     Args.PointZero.Y = DSProject.Storage[DSProject.SQUARE].PointZeroY;
                    // let g = (await ConverterHelper.genFrame((await SPLINT.SessionsPHP.get("USER_ID", false)), DSProject.Storage.ProjectID, Args));
                    // console.log(g);
                    // let projectPATH = ProjectHelper.getPath2AdminProject(DSProject.Storage.ProjectID);
                    // console.log(DSProject, Args);
                    // download_S.download(projectPATH + "/Frame.nc", "LaserFrame__Xn" + Args.PointZero.X/ 16.4 + "_Yn" + Args.PointZero.Y/ 16.4 + "__X" + DSProject.Storage.Square.widthMM + "_Y" + DSProject.Storage.Square.heightMM +  ".nc");
                }.bind(this);
    }
}