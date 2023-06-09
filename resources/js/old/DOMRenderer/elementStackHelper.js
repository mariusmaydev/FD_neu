
class CDOMR_elementStackHelper {
    constructor(instance){
        this.instance_main = instance;

    }
    getImgElementByID(ID){
        for(const index in this.instance_main.elements){
            let element = this.instance_main.elements[index];
                if(element.data.ImageID == ID){
                    return element;
                }
        }
        return false;
    }
    getImgIndexByID(ID){
        for(const index in this.instance_main.elements){
            let element = this.instance_main.elements[index];
                if(element.data.ImageID == ID){
                    return index;
                }
        }
        return false;
    }

}