
class TextTools {
    constructor(index){
      this.index = index;
      this.data = DSText.get(this.index);
      this.ID = this.data.TextID;
      this.converter = CONVERTER_STORAGE.canvasNEW;
    }
    static getTextToolsForID(TextID){
        return (new TextTools(DSText.getIndex(TextID)));
    }
    align(type){
      switch(type){
        case 'left'   : this.data.TextOrientation = 'left'; break; //this.ConverterHelper.TextInput[this.index].update(); break;
        case 'center' : this.data.TextOrientation = 'center'; break;
        case 'right'  : this.data.TextOrientation = 'right'; break;
      }
      CONVERTER_STORAGE.canvasNEW.refreshData();
      // CONVERTER_STORAGE.toolBar.update();
    }
    setLineHeight(height){
      this.data.TextLineHeight = height;
      CONVERTER_STORAGE.canvasNEW.refreshData();
      // CONVERTER_STORAGE.toolBar.update();
    }
    fontFamily(type){
      this.data.FontFamily = type;
      CONVERTER_STORAGE.canvasNEW.refreshData();
    }
    fontStyle(type){
      this.data.FontStyle = type;
      CONVERTER_STORAGE.canvasNEW.refreshData();
      // CONVERTER_STORAGE.toolBar.update();
    }
    setValue(value){
      this.data.TextValue = value;
      CONVERTER_STORAGE.canvasNEW.refreshData();
      DSText.save();
    }
    async remove(){
      await DSText.remove(this.index);
      CONVERTER_STORAGE.canvasNEW.refreshData();
      await DSText.saveAsync();
      CONVERTER_STORAGE.toolBar.update();
      CONVERTER_STORAGE.toolBar.blurAll();
    }
    copy(){
      Text_C.copy(this.index);
    }
  }