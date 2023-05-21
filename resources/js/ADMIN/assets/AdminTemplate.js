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
    #drawHeader_back(){
      this.button_back = new SPLINT.DOMElement.Button(this.head, "back");
      this.button_back.Class("back");
      this.button_back.bindIcon("arrow_back");
      this.button_back.button.onclick = function(){
        S_Location.goto(this.locationBack).call();
      }.bind(this);
    }
  }

