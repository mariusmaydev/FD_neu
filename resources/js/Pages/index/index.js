
class drawIndex extends Pages_template {
    constructor(){
        super("index");
        this.id = "Index_";
        this._draw();
        

    }
    _draw(){
        this.overlay = new indexOverlay(this);
        Footer.parent = this.overlay.contentElement;
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            Footer.mobile();
        } else {
            Footer.desktop();
        }
        this.Lighter = new drawLighter3D(this.mainElement, "test", drawLighter3D.INDEX);


        let offsetStart = 0;
        this.Lighter.canvas.ontouchstart = function(e){
            offsetStart = e.touches[0].pageY;
            this.overlay.dynamicScrollStart();
        }.bind(this)
        this.Lighter.canvas.ontouchend = function(e){
            this.overlay.dynamicScrollEnd();
        }.bind(this)
        let touchStartPosX = 0;
        window.addEventListener('touchmove', function (evt){
                var touch = evt.touches[0];  
                var x = Number(touch.pageX); 
                var y = Number(touch.pageY);  
        
                    var rate = 0;
        
                    let end = x;
                    let offsetEnd = y;
                    console.log(offsetStart, offsetEnd)
                    rate = 100/ window.innerHeight * (offsetEnd - offsetStart);
                    if(this.overlay.dynamicScroll(rate) == true){
                        offsetStart = y;
                    };
        }.bind(this));
        this.Lighter.canvas.onwheel = function(e){
            let deltaY = e.deltaY;
            // console.log(e);
            if(deltaY > 0){
                this.overlay.scrollDown();
            } else {
                this.overlay.scrollUp();
            }
        }.bind(this);
        // this.linkImprint = new SPLINT.DOMElement.Button(this.mainElement, "imprint", "Impressum");
        // this.linkImprint.Class("linkImprint");
        // this.linkImprint.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
        // this.linkImprint.onclick = function(){
        //     S_Location.goto(PATH.location.imprint).call();
        // }
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
