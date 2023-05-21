
class drawIndex extends Pages_template {
    constructor(){
        super("index");
        this.id = "Index_";
        this._draw();
    }
    _draw(){
        this.overlay = new indexOverlay(this);
        this.Lighter = new drawLighter3D(this.mainElement, "test", drawLighter3D.INDEX);

        this.Lighter.canvas.onwheel = function(e){
            let deltaY = e.deltaY;
            if(deltaY > 0){
                this.overlay.scrollDown();
            } else {
                this.overlay.scrollUp();
            }
        }.bind(this);
        this.linkImprint = new SPLINT.DOMElement.Button(this.mainElement, "imprint", "Impressum");
        this.linkImprint.Class("linkImprint");
        this.linkImprint.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
        this.linkImprint.onclick = function(){
            S_Location.goto(PATH.location.imprint).call();
        }
    }
    drawButtonDiv(){
        this.buttonDiv = new SPLINT.DOMElement(this.id + "buttonDiv", "div", this.informationDiv);
        this.buttonDiv.Class("buttonDiv");
        let button_create = new SPLINT.DOMElement.Button(this.buttonDiv, "create", "jetzt erstellen");
            button_create.setStyleTemplate(S_Button.STYLE_NONE);
            button_create.button.Class("create");
            button_create.button.onclick = function(){
                let obj = new SPLINT.autoObject();
                    obj.click = true;
                this.Lighter.sendToRenderer(obj);
            }.bind(this);
    }

}
