
importScripts(location.origin + "/Splint/js/DataManagement/indexedDB.js");
SPLINT.require_now("@SPLINT_ROOT/Tools/fontObject.js");

importScripts(location.origin + "/fd/resources/js/_WebWorker/_common/_converterWorker/_ConverterWorkerHelper.js");

importScripts(location.origin + "/Splint/js/dataTypes/BinaryImage/BinaryImage.js");

const FontFaceStorage = new SPLINT.IndexedDB.Manager("StaticData");

class ConverterWorker extends SPLINT.Worker.WorkerHelper.WebWorkerTemplate {
    static { new this() }

    async createThumbnail(data){
        let stack = data.stack;
        let size = data.size;
        let canvas = new OffscreenCanvas(size.x, size.y);

            // canvas.width  = size.x;
            // canvas.height = size.y;
        let ctx     = canvas.getContext('2d', { willReadFrequently: true });
            ctx.fillStyle = "transparent";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

        for(const element of stack){
              if(element.type == "img"){
                if(element.blob.size == 0){
                    continue;
                }
                const source = await createImageBitmap(element.blob);
                element.src = source;
                element.ctx = ctx;
                ConverterWorkerHelper.drawThumbnailImg(element)
              } else {
                let d = element.data;
                

                await this.#loadFont(d);
                // console.log(self.fonts.entries());
                //     console.dir(element.data)
                element.ctx = ctx;
                ConverterWorkerHelper.drawThumbnailTxt(element)
              }
        };
        let SIZE = size.dimensions;
        let canvasOut = new OffscreenCanvas(SIZE, SIZE);
        let ctx1 = canvasOut.getContext("2d");
            ctx1.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, SIZE, SIZE);
        let d = ctx1.getImageData(0, 0, SIZE, SIZE);
        return d;
    }
    async #loadFont(data){
        if(self.fonts.ready == true){
            return;
        }
        let fontFamily  = data.FontFamily;
        let faces = [];
        let fontsS = await FontFaceStorage.get("FONTS");
        if(fontsS != undefined){
            for(const e of fontsS){
                if(e.fontFamily != fontFamily){
                    continue;
                }
                let face = new FontFace(e.fontFamily, e.src, {
                    weight: e.fontWeight,
                    style: e.fontStyle,
                    fontDisplay: e.fontDisplay,
                    unicodeRange: e.unicodeRange
                });
                face.load().then(function(l){
                    console.dir(l)
                self.fonts.add(face)
                });
            }
            return;
        } else {
            let array = S_fonts_Object["@font-face"].entries();
            for await (const e of array){
                let font = e[1];
                let src = font.src.substring(4, font.src.length-17);
                let f = await fetch(src);
                font.src = await new Promise(async function(resolve){
                    let blob = await f.blob();
                    let dURL = await blobToDataURL(blob);
                    resolve("url(" + dURL + ")");
                });
                faces.push(font);
            }
            FontFaceStorage.set("FONTS", faces)
            return;
        }
    }
}

//**dataURL to blob**
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

//**blob to dataURL**
function blobToDataURL(blob) {
    return new Promise(async function(resolve){
        let a = new FileReader();
        a.onload = function (e) {
            resolve(e.target.result);
        }
        a.readAsDataURL(blob);
    })
}
