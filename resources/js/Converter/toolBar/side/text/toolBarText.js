
class ToolBar_Text {
    constructor(parent) {
        this.ELEMENTS = [];
        this.parent = parent;
        this.id = "ConverterToolBar_Text_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("ToolBar_TextMain");
    }
    addElement(data){
        let flag = true;
        for(const element of this.ELEMENTS){
            if(data.TextID == element.TextID){
                flag = false;
                break;
            }
        }
        if(flag){
            let ele = new ToolBar_TextElement(data);
                ele.mainElement.onclick = function(e){
                    if(!e.target.classList.contains("expander") && !e.target.parentNode.classList.contains("expander")){
                        if(!e.target.id.includes("copy")){
                            this.focusElement(data.TextID);
                        }
                    }
                }.bind(this);
            this.ELEMENTS.push(ele);
        }
    }
    removeElement(TextID){
        for(const index in this.ELEMENTS){
            let element = this.ELEMENTS[index];
            if(element.TextID == TextID){
                this.ELEMENTS.splice(index, 1);
            }
        }
    }
    focusElement(TextID = null){
        if(TextID == null){
            for(const element of this.ELEMENTS){
                element.focus();
            }
        } else {
            for(const element of this.ELEMENTS){
                if(element.TextID == TextID){
                    element.focus();
                } else {
                    // element.blur();
                }
            }
        }
    }
    blurElement(TextID = null){
        if(TextID == null){
            for(const element of this.ELEMENTS){
                element.blur();
            }
        } else {
            for(const element of this.ELEMENTS){
                if(element.TextID == TextID){
                    element.blur();
                }
            }
        }
    }
    getElement(TextID){
        for(const element of this.ELEMENTS){
            if(element.TextID == TextID){
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

