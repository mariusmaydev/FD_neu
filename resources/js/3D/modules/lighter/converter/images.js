import * as THREE from 'threeJS';
import SPLINT from 'SPLINT';
import * as MATERIALS from '../../assets/materials/materials.js';
export default class converterImages {
    constructor(inst) {
        this.inst = inst;
        this.scene = inst.scene;
        this.stack = new Array();
        this.meshGeo = new THREE.PlaneGeometry(3.4/20, 5.145/20, 1, 1);
        this.meshGeo.translate(3.4/40, -5.145/40, 0);
        this.mesh = new THREE.Mesh(this.meshGeo, new THREE.MeshBasicMaterial({transparent: true, opacity: 0}));
        let helper = new THREE.BoxHelper(this.mesh, 0x006aff);
        helper.update();
        // this.mesh.add(helper);
        this.mesh.position.y = 0.267;
        this.mesh.position.x = -0.085;
        this.mesh.position.z = 0.0334;
        // this.mesh.rotation.x = 90 * Math.PI / 180;
        this.mesh.rotation.z =0 * Math.PI / 180;
        // this.mesh.needsUpdate = true;
        // this.mesh.updateMatrixWorld();
        this.mesh.name = "Images";
        console.log(this.mesh)
        this.scene.add(this.mesh);
        // this.Groupe = new THREE.Group();
        // this.Groupe.rotation.x = 90 * Math.PI / 180;
        // this.Groupe.rotation.y = 0 * Math.PI / 180;
        // this.Groupe.rotation.z = 0 * Math.PI / 180;
        // this.Groupe.position.y = 0;
        // this.Groupe.position.x = 0;
        // console.log(this.Groupe);
        // // var sphereAxis = new THREE.AxesHelper(200);
        // // sphereAxis.position.copy(this.Groupe.position);
        // this.scene.add(this.Groupe);
    }
    loadImage(src, name = "", color = 0xe8b000, isHidden = false){
        let double = false;
        let material = null;
            material = MATERIALS.Lighter.Engraving(this.inst, src, undefined, color, function(texture, mat = null){
                console.log(this.scene);
                if(mat != null){
                    material = mat;
                }      
                let plane1 = SPLINT.object.Plane(1, 1, 1, 1);
                    plane1.rotate(0, 180, 180);
                    plane1.position(0, 0, 0);
                    plane1.material = material.clone();
                    plane1.setMapOffset(0, 1);
                    plane1.setMapRepeat(1, 1);

                    plane1.plane.scale.set(3.4/20, 5.145/20, 1);
                    // plane1.plane.scale.set(10, 10, 10);
                    plane1.get().material.needsUpdate = true;
                    plane1.get().name = name;

                    
                    // var sphereAxis1 = new THREE.AxesHelper(200);
                    // sphereAxis1.position.copy(plane1.get().position);
                    // this.Groupe.add(sphereAxis1);

            // let box3 = new THREE.Box3().setFromObject(this.mesh, true);

                    this.mesh.add(plane1.get()); 

                // let plane2 = SPLINT.object.Plane(3.4/1000, 3.169/1000, 1, 1);
                //     plane2.rotate(0, 180, 180);
                //     plane2.position(0, 1.845, 0.668);
                //     plane2.get().material.needsUpdate = true;
                //     material.map = material.map.clone();
                //     // material.normalMap = material.normalMap.clone();
                //     material.bumpMap = material.bumpMap.clone();
                //     plane2.material = material;
                //     plane2.setMapOffset(0, 0.3844);
                //     plane2.setMapRepeat(1, 0.61599);

                //     plane2.plane.scale.set(1000, 1000, 1000);
                //     plane2.get().material.needsUpdate = true;
                //     plane2.get().name = name;
                //     // plane2.get().visible = false;
                //     this.scene.children[1].children[0].add(plane2.get()); 
                    // requestAnimationFrame(instance.animate.bind(instance));
                    
                    if(isHidden){
                        plane1.get().material.opacity = 0;
                        // plane2.get().material.opacity = 0;
                    }
                    console.log(this.mesh)
                this.inst.animate();
                return Promise.resolve("ok");
                // let b = SPLINT.SVGModelLoader.load(SPLINT.resources.SVGs.lighter_engraving_thumbnail_head, plane1.get());
                //     b.object.position.set(-0.002, 0, 0);
                // plane1.get().add(b.object);
                // b.update(1);
                // const boxH = new THREE.BoxHelper( b.object, 0xffff00 ); plane1.get().add( boxH );
                // let c = SPLINT.SVGModelLoader.load(SPLINT.resources.SVGs.lighter_engraving_thumbnail_body,plane2.get());
                // plane2.get().add(c.object);
                // c.update(1);
                // resolve('resolved')
            }.bind(this));
            // let size = new THREE.Vector3();
            // let box3 = new THREE.Box3().setFromObject(this.Groupe);
            // // this.scene.add(box3);
            // this.Groupe.rotation.y = 10;
            // this.Groupe.needsUpdate = true;
            // var helper = new THREE.Box3Helper(box3, 0xff0000);
            // this.scene.add(helper);
            // box3.setFromObject(helper);
            // box3.getSize(size);
            // helper.update();

    }
    setLayer(){
        // for(let i = this.stack.length - 1; i >= 0; i--){
            for(let i = 0; i <= this.stack.length - 1; i++){
            let layer = this.stack[i];
            let mesh = this.getByName(layer.ImageID);
                mesh.position.z = 0 + (0.001*(this.stack.length-i));
                mesh.needsUpdate = true;
                mesh.updateMatrix();
        }
        this.mesh.updateMatrix();
    }
    focus(id){
        // let img = this.getImage(id);
        // let mesh = this.getByName(id);
            console.log(id)
        this.setTop(id);
        this.setLayer();
    }
    setTop(id){
        let index = this.getImageIndex(id);
        this.stack.splice(0, 0, this.stack.splice(index, 1)[0]);
    }
    async addImage(imgData){
        this.stack.push(imgData);
        let Texture = await SPLINT.texture.loadFromRoot(imgData.images.view, function(){
            this.loadImage(Texture, imgData.ImageID);
            imgData.instance = this;
            imgData.instance.inst.raycaster.addObject(imgData.ImageID);
            imgData.update = function(a, b) {
                let parent = this.instance.mesh;
                let mesh = this.instance.getByName(this.ImageID);
    
                let realWidth = 1900;
                let mainWidth = parent.geometry.parameters.width;
                let v = mainWidth / realWidth * this.ImageWidth;
                    mesh.scale.x = v;
    
                let realHeight = 2875;
                let mainHeight = parent.geometry.parameters.height;
                    v = mainHeight / realHeight * this.ImageHeight;
                    mesh.scale.y = v;
    
                v = mainHeight / realHeight * this.ImagePosY;
                mesh.position.y = -v;
    
                v = mainWidth / realWidth * this.ImagePosX;
                mesh.position.x = v;
                mesh.updateMatrix();
                // console.log(this.instance)
            };
            imgData.update();
        }.bind(this))
    }
    removeImage(id){

    }
    getImage(id){
        for(const index in this.stack){
            let img = this.stack[index];
            if(img.ImageID == id){
                return img;
            }
        }
    }
    getImageIndex(id){
        for(let i = 0; i <= this.stack.length - 1; i++){
            let img = this.stack[i];
            if(img.ImageID == id){
                return i;
            }
        }
    }

    setWidth(width){
    }
    getByName(name){
            return SPLINT.Utils.getObjByKey_Value(this.mesh.children, "name", name);
    }
}