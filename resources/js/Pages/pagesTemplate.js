
class Pages_template {
    constructor(name){
        this.id = "Page_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", document.body);
        this.mainElement.Class("Pages_MAIN");
        this.draw();
    }
    draw(){
    }
    clear(){
      this.mainElement.innerHTML = "";
    }
}