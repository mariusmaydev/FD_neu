
class ConverterDOM_renderer {
    constructor(parent){
        this.parent = parent;
    }
    loadImages(){
        for(const index in DSImage.Storage){
            let img = DSImage.Storage[index];
            this.addImage(img);
        }
    }
    addImage(data){
        console.log(data);
        let img = new ImgElement(this.parent, data.ImageID);
            img.img.src = data.images.view;
    }
    removeImage(){

    }
    addText(){

    }
    removeText(){

    }
} 