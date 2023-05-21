
SPLINT.require_now('@PROJECT_ROOT/Converter/DataStorage/DSImage.js');
SPLINT.require_now('@PROJECT_ROOT/Converter/DataStorage/C_Image.js');
SPLINT.require_now('@PROJECT_ROOT/Converter/DataStorage/DSText.js');
SPLINT.require_now('@PROJECT_ROOT/Converter/DataStorage/C_Text.js');
SPLINT.require_now('@PROJECT_ROOT/Converter/DataStorage/DSProject.js');
SPLINT.require_now('@PROJECT_ROOT/Converter/renderer/ConverterRender.js');
  //Feuerzeugdaten
 //      Champ Xentai
 const LighterWidth  = 38;    //in mm 38,5  38,3
 const LighterHeight = 57.5;    //in mm 57,8  57,8
 const LighterMid    = S_Math.multiply(23.5, 0.94);    //in mm 22,4  23,4
 var Box = new Object();
     Box.X = 0;
     Box.Y = 0;
var mobileFlag;

var DSImage     = new DataStorageImage_C();
var DSText      = new DataStorageText_C();
var DSProject   = new DataStorageProject_C();

const CONVERTER_STORAGE = new SPLINT.autoObject();
// const DOM_CONVERTER_STORAGE = new Object();


class Converter {
  constructor(parent = document.body){
    this.parent = parent;
    this.screenSize = null;
    this.start();
  }
  async start(){
    let promiseText = Text_C.get();
    let promiseImage = Image_C.get();
    let promiseProject = ProjectHelper.get();
    Promise.all([promiseText, promiseImage, promiseProject]).then(async function(response){
        console.log(arguments)
        DSProject.add(response[2]);
        this.draw();
        this.init();
        this.initEvents();
        CONVERTER_STORAGE.canvasNEW.refreshData();
    }.bind(this));

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
    // CONVERTER_STORAGE.converterDOM.loadImages();
    // CONVERTER_STORAGE.canvasNEW.refreshData();
    let rightElement = new SPLINT.DOMElement("Converter_rightBar", "div", ConverterHelper.ELE_MAIN);
        rightElement.Class("Conv_RightBar");
    let hashes = S_Location.getHashes();
    if(hashes == "ADMIN"){
      NavBar.hide();
    }
    // ProjectHelper.get().then(async function(project){

    //   DSProject.add(project);
    //   console.log(project)
      Converter_ToolBar.init(rightElement);
      Converter_closeButtons.draw(rightElement);
      CONVERTER_STORAGE.toolBar.blurAll();
    // // Text_C.get();
    // Image_C.get();
      AdjustSquareBorder();
    // })
  }
  initEvents(){
    ViewPort.onViewPortChanged = function(size, lastSize){
        console.log(size)
      // this.draw();
      if(size != 'mobile-small'){
        converter_drawDesktop.draw();
        // // if(CONVERTER_STORAGE.toolBar != undefined && CONVERTER_STORAGE.toolBar.type == "bottom"){
        // //   CONVERTER_STORAGE.toolBar.mainElement.remove();
        // //   // document.getElementById("ConverterToolBar_main").before(document.getElementById("ConverterCloseButtons__main"))
        // // }
        // Converter_ToolBar.init();
      } else {
        converter_drawMobile.draw();
        // Converter_ToolBar.init();
        // CONVERTER_STORAGE.toolBar.update();
        // CONVERTER_STORAGE.toolBar.blurAll();
      }
      Converter_ToolBar.update();
    }.bind(this);
    window.onresize       = function(){
      AdjustSquareBorder();
    }.bind(this);
    window.onbeforeunload = function(){
      ProjectHelper.CONVERTER_closeProject();
    }
  }
}

function AdjustSquareBorder(){
  SQ = DSProject.Storage[DSProject.SQUARE];
  let SquareBorder = document.getElementById(ConverterHelper.ELE_SQUARE_BORDER_DIV);
  let EditorMainFrame;
  if(SPLINT.ViewPort.getSize() == "desktop" || SPLINT.ViewPort.getSize() == "mobile"){
    EditorMainFrame = document.getElementById("ConverterMainElement");
  } else {
    EditorMainFrame = document.getElementById("ConverterEditorFrame");
  }
      
      SquareBorderTop = SquareBorder.getBoundingClientRect().top;
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

      // document.getElementById("drawLighter3D_ConverterLighter_main").style.width    = (SQ.width * 1.3)  + "px";
      // document.getElementById("drawLighter3D_ConverterLighter_main").style.height   = (SQ.height * 1.3) + "px";

      // Box.X = getAbsoluteWidth(SquareBorder) - parseInt(border) * 2;
      // Box.Y = getAbsoluteHeight(SquareBorder) - parseInt(border) * 2;
            
  CONVERTER_STORAGE.canvasNEW.setSize();
  DSProject.saveAsync();
  DSImage.saveAsync();
  DSText.saveAsync();
}

