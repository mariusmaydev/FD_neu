
class drawIndex extends Pages_template {
    constructor(){
        super("index");
        this.id = "Index_";
        this._draw();
    }
    _draw(){       
        
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            NavBar.setSolid();
            NavBar.burgerMenu.onOpen = function(){
                this.Lighter.send("interaction", false);
            }.bind(this);
        } else {
            NavBar.setTransparent();
        }
        this.overlay = new indexOverlay(this);
        Footer.parent = this.overlay.contentElement;
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            Footer.remove();
        } else {
            Footer.desktop();
        }
        this.Lighter = new drawLighter3D(this.mainElement, "test", drawLighter3D.INDEX, null, false, false);
        this.Lighter.saveContext = false;


        let offsetStart = 0;
        this.Lighter.canvas.ontouchstart = function(e){
            offsetStart = e.touches[0].pageY;
            this.overlay.dynamicScrollStart();
        }.bind(this)
        this.Lighter.canvas.ontouchend = function(e){
            this.overlay.dynamicScrollEnd();
        }.bind(this)
        let touchStartPosX = 0;
        let listener = window.SEvent.addListener('touchmove', function (evt){
                if(NavBar.burgerMenu.isOpen){
                    return;
                }
                var touch = evt.touches[0];  
                var x = Number(touch.pageX); 
                var y = Number(touch.pageY);  
        
                    var rate = 0;
        
                    let end = x;
                    let offsetEnd = y;
                    rate = 100/ window.innerHeight * (offsetEnd - offsetStart);
                    if(this.overlay.dynamicScroll(rate) == true){
                        offsetStart = y;
                    };
        }.bind(this));
        SPLINT.Events.onPopStateChange = function(){
            listener.remove();
            // console.dir(window.SEvent);
        }
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
        //    SPLINT.Tools.Location_old.goto(PATH.location.imprint).call();
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
