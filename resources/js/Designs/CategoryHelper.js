class CategoryHelper {
    static async edit_Originals(settings){
      return SPLINT.DataStorage.edit("/categories_original.json", JSON.stringify(settings));
    }
    static async get_Originals(){
        return SPLINT.DataStorage.get("/categories_original.json");
    }
    static async reset_Originals(){
        let settings = new Object();
            settings["alle"] = new Object();
        return SPLINT.DataStorage.edit("/categories_original.json", JSON.stringify(settings));
    }
    static async edit_Examples(settings){
      return SPLINT.DataStorage.edit("/categories_example.json", JSON.stringify(settings));
    }
    static async get_Examples(){
      return SPLINT.DataStorage.get("/categories_example.json");
    }
    static async reset_Examples(){
        let settings = new Object();
            settings["alle"] = new Object();
        return SPLINT.DataStorage.edit("/categories_example.json", JSON.stringify(settings));
    }
  }