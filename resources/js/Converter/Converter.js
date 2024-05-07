
SPLINT.require_now('@PROJECT_ROOT/Converter/DataStorage/DSImage.js');
SPLINT.require_now('@PROJECT_ROOT/Converter/DataStorage/C_Image.js');
SPLINT.require_now('@PROJECT_ROOT/Converter/DataStorage/DSText.js');
SPLINT.require_now('@PROJECT_ROOT/Converter/DataStorage/C_Text.js');
SPLINT.require_now('@PROJECT_ROOT/Converter/DataStorage/DSProject.js');
// SPLINT.require_now('@PROJECT_ROOT/Converter/renderer/ConverterRender.js');
  //Feuerzeugdaten
 //      Champ Xentai
//  var LighterWidth  = 38;    //in mm 38,5  38,3
//  var LighterHeight = 57.5;    //in mm 57,8  57,8
//  var LighterMid    = S_Math.multiply(23.5, 0.94);    //in mm 22,4  23,4

 
 var LighterWidth  = 33;    //in mm 38,5  38,3
 var LighterHeight = 54;    //in mm 57,8  57,8
 var LighterMid    = 20.75;//S_Math.multiply(23.5, 0.94);    //in mm 22,4  23,4


 var Box = new Object();
     Box.X = 0;
     Box.Y = 0;
var mobileFlag;

var DSImage     = new DataStorageImage_C();
var DSText      = new DataStorageText_C();
var DSProject   = new DataStorageProject_C();

const CONVERTER_STORAGE = new SPLINT.autoObject();

class Converter {
    static {
        this.workerManager = new SPLINT.Worker.WebWorker.Manager("js/_WebWorker/_common/_converterWorker/_ConverterWorker.js");
        this.workerCreateThumbnail;
        this.workerTextRendering;
    }
  constructor(parent = document.body){
    this.parent = parent;
    this.screenSize = null;
    this.start();
  }
  async start(){
    Converter.workerCreateThumbnail  = await Converter.workerManager.connect("createThumbnail", true, false);
    Converter.workerTextRendering    = await Converter.workerManager.connect("textRendering", true, false);

    await DSController.getAll();
    console.dir(DSImage)
    console.dir(DSText)
    console.dir(DSProject)
    
    let squareCheck = DSProject.Storage[DSProject.SQUARE];
    if(squareCheck.width == undefined || squareCheck.widthMM == undefined || squareCheck.height == undefined || squareCheck.heightMM == undefined){
        squareCheck.width = LighterWidth * 16.4;
        squareCheck.widthMM = LighterWidth;
        squareCheck.height = LighterHeight * 16.4;
        squareCheck.heightMM = LighterHeight;
    }
    
        this.draw();
        this.init();
        this.initEvents();
        CONVERTER_STORAGE.canvasNEW.refreshData();
        if(typeof CONVERTER_STORAGE.lighter3D.promise.then == 'function'){
            CONVERTER_STORAGE.lighter3D.promise.then(async function(){
                let color = await productHelper.getColorForID(DSProject.Storage.Color);
                if(color == null || color == undefined){
                    color = "base";
                    DSProject.Storage.Color = color;
                    DSProject.saveAsync();
                    return;
                }
                CONVERTER_STORAGE.lighter3D.send("changeColor", color);
                
            })
        }

  }
  draw(){
    let size = SPLINT.ViewPort.getSize()
    if(size == this.screenSize){
      return;
    }
    this.screenSize = SPLINT.ViewPort.getSize();
    if(this.screenSize == "desktop") {
      converter_drawDesktop.draw();
      let rightElement = new SPLINT.DOMElement("Converter_rightBar", "div", ConverterHelper.ELE_MAIN);
          rightElement.Class("Conv_RightBar");
          
      // Converter_ToolBar.init(rightElement);
    } else if(this.screenSize == "desktop-small") {
      converter_drawDesktop.draw();
    } else if(this.screenSize == "mobile") {
      converter_drawDesktop.draw();
    } else if(this.screenSize == "mobile-small") {
        converter_drawDesktop.draw();
        let rightElement = new SPLINT.DOMElement("Converter_rightBar", "div", ConverterHelper.ELE_MAIN);
            rightElement.Class("Conv_RightBar");
      converter_drawMobile.draw();
    }
  }
  init(){
    CONVERTER_STORAGE.canvasNEW = new CanvasElement_C(ConverterHelper.ELE_SQUARE_BORDER, ConverterHelper.ELE_SQUARE_BORDER_DIV);
    new Converter_LeftBar();
    let rightElement = new SPLINT.DOMElement("Converter_rightBar", "div", ConverterHelper.ELE_MAIN);
        rightElement.Class("Conv_RightBar");
    let hashes = S_Location.getHashes();
    if(hashes == "ADMIN"){
      NavBar.hide();
    } else if(hashes == "ADMINPLUS"){
        // SPLINT.DataStorage.get("/converterSettings/" + name + ".json");
      NavBar.clear();
    } else {
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            NavBar.setSolid();
        } else {
            NavBar.setInParts();
        }
    }
      Converter_ToolBar.init(rightElement);
      Converter_closeButtons.draw(rightElement);
      CONVERTER_STORAGE.toolBar.blurAll();
      Converter.AdjustSquareBorder();
  }
  initEvents(){
    ViewPort.onViewPortChanged = function(size, lastSize){
      if(size != 'mobile-small'){
        converter_drawDesktop.draw();
      } else {
        converter_drawMobile.draw();
      }
      Converter_ToolBar.update();
    }.bind(this);
    window.onresize       = function(){
      Converter.AdjustSquareBorder();
    }.bind(this);
    window.onbeforeunload = function(){
      ProjectHelper.CONVERTER_closeProject();
    }
  }
  static AdjustSquareBorder(){
    let SQ = DSProject.Storage[DSProject.SQUARE];
    let SquareBorder = document.getElementById(ConverterHelper.ELE_SQUARE_BORDER_DIV);
    let EditorMainFrame;
    if(SPLINT.ViewPort.getSize() == "desktop" || SPLINT.ViewPort.getSize() == "mobile"){
      EditorMainFrame = document.getElementById("ConverterMainElement");
    } else {
      EditorMainFrame = document.getElementById("ConverterEditorFrame");
    }
        
        // let SquareBorderTop = SquareBorder.getBoundingClientRect().top;
        // WindowHeight = $(window).height();
        if(EditorMainFrame.offsetHeight / EditorMainFrame.offsetWidth > LighterHeight / LighterWidth){
          SQ.width = EditorMainFrame.offsetWidth; 
          SQ.height  = S_Math.multiply(S_Math.divide(EditorMainFrame.offsetWidth, LighterWidth), LighterHeight);
        } else {
          SQ.height = EditorMainFrame.offsetHeight; 
          SQ.width  = S_Math.multiply(S_Math.divide(EditorMainFrame.offsetHeight, LighterHeight), LighterWidth);
        }
  
        SquareBorder.style.width    = (SQ.width * 0.9)  + "px";
        SquareBorder.style.height   = (SQ.height * 0.9) + "px";
              
    CONVERTER_STORAGE.canvasNEW.setSize();
    if(SPLINT.Events.onLoadingComplete.dispatched == true){
          DSController.saveAll.callFromIdle(1000, DSController);
      
          // DSProject.saveAsync();
    };
  }
}


    window.addEventListener("beforeunload", async function(){
        ConverterRenderThumbnail.save()
        await DSController.createThumbnail();
        await DSController.saveAll();
    });


