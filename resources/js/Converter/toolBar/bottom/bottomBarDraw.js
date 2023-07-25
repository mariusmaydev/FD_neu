
class BottomBar_Draw {
    constructor(parent){
        this.parent = parent;
        this.renderImage = new BottomBar_Image(parent);
        this.renderText = new BottomBar_Text(parent);
        this.renderStandard = new BottomBar_Standard(parent);
    }
    drawImage(data){
        console.log(data);
    }
    drawText(data){
        console.log(data);
    }
    focusElement(ID){
        this.clear();
        let indexIMG = DSImage.getIndex(ID);
        if(indexIMG != -1){
            this.renderImage.draw(DSImage.get(indexIMG));
            return;
        }        
        let indexTXT = DSText.getIndex(ID);
        if(indexTXT != -1){
            this.renderText.draw(DSText.get(indexTXT));
            return;
        }
    }
    blurElement(){

    }
    unsetFocus(){
        this.clear();
        this.renderStandard.draw();
    }
    clear(){
        this.parent.innerHTML = '';
    }

}