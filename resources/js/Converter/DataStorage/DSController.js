
class DSController {
    static PATH = PATH.php.converter;
    static async saveAll(){
        return new Promise(async function(resolve){
        let imgData = DSImage.parse();
        let textData = DSText.parse();
        let a = (await CONVERTER_STORAGE.canvasNEW.createData(1));
        DSProject.Storage.Thumbnail = a;
        let projectData = DSProject.get();
        let call = new SPLINT.CallPHP(this.PATH, "SAVE.ALL");
            call.data.img = imgData;
            call.data.txt = textData;
            call.data.project = projectData;
            call.keepalive = false;
        
        let res = await call.send();
        resolve(res);    
        }.bind(this));
    }
    static async getAll(){
        return new Promise(async function(resolve){
        let call = new SPLINT.CallPHP(this.PATH, "GET.ALL");
        let res = await call.send();
        DSImage.add(res.img);
        DSText.add(res.txt);
        DSProject.add(res.project);
        resolve(res);    
        }.bind(this));
    }
}