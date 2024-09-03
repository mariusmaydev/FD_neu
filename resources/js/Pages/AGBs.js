
class drawAGBs extends Pages_template{
    constructor(parent = document.body){
        super("AGBs");
        this.id = "AGBs_";
        this._draw();
    }
    _draw(){
        
        // Footer.parent = this.overlay.contentElement;
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            NavBar.setSolid();
        } else {
            NavBar.setTransparent();
            Footer.desktop();
        }
        this.containerMain = new SPLINT.DOMElement(this.id + "ContainerMain", "div", this.mainElement);
        this.containerMain.Class("containerMain");
            let headline = new SPLINT.DOMElement.SpanDiv(this.containerMain, "", "Impressum");
                headline.Class("headline");
            this.containerText = new SPLINT.DOMElement(this.id + "ContainerText", "div", this.containerMain);
            this.containerText.Class("containerText");
                this.getTextContainer("name", "Name", "MariusMay")
                new SPLINT.DOMElement.HorizontalLine(this.containerText);
                this.getTextContainer("address", "Anschrift", 
                "Marius May<br> " + 
                "Wernsdorfer Straße 27a<br>" + 
                "09322 Penig")
                

        SPLINT.Events.onLoadingComplete.dispatch();
    }
    getTextContainer(name, headline, text){
        let c = new SPLINT.DOMElement(this.id + "c_" + name, "div", this.containerText);
            c.Class("c_" + name);
            c.Class("textContainer")
            let h = new SPLINT.DOMElement.SpanDiv(c, "h_" + name, headline);
                h.Class("headline");
            let p = new SPLINT.DOMElement(this.id + "p_" + name, "p", c);
                p.innerHTML = text;

        return c;

    }
} 