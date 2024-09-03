
class ToolBar_LighterSettings {
    static instance = null;
    constructor(parent){
        this.parent = parent;
        this.id = parent.id + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
        this.mainElement.Class("mainContent");
        this.draw();
        this.drawContent();
        ToolBar_LighterSettings.instance = this;
    }
    static blur(){
        this.instance.blur();
    }
    draw(){
        this.expanderBody = new SPLINT.DOMElement(this.id + "_expanderBody", "div", this.mainElement);
        this.expanderBody.Class("expanderBody");
            this.expander = new SPLINT.DOMElement.Button.Switch(this.expanderBody, "Expander");
            this.expander.disableStandardSwitch();
            this.expander.button.Class("expander");
            this.expander.bindIcon("expand_more");
            this.expander.onactive = function(){
                this.expander.bindIcon("expand_less");
            }.bind(this);
            
            this.expander.onpassive = function(){
                this.expander.bindIcon("expand_more");
            }.bind(this);

            this.expander.onchange = function(state){
                if(state == "passive"){
                    this.blur();
                } else {
                    this.focus();
                }
            }.bind(this);
            this.expander.unsetActive();
            this.blur();

            let headline = new SPLINT.DOMElement.SpanDiv(this.expanderBody, "headline", "Farbe ändern");
                headline.Class("headline");
                headline.div.onclick = function(){
                    this.expander.button.click();
                }.bind(this);

        new SPLINT.DOMElement.HorizontalLine(this.mainElement);
    }
    blur(){
        this.mainElement.state().unsetActive();
        this.expander.unsetActive();
    }
    focus(){
        this.mainElement.state().setActive();
        this.expander.setActive();
    }
    async getProductDataFull(){
        this.productDataFull = await productHelper.getProducts();
        this.productData     = this.productDataFull[DSProject.Storage.Product]
        // console.dir(DSProject.Storage.EPType);
    }
    async drawContent(){
        this.contentElement = new SPLINT.DOMElement(this.id + "Content", "div", this.mainElement);
        this.contentElement.Class("content");
        await this.getProductDataFull();
        // let EPTypeContainer = new SPLINT.DOMElement(this.id + "EPTypeContainer", "div", this.contentElement);
        //     EPTypeContainer.Class("EPTypeContainer");
        //     let EPTypeContainerHeadline = new SPLINT.DOMElement.SpanDiv(EPTypeContainer, "headline", "Beschichtung");
        //         EPTypeContainerHeadline.Class("headline");
        //     let EPTypeContainerContent = new SPLINT.DOMElement(this.id + "EPTypeContainerContent", "div", EPTypeContainer);
        //         EPTypeContainerContent.Class("contentElement");

        //     this.drawEPTypeMenu(EPTypeContainerContent);
        
        let ColorContainer = new SPLINT.DOMElement(this.id + "colorContainer", "div", this.contentElement);
            ColorContainer.Class("colorContainer");
            let ColorContainerHeadline = new SPLINT.DOMElement.SpanDiv(ColorContainer, "headline", "Farbe");
                ColorContainerHeadline.Class("headline");
            let ColorContainerContent = new SPLINT.DOMElement(this.id + "colorContainerContent", "div", ColorContainer);
                ColorContainerContent.Class("contentElement");

            this.drawColorMenu(ColorContainerContent);

    }
    async drawEPTypeMenu(parent = document.getElementById(this.id + "EPTypeContainerContent")){
        parent.clear();
        let products = await productHelper.getProducts();
        let colors = await productHelper.getColors();
        for(const [key, value] of Object.entries(products)){
            if(value.colorID == DSProject.Storage.Color){
                let btContainer = new SPLINT.DOMElement("btEPTypeContainer_" + value.EPType, "div", parent);
                    btContainer.setAttribute("value", value.EPType)

                    if(value.EPType == DSProject.Storage.EPType){
                        btContainer.state().setActive();
                    }

                    let text = "999er Feingold"
                    if(value.EPType == "CHROME"){
                        text = "Chrom hochglanz";
                    }
                    let btEPType = new SPLINT.DOMElement.Button(btContainer, "btEPType_" + value.EPType, text)
                        btEPType.Class("btColor");
                        btEPType.button.setAttribute("EPType", value.EPType);
                        btEPType.onclick = async function(){
                            ConverterHelper.setEPType(value.EPType);
                            CONVERTER_STORAGE.lighter3D.send("changeColor", colors[value.colorID]);
                            DSProject.Storage.Product = value.name;
                            DSProject.Storage.Color = value.colorID;
                            DSProject.save();
                            this.drawColorMenu();
                            for(const ele of parent.children) {
                                ele.state().unsetActive();
                            }
                            btContainer.state().setActive();
                        }.bind(this);
            }
        }
    }
    
    async drawColorMenu(parent = document.getElementById(this.id + "colorContainerContent")){
        parent.clear();
        let colors = await productHelper.getColors();
        for(const [key, value] of Object.entries(colors)){
            let product = await productHelper.getProduct_ColorEPType(key, DSProject.Storage.EPType);
            
            if(product == false){
               continue;
            }
            let btColor = new SPLINT.DOMElement.Button(parent, "btColor_" + key)
                btColor.Class("btColor");
                btColor.setAttribute("colorid", key);
                btColor.button.style.backgroundColor = value.hex.replace('0x', '#');
                if(key == "base"){
                    btColor.button.style.backgroundImage = "url(" + SPLINT.projectRootPath + "../data/images/LighterBaseColor.png)";
                }
                btColor.onclick = async function(){
                    CONVERTER_STORAGE.lighter3D.send("changeColor", value);
                    DSProject.Storage.Product = product.name;
                    DSProject.Storage.Color = key;
                    await DSProject.saveAsync();
                    // this.drawEPTypeMenu();
                }.bind(this);
        }
    }
}