
class ConverterHelper {
    static CONVERTER_IMG  = "CONVERTER_IMG";
    static UNSPLASH_IMG   = "UNSPLASH_IMG";
    static PRODUCT_IMG    = "PRODUCT_IMG";
    
  static PATH = PATH.php.converter;
  static CREATE_THUMBNAIL       = "CREATE_THUMBNAIL";
  static FILTER                 = "FILTER";
  static GEN_FRAME              = "GEN_FRAME";
  static FLIP                   = "FLIP";
    static VERTICAL               = "VERTICAL";
    static HORIZONTAL             = "HORIZONTAL";
  static CREATE                 = "CREATE";

  static ELE_MAIN               = "ConverterMainElement";
  static ELE_TOOLBAR_MAIN       = "ConverterToolbarMainFrame";
  static ELE_TOOLBAR_TEXT       = "ConverterToolbarMain_Text";
  static ELE_TOOLBAR_IMAGE      = "ConverterToolbarMain_Image";
  static ELE_SQUARE_BORDER      = "square-border";
  static ELE_SQUARE_BORDER_DIV  = "square-border_div";
  static ELE_EDITOR_FRAME       = "ConverterEditorFrame";

  static ELE_LINE_MID_VERTICAL  = "midLineVertical";
  static ELE_LINE_MID_MAIN      = "midLineMain";
  static ELE_LINE_MID_HEAD      = "midlineHead";
  static ELE_LINE_MID_BODY      = "midlineBody";  
  static getCurrentConfig(){
      let params = SPLINT.Tools.Location.getParams();
      if(typeof params == "object"){
          if(params.name != undefined){
              return params.name;
          }
      }
      return "converterProcess";
  }

  static getSquareBorder(){
    return document.getElementById(ConverterHelper.ELE_SQUARE_BORDER_DIV);
  }
  static addText(){
    return Text_C.new(function(txt){
      DSText.add(txt);
      CONVERTER_STORAGE.canvasNEW.refreshData();
      CONVERTER_STORAGE.canvasNEW.setActive(DSText.get(DSText.length() -1), "txt");
      CONVERTER_STORAGE.toolBar.update();
      CONVERTER_STORAGE.toolBar.focusElement("txt", txt[0].TextID);
    });
  }

  static async setEPType(type){
    DSProject.Storage.EPType = type;
    CONVERTER_STORAGE.canvasNEW.refreshData();
  }
  static async createData(UserID, ProjectID, Args = null){
    let call = new SPLINT.CallPHP(ConverterHelper.PATH, ConverterHelper.CREATE);
        call.data.UserID             = UserID;
        call.data.ProjectID          = ProjectID;
        call.data.Args               = Args;
    return call.send();
  }
  static async flip(index, type){
    let call = new SPLINT.CallPHP(this.PATH, this.FLIP);
        call.data.ImageID = DSImage.get(index).ImageID;
        call.data.FLIP_TYPE = type;
    let output = await call.send();
        DSImage.setImages(index, output);
        CONVERTER_STORAGE.canvasNEW.refreshData();
  }
  static async genFrame(UserID, ProjectID, Args = null){
    let call = new SPLINT.CallPHP(ConverterHelper.PATH, ConverterHelper.GEN_FRAME);
        call.data.UserID             = UserID;
        call.data.ProjectID          = ProjectID;
        call.data.Args               = Args;
        return call.send();
  }
  static async filerGrayscale(active = true){
    for(const index in DSImage.Storage){
        await this.filter(index, active)
    }
  }
  static async filter(index, grayscale = false){
    DSProject.Storage.grayscale = grayscale;
    let imgData = DSImage.get(index);
    let imgID                       = imgData.ImageID;
    let call = new SPLINT.CallPHP(ConverterHelper.PATH, ConverterHelper.FILTER);
        call.data.Storage  = imgData;
        call.data.Storage.grayscale = grayscale;
        call.onBeforeSend = function(){
            if(CONVERTER_STORAGE.toolBar.imageBar == undefined){
                // CONVERTER_STORAGE.toolBar.drawBar.blockElement(imgID);
            } else {
                CONVERTER_STORAGE.toolBar.imageBar.blockElement(imgID);
            }
        }
        call.onFinish = function(data){
              DSImage.get(index).images.view = data.ImageViewPath + "?v=" + SPLINT.Tools.DateTime.Helper.getTime();
              CONVERTER_STORAGE.canvasNEW.refreshData();
              
                if(CONVERTER_STORAGE.toolBar.imageBar != undefined){
                    CONVERTER_STORAGE.toolBar.imageBar.unBlockElement(imgID);
                }
        }.bind(this)
    return call.send();
  }
  static uploadImage(data){
    let pData = JSON.parse(data);
    DSImage.add(pData);
    // DOM_CONVERTER_STORAGE.renderer.update();
    CONVERTER_STORAGE.canvasNEW.refreshData();
    CONVERTER_STORAGE.canvasNEW.setActive(DSImage.get(DSImage.length() -1), "img");
    CONVERTER_STORAGE.toolBar.update();
    CONVERTER_STORAGE.toolBar.focusElement("img", pData[0].ImageID);
  }
  static openImageMenu(){
    CONVERTER_STORAGE.canvasNEW.ListenersActive(false);
    NavBar.grow();
    let imageMenu = new ImageMenu(document.body);
        imageMenu.onClose = function(){
            NavBar.shrink();
          CONVERTER_STORAGE.canvasNEW.ListenersActive(true);
        }.bind(this);
        let background = imageMenu.drawBackground();
        setTimeout(function(){
            background.Class("start");
        }, 100);
            background.onclick = function(e){
              imageMenu.close();
            };
        let ESC_listener = new SPLINT.Events.KeyEvent(document.body, SPLINT.Events.KeyEvent.KEY_UP, function(e){
                                  imageMenu.close();
                                  this.remove();
                                });
            ESC_listener.key = "Escape";
        imageMenu.draw();
  }
}