
class Pages_template {
    constructor(name, pre = false){
        this.id = "Page_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", document.body);
        if(pre) {
            this.mainElement.setAttribute("loaded1", true);
        }
        this.mainElement.Class("Pages_MAIN");
        this.draw();
    }
    draw(){
    }
    clear(){
      this.mainElement.innerHTML = "";
    }
}