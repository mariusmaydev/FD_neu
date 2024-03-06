importScripts("http://localhost/fd/resources/js/Converter/renderer/helper/CanvasPaths.js");
importScripts("http://localhost/fd/resources/js/Converter/renderer/ConverterRender.js");
importScripts("http://localhost/fd/resources/js/Converter/worker/_ConverterWorkerHelper.js");
importScripts(location.origin + "/Splint/js/Tools/json.js");

class ConverterWorker {
    static {
        onmessage = ConverterWorker.onmessage
    }
    static async onmessage(e){
        switch (e.data.method) {
            case 'createThumbnail' : {
                let i = await ConverterWorker.createThumbnail(e.data.data.canvas, e.data.data.stack, e.data.data.size)
                self.postMessage(i);
            } break;
            case 'createTextData' : {
                let i = await ConverterWorker.createTextData(e.data.data.canvas, e.data.data.stack, e.data.data.size)
                self.postMessage(i);
            } break;
        }
    }
    static async createTextData(canvas, stack, size) {
        for(const element of stack){
            if(element.type == "txt"){
                let postEle = JSON.parse(JSON.stringify( element));
                    postEle.data.TextAlign = 0;

                    canvas.width  = (postEle.data.FrameWidth * size.scale) + 10;
                    canvas.height = (postEle.data.FrameHeight * size.scale) + 10;

                let ctx     = canvas.getContext('2d');
                    ctx.fillStyle = "transparent";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.scale(size.scale / 2, size.scale / 2);

                let a = postEle.data.TextPosX;
                let b = postEle.data.TextPosY;

                    postEle.data.TextPosX = (canvas.width ) / (size.scale );
                    postEle.data.TextPosY = (canvas.height) / (size.scale );
                    postEle.ctx = ctx;

                ConverterWorkerHelper.drawTextForData(postEle, true);
                
                element.data.TextImg = await ctx.getImageData(0, 0, canvas.width, canvas.height);//canvas.toDataURL("image/png", 1);
                element.data.TextPosX = a;
                element.data.TextPosY = b;
            }
        }
        return stack;
    }
    static async createThumbnail(canvas, stack, size){
            canvas.width  = size.x;
            canvas.height = size.y;
        let ctx     = canvas.getContext('2d', { willReadFrequently: true });
            ctx.fillStyle = "transparent";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.scale(size.scale, size.scale);
            
        for(const element of stack){
              if(element.type == "img"){
                const source = await createImageBitmap(element.blob);
                element.src = source;
                element.ctx = ctx;
                ConverterWorkerHelper.drawThumbnailImg(element)
              } else {
                element.ctx = ctx;
                ConverterWorkerHelper.drawThumbnailTxt(element)
              }
        };
        let canvasOut = new OffscreenCanvas(1024, 1024);
        let ctx1 = canvasOut.getContext("2d");
            ctx1.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 1024, 1024);
        return ctx1.getImageData(0, 0, 1024, 1024);
    }
}