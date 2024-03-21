
class ProjectDetailsHelper {
    constructor(instance){
        this.inst = instance;
    }
    drawButtonColor(parent){  
        let buttonColor = new SPLINT.DOMElement.Button.Switch(parent, "color", "Farbe ändern");
            buttonColor.Class("color");
            buttonColor.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT)
            buttonColor.onactive = function(){
                this.inst.lighter.send("changeColor", "green");
                this.inst.lighter.canvas.setAttribute("changeColor", "green")
                this.inst.lighter.div.setAttribute("changeColor", "green")
            }.bind(this);
            buttonColor.onpassive = function(){
                this.inst.lighter.send("changeColor", "base");
                this.inst.lighter.canvas.setAttribute("changeColor", "base")
                this.inst.lighter.div.setAttribute("changeColor", "base")
            }.bind(this);
        return buttonColor;
    }
    drawButtonEdit(parent){
        let buttonEdit = new SPLINT.DOMElement.Button.Switch(parent, "edit", "bearbeiten");
            buttonEdit.Class("edit");
            buttonEdit.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT)
            // buttonEdit.bindIcon("edit");
            buttonEdit.onclick = async function(e){
                e.stopPropagation();
                if(this.inst.data.State == ProjectHelper.STATE_NORMAL){
                    ProjectHelper.CONVERTER_startProject(this.inst.data.ProjectID, false);
                } else if(this.inst.data.State == "ADMIN"){
                    let projectID = await ProjectHelper.copy(this.inst.data.ProjectID, "admin");
                    ProjectHelper.CONVERTER_startProject(projectID, false);
                }
            }.bind(this);
    }

    drawButtonSize(parent){
        let buttonSize = new SPLINT.DOMElement.Button.Switch(parent, "size", "Maße anzeigen");
            buttonSize.Class("size");
            buttonSize.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT)
            buttonSize.onactive = function(){
                this.inst.lighter.send("showDimensions", true);
                this.inst.lighter.canvas.setAttribute("showDimensions", "true")
                this.inst.lighter.div.setAttribute("showDimensions", "true")
            }.bind(this);
            buttonSize.onpassive = function(){
                this.inst.lighter.send("showDimensions", false);
                this.inst.lighter.canvas.setAttribute("showDimensions", "false")
                this.inst.lighter.div.setAttribute("showDimensions", "false")
            }.bind(this);
    }
    async drawEPTypeMenu(parent = document.getElementById(this.inst.id + "EPTypeContainerContent")){
        parent.clear();

        for(const [key, value] of Object.entries(this.inst.productDataFull)){
            if(value.colorID == this.inst.productData.colorID){
                // let product = await productHelper.getProduct_ColorEPType(value.colorName, this.data.EPType);
                let btContainer = new SPLINT.DOMElement("btEPTypeContainer_" + value.EPType, "div", parent);
                    btContainer.setAttribute("value", value.EPType)

                    if(value.EPType == this.inst.productData.EPType){
                        btContainer.state().setActive();
                    }

                    let text = "999er Feingold"
                    if(value.EPType == "CHROME"){
                        text = "Chrom hochglanz";
                    }
                    let btEPType = new SPLINT.DOMElement.Button(btContainer, "btEPType_" + value.EPType, text)
                        btEPType.Class("btColor");
                        btEPType.button.setAttribute("EPType", value.EPType);
                        btEPType.onclick = function(){
                            this.inst.lighter.send("changeEPType", value.EPType);
                            this.inst.data.Product = key;
                            this.inst.data.EPType = value.EPType;
                            this.inst.productData = value;
                            this.inst.priceElement.setPrice(value.price);
                            this.inst.clearImages();
                            this.inst.drawImageList();
                            this.inst.drawImageMain();
                            this.drawColorMenu();
                            for(const ele of parent.children) {
                                ele.state().unsetActive();
                            }
                            btContainer.state().setActive();
                        }.bind(this);
            }
        }
    }
    
    async drawColorMenu(parent = document.getElementById(this.inst.id + "colorContainerContent")){
        parent.clear();
        let colors = await productHelper.getColors();
        for(const [key, value] of Object.entries(colors)){
            let product = await productHelper.getProduct_ColorEPType(key, this.inst.data.EPType);
            
            if(product == false){
                continue;
            }
            let btColor = new SPLINT.DOMElement.Button(parent, "btColor_" + key)
                btColor.Class("btColor");
                btColor.button.style.backgroundColor = value.hex.replace('0x', '#');
                btColor.onclick = function(){
                    this.inst.lighter.send("changeColor", value);
                    this.inst.data.Color = key;
                    this.inst.data.Product = product.name;
                    ProjectHelper.edit(this.inst.data);
                    // this.data
                    this.inst.productData = product;
                    this.inst.priceElement.setPrice(product.price);
                    this.inst.clearImages();
                    this.inst.drawImageList();
                    this.inst.drawImageMain();
                    this.drawEPTypeMenu();
                }.bind(this);
        }
    }
}