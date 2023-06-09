class ADMIN_DrawTemplate {
    constructor(name){
        this.id = "ADMIN_" + name;
        this.head = new SPLINT.DOMElement(this.id + "_head", "div", document.body);
        this.head.Class("head");
        this.mainElement = new SPLINT.DOMElement(this.id, "div", document.body);
        this.mainElement.Class("main");
        this.locationBack = PATH.location.ADMIN.index;
        this.#drawHeader_back();
        this.draw();
    }
    draw(){
    }
    clear(){
      this.mainElement.innerHTML = "";
    }
    async #drawHeader_back(){
      this.button_back = new SPLINT.DOMElement.Button(this.head, "back");
      this.button_back.Class("back");
      this.button_back.setTooltip("zur Startseite", "right")
      this.button_back.bindIcon("arrow_back");
      this.button_back.button.onclick = function(){
        S_Location.goto(this.locationBack).call();
      }.bind(this);
      
      if((await ADMIN_loginFuncs.isLoggedIn())){
        this.loginDiv = new SPLINT.DOMElement(this.id + "loginContainer", "div", this.head);
        this.loginDiv.Class("loginContainer");
            let bt_logout = new SPLINT.DOMElement.Button(this.loginDiv, "logout");
                bt_logout.bindIcon("logout");
                bt_logout.setTooltip("abmelden", "left")
                bt_logout.onclick = function(){
                    ADMIN_loginFuncs.logout();
                }
        }
    }
  }

