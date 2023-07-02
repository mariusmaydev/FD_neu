class DataStorageImage_C {  
    constructor(){
      this.Storage = [];

    }
    #generateObject(data){
      let obj = new Object();
          obj.ImageID     = data.ImageID;
          obj.ImageName   = data.ImageName;
          if(data.width == undefined || data.height == undefined){
            obj.ImageHeight = parseInt(data.ImageHeight);
            obj.ImageWidth  = parseInt(data.ImageWidth);
          } else {
            obj.ImageHeight = parseInt(data.height);
            obj.ImageWidth  = parseInt(data.width);
          }
          obj.ImageCrop   = data.ImageCrop;
          obj.ImageAlign  = data.ImageAlign;
          if(data.ImagePosY == undefined || data.ImagePosX == undefined){
            obj.ImagePosX   = data.ImagePosX;
            obj.ImagePosY   = data.ImagePosY;
          } else {
            obj.ImagePosX   = parseInt(data.ImagePosX);
            obj.ImagePosY   = parseInt(data.ImagePosY);
          }
          obj.images      = new Object();
          obj.images.view     = data.ImageViewPath + "?v=" + S_Time.getTime();
          obj.images.scale    = data.ImageScalePath + "?v=" + S_Time.getTime();
          obj.ImageFilter = new Object();
          obj.ImageFilter   = data.ImageFilter;
      return obj;
    }
    add(data){
      for(let i = 0; i < data.length; i++){
        this.Storage.push(this.#generateObject(data[i]));
      }
      return this;
    }
    setImages(index, data){
      if(data.ImageViewPath != undefined){
        this.Storage[index].images.view   = data.ImageViewPath + "?v=" + parseInt(S_Time.getTime() + Math.random(1)*10);
      }
      if(data.ImageScalePath != undefined){
        this.Storage[index].images.scale  = data.ImageScalePath + "?v=" + parseInt(S_Time.getTime() + Math.random(1)*10);
      }
    }
    getImages(index){
      return this.get(index).images;
    }
    get(index){
      return this.Storage[index];
    }
    log(){
      console.log(this.Storage);
    }
    getIndex(ID){
      for(let i = 0; i < this.Storage.length; i++){
        if(this.Storage[i].ImageID == ID){
          return i;
        }
      }
      return -1;
    }
    edit(data){
      this.Storage = _.mergeWith(this.Storage, data, (objValue, srcValue) => {
        if( _.isArray(srcValue)) {
          return srcValue;
        }
      });
      return this;
    }
    getClone(){
      return deepClone(this);
    }
    async remove(index){
      let call = new SPLINT.CallPHP(Image_C.PATH, Image_C.REMOVE);
          call.data.ImageID = this.Storage[index].ImageID;
          call.onBeforeSend = function(){
            this.Storage.splice(index, 1);
          }.bind(this);
      return call.send();
    }
    parse(index = null){
      let data = this.getClone();
          data = data.Storage;
          for(let i = 0; i < data.length; i++){
            delete data[i].images;
          }
      if(index != null){
        return data[index];
      } else {
        return data;
      }
    }
    length(){
      return this.Storage.length;
    }
    static createDummy(index){
      let data = [];
          data[index] = new Object();
      return data;
    }
    async saveAsync(){
      let call = new SPLINT.CallPHP(Image_C.PATH, Image_C.EDIT);
          call.data.Storage = this.parse();
          call.send();
    }
    async save(){
      let call = new SPLINT.CallPHP(Image_C.PATH, Image_C.EDIT);
          call.data.Storage = this.parse();
          call.sendInSequence();
    }
  }