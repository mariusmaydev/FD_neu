
class converter_drawDesktop {
    static draw(parent = document.body){    
        this.background = new drawBackground3D(parent, "back", "medium");
        


        this.mainElement = new SPLINT.DOMElement("ConverterMainElement", "div", parent);
        this.mainElement.Class("Conv_MAIN");
        
        Footer.desktop();
        this.EditorFrameElement = new SPLINT.DOMElement("ConverterEditorFrame", "div", this.mainElement);
        this.EditorFrameElement.Class("EditorFrame");
    
        this.SquareBorder = new SPLINT.DOMElement(ConverterHelper.ELE_SQUARE_BORDER_DIV, "div", this.EditorFrameElement);
        this.SquareBorder.Class("square-border-div");
        let hashes = S_Location.getHashes();
        if(hashes == "ADMINPLUS"){
                this.SquareBorder.classList.add("ADMINPLUS");
                SPLINT.Events.onLoadingComplete.dispatch();
        } else {
            CONVERTER_STORAGE.lighter3D = new drawLighter3D(this.SquareBorder, "ConverterLighter", drawLighter3D.CONVERTER);
            CONVERTER_STORAGE.lighter3D.saveContext = true;
        }
        // this.ConverterDrawFrame = new SPLINT.DOMElement("ConverterDrawFrame", "div", this.SquareBorder);
        // this.ConverterDrawFrame.Class("ConverterDrawFrame");
    }
}