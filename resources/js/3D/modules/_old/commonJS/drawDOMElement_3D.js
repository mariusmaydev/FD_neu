class drawDOMElement_3D {
    constructor(parent, name = ""){
      this.parent = parent;
      
      this.id = "DOMElement3D_" + name + "_";

      this.mainElement = document.createElement("div");
      this.mainElement.id = this.id + "main";
          
    //   this.communication();
    }
    setAttribute(name, value){
        this.mainElement.setAttribute(name, value);
    }
    Class(className){
        this.mainElement.Class(className);
    }
    create(){
        this.parent.appendChild(this.mainElement);
        this.canvas = new SPLINT.DOMElement(this.id + "canvas", "canvas", this.mainElement);
    }
    communicationInit(){
        this.events = new Object();
        this.events.names = new Object();
        this.events.names.Module_to_Common = new Object();
        this.events.names.Module_to_Common.request    = this.id + "_EVENT__request-to-Common";
        this.events.names.Module_to_Common.listen     = this.id + "_EVENT__listen-for-Module";
        this.events.names.Common_to_Module = new Object();
        this.events.names.Common_to_Module.request    = this.id + "_EVENT__request-to-Module";
        this.events.names.Common_to_Module.listen     = this.id + "_EVENT__listen-for-Common";
        
        this.events.functions = new Object();
        this.events.function.request_Module = new CustomEvent(this.id + "_EVENT__request-to-Module");
        this.events.function.listen_Module  = new CustomEvent(this.id + "_EVENT__listen-for-Module");

        //wartet auf Antwort
        this.canvas.addEventListener(this.events.names.Module_to_Common.request, function(e){
            console.log(e);
        });
        //wartet auf Anfrage
        this.canvas.addEventListener(this.events.names.Module_to_Common.listen, function(e){
            console.log(e);
        });
    }
    request_to_Module(){
        this.canvas.dispatchEvent(this.events.name.Common_to_Module.request)
    }

    // toModule(){

    // }
    // fromModule(){

    // }
    // communication(){
    //     function obj(inst){
    //         this.init = function(){
    //             inst.event_askDOM       = new CustomEvent("Converter3D_askDOM");
    //             inst.event_toConverter  = new CustomEvent("Converter3D_toConverter", {detail: {DSImage, DSText, DSProject}});

    //             inst.canvas.addEventListener("Converter3D_askConverter", function(){
    //                 inst.toConverter();
    //             })

    //             inst.canvas.addEventListener("Converter3D_toDOM", function(e){
    //                 DSImage = e.detail.DSImage;
    //                 DSProject = e.detail.DSProject;
    //                 DSText = e.detail.DSText;
    //             })
    //         }
    //     }
    //     return new obj(this);
    // }
    // communication(){
    //   this.event_askDOM       = new CustomEvent("Converter3D_askDOM");
    //   this.event_toConverter  = new CustomEvent("Converter3D_toConverter", {detail: {DSImage, DSText, DSProject}});

    //   this.canvas.addEventListener("Converter3D_askConverter", function(){
    //     this.toConverter();
    //   }.bind(this))

    //   this.canvas.addEventListener("Converter3D_toDOM", function(e){
    //     DSImage = e.detail.DSImage;
    //     DSProject = e.detail.DSProject;
    //     DSText = e.detail.DSText;
    //   })
    // }
    // askFromDOM(){
    //   this.canvas.dispatchEvent(this.event_askDOM);
    // }
    // toConverter(){
    //   this.canvas.dispatchEvent(this.event_toConverter);
    // }
  }