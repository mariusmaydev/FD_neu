class Image_C {
    static PATH = PATH.php.image;
    static GET    = "GET";
    static REMOVE = "REMOVE";
    static ADD    = "ADD";
    static EDIT   = "EDIT";
    static COPY   = "COPY";
  

    static get(){
        return new Promise(async function(resolve){
            let call = new SPLINT.CallPHP(Image_C.PATH, Image_C.GET);
            //   call.onFinish = function(res){
                
            //     //   CONVERTER_STORAGE.canvasNEW.refreshData();
            //     //   CONVERTER_STORAGE.toolBar.update();
            //     //   CONVERTER_STORAGE.toolBar.blurAll();
            //   };
            call.data.ProjectID   = await SPLINT.SessionsPHP.get("PROJECT_ID", false);
            call.data.ImageID     = null;
            call.data.UserID      = await SPLINT.SessionsPHP.get("USER_ID", false);
            let send = await call.send();
            await DSImage.add(send);
            resolve(send);
            return send;
        }.bind(this));
    }
    static add(index){
      let Image = DSImage.get(index);
      let call = new SPLINT.CallPHP(Image_C.PATH, Image_C.ADD);
          call.data.ImageName      = "";
          call.data.ImagePosX      = Image.ImagePosX;
          call.data.ImagePosY      = Image.ImagePosY;
          call.data.ImageWidth     = Image.ImageWidth;
          call.data.ImageHeight    = Image.ImageHeight;
          call.data.ImageFilter    = FilterObj;
          call.data.ImageAlign     = 0;
          call.data.ImageCrop      = false;
          return call.send();
    }
    static copy(index){
      let clone = [DSImage.getClone().get(index)];
      let data = SPLINT.Data.CallPHP_OLD.getCallObject(this.COPY);
          data.ImageID = clone[0].ImageID;
      let response = SPLINT.Data.CallPHP_OLD.call(this.PATH, data).toObject();
      clone[0].ImageID          = response.ImageID;
      clone[0].ImagePosX          = parseFloat(clone[0].ImagePosX) + 20;
      clone[0].ImagePosY          = parseFloat(clone[0].ImagePosY) + 20;
      clone[0].images.view      = response.ImageViewPath + "?v=" + SPLINT.Tools.DateTime.Helper.getTime();
      DSImage.Storage.push(clone[0]);
      DSImage.save();
      CONVERTER_STORAGE.canvasNEW.refreshData();
      CONVERTER_STORAGE.canvasNEW.setActive(DSImage.get(DSImage.length() -1), "img");
      CONVERTER_STORAGE.toolBar.update();
      CONVERTER_STORAGE.toolBar.focusElement("img", response.ImageID);
    }
    static getFilterObj(){
      data = new Object();
      data.contrast     = 0;
      data.sharpness    = 0;
      data.antialiasing = 0;
      data.lineWidth    = 1;
      data.edges        = true;
      return JSON.stringify(data);
    }
    static remove(){
      data = SPLINT.Data.CallPHP_OLD.getCallObject(this.REMOVE);
      console.log(SPLINT.Data.CallPHP_OLD.call(this.PATH, data).text);
    }
  }