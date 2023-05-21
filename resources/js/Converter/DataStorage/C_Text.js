class Text_C {
    static PATH = PATH.php.text;
    static GET    = "GET";
    static REMOVE = "REMOVE";
    static ADD    = "ADD";
    static EDIT   = "EDIT";
    static NEW    = "NEW";
    static COPY   = "COPY";
  
    static async get(TextID = null){
      let call = new SPLINT.CallPHP(Text_C.PATH, Text_C.GET);
          call.onFinish = function(res){
              DSText.add(res);
              DSText.Storage.forEach(function(element, index) {
                if(element.TextValue == "" || element.TextValue == "NaN"){
                  DSText.remove(index);
                }
              });
                // CONVERTER_STORAGE.canvasNEW.refreshData();
              
                // console.dir(CONVERTER_STORAGE.toolBar)
                // CONVERTER_STORAGE.toolBar.update();
                // CONVERTER_STORAGE.toolBar.blurAll();

              
          };
          call.data.TextID   = TextID;
        return call.send();
    }
    static async new(callBack = function(){}){
      let call = new SPLINT.CallPHP(Text_C.PATH, Text_C.NEW);
          call.onFinish = function(txt){
            callBack(txt);
          };
          call.send();
    }
    static remove(){
      data = CallPHP_S.getCallObject(this.REMOVE);
      console.log(CallPHP_S.call(this.PATH, data).text);
    }
    static copy(index){
      let clone = [DSText.getClone().get(index)];
      let data = CallPHP_S.getCallObject(this.COPY);
          data.TextID = clone[0].TextID;
      let response = CallPHP_S.call(this.PATH, data).toObject();
      clone[0].TextID          = response;
      clone[0].TextPosX = parseFloat(clone[0].TextPosX) + 20;
      clone[0].TextPosY = parseFloat(clone[0].TextPosY) + 20;
  
      DSText.Storage.push(clone[0]);
      DSText.save();
      CONVERTER_STORAGE.canvasNEW.refreshData();
      let dataa = DSText.get(DSText.length() -1);
      CONVERTER_STORAGE.canvasNEW.setActive(dataa, "txt");
      CONVERTER_STORAGE.toolBar.update();
      CONVERTER_STORAGE.toolBar.focusElement("txt", response);
    }
  }