
class ImageMenuFilter {
  constructor(parent, index = 0, ImageMenuInstance = null){
    this.ImageMenuInstance = ImageMenuInstance;
    this.parent = parent;
    this.index = index;
    this.id = "ImageMenuFilter_" + index;
    this.mainElement = new SPLINT.DOMElement(this.id + "_MAIN", "div", parent);
    this.mainElement.Class("ImageMenuFilter");
    this.onsearch = function(){};
    this.draw();
  }
  draw(){
    let buttonCloseContainer = new SPLINT.DOMElement(this.id + "closeContainer", "div", this.mainElement);
        buttonCloseContainer.Class("buttonCloseContainer");
        let buttonClose = new SPLINT.DOMElement.Button(buttonCloseContainer, this.id + "close");
            buttonClose.bindIcon("close");
            buttonClose.Class("closeBT");
            buttonClose.onclick = function(){
                this.ImageMenuInstance.close();
            }.bind(this);
    this.searchBar = new SPLINT.DOMElement.InputDiv(this.mainElement, "searchBar", "suche");
    this.searchBar.type = "text";
    this.searchBar.input.autocomplete = true;
      let bt = this.searchBar.drawToggleButton();
          bt.bindIcon("search");
          bt.onchange = function(){
            this.onsearch(this.searchBar.value);
          }.bind(this);
        SPLINT.Events.KeyEvent.new(this.searchBar.input, SPLINT.Events.KeyEvent.KEY_DOWN, function(e){
          if(e.key == 'Enter'){
            bt.button.click();
          }
        });
  }
  drawModeSwitch(){
  }
}
