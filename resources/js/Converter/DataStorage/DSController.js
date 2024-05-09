
class DSController {
    static PATH = PATH.php.converter;
    static {
        this.saveAll_promise = null;
    }
    
    static async createThumbnail(){
        await ConverterRenderThumbnail.update.callFromIdle(1000, ConverterRenderThumbnail);
        // ConverterRenderThumbnail.save.callFromIdle(1000, ConverterRenderThumbnail);
        // await ConverterRenderThumbnail.save.callFromIdle(1000, ConverterRenderThumbnail);
    }
    static async saveAll(){
        this.createThumbnail();
        if(this.saveAll_promise != null){
            return this.saveAll_promise;
        }
        this.saveAll_promise = new Promise(async function(resolve){
            await ConverterRenderThumbnail.save(true)//.callFromIdle(1000, ConverterRenderThumbnail);
            let imgData = DSImage.parse();
            let textData = DSText.parse();
            let projectData = Object.assign({}, DSProject.get());
            projectData.Thumbnail = null;

            let call = new SPLINT.CallPHP(this.PATH, "SAVE.ALL");
                call.data.img = imgData;
                call.data.txt = textData;
                call.data.project = projectData;
                call.keepalive = true;
                
                let res = await call.send();
                // await DSText.save();
                this.saveAll_promise = null;
                resolve(res);    
        }.bind(this));
        return this.saveAll_promise;
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