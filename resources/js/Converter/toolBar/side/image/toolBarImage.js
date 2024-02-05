
class ToolBar_Image {
    constructor(parent) {
        this.ELEMENTS = [];
        this.parent = parent;
        this.id = "ConverterToolBar_Image_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("ToolBar_ImageMain");
    }
    blockElement(ImageID){
        for(const index in this.ELEMENTS){
            let element = this.ELEMENTS[index];
            if(ImageID == element.ImageID){
                element.block = true;
                break;
            }
        }
    }
    unBlockElement(ImageID){
        for(const index in this.ELEMENTS){
            let element = this.ELEMENTS[index];
            if(ImageID == element.ImageID){
                element.block = false;
                break;
            }
        }
    }
    addElement(data){
        let flag = true;
        for(const element of this.ELEMENTS){
            if(data.ImageID == element.ImageID){
                flag = false;
                break;
            }
        }
        if(flag){
            let ele = new ToolBar_ImageElement(data);
                ele.mainElement.onclick = function(e){
                    if(!e.target.classList.contains("expander") && !e.target.parentNode.classList.contains("expander")){
                        if(!e.target.id.includes("copy")){
                            this.focusElement(data.ImageID);
                        }
                    }
                }.bind(this);
            this.ELEMENTS.push(ele);
        }
    }
    removeElement(ImageID){
        for(const index in this.ELEMENTS){
            let element = this.ELEMENTS[index];
            if(element.ImageID == ImageID){
                this.ELEMENTS.splice(index, 1);
            }
        }
    }
    focusElement(ImageID = null){
        if(ImageID == null){
            for(const element of this.ELEMENTS){
                element.focus();
            }
        } else {
            for(const element of this.ELEMENTS){
                if(element.ImageID == ImageID){
                    element.focus();
                } else {
                    element.blur();
                }
            }
        }
    }
    blurElement(ImageID = null){
        if(ImageID == null){
            for(const element of this.ELEMENTS){
                element.blur();
            }
        } else {
            for(const element of this.ELEMENTS){
                if(element.ImageID == ImageID){
                    element.blur();
                }
            }
        }
    }
    getElement(ImageID){
        for(const element of this.ELEMENTS){
            if(element.ImageID == ImageID){
                return element.mainElement;
            }
        }
        return false;
    }
    clear(){
        this.mainElement.innerHTML = "";
        this.ELEMENTS = [];
        document.getElementById("ConverterToolBar_activeBody").innerHTML = "";
    }
    updateElement(){

    }
}

