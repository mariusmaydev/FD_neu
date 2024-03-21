

class WebWorker3D extends SPLINT.Worker.WorkerHelper.WebWorkerTemplate {
    static {
        new this();
    }
    async createNormalMap(data){
        let src = data.src;
        return new Promise(async function(resolve){
            
            const bitmapData = data.src
            if(typeof data.src == "string"){
                const resp = await fetch(src);
                if (!resp.ok) { 
                    throw "Network Error"; 
                }
                bitmapData = await resp.blob();
                
            }
            const source = await createImageBitmap(bitmapData);
            const { width, height } = source;
            let h = height;
            let w = width;

            if(height < width){
                w = height;
                h = height;
            } else { 
                w = width;
                h = width;
            }
            // w = w * 2;
            // h = h * 2;

            const canvas = new OffscreenCanvas(w, h);
            let ctx_i = canvas.getContext("2d", { willReadFrequently: true});
                
                ctx_i.save();
                ctx_i.fillStyle = "rgba(255, 255, 255, 255)";
                ctx_i.fillRect(0, 0, w, h);
                ctx_i.restore();

                ctx_i.save();
                ctx_i.imageSmoothingEnabled = true;
                ctx_i.imageSmoothingQuality = "high";
                // ctx_i.fillStyle = "rgba(0, 0, 0, 255)";
                ctx_i.filter = "invert(100) ";
                // ctx_i.filter = "invert(100)";
                ctx_i.drawImage(source, 0, 0, width, height, 0, 0, w, h);
                ctx_i.restore();
                // canvas.width = w;
                // canvas.height = h;
                // ctx_i.scale(2, 2);
                // ctx_i.fill();
                // ctx_i.scale(0.5, 0.5);
            source.close(); // free memory, we don't need it anymore
            const imageData = ctx_i.getImageData(0, 0, w, h);
            let imgDa = WebWorker3D.normalize(imageData);

            resolve(imgDa);
        }.bind(this));
    }
    static normalize(imgData){
        console.log(imgData)
        let w = imgData.width;
        let h = imgData.height;
        var pixel, x_vector, y_vector, coords;
        let imgDataOut = new ImageData(w, h);

        for (var y = 0; y < w + 1; y += 1) {
            for (var x = 0; x < h + 1; x += 1) {
                var data = 
                [
                    0, 0, 0, 0,
                    x > 0, x < w, y > 1, y < h, 
                    x - 1, x + 1, x, x, 
                    y, y, y - 1, y + 1
                ];
                for (var z = 0; z < 4; z +=1) {
                    if (data[z + 4]) {
                        coords = WebWorker3D.getColorIndicesForCoord(data[z + 8], data[z + 12], w);
                        pixel = WebWorker3D.getcolorFromImgData(coords, imgData);//ctx_i.getImageData(data[z + 8], data[z + 12], 1, 1);
                        data[z] = ((0.299 * (pixel[0] / 100)) + (0.587 * (pixel[1] / 100)) + (0.114 * (pixel[2] / 100)) / 3);
                    } else {
                        coords = WebWorker3D.getColorIndicesForCoord(x,y, w);
                        pixel = WebWorker3D.getcolorFromImgData(coords, imgData);//ctx_i.getImageData(x, y, 1, 1);
                        data[z] = ((0.299 * (pixel[0] / 100)) + (0.587 * (pixel[1] / 100)) + (0.114 * (pixel[2] / 100)) / 3);
                    }
                }
                x_vector = parseFloat((Math.abs(data[0] - data[1]) + 1) * 0.5) * 255;
                y_vector = parseFloat((Math.abs(data[2] - data[3]) + 1) * 0.5) * 255;
                coords = this.getColorIndicesForCoord(x, y, w)
                imgDataOut.data[coords[0]] = x_vector;
                imgDataOut.data[coords[1]] = y_vector;
                imgDataOut.data[coords[2]] = 255;
                imgDataOut.data[coords[3]] = 255;
            }
        }
        return imgDataOut;
    }
    static getcolorFromImgData(coords, imgData){
        let ar = [];
        ar[0] = imgData.data[coords[0]];
        ar[1] = imgData.data[coords[1]];
        ar[2] = imgData.data[coords[2]];
        ar[3] = imgData.data[coords[3]];
        return ar;
    }
    static getColorIndicesForCoord (x, y, width) {
        let red = y * (width * 4) + x * 4;
        return [red, red + 1, red + 2, red + 3];
      };
    static testImageTracer(base64){
        // importScripts()
        
        ImageTracer.imageToSVG( base64, ImageTracer.appendSVGString, { ltres:0.1, qtres:1, scale:10, strokewidth:5 } );


        // importScripts(location.origin + "/Splint/lib/imageTracerJS/imagetracer_v1.2.6.js");
    }
}
