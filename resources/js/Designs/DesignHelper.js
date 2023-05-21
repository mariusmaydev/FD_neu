
class DesignHelper {
  static GET    = "GET";
  static NEW    = "NEW";
  static EDIT   = "EDIT";
  static REMOVE = "REMOVE";

  static PATH = PATH.php.designs.designs;

  static get(DesignID, hashtagObj, filter = "ALL"){
    console.log("LLOO")
    let data = CallPHP_S.getCallObject(DesignHelper.GET);
        data.hashtags = hashtagObj;
        data.DesignID = DesignID;
        data.filter   = filter;
    return CallPHP_S.call(DesignHelper.PATH, data).text;
  }
  static new(DesignData, HashtagsOBJ, name = "unbenannt"){
    let data = CallPHP_S.getCallObject(DesignHelper.NEW);
        data.DesignName     = name;
        data.DesignData     = JSON.stringify(DesignData);
        data.DesignHashtags = HashtagsOBJ;
    return CallPHP_S.call(DesignHelper.PATH, data).text;
  }
  static remove(...designID){
    designID.forEach(ID =>{
      let data = CallPHP_S.getCallObject(DesignHelper.REMOVE);
          data.DesignID = ID;
      CallPHP_S.call(DesignHelper.PATH, data);
    });
  }
  static edit(designObj){
    let data = CallPHP_S.getCallObject(DesignHelper.EDIT);
        data.designObj = designObj;
    CallPHP_S.call(DesignHelper.PATH, data);
  }
}

class MenuSessions {
  static SESSION_NAME = "DesignMenu";
  constructor(){
  }
  set(data){
    sessionStorage.setItem(MenuSessions.SESSION_NAME, data);
  }
  mode(value = null){
    let sessionData = this.get();
    if(value != null){
      sessionData.mode = value;
      this.set(JSON.stringify(sessionData));
    }
    return sessionData.mode;
  }
  filter(value = null){
    let sessionData = this.get();
    if(value != null){
      sessionData.filter = value;
      this.set(JSON.stringify(sessionData));
    }
    return sessionData.mode;
  }
  category(value = null){
    let sessionData = this.get();
    if(value != null){
      sessionData.category = value;
      this.set(JSON.stringify(sessionData));
    }
    return sessionData.mode;
  }
  get(){
    let session = sessionStorage.getItem(MenuSessions.SESSION_NAME);
    if(session != null){
      return JSON.parse(session);
    } else {
      let output = new Object();
          output.mode     = "";
          output.filter   = "";
          output.category = "";
      return output;
    }
  }
  remove(){
    sessionStorage.removeItem(MenuSessions.SESSION_NAME);
  }
}
var MenuSession = new MenuSessions();