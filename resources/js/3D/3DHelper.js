
class drawLighter3D {
  static STORAGE              = []
  static INDEX                = "INDEX";
  static CONVERTER            = "CONVERTER";
  static PROJECT              = "PROJECT";
  static PROJECT_NEW          = "PROJECT_NEW";
    constructor(parent, name = "", type = "", src = null, newContext = false, mouseEvents = false){
      this.parent       = parent;
      this.type         = type;
      this._saveContext  = false;
      this.id = "drawLighter3D_" + name + "_";
      if(document.getElementById(this.id + "main") != null){
        for(const inst of drawLighter3D.STORAGE){
          if(inst.id == this.id){
            return inst;
          }
        }
        return;
      }

      this.div    = document.createElement("div");
      this.div.id = this.id + "main";
      this.div.setAttribute("render", "3D_Lighter_" + type);
      this.div.setAttribute("saveContext", this._saveContext);
      this.div.setAttribute("mouseEvents", mouseEvents);
      this.div.saveContext = this._saveContext;
      this.div.Class("Lighter3D");

      this.parent.appendChild(this.div);

      this.canvas = new SPLINT.DOMElement(this.id + "canvas", "canvas", this.div);
      if(src != null){
        this.canvas.setAttribute("thumbsrc", src);
        this.canvas.setAttribute("newContext", newContext);
      }
      this.getFromRenderer();
      this.canvas.remove = function(){

      }
      drawLighter3D.STORAGE.push(this);
    }
    set saveContext(value){
      this._saveContext = value;
      this.div.setAttribute("saveContext", value);
      this.div.saveContext = value;
    }
    get saveContext(){
      return this._saveContext;
    }
    send(dataOrName, value = null){
        if(typeof dataOrName == 'object'){
            this.canvas.Storage = dataOrName;
        } else {
            this.canvas.Storage = new Object();
            this.canvas.Storage.type = dataOrName;
            this.canvas.Storage.value = value;
        }
        this.canvas.dispatchEvent(SPLINT_EVENTS.toModule);
    }
    /**
     * 
     * @deprecated 
     */
    sendToRenderer(data){
        this.canvas.X = data;
      if(typeof data == "object"){
        this.canvas.setAttribute("LighterData", JSON.stringify(data));
      } else {
        this.canvas.setAttribute("LighterData", data);
      }
      this.canvas.dispatchEvent(SPLINT_EVENTS.toModule);
    }
    getFromRenderer(){
      this.canvas.S_toCommonJS = function(e, b, c){
        let data = JSON.parse(c);
        if(data.type == "loaded"){
          let obj = new Object();
              obj.type = "addImage";
              obj.data = DSImage.Storage;
          this.sendToRenderer(obj)
        }
      }.bind(this);
    }
  }

  
class drawBackground3D {
    constructor(parent, name = "", brightness = "bright"){
      this.parent = parent;
      this.brightness = brightness;
      this.id = "drawBackground3D_" + name + "_";
      if(document.getElementById(this.id + "main") != null){
        return;
      }

      this.div    = document.createElement("div");
      this.div.id = this.id + "main";
      this.div.setAttribute("render", "3D_Background");
      this.div.Class("Background3D");

      this.parent.appendChild(this.div);

      this.canvas = new SPLINT.DOMElement(this.id + "canvas", "canvas", this.div);
      this.canvas.setAttribute("brightness", this.brightness);
      this.getFromRenderer();
    }
    sendToRenderer(data){
      if(typeof data == "object"){
        this.canvas.setAttribute("LighterData", JSON.stringify(data));
      } else {
        this.canvas.setAttribute("LighterData", data);
      }
      this.canvas.dispatchEvent(SPLINT_EVENTS.toModule);
    }
    getFromRenderer(){
      this.canvas.S_toCommonJS = function(e, b, c){
        let data = JSON.parse(c);
        if(data.type == "loaded"){
          let obj = new Object();
              obj.type = "addImage";
              obj.data = DSImage.Storage;
          this.sendToRenderer(obj)
        }
      }.bind(this);
    }
  }

  class drawConverter3D {
      constructor(parent, name = ""){
        this.parent = parent;
        this.id = "drawConverter3D_" + name + "_";
  
        this.div    = document.createElement("div");
        this.div.id = this.id + "main";
        this.div.setAttribute("FD_width", DSProject.Storage.Square.width);
        this.div.setAttribute("FD_height", DSProject.Storage.Square.height);
        this.div.setAttribute("render", "3D_Converter");
        this.div.Class("Converter3D");
  
        this.parent.appendChild(this.div);
        	
        this.canvas = new SPLINT.DOMElement(this.id + "canvas", "canvas", this.div);
        this.communication();
      }
      communication(){
        this.event_askDOM       = new CustomEvent("Converter3D_askDOM");
        this.event_toConverter  = new CustomEvent("Converter3D_toConverter", {detail: {DSImage, DSText, DSProject}});

        this.canvas.addEventListener("Converter3D_askConverter", function(){
          this.toConverter();
        }.bind(this))

        this.canvas.addEventListener("Converter3D_toDOM", function(e){
          DSImage = e.detail.DSImage;
          DSProject = e.detail.DSProject;
          DSText = e.detail.DSText;
        })
      }
      askFromDOM(){
        this.canvas.dispatchEvent(this.event_askDOM);
      }
      toConverter(){
        this.canvas.dispatchEvent(this.event_toConverter);
      }
    }