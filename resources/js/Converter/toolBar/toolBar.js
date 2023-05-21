
class Converter_ToolBar {
    static TYPE_IMG = "img";
    static TYPE_TXT = "txt";
    static init(parent){
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            CONVERTER_STORAGE.toolBar = new Converter_ToolBar_side(document.getElementById("Converter_rightBar"));
            let bottomBar = new SPLINT.DOMElement("ConverterBottomBar", "div", document.getElementById("ConverterMainElement"));
                bottomBar.Class("converter-bottom-bar");
                
                CONVERTER_STORAGE.toolBar = new Converter_ToolBar_bottom();
                CONVERTER_STORAGE.toolBar.blurAll();
        } else {
            // CONVERTER_STORAGE.toolBar.hide();
            CONVERTER_STORAGE.toolBar = new Converter_ToolBar_side(document.getElementById("Converter_rightBar"));
        }
    }
    static update(){
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            CONVERTER_STORAGE.toolBar = new Converter_ToolBar_side(document.getElementById("Converter_rightBar"));
            let bottomBar = new SPLINT.DOMElement("ConverterBottomBar", "div", document.getElementById("ConverterMainElement"));
                bottomBar.Class("converter-bottom-bar");
                
                CONVERTER_STORAGE.toolBar = new Converter_ToolBar_bottom();
                CONVERTER_STORAGE.toolBar.blurAll();
        } else {
            let ele = document.getElementById("converter-bottom-bar");
            if(ele != null){
                ele.style.display = "none";
            }
            let ele1 = document.getElementById("BottomBar_Standard_main");
            if(ele1 != null){
                ele1.parentElement.classList.remove("conv_Bottom_bar_std");
                ele1.style.display = "none";
            }
            if(CONVERTER_STORAGE.toolBar.hide != undefined){
                // CONVERTER_STORAGE.toolBar.hide();
            }
            CONVERTER_STORAGE.toolBar = new Converter_ToolBar_side(document.getElementById("Converter_rightBar"));
            let m = CONVERTER_STORAGE.toolBar.mainElement;
            m.parentElement.insertBefore(m, m.parentElement.firstChild);
        }

    }
}
// static drawBottomBar(parent){
//     let bottomBar = new SPLINT.DOMElement("ConverterBottomBar", "div", parent);
//         bottomBar.Class("converter-bottom-bar");
        
//         CONVERTER_STORAGE.toolBar = new Converter_ToolBar_bottom();
//         CONVERTER_STORAGE.toolBar.blurAll();
// }