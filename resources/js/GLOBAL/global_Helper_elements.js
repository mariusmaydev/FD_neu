
class ImageElement extends DOMElement {
  constructor(name, parent){
    super(name + "_img", "img", parent);
    this.name = name;
    this.onerror = function(){
      this.src = PATH.images.errorSRC;
    }
    return this;
  }
}
let test = new Object();
    test.a = "ok";
    test.a

class FileUploadButton extends S_Button {
  constructor(parent, name, accept, type){
    super(parent, name);
    this.parent = parent;
    this.name   = name;
    this.accept = accept;
    this.type   = type;
    this.onsuccess = function(data){};
    this.id     = "ImageUpload_" + name;
    this.#draw();
  }
  preventDirect(){
    this.#draw(true);
  }
  get FileData(){
    return this.file_data;
  }
  #draw(preventDirect = false){
    this.input = new SPLINT.DOMElement(this.id + "_input", "input", this.parent);
    this.input.type = "file";
    this.input.accept = this.accept;
    this.input.name = "inputfile";
    this.input.oninput = function(){
            if(preventDirect){
              this.file_data = FileUpload.getFileData(this.input);
            } else {
              FileUpload.direct(this.input, this.type, this.onsuccess);
            }
          // UploadDirect(this.input);
          this.input.clear();
        }.bind(this);
  
    this.button.onclick = function(){
          this.input.click();
        }.bind(this);
  }
}


  
  function getElement(id, type, parentID, grandfatherElementID){
    if(grandfatherElementID != undefined && HasChild(grandfatherElementID, id)){
      document.getElementById(id).innerHTML = "";
        return document.getElementById(id);
    } else if(grandfatherElementID == undefined && document.getElementById(id) != null){
        document.getElementById(id).innerHTML = "";
        return document.getElementById(id);
    } else {
        let element = document.createElement(type);
        element.id = id;
        element.innerHTML = "";
        document.getElementById(parentID).append(element);
        return element;
    }
  }

  
  function HasChild(grandfatherElementID, childID){
    let children = document.getElementById(grandfatherElementID).getElementsByTagName("*");
    for(let i = 0; i < children.length; i++){
      if(children[i].id == childID){
        return true;
      }
    }
    return false;
  }

  class Spinner {
    constructor(parent, name){
      this.id     = parent.id + "_" + name;
      this.parent = parent;
      this.mainElement = new SPLINT.DOMElement(this.id, "div", parent);
      this.mainElement.Class("Spinner");
    }
    toggle(isVissible = true){
      if(isVissible){
        this.mainElement.style.visibility = "visibile";
      } else {
        this.mainElement.style.visibility = "hidden";
      }
    }
    remove(){
      this.mainElement.remove();
    }
    get(){
      return this.mainElement;
    }
  }





  function drawSimpleElement(parent, value = " ", name = null){
    value = value.replace(" ", "\xa0");
    if(name == null){
      name = 0;
      while(document.getElementById(parent.id + "_" + name + "_simple" + "_div") != null){
        name++;
      }
    }
    let main = new SPLINT.DOMElement.SpanDiv(parent, name + "_simple", value);
    return main;
  }


HTMLElement.prototype.addKeyInput = function(type = KeyInput.KEY_DOWN, func, sync = true){
  return new KeyInput(this, type, func, sync);
}
class KeyInput {
  static KEY_DOWN   = 'keydown';
  static KEY_UP     = 'keyup';
  static KEY_PRESS  = 'keypress';
  static list = [];

  constructor(parent, type = KeyInput.KEY_DOWN, func, sync = true){
    KeyInput.list.push(this);
    this.parent = parent;
    this.type   = type;
    this.sync   = sync;
    this.key    = null;
    this.active = true;
    this.func   = function(f, e){
                    if(!this.active || (this.key != null && this.key != e.key)){
                      return;
                    }
                    func.call(this, e);
                  }.bind(this, func);
    this.#init();
    this.remove = function(){
      this.#remove();
    }.bind(this);
  }
  f1(){
    if(this.key != null){
    }
    console.log(this.key);
  }
  #remove(){
    this.parent.removeEventListener(this.type, this.func, !this.sync);
    KeyInput.list.splice(KeyInput.list.indexOf(this.constructor), 1);
  }
  #init(){
    this.parent.addEventListener(this.type, this.func, !this.sync);
  }
  get activeEvents(){
    return KeyInput.list;
  }
  pause(){
    this.active = false;
  }
  wakeUp(){
    this.active = true;
  }
  static new(parent, type = KeyInput.KEY_DOWN, func){
    let event = new KeyInput(parent, type, func);
    return event;
  }
}