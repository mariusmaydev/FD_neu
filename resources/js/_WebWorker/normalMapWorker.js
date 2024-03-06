


  

class WebWorker3D {
    static {
        onmessage = WebWorker3D.onmessage
    }
    static async onmessage(e){
        switch (e.data.type) {
            case 'createNormalMap' : {
                let res = new Object();
                    res.type    = e.data.type;
                    res.id      = e.data.id;
                    res.content = await WebWorker3D.start(e.data.url);
                self.postMessage(res);
            } break;
        }
    }
    static start(src){
        return new Promise(async function(resolve){

            const resp = await fetch(src);
            if (!resp.ok) { 
                throw "Network Error"; 
            }
            const blob = await resp.blob();
            const source = await createImageBitmap(blob);
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

            const canvas = new OffscreenCanvas(w, h);
            let ctx_i = canvas.getContext("2d", { willReadFrequently: true , colorSpace: "display-p3" });
                ctx_i.imageSmoothingEnabled = true;
                ctx_i.imageSmoothingQuality = "high";
                ctx_i.drawImage(source, 0, 0, width, height, 0, 0, w, h);
            source.close(); // free memory, we don't need it anymore
            const imageData = ctx_i.getImageData(0, 0, w, h, { colorSpace: "display-p3" });
            let imgDa = WebWorker3D.normalize(w, h, imageData);
            resolve(imgDa);
        }.bind(this));
    }
    static normalize(w, h, imgData){
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
                // ctx_o.fillStyle = "rgba(" + x_vector + "," + y_vector + ",255,255)";
                // ctx_o.fillRect(x, y, 1, 1);
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
