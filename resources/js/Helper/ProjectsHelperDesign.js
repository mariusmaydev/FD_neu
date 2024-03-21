
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
          obj.Categories    = [];
      return obj;
    }
  }