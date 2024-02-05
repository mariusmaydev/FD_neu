
class drawCart extends Pages_template {
    constructor() {
        super("cart");
    }
    draw(){
        let background = new drawBackground3D(document.body, "back3D", "medium");
            background.div.before(this.mainElement);
        NavBar.grow();
        this.right = new drawCartRight(this.mainElement);
        this.list = new drawCartList(this.mainElement);
        
        // Footer.parent = this.mainElement;
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            Footer.mobile();
        } else {
            Footer.desktop();
        }
        SPLINT.Events.onLoadingComplete = function(){
            this.mainElement.setAttribute("loaded", true);
        }.bind(this);
        SPLINT.Events.onLoadingComplete.dispatch();
        // if(SPLINT.ViewPort.getSize() == "mobile-small"){
        //     let footer = new SPLINT.DOMElement(this.id + "footer", "div", this.mainElement);
        //         footer.Class("footer");
        //         let s = new SPLINT.DOMElement.SpanDiv(footer, "t", "test");
        // }
    }

}
