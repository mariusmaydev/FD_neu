class DataStorageProject_C {  
    static PROJECT_ID     = "ProjectID";
    static PROJECT_NAME   = "ProjectName";
    static FIRST_TIME     = "First_Time";
    static LAST_TIME      = "Last_Time";
    static EPTYPE         = "EPType";
    static EPTYPE_GOLD    = "GOLD";
    static EPTYPE_CHROME  = "CHROME";
    static THUMBNAIL      = "Thumbnail";
    static SQUARE         = "Square";

    PROJECT_ID    = DataStorageProject_C.PROJECT_ID;
    PROJECT_NAME  = DataStorageProject_C.PROJECT_NAME;
    FIRST_TIME    = DataStorageProject_C.FIRST_TIME;
    LAST_TIME     = DataStorageProject_C.LAST_TIME;
    EPTYPE        = DataStorageProject_C.EPTYPE;
    EPTYPE_GOLD   = DataStorageProject_C.EPTYPE_GOLD;
    EPTYPE_CHROME = DataStorageProject_C.EPTYPE_CHROME;
    THUMBNAIL     = DataStorageProject_C.THUMBNAIL;
    SQUARE        = DataStorageProject_C.SQUARE;

    constructor(){
      this.Storage = [];
    }
    get(){
      return this.Storage;
    }
    add(data){
      this.Storage = data;
      return this;
    }
    log(){
      console.log(this.Storage);
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
      return SPLINT.Tools.ObjectTools.deepClone(this);
    }
    async saveAsync(){
      let a = CONVERTER_STORAGE.canvasNEW.createData(1);
          a.then(function(img){
            this.Storage.Thumbnail = img;
            return img;
          }.bind(this))
          .then(async function(){
            let call = new SPLINT.CallPHP(ProjectHelper.PATH, ProjectHelper.EDIT);
                call.data.Storage = this.Storage;
                call.keepalive = false;
                call.send();
                return true;
          }.bind(this))
    }
    async save(){
        return new Promise((resolve, reject) => {
            let a = CONVERTER_STORAGE.canvasNEW.createData(1);
            a.then(function(img){
                this.Storage.Thumbnail = img;
                return img;
            }.bind(this))
            .then(async function(){
                let call = new SPLINT.CallPHP(ProjectHelper.PATH, ProjectHelper.EDIT);
                    call.data.Storage = this.Storage;
                    call.keepalive = false;
                    call.sendInSequence();
                    resolve();
                    return true;

            }.bind(this))
        });
    }

    getColorFor(color){
      if(color == "CHROME"){
        return "#eff8ff";
      }
      return "#ffd700";
    }
  }