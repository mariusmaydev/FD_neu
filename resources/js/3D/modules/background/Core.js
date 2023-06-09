import * as THREE from 'threeJS';
import SPLINT from 'SPLINT';
import * as MATERIALS from '../assets/materials/materials.js';
import LIGHT_Dark from './light_dark.js';
import LIGHT_Bright from './light_bright.js';
import LIGHT_Medium from './light_medium.js';
import SETUP from '../lighter/setup.js';

export class draw {
    static get(canvas){
        return new draw(canvas);
    }
    constructor(canvas){
        this.id = "background3D_";
        this.canvas = canvas;
        this.loaded = true;
        this.setup = new SETUP(this);
        this.init();
        this.events();
        this.draw();

    }
    init(){
        this.setup.renderer(true);
        this.scene      = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xd7d7d7, 0.05, 20);
        this.setupCamera();

        this.renderer.toneMappingExposure = 1;
        // this.setup.controls();
    }
    setupCamera(){
        this.camera     = new THREE.PerspectiveCamera(10, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 200);
        this.camera.position.set(-0.15, 0.35, 3.5);
        this.camera.rotation.set(-0.05, 0, 0);
    }
    async loadThumbnail(name, GoldFlag){return}
    onFinishLoading(){

    }
    light(){
        switch(this.canvas.getAttribute("brightness")){
            case "dark"     : LIGHT_Dark(this.scene);   break;
            case "medium"   : LIGHT_Medium(this.scene); break;
            case "bright"   : LIGHT_Bright(this.scene); break;
            default         : LIGHT_Medium(this.scene); break;
        }
        
    }
    
    animate(){
        this.render();
    }
    render(){
        this.renderer.render(this.scene, this.camera);
        this.context.clearRect(0, 0, this.canvas.parentNode.clientWidth*2, this.canvas.parentNode.clientHeight*2);
        let domE = this.renderer.domElement;
        this.context.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);
    }
    drawBackground(){
        this.scene.background = new THREE.Color( 0x000000);
        let plane = SPLINT.object.Plane(1000, 1600, 1, 1);
        plane.get().geometry.translate(0, -799, 0);
        // plane.position(0, 0, -15);
            plane.rotate(93, 0, 0);
            let color;
            switch(this.canvas.getAttribute("brightness")){
                case "dark"     : color = 0x9e856b; break;
                case "medium"   : color = 0xbfa182; break;
                case "bright"   : color = 0xdfcbb7; break;
                default         : color = 0xbfa182; break;
            }
            plane.plane.material = MATERIALS.other.indexBackground(color);
            plane.plane.receiveShadow = true;
        this.scene.add(plane.plane);
    }    
    draw(){
        this.drawBackground();
        this.light();
        this.scene.add( this.camera );
        this.animate();
    }
    events(){
        // this.setup.events.onResizeInit();
        let flag = true;
    }
    onResize(){
        let a = this.canvas.parentNode.clientWidth;
        let b = this.canvas.parentNode.clientHeight;
        this.canvas.style.width = a + "px";
        this.canvas.style.height = b + "px";
        this.renderer.setPixelRatio( window.devicePixelRatio * 0.5);
        this.renderer.setSize( this.canvas.parentNode.clientWidth, this.canvas.parentNode.clientHeight);
        this.camera.aspect = this.canvas.parentNode.clientWidth / this.canvas.parentNode.clientHeight;
        this.camera.updateProjectionMatrix();
    }
}
