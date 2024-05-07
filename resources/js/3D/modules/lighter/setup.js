// import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import SPLINT from 'SPLINT';
import { OrbitControls } from '@THREE_ADDONS/controls/OrbitControls.js';
// import { Scene } from "@THREE_ROOT_DIR/src/scenes/Scene.js";
import rendererT from './renderer.js'
import * as THREE from "@THREE";//@THREE_ROOT_DIR/build/three.module.min.js";
// import { WebGLRenderer } from "@THREE_ROOT_DIR/src/renderers/WebGLRenderer.js";

export default class setup {
    static RENDERER = null;
    constructor(instance) {
        this.inst = instance;
        this.events = new events(this, this.inst);
        this.inst.LighterGroupe = new Object();
    }
    renderer(newFlag = false){
            // let canvas = this.inst.canvas;
            // let a = this.inst.canvas.parentNode.clientWidth;
            // let b = this.inst.canvas.parentNode.clientHeight;
            // swi
            // if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            //     this.inst.canvas.width = a * 2;
            //     this.inst.canvas.height = b * 2;
            // } else {
            //     this.inst.canvas.width = a * 2;
            //     this.inst.canvas.height = b * 2;
            // }
            // this.inst.canvas.style.width = (a) + "px";
            // this.inst.canvas.style.height = (b) + "px";
            // this.inst.context = this.inst.canvas.getContext("webgl2");
            // this.inst.renderer = rendererT.init(window.devicePixelRatio * 2, this.inst.canvas.width, this.inst.canvas.height, this.inst.canvas, this.inst.context)
        if( setup.RENDERER == null || newFlag){
            this.inst.renderer   = new THREE.WebGLRenderer({canvas: this.inst.canvas, preserveDrawingBuffer:false, antialias: false, alpha: true, precision: "highp", powerPreference: "high-performance"});
            this.inst.renderer.shadowMap.enabled = true;
            // this.inst.renderer.shadowMap.type = THREE.VSMShadowMap
            this.inst.renderer.shadowMap.soft = true;
            this.inst.renderer.shadowMap.needsUpdate = true;
            this.inst.renderer.gammaFactor = 10;
            // if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            //     this.inst.renderer.setPixelRatio( window.devicePixelRatio*1.5);
            //     this.inst.renderer.setSize( this.inst.canvas.parentNode.clientWidth /2, this.inst.canvas.parentNode.clientHeight /2, false);
            // } else {
            //     this.inst.renderer.setPixelRatio( window.devicePixelRatio*2);
            //     this.inst.renderer.setSize( this.inst.canvas.parentNode.clientWidth , this.inst.canvas.parentNode.clientHeight, false);
            //     // this.inst.renderer.setPixelRatio( window.devicePixelRatio*0.5);
            // }
            // this.inst.renderer.setSize( this.inst.canvas.parentNode.clientWidth, this.inst.canvas.parentNode.clientHeight, false);

            this.inst.renderer.gammaOutput = true;
            this.inst.renderer.gammaInput = true;
            this.inst.renderer.physicallyCorrectLights = true;
            this.inst.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.inst.renderer.outputEncoding = 3001;
            this.inst.renderer.toneMappingExposure = 1;
            this.inst.renderer.setClearColor(0x000000, 0);
            this.inst.renderer.powerPreference = "high-performance";
            this.inst.renderer.autoClear = true;
            if(newFlag == false){
                setup.RENDERER = this.inst.renderer;
            }
        } else {
            this.inst.renderer = setup.RENDERER;
        }
        this.onResize();
        this.inst.context = this.inst.canvas.getContext("2d", {willReadFrequently: false ,desynchronized: false});
    }
    scene(sceneName = "scene"){
        this.inst.scene      = new THREE.Scene();
    }
    controls(){
        this.inst.controls   = new OrbitControls( this.inst.camera, this.inst.canvas );
        this.inst.controls.enableDamping     = false;   //damping 
        this.inst.controls.dampingFactor     = 0.5;   //damping inertia
        this.inst.controls.enableZoom        = true;      //Zooming
        this.inst.controls.autoRotate        = false;       // enable rotation
        // this.controls.enablePan = true; // enable panning
        // this.controls.minPolarAngle     = Math.PI / 2;
        // this.controls.maxPolarAngle     = Math.PI / 2;
        this.inst.controls.update();
    }
    onResize(){
        this.adjustCamera();
        this.inst.adjustSizes();
    }
    adjustCamera(){
        if(this.inst.camera == undefined){
            return;
        }
        const parentSize = {
            width : this.inst.canvas.parentNode.clientWidth,
            height : this.inst.canvas.parentNode.clientHeight
        }
        this.inst.camera.aspect = parentSize.width / parentSize.height;
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
        window.addEventListener('resize', function(){
            let scenes = SPLINT.threeJS.scenes;
            for(const sc of scenes){
                sc.setup.onResize();
            }
        }, false);
    }
    constructor(inst_setup, inst_core){
        this.inst_setup = inst_setup;
        this.inst_core = inst_core;
    }
}