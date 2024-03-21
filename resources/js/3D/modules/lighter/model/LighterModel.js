import SPLINT from "SPLINT";
import * as THREE from '@THREE';
import MaterialHelper from "@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js";
import MaterialsLighterGeneral from "../../assets/newMaterials/materialsLighterGeneral.js";

export default class LighterModel {
    static promiseLoading = null;
    static SRCscenes = null;
    static isStarted = false;
    static loaded = false;
    static {
        this.materials = new Object();
        this.materials.chrome = MaterialsLighterGeneral.chrome();
    }
    constructor(instance, name = "lighter"){
        this.instance = instance;
        this._customLoad = null;
        this.name = name;
        this.withFlame = false;
    }
    set customLoad(callback) {
        this._customLoad = callback;
    }
    get customLoad(){
        return this._customLoad;
    }
    rotate(dX, dY, dZ){
        this.scene.rotation.y += dY / 100;
        this.scene.rotation.x += dX / 100;
        this.scene.rotation.z += dZ / 100;
    }
    async init(){
        return new Promise(async function(resolve, reject){
            LighterModel.isStarted = true;
            SPLINT.ResourceManager.models.lighter_glb.then(async function(data){
                    const pos = new THREE.Vector3( 0, 0, 0 );
                    if(LighterModel.loaded){
                        LighterModel.SRCscene = LighterModel.SRCscene.clone();
                        LighterModel.SRCscene.position.copy(pos);
                    } else {
                        if(this.customLoad != null){
                            LighterModel.SRCscene = await this.customLoad(data.scene, pos);
                        } else {
                            LighterModel.SRCscene = await this.load(data.scene.clone(), pos);
                        }
                        LighterModel.loaded = true;
                    }    
                    LighterModel.SRCscene.name = this.name;
                    LighterModel.SRCscene.rotation.x = Math.PI / 2;
                    this.scene = LighterModel.SRCscene.clone();
                    this.instance.scene.add(this.scene);
                    if(this.withFlame){
                        this.getFlame(this.scene);
                    }
                return true;
            }.bind(this)).then(async function(){
                resolve(true);
            });
        }.bind(this));
    }
    async load(scene, pos){
        if(LighterModel.promiseLoading == null){
            LighterModel.promiseLoading = new Promise(async function(resolve){
                
                    scene.position.copy(pos);
                    scene.scale.set(5, 5, 5);
                let material = scene.children[0].children[0].material.clone();
                    material.name = "lighterBlackRough";
                MaterialHelper.set(material);
                for(const element of scene.children){
                    LighterModel.initParts(element);
                }
                scene.receiveShadow = true;
                scene.castShadow = true;
                resolve(scene);
                return scene;
            }.bind(this));
        }
        return LighterModel.promiseLoading;
    }
    static initParts(element){
        element.children[0].castShadow = true;
        element.children[0].receiveShadow = true;
        let MESH = element.children[0];
        switch(element.name){
            case 'unteres_teil1'       : {
                MESH.material.name = "body";
             } break;
            case 'oberes_teil1'        : {
                MESH.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 1.92, -0.003, 0 ) );
                MESH.position.x = -0.01919; 
                MESH.material.name = "body";
             } break;
            case 'stab1'               : {
                MESH.material.name = "body";
            }  break;
            case 'verbindung_oben1'    : {

                MESH.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, -2.08, -0.475 ) );
                MESH.position.z = 0.00475; 
                MESH.position.y = 0.0208; 
                MESH.rotation.x = 135 * Math.PI / 180;
                MESH.material.name = "body";
            } break;
            case 'verbindung_unten1'   : {
                MESH.material.name = "body";
            } break;
            case 'Innenleben11'        : {
                // MESH.geometry = BufferGeometryUtils.mergeVertices(MESH.geometry, 0.01);
                // MESH.geometry.computeVertexNormals();
                MESH.material = LighterModel.materials.chrome;
                MESH.material.needsUpdate = true;
            } break;
            case 'Rad1'               : {
                MESH.material.name = "wheelStd";
                MESH.material.needsUpdate = true;
                MESH.rotation.y = -100 * Math.PI / 180;
            } break;
            case 'Bolzen_Rad1'        : { MESH.material = LighterModel.materials.chrome; } break;
            case 'Bolzen_Rad2'        : { MESH.material = LighterModel.materials.chrome; } break;
            case 'Bolzen_Scharnier2'  : { MESH.material = LighterModel.materials.chrome; } break;
            case 'Feuersteinauflage1' : { MESH.material = LighterModel.materials.chrome; } break;
            case 'Feuersteinhalter1'  : { MESH.material = LighterModel.materials.chrome; } break;
            case 'Schraube1'          : { MESH.material = LighterModel.materials.chrome; } break;
            case 'Feder1'             : {  
                MESH.children[0].material = LighterModel.materials.chrome;
                MESH.children[0].castShadow = LighterModel;
                MESH.children[1].material = LighterModel.materials.chrome;
                MESH.children[1].castShadow = true;
                MESH.material = LighterModel.materials.chrome;
            } break;
            case 'Feuerstein1'         : { MESH.material = LighterModel.materials.chrome; } break;
            case 'Scharnier1'          : {
                MESH.material = LighterModel.materials.chrome;
                MESH.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 7.573, 0, -11.183 ) );
                MESH.rotation.y = 105 * Math.PI / 180;
                element.position.x = -0.0135; 
                element.position.z = -0.038; 
            } break;
            case 'docht1'          :  break;
        }
    }
    
    static _rotate(obj, dX, dY, dZ){
        obj.rotation.y += dY / 100;
        obj.rotation.x += dX / 100;
        obj.rotation.z += dZ / 100;
    }
    getFlame(scene){
        let wick = this.instance.setup.getLighterGroupe(scene, 'docht1').children[0];
        // flame
        var flameMaterials = [];
        function flame(isFrontSide){
            let flameGeo = new THREE.SphereGeometry(0.5, 32, 32);
                flameGeo.translate(0, 0.5, 0);
            let flameMat = MaterialsLighterGeneral.FlameMaterial(true);
                flameMaterials.push(flameMat);
            let flame = new THREE.Mesh(flameGeo, flameMat);
            flame.position.set(0.0, 1.8, 0.00);
            flame.rotation.y = -45 *(Math.PI / 180);
            flame.name = "flame";
            flame.visible = false;
            wick.add(flame);
            return flame;
        }

        // flame(false);
        return flame(true);
    }
}