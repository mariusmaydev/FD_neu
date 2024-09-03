
class NavigationBarDesktop {
    constructor(parent){
        this.contentElement = parent;
    }
    draw(){
        this.drawLogo();
        this.drawCreateNow();
        this.drawOriginal()
    }
    drawLogo(){
        this.logo = new Object();
        this.logo.div = new SPLINT.DOMElement("NavBar_LogoDiv", "div", this.contentElement);
        this.logo.div.Class("Logo");
            this.logo.inner = new SPLINT.DOMElement("NavBar_LogoInner", "div", this.logo.div);
            this.logo.inner.Class("inner");
            this.logo.inner.onclick = function(){
                // LoaderMain.goto("index");
            }
                this.logo.inner1 = new SPLINT.DOMElement("NavBar_LogoInner1", "div", this.logo.inner);
                this.logo.inner1.Class("inner1");
                    this.logo.content = new SPLINT.DOMElement("NavBar_LogoContent", "div", this.logo.inner1);
                    this.logo.content.Class("content");
                        this.logo.img = new SPLINT.DOMElement("NavBar_LogoImg", "img", this.logo.content);
                        this.logo.img.src = PATH.images.logo;
                        this.logo.img.onclick = function(){
                            LoaderMain.goto("index");
                        }
    }
    drawCreateNow(){
        this.createNow = new Object();
        this.createNow.div = new SPLINT.DOMElement("NavBar_DesignDiv", "div", this.contentElement);
        this.createNow.div.Class("Design");
            this.createNow.button = new SPLINT.DOMElement.Button(this.createNow.div, "design", "jetzt entwerfen");
            this.createNow.button.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
            this.createNow.button.button.onclick = function() {
                
               LoaderMain.goto("converterStart");
            }
    }
    drawOriginal(){
        this.original = new Object();
        this.original.div = new SPLINT.DOMElement("NavBar_OriginalDiv", "div", this.contentElement);
        this.original.div.Class("Original");
            this.original.button = new SPLINT.DOMElement.Button(this.original.div, "original", "Originale");
            this.original.button.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
            this.original.button.button.onclick = function() {
                LoaderMain.goto("converterStart", "originals");
            }
    }
}