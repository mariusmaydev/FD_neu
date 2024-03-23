import * as THREE from "@THREE";
export default class rendererT  {
    static init(devicePixelRatio, width, height, canvas = null, context = null){
        let opts = {
            preserveDrawingBuffer:false, 
            antialias: false, 
            alpha: true, 
            precision: "highp", 
            powerPreference: "high-performance"
        }
        if(canvas != null){
            opts.canvas = canvas;
            opts.context = context;//canvas.getContext("webgl2")
        }
        // let context = canvas.getContext("webgl2");
        this.renderer   = new THREE.WebGLRenderer(opts);
        this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.VSMShadowMap
        this.renderer.shadowMap.soft = true;
        this.renderer.shadowMap.needsUpdate = true;
        this.renderer.gammaFactor = 10;
        this.renderer.setPixelRatio( devicePixelRatio);
        this.renderer.setSize( width, height, false);
    
        this.renderer.gammaOutput = true;
        this.renderer.gammaInput = true;
        this.renderer.antialias = true;
        this.renderer.alpha = true;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.outputEncoding = 3001;
        this.renderer.toneMappingExposure = 1;
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.powerPreference = "high-performance";
        this.renderer.autoClear = true;
        return this.renderer;
    }
}

// export default rendererT;