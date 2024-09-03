

class ProjectHelper extends SPLINT.CallPHP.Manager {
    static NEW                = "NEW";
    static EDIT               = "EDIT";
    static GET                = "GET";
    static GET_ALL            = "GET_ALL";
    static GET_ALL_ADMIN      = "GET_ALL_ADMIN";
    static OVERVIEW           = "OVERVIEW";
    static REMOVE             = "REMOVE";
    static COPY               = "COPY";
    static GET_FROM_ARCHIVE   = 'GET_FROM_ARCHIVE';
    static ADD_TO_DESIGN      = 'ADD_TO_DESIGN';
    static REMOVE_FROM_DESIGN = 'REMOVE_FROM_DESIGN';
  
    static CHANGE_STATE = "CHANGE_STATE";
    static STATE_NORMAL = "NORMAL";
    static STATE_CART   = "CART";
    static STATE_ORDER  = "ORDER";
  
    static PATH     = PATH.php.project;
    static Design(projectID = null, userID = null){
      return new ProjectHelper_Design(projectID, userID);
    }
    static getPath2AdminProject(projectID, domainFlag = true){
        let domainStart = "";
        if(domainFlag){
            domainStart = SSL + "//" + domain + "/";
        }
      return domainStart + folder + "/data/Users/Admin/projects/" + projectID;
    }
    static getPath2Project(UserID, projectID, domainFlag = true){
        let domainStart = "";
        if(domainFlag){
            domainStart = SSL + "//" + domain + "/";
        }
      return domainStart + folder + "/data/Users/" + UserID + "/projects/" + projectID;
    }
    static getPath2ProjectArchive(UserID, projectID, orderID){
      return SSL + "//" + domain + "/" + folder + "/data/Archive/Orders/" + orderID + "/" + UserID + "/projects/" + projectID;
    }
    static async getFromArchive(ProjectID = null, UserID = null, orderID = null){
      let call = this.callPHP(this.GET_FROM_ARCHIVE);
          call.data.ProjectID = ProjectID;
          call.data.UserID    = UserID;
          call.data.OrderID   = orderID;
      return call.send();
    }
    static async new(ProjectName = 'unbenannt', Product = 'LIGHTER_BASE_GOLD_custom', isAdmin = false, isOriginal = false, isExperimental = false, color = "base"){
      let call = this.callPHP(this.NEW);
          call.data.Experimental = isExperimental;
          call.data.Original     = isOriginal;
          call.data.ProjectName  = ProjectName;
          call.data.Product      = Product;
          call.data.isAdmin      = isAdmin;
          call.data.Color        = color; 
      return call.send();
    }
    static async get(ProjectID = null, UserID = null){
      let call = this.callPHP(this.GET);
          call.data.ProjectID = ProjectID;
          call.data.UserID    = UserID;
      return call.send();
    }
    static async getAll(state = null, UserID = null){
      let call = this.callPHP(this.GET_ALL);
          call.data.State = state;
          call.data.UserID = UserID;
      return call.send();
    }
    static async getAllAdmin(original = false){
      let call = this.callPHP(this.GET_ALL_ADMIN);
          call.data.Original = null;
        let res = await call.send();
        let res2 = [];
        if(res != null) {
            if(original != null) {
                for(const e of res){
                    if(SPLINT.Tools.parse.stringToBool(e.Original, true) == original) {
                        res2.push(e);
                    }
                }
            } else {
                res2 = res;
            }
        }
        return SPLINT.Tools.parse.castTypesRecursive(res2);
    }
    static async edit(StorageIn){
        let Storage = Object.assign({}, StorageIn);
        Storage.Thumbnail = null;
        if(StorageIn.Thumbnail instanceof Blob){
            Storage.Thumbnail = null;
        } else if(Storage.Thumbnail != null && Storage.Thumbnail.substring(0, 4) != "data"){
            Storage.Thumbnail = null;
        }
        let call = new SPLINT.CallPHP(ProjectHelper.PATH, ProjectHelper.EDIT);
            call.data.Storage = Storage;
            call.keepalive = true;
        return call.send();
    }
    static async copy(ProjectID, FromUserID = null){
      let call = this.callPHP(this.COPY);
          call.data.ProjectID   = ProjectID;
          call.data.FromUserID  = FromUserID;
      return call.send();
    }
    static async changeState(projectID, State){
      let call = this.callPHP(ProjectHelper.CHANGE_STATE);
          call.data.ProjectID = projectID;
          call.data.State     = State;
      return call.send();
    }
    static async remove(projectID, UserID = null){
      let call = this.callPHP(ProjectHelper.REMOVE);
          call.data.ProjectID = projectID;
          call.data.UserID = UserID;
      return call.send();
    }
    static async addToDesign(designObject, projectID = null, userID = null){
      let call = this.callPHP(ProjectHelper.ADD_TO_DESIGN);
          call.data.Hashtags    = designObject.Hashtags;
          call.data.Categories  = designObject.Categories;
          call.data.UserID      = userID;
          call.data.ProjectID   = projectID;
      return call.send();
    }
    static async removeFromDesign(designObject, projectID = null, userID = null){
      let call = this.callPHP(ProjectHelper.REMOVE_FROM_DESIGN);
          call.data.Hashtags    = designObject.Hashtags;
          call.data.Categories  = designObject.Categories;
          call.data.UserID      = userID;
          call.data.ProjectID   = projectID;
      return call.send();
    }
    static async CONVERTER_startProject(projectID, editCart = false){
      await SPLINT.SessionsPHP.set(SPLINT.SessionsPHP.PROJECT_ID, projectID, false);
    //   SPLINT.Tools.Location.URL = PATH.location.converter;
      if(editCart){
        SPLINT.Tools.Location.addParams({"mode": "edit_cart"});
      } else {
        SPLINT.Tools.Location.addParams({"mode": "edit_project"});
      }
      LoaderMain.goto("converter");
    //  SPLINT.Tools.Location_old.goto(PATH.location.converter).call();
    }
    static async CONVERTER_closeProject(){
        await DSController.createThumbnail();
        await DSImage.save();
        await DSText.save();
        await DSProject.save();
        await SPLINT.SessionsPHP.remove(SPLINT.SessionsPHP.PROJECT_NAME, false);
        await SPLINT.SessionsPHP.remove(SPLINT.SessionsPHP.PROJECT_ID, false);
        return ;
        // DSImage.remove(index)
    }
    static getDesignObj(){
      let obj = new Object();
          obj.Hashtags        = [];
          obj.Categories  = [];
      return obj;
    }
  }