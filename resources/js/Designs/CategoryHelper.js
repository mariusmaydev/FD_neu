class CategoryHelper {
    static edit_Originals(settings){
      return SPLINT.DataStorage.edit("/categories_original.json", JSON.stringify(settings));
    }
    static get_Originals(){
        return SPLINT.DataStorage.get("/categories_original.json");
    }
    static edit_Examples(settings){
      return SPLINT.DataStorage.edit("/categories_example.json", JSON.stringify(settings));
    }
    static get_Examples(){
      return SPLINT.DataStorage.get("/categories_example.json");
    }
  }