
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

        // let touchPos = new Object();
        //     touchPos.Y = 0;
        //     touchPos.X = 0;

        let offsetStart = 0;
        this.Lighter.canvas.ontouchstart = function(e){
            offsetStart = e.touches[0].pageY;
            // touchPos.X = Math.round(e.touches[0].screenX);
            // touchPos.Y = e.touches[0].screenY;
            // console.log(e);
        }
        let touchStartPosX = 0;
        window.addEventListener('touchmove', function (evt){
            //evt.preventDefault();
            // try{
                var deviceHeight = window.innerHeight;
                var touch = evt.touches[0]; //获取第一个触点  
                var x = Number(touch.pageX); //页面触点X坐标  
                var y = Number(touch.pageY); //页面触点Y坐标  
                //记录触点初始位置  
        
                // if((y - offsetStart) > 0 && document.body.scrollTop == 0){
                    // evt.preventDefault();
                    var page = document.getElementsByClassName('tweet-page')[0];
                    var rate = 0;
        
                    let end = x;
                    let offsetEnd = y;
                    rate = (offsetEnd - offsetStart) / ( deviceHeight);
        
                    //tool.print(rate);
                    if(rate >= 0.3){
                        this.overlay.scrollUp();
                        offsetStart = offsetEnd;
                    } else if(rate <= -0.3) {
                        this.overlay.scrollDown();
                        offsetStart = offsetEnd;
                    }
                    console.log(page, rate);
                    // easing.pullMotion(page, rate);
                // }
        
            // }catch(e){
            //     alert(e.message);
            // }
        }.bind(this));
        // this.Lighter.canvas.ontouchmove = function(e){
        //     let deltaX = Math.round(touchPos.X);
        //     let deltaY = e.touches[0].clientY - touchPos.Y;
        //     console.log(e);
        //     if(touchPos.X === Math.round(e.touches[0].screenX)){
        //         return;
        //     }
        //     // if(deltaX === touchStart)
        //     if(deltaY > 0){
        //         this.overlay.scrollDown();
        //     } else {
        //         this.overlay.scrollUp();
        //     }
        // }.bind(this);
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
