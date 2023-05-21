
class ImageHelper {
  static COPY_TO_PROJECT    = "COPY_TO_PROJECT";
  static COPY_FROM_UNSPLASH = "COPY_FROM_UNSPLASH";
  static ADD                = "ADD";
  static GET                = "GET";
  static REMOVE             = "REMOVE";
  static EDIT               = "EDIT";

  static MODE_PUBLIC        = "PUBLIC";
  static MODE_PRIVATE       = "PRIVATE";

  static PATH = PATH.php.designs.image;

  static get(ImageID, hashtags, mode = "PUBLIC",filter = "ALL"){
    let output = "";
    if(mode == "PRIVATE"){
      output = UserData.getImages(ImageID, mode, hashtags);
    } else {
      let data = CallPHP_S.getCallObject(ImageHelper.GET);
          data.Hashtags     = hashtags;
          data.ImageStatus  = filter;
      output = CallPHP_S.call(ImageHelper.PATH, data);
    }
    return output;
  }
  static add(ImageID){
    let data = CallPHP_S.getCallObject(ImageHelper.ADD);
        data.ImageID = ImageID;
    CallPHP_S.call(ImageHelper.PATH, data);
  }
  static remove(ImageID, mode){
    if(mode == "PRIVATE"){
      UserData.removeImage(ImageID, mode);
    } else {
      let data = CallPHP_S.getCallObject(ImageHelper.REMOVE);
          data.ImageID = ImageID;
      CallPHP_S.call(ImageHelper.PATH, data);
    }
  }
  static edit(imageObj){
    let data = CallPHP_S.getCallObject(ImageHelper.EDIT);
        data.imageObj = imageObj;
    return CallPHP_S.call(ImageHelper.PATH, data).text;
  }
  static copyFromUnsplash(link){
    let data = CallPHP_S.getCallObject(ImageHelper.COPY_FROM_UNSPLASH);
        data.link = link;
    return CallPHP_S.call(ImageHelper.PATH, data);
  }
  static copyToProject(ImageID, mode){
    let data = CallPHP_S.getCallObject(ImageHelper.COPY_TO_PROJECT);
        data.ImageID  = ImageID;
        data.mode     = mode;
        let output = CallPHP_S.call(ImageHelper.PATH, data).toObject();
        DSImage.add(output);
        ConverterStorage.canvasNEW.refreshData();
        ConverterStorage.toolBar.update();
        console.log(DSImage.Storage);
        // createDragImageElement(DSImage.Storage.length -1);
    return output;
  }
}