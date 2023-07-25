

class NavigationBar {
    constructor() {
        this.mainElement = document.getElementById("NavigationBar");
        this.mainElement.Class("NavigationBar");
        this.contentElement = new SPLINT.DOMElement("NavigationBar_content", "div", this.mainElement);
        this.contentElement.Class("content");
        this.cart = new Object();
        SPLINT.Events.onLoadingComplete = async function(){
            await this.drawCart();
            this.mainElement.setAttribute("loaded", true);
        }.bind(this);
        this.draw();
    }
    hide(){
        this.mainElement.style.visibility = "hidden";
    }
    draw(){
        this.drawLogo();
        this.drawNewProject();
    }
    drawNewProject(){
        this.design = new Object();
        this.design.div = new SPLINT.DOMElement("NavBar_DesignDiv", "div", this.contentElement);
        this.design.div.Class("Design");
            this.design.button = new SPLINT.DOMElement.Button(this.design.div, "design", "jetzt entwerfen");
            this.design.button.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
            // this.design.button.bindIcon("Add");
            this.design.button.button.onclick = function() {
                S_Location.goto(PATH.location.converterStart).call();
                // openConverter();
            }
    }
    drawLogo(){
        this.logo = new Object();
        this.logo.div = new SPLINT.DOMElement("NavBar_LogoDiv", "div", this.contentElement);
        this.logo.div.Class("Logo");
            this.logo.content = new SPLINT.DOMElement("NavBar_LogoContent", "div", this.logo.div);
            this.logo.content.Class("content");
                this.logo.img = new SPLINT.DOMElement("NavBar_LogoImg", "img", this.logo.content);
                this.logo.img.src = PATH.images.logo;
                this.logo.img.onclick = function(){
                    S_Location.goto(PATH.location.index).call();
                }
    }
    async drawCart(){
        this.cart.div = new SPLINT.DOMElement("NavBar_CartDiv", "div", this.contentElement);
        this.cart.div.Class("Cart");
        return new Promise(async function(resolve){
            let cartData = (await ShoppingCart.get()).shoppingCart;
            if(cartData != null && cartData.length > 0){
                this.drawCartPoint(cartData.length);
            } else if(this.cart.point != undefined){
                this.cart.point.div.style.visibility = "hidden";
            }
            this.cart.button = new SPLINT.DOMElement.Button(this.cart.div, "shoppingCart");
            this.cart.button.bindIcon("shopping_cart");
            this.cart.button.button.onclick = function(){
                // SPLINT.Tools.Location.addHash("test", "test2");
                S_Location.goto(PATH.location.cart).call();
            }
            resolve();
        }.bind(this));

    }
    drawCartPoint(amount = 0){
        this.cart.point = new SPLINT.DOMElement.SpanDiv(this.cart.div, "point", amount);
        this.cart.point.div.Class("cartPoint");
        this.cart.point.div.onclick = function(){
            this.cart.button.button.click();
        }.bind(this);

    }
    async updateCart(cartData = null){
        if(cartData == null){
            cartData = (await ShoppingCart.get()).shoppingCart;
        }
        if(cartData.length == 0){
            this.cart.point.div.remove();
            this.cart.point = undefined;
            return;
        }
        if(this.cart.point == undefined){
            this.drawCartPoint(cartData.length);
        } else {
            this.cart.point.value = cartData.length;
        }
    }
    static update(){
        new NavigationBar();
    }
}
const NavBar = new NavigationBar();