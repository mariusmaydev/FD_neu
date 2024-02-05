
class drawImprint extends Pages_template{
    constructor(parent = document.body){
        super("imprint");
        this.id = "Imprint_";
        this._draw();
    }
    _draw(){
        
        // Footer.parent = this.overlay.contentElement;
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            Footer.mobile();
        } else {
            Footer.desktop();
        }
        this.background = new drawBackground3D(document.body, "back", "medium");
        this.background.div.before(this.mainElement);
        this.containerMain = new SPLINT.DOMElement(this.id + "ContainerMain", "div", this.mainElement);
        this.containerMain.Class("containerMain");
            let headline = new SPLINT.DOMElement.SpanDiv(this.containerMain, "", "Impressum");
                headline.Class("headline");
            this.getTextContainer("name", "Name", "MariusMay")
            this.getTextContainer("address", "Anschrift", 
            "Marius May<br> " + 
            "Wernsdorfer Straße 27a<br>" +
            "09322 Penig")
                

        SPLINT.Events.onLoadingComplete.dispatch();
    }
    getTextContainer(name, headline, text){
        let c = new SPLINT.DOMElement(this.id + "c_" + name, "div", this.containerMain);
            c.Class("c_" + name);
            c.Class("textContainer")
            let h = new SPLINT.DOMElement.SpanDiv(c, "h_" + name, headline);
                h.Class("headline");
            let p = new SPLINT.DOMElement(this.id + "p_" + name, "p", c);
                p.innerHTML = text;

        return c;

    }
} 