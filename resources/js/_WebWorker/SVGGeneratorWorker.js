
        importScripts(location.origin + "/Splint/lib/imageTracerJS/imagetracer_v1.2.6.js");
class SVGGeneratorWorker {
    static {
        onmessage = SVGGeneratorWorker.onmessage
    }
    static async onmessage(e){
            let res = await SVGGeneratorWorker.testImageTracer(e.data)
            self.postMessage(res);
    }
    
    static async testImageTracer(imgData){
        // importScripts()
        console.dir(imgData)
        // return "okk"
        // ImageTracer.imageToSVG( imgData, ImageTracer.appendSVGString, { ltres:0.1, qtres:1, scale:10, strokewidth:5 } );
        let options = { };
        let r = ImageTracer.imagedataToSVG ( imgData);

        return r;
        // importScripts(location.origin + "/Splint/lib/imageTracerJS/imagetracer_v1.2.6.js");
    }
}