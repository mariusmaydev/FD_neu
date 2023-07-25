
class ConverterHelper {
  static PATH = PATH.php.converter;
  static CREATE_THUMBNAIL       = "CREATE_THUMBNAIL";
  static FILTER                 = "FILTER";
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

  static getSquareBorder(){
    return document.getElementById(ConverterHelper.ELE_SQUARE_BORDER_DIV);
  }
  static addText(){
    Text_C.new(function(txt){
      DSText.add(txt);
      console.log(DSText, txt);
      CONVERTER_STORAGE.canvasNEW.refreshData();
      CONVERTER_STORAGE.canvasNEW.setActive(DSText.get(DSText.length() -1), "txt");
      CONVERTER_STORAGE.toolBar.update();
    });
  }

  static setEPType(type){
    if(type == "GOLD"){
        DSProject.Storage.Product = "Lighter_Gold_custom";
    } else {
        DSProject.Storage.Product = "Lighter_Chrome_custom";
    }
    DSProject.Storage.EPType = type;
    DSProject.saveAsync();
    CONVERTER_STORAGE.canvasNEW.refreshData();
  }

  // static createThumbnail(){
  //   let data = CallPHP_S.getCallObject(ConverterHelper.CREATE_THUMBNAIL);
  //       data.StorageImg     = DSImage.Storage;
  //       data.StorageText    = DSText.Storage;
  //       data.StorageProject = DSProject.Storage;
  //   CallPHP_S.call(ConverterHelper.PATH, data, "POST", false);
  // }
  static async createData(UserID, ProjectID){
    // let RenderImage = CONVERTER_STORAGE.canvasNEW.createData();
    // CONVERTER_STORAGE.canvasNEW.getTextImg();
    let call = new SPLINT.CallPHP(ConverterHelper.PATH, ConverterHelper.CREATE);
        call.data.UserID             = UserID;
        call.data.ProjectID          = ProjectID;
        // data.StorageImg         = DSImage.Storage;
        // data.StorageText        = DSText.Storage;
        // data.StorageProject     = DSProject.Storage;
        // data.StorageRenderImage = RenderImage;
    return call.send();
  }
  static flip(index, type){
    let data = CallPHP_S.getCallObject(this.FLIP);
        data.ImageID = DSImage.get(index).ImageID;
        data.FLIP_TYPE = type;
    let output = CallPHP_S.call(this.PATH, data).toObject();
        DSImage.setImages(index, output);
        CONVERTER_STORAGE.canvasNEW.refreshData();
  }
  static filter(index){
    let imgData = DSImage.get(index);
    let imgID                       = imgData.ImageID;
    let call = new SPLINT.CallPHP(ConverterHelper.PATH, ConverterHelper.FILTER);
        call.data.Storage  = imgData;
        call.onBeforeSend = function(){
            if(CONVERTER_STORAGE.toolBar.imageBar == undefined){
                // CONVERTER_STORAGE.toolBar.drawBar.blockElement(imgID);
            } else {
                CONVERTER_STORAGE.toolBar.imageBar.blockElement(imgID);
            }
        }
        call.onFinish = function(data){
              DSImage.get(index).images.view = data.ImageViewPath + "?v=" + S_Time.getTime();
              CONVERTER_STORAGE.canvasNEW.refreshData();
              
                if(CONVERTER_STORAGE.toolBar.imageBar != undefined){
                    CONVERTER_STORAGE.toolBar.imageBar.unBlockElement(imgID);
                }
        }.bind(this)
        call.send();
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
    let imageMenu = new ImageMenu(document.body);
        imageMenu.onClose = function(){
          CONVERTER_STORAGE.canvasNEW.ListenersActive(true);
        }.bind(this);
        let background = imageMenu.drawBackground();
        setTimeout(function(){
            background.Class("start");
        }, 100);
            background.onclick = function(e){
              imageMenu.close();
            };
        let ESC_listener = new KeyInput(document.body, KeyInput.KEY_UP, function(e){
                                  imageMenu.close();
                                  this.remove();
                                });
            ESC_listener.key = "Escape";
        imageMenu.draw();
  }
}