
class ProjectHelper_Design{
  static PATH     = PATH.php.project;
  static {
    SPLINT.CallPHP.Manager.bind2class(PATH.php.project, this);
  }
  constructor(projectID, userID){
    this.userID = userID;
    this.projectID = projectID;
  }
  addTags(...names){
    let call = ProjectHelper_Design.callPHP(ProjectHelper.ADD_TO_DESIGN);
        call.data.Categories  = [];
        call.data.Hashtags    = [...names];
        call.data.UserID      = this.userID;
        call.data.ProjectID   = this.projectID;
    return call.send();
  }
  removeTags(...names){
    let call = ProjectHelper_Design.callPHP(ProjectHelper.REMOVE_FROM_DESIGN);
        call.data.Categories  = [];
        call.data.Hashtags    = [...names];
        call.data.UserID      = this.userID;
        call.data.ProjectID   = this.projectID;
    return call.send();
  }
  addCategories(...names){
      let call = ProjectHelper_Design.callPHP(ProjectHelper.ADD_TO_DESIGN);
          call.data.Hashtags    = [];
          call.data.Categories  = [...names];
          call.data.UserID      = this.userID;
          call.data.ProjectID   = this.projectID;
      return call.send();
  }
  removeCategories(...names){
      let call = ProjectHelper_Design.callPHP(ProjectHelper.REMOVE_FROM_DESIGN);
          call.data.Hashtags    = [];
          call.data.Categories  = [...names];
          call.data.UserID      = this.userID;
          call.data.ProjectID   = this.projectID;
      return call.send();
  }
  #getDesignObj(){
    let obj = new Object();
        obj.Hashtags        = [];
        obj.Categories  = [];
    return obj;
  }
}
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
    static async new(ProjectName = 'unbenannt', Product = 'Test', isAdmin = false, isOriginal = false){
      let call = this.callPHP(this.NEW);
          call.data.Original     = isOriginal;
          call.data.ProjectName  = ProjectName;
          call.data.Product      = Product;
          call.data.isAdmin      = isAdmin;
      return call.send();
    }
    static async get(ProjectID = null, UserID = null){
      let call = this.callPHP(this.GET);
          call.data.ProjectID = ProjectID;
          call.data.UserID    = UserID;
      return call.send();
    }
    static async getAll(state = null){
      let call = this.callPHP(this.GET_ALL);
          call.data.State = state;
      return call.send();
    }
    static getAllAdmin(original = false){
      let call = this.callPHP(this.GET_ALL_ADMIN);
          call.data.Original = original;
      return call.send();
    }
    static edit(projectID = null, projectName = null, EPType = null, Product = 'Test', State = null){
      let call = this.callPHP(this.EDIT);
          call.data.ProjectID    = projectID;
          call.data.ProjectName  = projectName;
          call.data.EPType       = EPType;
          call.data.Product      = Product;
          call.data.State        = State;
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
    static async remove(projectID){
      let call = this.callPHP(ProjectHelper.REMOVE);
          call.data.ProjectID = projectID;
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
      SPLINT.Tools.Location.URL = PATH.location.converter;
      if(editCart){
        SPLINT.Tools.Location.addParams({"mode": "edit_cart"}).call();
      } else {
        SPLINT.Tools.Location.addParams({"mode": "edit_project"}).call();
      }
    //   S_Location.goto(PATH.location.converter).call();
    }
    static async CONVERTER_closeProject(){
      DSImage.save();
      DSText.save();
      DSProject.save();
    //   await SPLINT.SessionsPHP.remove(SPLINT.SessionsPHP.CONVERTER_MODE, false);
    //   await SPLINT.SessionsPHP.remove(SPLINT.SessionsPHP.PROJECT_ID, false);
      await SPLINT.SessionsPHP.remove(SPLINT.SessionsPHP.PROJECT_NAME, false);
    }
    static getDesignObj(){
      let obj = new Object();
          obj.Hashtags        = [];
          obj.Categories  = [];
      return obj;
    }
  }