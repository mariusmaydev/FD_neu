
class drawFooter {
    constructor(parent = document.body, type = "Desktop"){
        this._parent = parent;
        this._type = type;
        this.id = "Footer";
        this.mainElement = null;
    }
    set parent(v){
        this._parent = v;
    }
    get parent(){
        return this._parent;
    }
    set type(v){
        this._type = v;
    }
    get type(){
        return this._type;
    }
    remove(){
        let box = document.getElementById("FooterBTContainer");
        if(this.mainElement != null){
            this.mainElement.remove();
        } else if(box != null){
            box.remove();
        }
    }
    update(){
        if(this.mainElement != null){
            this.mainElement.remove();
        }
        if(this.type == "Mobile"){
            this.mobile();
        } else {
            this.desktop();
        }
    }
    mobile(){
        this.type = "Mobile";
        this.mainElement = new SPLINT.DOMElement("FooterBody", "div", this._parent);
        this.mainElement.Class("FooterBody");
            let BTContainer = new SPLINT.DOMElement("BTContainer", "div", this.mainElement);
                BTContainer.Class("BTContainer");
                let BTContact = new SPLINT.DOMElement.Button(BTContainer, "BTContact", "Kontakt");
                    BTContact.Class("BTContact");
                let BTImprint = new SPLINT.DOMElement.Button(BTContainer, "BTImprint", "Impressum");
                    BTImprint.Class("BTImprint");
                    BTImprint.onclick = function(){
                        SPLINT.Tools.Location_old.goto(PATH.location.imprint).call();
                    }
                let BTData = new SPLINT.DOMElement.Button(BTContainer, "BTData", "Datenschutzerklärung");
                    BTData.Class("BTData");
                    BTData.onclick = function(){
                        SPLINT.Tools.Location_old.goto(PATH.location.dataProtection).call();
                    }
                let BT_AGB = new SPLINT.DOMElement.Button(BTContainer, "BT_AGB", "AGBs");
                    BT_AGB.Class("BT_AGB");
                    BT_AGB.onclick = function(){
                        SPLINT.Tools.Location_old.goto(PATH.location.AGB).call();
                    }
    

                    new SPLINT.DOMElement.HorizontalLine(this.mainElement);
            let PayingMethodsContainer = new SPLINT.DOMElement("PayingMethodsContainer", "div", this.mainElement);
                PayingMethodsContainer.Class("PayingMethodsContainer");
                let imgPaypal = new SPLINT.DOMElement("imgPaypal", "img", PayingMethodsContainer);
                    imgPaypal.src = PATH.images.PaypalLogo;
    }
    desktop(){
        this.type = "Desktop";
        this.mainElement = new SPLINT.DOMElement("FooterBody", "div", this._parent);
        this.mainElement.Class("FooterBody");
            let BTContainer = new SPLINT.DOMElement("BTContainer", "div", this.mainElement);
                BTContainer.Class("BTContainer");
                let BTContact = new SPLINT.DOMElement.Button(BTContainer, "BTContact", "Kontakt");
                    BTContact.Class("BTContact");
                let BTImprint = new SPLINT.DOMElement.Button(BTContainer, "BTImprint", "Impressum");
                    BTImprint.Class("BTImprint");
                    BTImprint.onclick = function(){
                        SPLINT.Tools.Location_old.goto(PATH.location.imprint).call();
                    }
                let BTData = new SPLINT.DOMElement.Button(BTContainer, "BTData", "Datenschutzerklärung");
                    BTData.Class("BTData");
                    BTData.onclick = function(){
                        SPLINT.Tools.Location_old.goto(PATH.location.dataProtection).call();
                    }
                let BT_AGB = new SPLINT.DOMElement.Button(BTContainer, "BT_AGB", "AGBs");
                    BT_AGB.Class("BT_AGB");
                    BT_AGB.onclick = function(){
                        SPLINT.Tools.Location_old.goto(PATH.location.AGB).call();
                    }
    

                    new SPLINT.DOMElement.HorizontalLine(this.mainElement);
            let PayingMethodsContainer = new SPLINT.DOMElement("PayingMethodsContainer", "div", this.mainElement);
                PayingMethodsContainer.Class("PayingMethodsContainer");
                let imgPaypal = new SPLINT.DOMElement("imgPaypal", "img", PayingMethodsContainer);
                    imgPaypal.src = PATH.images.PaypalLogo;
    }
    drawFooterAsBox(parent){
        let BTContainer = new SPLINT.DOMElement("FooterBTContainer", "div", parent);
            BTContainer.Class("FooterBTContainer");
            let BTContact = new SPLINT.DOMElement.Button(BTContainer, "BTContact", "Kontakt");
                BTContact.Class("BTContact");
            let BTImprint = new SPLINT.DOMElement.Button(BTContainer, "BTImprint", "Impressum");
                BTImprint.Class("BTImprint");
                BTImprint.onclick = function(){
                    SPLINT.Tools.Location_old.goto(PATH.location.imprint).call();
                }
            let BTData = new SPLINT.DOMElement.Button(BTContainer, "BTData", "Datenschutzerklärung");
                BTData.Class("BTData");
                BTData.onclick = function(){
                    SPLINT.Tools.Location_old.goto(PATH.location.dataProtection).call();
                }
            let BT_AGB = new SPLINT.DOMElement.Button(BTContainer, "BT_AGB", "AGBs");
                BT_AGB.Class("BT_AGB");
                BT_AGB.onclick = function(){
                    SPLINT.Tools.Location_old.goto(PATH.location.AGB).call();
                }
    }
}
const Footer = new drawFooter();