
class ADMIN_index extends ADMIN_DrawTemplate {
    constructor(){
        super("index");
    }
    async draw(){
        this.icon = new SPLINT.DOMElement(this.id + "_icon", "img", this.mainElement);
        this.icon.Class("logo-icon").set();
        this.icon.src = PATH.images.logo;

        this.loginDiv = new SPLINT.DOMElement(this.id + "loginContainer1", "div", this.mainElement);
        this.loginDiv.Class("loginContainer");
            let login_name = new SPLINT.DOMElement.SpanDiv(this.loginDiv, "UserName", (await ADMIN_loginFuncs.UserName));
                login_name.Class("UserName");
            let bt_logout = new SPLINT.DOMElement.Button(this.loginDiv, "logout1");
                bt_logout.bindIcon("logout");
                bt_logout.setTooltip("abmelden", "bottom")
                bt_logout.onclick = function(){
                    ADMIN_loginFuncs.logout();
                }

        this.navigationMenu = new ADMIN_NavigationMenu(this.mainElement);   
        this.navigationMenu.draw();
    }
}