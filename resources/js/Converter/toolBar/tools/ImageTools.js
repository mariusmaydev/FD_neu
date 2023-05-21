

class ImageTools {
    constructor(index){
      this.index = index;
      this.data = DSImage.get(this.index);
      this.converter = CONVERTER_STORAGE.canvasNEW;
    }
    static getImageToolsForID(ImageID){
        return (new ImageTools(DSImage.getIndex(ImageID)));
    }
    async remove(){
      await DSImage.remove(this.index);
      CONVERTER_STORAGE.canvasNEW.refreshData();
      DSImage.saveAsync();
      CONVERTER_STORAGE.toolBar.update();
    }
    copy(){
      Image_C.copy(this.index);
    }
    flip(type){
      ConverterHelper.flip(this.index, type);
    }
  }