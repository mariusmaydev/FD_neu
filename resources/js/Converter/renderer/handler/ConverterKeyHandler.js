
class ConverterKeyHandler {
    static {
        ConverterKeyHandler.init();
    }
    static init(){
        document.addEventListener("keydown", async function(event){
            let key = event.key
            let activeElement = CONVERTER_STORAGE.canvasNEW.activeElement;
            switch(key) {
                case "Delete" : {
                    if(activeElement == null){
                        break;
                    }
                    if(activeElement.type == "txt"){
                        await DSText.remove(DSText.getIndex(activeElement.data.TextID));
                        CONVERTER_STORAGE.canvasNEW.refreshData();
                        await DSText.saveAsync();
                        CONVERTER_STORAGE.toolBar.update();
                        CONVERTER_STORAGE.toolBar.blurAll();
                    } else if(activeElement.type == "img"){
                        await DSImage.remove(DSImage.getIndex(activeElement.data.ImageID));
                        CONVERTER_STORAGE.canvasNEW.refreshData();
                        await DSImage.saveAsync();
                        CONVERTER_STORAGE.toolBar.update();
                        CONVERTER_STORAGE.toolBar.blurAll();
                    }
                } break;
                case "Escape" : {
                        CONVERTER_STORAGE.canvasNEW.activeElement = null;
                        CONVERTER_STORAGE.canvasNEW.removeEdges();
                        CONVERTER_STORAGE.toolBar.blurAll();
                } break;
            }
        })
    }
}