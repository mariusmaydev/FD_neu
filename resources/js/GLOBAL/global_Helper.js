  
  var CursorFlag          = false;


  class SVG_preLoader {
    constructor(){
      this.SVG = new Object();
    }
    load(name, path = PATH.svg.arrow.turn, color = null){
      this.SVG[name] = new SVG_object(name, path, color);
    }
    get(name){
      return this.SVG[name];
    }
    remove(name){
      delete this.SVG[name];
    }
  }

  class SVG_object{
    constructor(name, path, color = null){
      this.name = name;
      this.path = path;
      this.color = color;
      this.src = new Image();
      this.load();
    }
    load(){
      let img = new Image();
          img.src = this.path;
          if(this.color != null){
            img.onload = function(){
              let canvas = document.createElement("canvas");
                  canvas.width  = Math.abs(img.width);
                  canvas.height = Math.abs(img.height);
              let ctx = canvas.getContext('2d');
                  ctx.imageSmoothingEnabled = true;
                  ctx.imageSmoothingQuality = "high";
                  ctx.drawImage(img, 0, 0, Math.abs(img.width), Math.abs(img.height));
                  ctx.globalCompositeOperation = "source-in";
                  ctx.fillStyle = this.color;
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  ctx.globalCompositeOperation = "source-over";
              this.src.src = canvas.toDataURL('image/png', 1);
        
              canvas.remove();
            }.bind(this);
          } else {
            this.src.src = img.src;
          }
    }
  }


  class FileUpload {
    static CONVERTER_IMG  = "CONVERTER_IMG";
    static UNSPLASH_IMG   = "UNSPLASH_IMG";
    static PRODUCT_IMG    = "PRODUCT_IMG";

    static PATH = PATH.php.upload;

    constructor(file_data, dst){
      this.file_data    = file_data;
      this.dst          = dst;
      this.data         = new FormData();
      this.data.append("METHOD", dst);
      this.data.append("file", file_data);
      this.onsuccess  = function(data){}; 
    }
    static getFileData(srcElement){
      let element = $('#' + srcElement.id);
      if (typeof element.prop('files')[0] != 'undefined') {
        return element.prop('files')[0];
      } else {
        return false;
      }
    }
    static direct(srcElement, type, onsuccess){
      let file_data = FileUpload.getFileData(srcElement);
      
      if(file_data != false){
        let fileUpload = new FileUpload(file_data, type);
            fileUpload.onsuccess = onsuccess;
            fileUpload.upload();
        return true;
      }
      return false;
    }
    static fromUnsplash(link, callBack){
      let data = CallPHP_S.getCallObject(FileUpload.UNSPLASH_IMG);
          data.link = link;
      CallPHP_S.call(FileUpload.PATH, data, "POST", false, callBack);
    }
    upload(){
      let ajaxData = new Object();
          ajaxData.url          = FileUpload.PATH;
          ajaxData.type         = "POST";
          ajaxData.contentType  = false;
          ajaxData.processData  = false;
          ajaxData.data         = this.data;
          ajaxData.async        = true;
          ajaxData.success      = function(data){
            this.onsuccess(data);
          }.bind(this);
      $.ajax(ajaxData);
    }
  }



  

  function deepClone(obj) {
    if (obj === null || typeof obj !== "object")
      return obj
    var props = Object.getOwnPropertyDescriptors(obj)
    for (var prop in props) {
      props[prop].value = deepClone(props[prop].value)
    }
    return Object.create(
      Object.getPrototypeOf(obj), 
      props
    )
  }

    class S_CursorHandler {
        static {
            this.cursor = new SPLINT.DOMElement("customCursor", "span", document.body);
            this.cursor.Class("customCursor");
            this.X = 0;
            this.Y = 0;
            document.body.addEventListener("mousemove", function(event){
                this.X = event.pageX;
                this.Y = event.pageY;
                this.updateCursor();
            }.bind(this), false);
        }
        static setCursor(type, rotation){
            if(type != this.type){
                this.type = type;
                this.#getCursor(type);
            }
            this.rotation = rotation;
            this.updateCursor();
            document.documentElement.style.cursor = "none";
            this.cursor.style.visibility = "visible";

        }
        static unsetCursor(){
            document.documentElement.style.cursor = "auto";
            this.cursor.style.visibility = "hidden";

        }
        static updateCursor(){
            this.width = this.cursor.clientWidth / 2;
            this.height = this.cursor.clientHeight / 2;
            this.cursor.style.transform = "translate(" + (this.X - this.width) + "px, " + (this.Y - this.height) + "px) rotate(" + this.rotation + "deg)";
        }
        static #getCursor(type){
          switch(type){
            case "crossArrow"   : this.cursor.bindIcon("open_with"); break;
            case "doubleArrow"  : this.cursor.bindIcon("open_in_full"); break;
            case "rotate"       : this.cursor.bindIcon("refresh"); break;
          }
        }
    }

  var CursorActive = null;

  class CursorHandler {
    constructor(){
      this.isMouse = !SPLINT.ViewPort.isMobile();
      this.flag = false;
      this.rotation = 0;
      this.Class = "";
      this.customCursor = new SPLINT.DOMElement("customCursor", "span", document.body);
      if(!this.isMouse){
        return;
      }
      this.#drawCursor();
      this.#init();
    }
    static unsetCursor(){
      if(!this.isMouse){
        return;
      }
      if(CursorActive != null){
        CursorActive.unsetCursor();
      }
    }
    setCursor(type, rotation, Class){
      if(!this.isMouse){
        return;
      }
      if(this.type == type){
        return;
      }
      if(Class != undefined){
        this.Class = Class;
      }
      this.flag = true;
      this.type = type;
      this.rotation = rotation;
      document.documentElement.style.cursor = "none";
      this.customCursor.style.visibility = "visible";
      this.#drawCursor();
    }
    unsetCursor(){
      if(!this.isMouse){
        return;
      }
      this.flag = false;
      this.rotation = 0;
      this.type = null;
      this.customCursor.style.visibility = "hidden";
      document.documentElement.style.cursor = "auto"; 
      CursorActive = null;
    }
    #init(){
      // this.#drawCursor();
      document.body.addEventListener("mousemove", function(event){
        this.X = event.pageX;
        this.Y = event.pageY;
        this.target = event.srcElement;

        if(this.flag){
          this.#updateCursor();
        }
      }.bind(this));
    }
    #updateCursor(){
      this.width = this.customCursor.clientWidth / 2;
      this.height = this.customCursor.clientHeight / 2;
      this.customCursor.style.transform = "translate(" + (this.X - this.width) + "px, " + (this.Y - this.height) + "px) rotate(" + this.rotation + "deg)";
    }
    #drawCursor(){
      this.customCursor.Class("customCursor");
      // this.customCursor.style.visibility = "visible";
      this.#changeCursor();
      if(this.Class != ""){
       this.customCursor.Class(this.Class);
      }
      // window.requestAnimationFrame(this.#updateCursor);
    }
    #changeCursor(){
      switch(this.type){
        case "crossArrow" : this.customCursor.bindIcon("open_with"); break;
        case "doubleArrow" : this.customCursor.bindIcon("open_in_full"); break;
        case "rotate"       : this.customCursor.bindIcon("refresh"); break;
      }
      this.#updateCursor();
    }
  }

  function listAllEventListeners() {
    const allElements = Array.prototype.slice.call(document.querySelectorAll('*'));
    allElements.push(document);
    allElements.push(window);
  
    const types = [];
  
    for (let ev in window) {
      if (/^on/.test(ev)) types[types.length] = ev;
    }
  
    let elements = [];
    for (let i = 0; i < allElements.length; i++) {
      const currentElement = allElements[i];
      for (let j = 0; j < types.length; j++) {
        if (typeof currentElement[types[j]] === 'function') {
          elements.push({
            "node": currentElement,
            "type": types[j],
            "func": currentElement[types[j]].toString(),
          });
        }
      }
    }
  
    return elements.sort(function(a,b) {
      return a.type.localeCompare(b.type);
    });
  }

