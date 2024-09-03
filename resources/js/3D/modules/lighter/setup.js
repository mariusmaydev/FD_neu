// import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import SPLINT from 'SPLINT';
import { OrbitControls } from '@THREE_ADDONS/controls/OrbitControls.js';
// import { Scene } from "@THREE_ROOT_DIR/src/scenes/Scene.js";
// import rendererT from './renderer.js'
import * as THREE from "@THREE";//@THREE_ROOT_DIR/build/three.module.min.js";
// import { WebGLRenderer } from "@THREE_ROOT_DIR/src/renderers/WebGLRenderer.js";

export default class setup {
    static RENDERER = null;
    static STATIC_RENDERER = null;
    constructor(instance) {
        this.inst = instance;
        this.events = new events(this, this.inst);
        this.inst.LighterGroupe = new Object();
        this.inst.remove = this.remove.bind(this);
        this.inst.finish = this.finish.bind(this);
        this.inst.isFinishedResolver;
        this.inst.onFinish = function(){};
    }
    staticRenderer(canvas = null){
        if(setup.STATIC_RENDERER == null){
            let ops = {
                preserveDrawingBuffer : true, 
                antialias: true, 
                alpha: false,
                willReadFrequently : true,
                precision: "highp",
                desynchronized: false,
                // powerPreference: "low-power"
            }
            if(canvas != null){
                ops.canvas = canvas;
            }
            this.inst.renderer   = new THREE.WebGLRenderer(ops);
            this.inst.renderer.shadowMap.enabled = true;
            this.inst.renderer.shadowMap.soft = true;
            this.inst.renderer.shadowMap.needsUpdate = true;
            this.inst.renderer.gammaFactor = 10;
            this.inst.renderer.gammaOutput = true;
            this.inst.renderer.gammaInput = true;
            this.inst.renderer.physicallyCorrectLights = true;
            this.inst.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.inst.renderer.outputEncoding = 3001;
            this.inst.renderer.toneMappingExposure = 1;
            this.inst.renderer.setClearColor(0x000000, 0);
            // this.inst.renderer.powerPreference = "low-performance";
            this.inst.renderer.autoClear = true;
            this.inst.isStaticRenderer = true;
            setup.STATIC_RENDERER = this.inst.renderer;
        } else {
            this.inst.renderer = setup.STATIC_RENDERER;
        }
        this.onResize();
    }
    renderer(newFlag = false, canvas = null){
        if( setup.RENDERER == null || newFlag){
            let ops = {
                preserveDrawingBuffer : false, 
                antialias: true, 
                alpha: true, 
                precision: "highp", 
                desynchronized: false,
                willReadFrequently: false, 
                // powerPreference: "low-power"
            }
            if(canvas != null){
                ops.canvas = canvas;
            }
            this.inst.renderer   = new THREE.WebGLRenderer(ops);
            this.inst.renderer.shadowMap.enabled = true;
            // this.inst.renderer.shadowMap.type = THREE.VSMShadowMap
            this.inst.renderer.shadowMap.soft = true;
            this.inst.renderer.shadowMap.needsUpdate = true;
            this.inst.renderer.gammaFactor = 10;
            this.inst.renderer.gammaOutput = true;
            this.inst.renderer.gammaInput = true;
            this.inst.renderer.physicallyCorrectLights = true;
            this.inst.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.inst.renderer.outputEncoding = 3001;
            this.inst.renderer.toneMappingExposure = 1;
            this.inst.renderer.setClearColor(0x000000, 0);
            // this.inst.renderer.powerPreference = "low-power";
            this.inst.renderer.autoClear = true;
            this.inst.isStaticRenderer = false;
            if(newFlag == false){
                setup.RENDERER = this.inst.renderer;
            }
        } else {
            this.inst.renderer = setup.RENDERER;
        }
        this.onResize();
    }
    scene(){
        this.inst.scene      = new THREE.Scene();
    }
    finish(){
        
        // this.inst.AnimationMixer.stop();
        // this.inst.renderer.dispose();
        // this.inst.renderer.forceContextLoss()
        // for(const i in SPLINT.threeJS.scenes){
        //     if(SPLINT.threeJS.scenes[i].drawID == this.inst.drawID){
        //         console.dir(SPLINT.threeJS.scenes)
        //         SPLINT.threeJS.scenes.splice(i, 1);
        //     }
        // }
        this.inst.onFinish();
    }
    remove(){
        this.inst.stopAnimationLoop();
        this.inst.renderer.dispose();
    }
    controls(){
        this.inst.controls   = new OrbitControls( this.inst.camera, this.inst.canvas );
        this.inst.controls.enableDamping     = false;   //damping 
        this.inst.controls.dampingFactor     = 0.5;   //damping inertia
        this.inst.controls.enableZoom        = true;      //Zooming
        this.inst.controls.autoRotate        = false;       // enable rotation
        this.inst.controls.update();
    }
    onResize(){
        // this.adjustCamera();
        this.inst.adjustSizes();
    }
    adjustCamera(parentSize = null){
        if(this.inst.camera == undefined){
            return;
        }
        if(parentSize == null) {
            parentSize = {
                width : this.inst.canvas.parentNode.clientWidth,
                height : this.inst.canvas.parentNode.clientHeight
            }
        }
         
        this.inst.camera.aspect = parentSize.width / parentSize.height;//.floor(parentSize.width * window.devicePixelRatio) / Math.floor(parentSize.height * window.devicePixelRatio);
        this.inst.camera.updateProjectionMatrix();
    }
    getLighterGroupe(scene = this.inst.scene, name = 'lighter'){
        
        if(this.inst.LighterGroupe[name] == undefined){
            this.inst.LighterGroupe[name] = SPLINT.Utils.getObjByKey_Value(scene.children, "name", name);
        }
        return this.inst.LighterGroupe[name];
    }
    static getGroupe(scene, name = 'lighter'){
        return SPLINT.Utils.getObjByKey_Value(scene.children, "name", name);
    }
    rotateScene(dX, dY, dZ){
        this.inst.scene.rotation.y += dY / 100;
        this.inst.scene.rotation.x += dX / 100;
        this.inst.scene.rotation.z += dZ / 100;
    }
} 

class events {
    static {
        window.SEvent.addListener('resize', function(){
            let scenes = SPLINT.threeJS.scenes;
            for(const sc of scenes){
                sc.setup.onResize();
            }
        }, false, true);
    }
    constructor(inst_setup, inst_core){
        this.inst_setup = inst_setup;
        this.inst_core = inst_core;
    }
}
