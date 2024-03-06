
import SPLINT from 'SPLINT';
import * as MATERIALS from '../assets/materials/materials.js';
import MaterialsEngraving from '../assets/newMaterials/materialsEngraving.js';
import MaterialsLighterGeneral from '../assets/newMaterials/materialsLighterGeneral.js';
import S_MATERIALS from '@SPLINT_THREE_DIR/materials/M_materials.js';
import { CanvasTexture } from "@THREE_ROOT_DIR/src/textures/CanvasTexture.js";
import { Vector3 } from "@THREE_ROOT_DIR/src/math/Vector3.js";
import { Vector2 } from "@THREE_ROOT_DIR/src/math/Vector2.js";
import { Matrix4 } from "@THREE_ROOT_DIR/src/math/Matrix4.js";
import { SphereGeometry } from "@THREE_ROOT_DIR/src/geometries/SphereGeometry.js";
import { Box3 } from "@THREE_ROOT_DIR/src/math/Box3.js";
import { Mesh } from "@THREE_ROOT_DIR/src/objects/Mesh.js";
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import { ShaderMaterial } from "@THREE_ROOT_DIR/src/materials/ShaderMaterial.js";
import { MeshLambertMaterial } from "@THREE_ROOT_DIR/src/materials/MeshLambertMaterial.js";
import { CubeTextureLoader } from "@THREE_ROOT_DIR/src/loaders/CubeTextureLoader.js";
import { BufferGeometryLoader } from "@THREE_ROOT_DIR/src/loaders/BufferGeometryLoader.js";
import * as BufferGeometryUtils from "@THREE_ROOT_DIR/examples/jsm/utils/BufferGeometryUtils.js";
import MaterialHelper from '@SPLINT_THREE_DIR/materials/MaterialHelper.js';
import { MeshPhongMaterial, MeshStandardMaterial } from 'three';
import { Color } from "@THREE_ROOT_DIR/src/math/Color.js";



export default class Model {
    static textureScale = 2;
    static loaded = false;
    static SRCscene = null;
    static isStarted = false;
    static async init(instance, name = "lighter", GoldFlag = true, thumbnailFlag = true){
        return new Promise(async function(resolve, reject){
            Model.isStarted = true;
            SPLINT.ResourceManager.models.lighter_glb.then(async function(data){
                    const pos = new Vector3( 0, 0, 0 );
                    
                    if(Model.loaded){
                        Model.SRCscene = Model.SRCscene.clone();
                        Model.SRCscene.position.copy(pos);
                    } else {
                        Model.SRCscene = await Model.load(data.scene.clone(), pos, null, instance);
                        Model.loaded = true;
                    }    
                    Model.SRCscene.name = name;
                    Model.SRCscene.rotation.x = Math.PI / 2;
                    instance.scene.add(Model.SRCscene.clone());
                    if(thumbnailFlag){
                        await instance.loadThumbnail(name, GoldFlag);    
                    }
                Model.getFlame(instance, instance.setup.getLighterGroupe(instance.scene, name));
                return true;
            }.bind(this)).then(async function(){
                resolve(true);
            });
        }.bind(this));
    }
    static _rotate(obj, dX, dY, dZ){
        obj.rotation.y += dY / 100;
        obj.rotation.x += dX / 100;
        obj.rotation.z += dZ / 100;
    }
    static p = null;
    static async load(scene, pos, rotate = true, instance = null){
        if(this.p == null){
            this.p = new Promise(async function(resolve){
                
                    scene.position.copy(pos);
                    scene.scale.set(5, 5, 5);
                let material = scene.children[0].children[0].material.clone();
                    material.name = "lighterBlackRough";
                MaterialHelper.set(material);
                for(const element of scene.children){
                        this.#loadParts(element, scene, instance);
                    element.children[0].castShadow = true;
                    element.children[0].receiveShadow = true;
                }
                scene.receiveShadow = true;
                scene.castShadow = true;
                console.dir(scene)
                resolve(scene);
                return scene;
            }.bind(this));
        }
        return this.p;
    }
    static async #loadParts(element, scene = null, instance = null){
        switch(element.name){
            case 'unteres_teil1'        : {
                element.children[0].material.name = "body";
             } break;
            case 'oberes_teil1'         : {
                element.children[0].geometry.applyMatrix4( new Matrix4().makeTranslation( 1.919, 0, 0 ) );

                element.children[0].position.x = -0.01919; 
                element.children[0].material.name = "body";
             } break;
            case 'stab1'                : {
                element.children[0].material.name = "body";
            }  break;
            case 'verbindung_oben1'     : {
                element.children[0].geometry.applyMatrix4( new Matrix4().makeTranslation( 0, -2.08, -0.475 ) );
                element.children[0].position.z = 0.00475; 
                element.children[0].position.y = 0.0208; 
                element.children[0].rotation.x = 135 * Math.PI / 180;
                element.children[0].material.name = "body";
            } break;
            case 'verbindung_unten1'    : {
                element.children[0].material.name = "body";
            } break;
            case 'Innenleben11'          : {
                let mesh = element.children[0];
                element.children[0].geometry = BufferGeometryUtils.mergeVertices(mesh.geometry, 0.01);
                element.children[0].geometry.computeVertexNormals();

				// // let path = '../../../../../../Splint/lib/threeJS/examples/textures/cube/SwedishRoyalCastle/';
				// // let format = '.jpg';
				// // let urls = [
				// // 	path + 'px' + format, path + 'nx' + format,
				// // 	path + 'py' + format, path + 'ny' + format,
				// // 	path + 'pz' + format, path + 'nz' + format
				// // ];//new CubeTextureLoader().load( urls );
				// let refractionCube = await SPLINT.ResourceManager.cubeTextures.swedishRoyalCastle;
				// refractionCube.mapping = THC.CubeRefractionMapping;

                // let g2 = await SPLINT.ResourceManager.textures.steel_metalicMap;
                // let g = await SPLINT.ResourceManager.textures.steel_roughnessMap;
                // let g1 = await SPLINT.ResourceManager.textures.steel_aoMap;

                // // g.repeat.set(1, 1);
                // g.flipY = false;
                // g.generateMipmaps = true;
                // g.mapping = THC.UVMapping  ;
                // g.magFilter = THC.LinearFilter;
                // g.minFilter = THC.LinearMipmapLinearFilter;
                // g.anisotropy = 16;
                // g.premultiplyAlpha = false;
                // g.needsUpdte = true;
                // g.matrixAutaoUpdate = true;
                // g.wrapS = THC.ClampToEdgeWrapping;
                // g.wrapT = THC.ClampToEdgeWrapping;
                // g.repeat.set(20, 20);

                // // let d = MaterialHelper.getTexture(instance.scene.enviroment);
                // let mP = new MeshPhongMaterial({
                //     color: 0x9a9a9a,
                //     // aoMap: g1,
                //     // aoMapIntensity: 0,
                //     opacity: 0.4,
                //     envMap: refractionCube,
                //     alphaToCoverage: true,
                //     emissive: 0x000000,
                //     side: THC.FrontSide,
                //     vertexColors: false,
                //     blending: THC.NormalBlending  ,
                //     dithering: false,
                //     emissiveIntensity: 0.2,
                //     specular: 0xa6a6a6,
                //     shininess: 50,
                //     combine: THC.MixOperation,
                //     reflectivity: 0.2,
                //     refractionRatio: 0.3,
                //     fog: false
                // })
                // mP.aoMap.needsUpdate = true;
                // mP.color.convertSRGBToLinear();
                // mP.needsUpdate = true;
                // let c = await SPLINT.ResourceManager.textures.lighter_inner_texture;
                // this.setTextureScale(element.children[0], 2);
                element.children[0].material = instance.materials.chrome;//S_MATERIALS.chrome(0xffffff, g, c);
                element.children[0].material.needsUpdate = true;
                // element.children[0].material.needsUpdate = true;
                    // geo.faces.map(f => f.vertexNormals = []);
                // SPLINT.ResourceManager.textures.lighter_reflectionENVMap.then(async function(data){
                //     console.log(data)
                // }.bind(this));
                // 
                // mesh.geometry.attributes.normal.needsUpdate = true;
                // const mergedGeometry = BufferGeometryLoader.mergedGeometry(mesh.geometry);
                // mergedGeometry.computeVertexNormals();
                // mesh.geometry = mergedGeometry;
                // material.color.setHex(0xffffff)

                // element.children[0].material.needsUpdate = true;
            } break;
            case 'Rad1'                 : {
                element.children[0].material.name = "wheelStd";
                element.children[0].material.needsUpdate = true;
                element.children[0].rotation.y = -100 * Math.PI / 180;
            } break;
            case 'Bolzen_Rad1'          : element.children[0].material = instance.materials.chrome; break;
            case 'Bolzen_Rad2'          : element.children[0].material = instance.materials.chrome; break;
            case 'Bolzen_Scharnier2'          : element.children[0].material = instance.materials.chrome; ; break;
            case 'Feuersteinauflage1'          : element.children[0].material = instance.materials.chrome; break;
            case 'Feuersteinhalter1'          : element.children[0].material = instance.materials.chrome; break;
            case 'Schraube1'          : element.children[0].material = instance.materials.chrome; break;
            case 'Feder1'          : {  
                element.children[0].children[0].material = instance.materials.chrome;
                element.children[0].children[0].castShadow = true;
                element.children[0].children[1].material = instance.materials.chrome;
                element.children[0].children[1].castShadow = true;
                element.children[0].material = instance.materials.chrome;
            } break;
            case 'Feuerstein1'          : element.children[0].material = instance.materials.chrome; break;
            case 'Scharnier1'          : {
                element.children[0].material = instance.materials.chrome;
                element.children[0].geometry.applyMatrix4( new Matrix4().makeTranslation( 7.573, 0, -11.183 ) );
                element.children[0].rotation.y = 105 * Math.PI / 180;
                element.position.x = -0.0135; 
                // element.children[0].position.y = 0; 
                element.position.z = -0.038; 
            } break;
            case 'docht1'          :  break;
        }
    }
    static setTextureScale(element){
            element.material.map.repeat.x *= this.textureScale;
            element.material.map.repeat.y *= this.textureScale;
    }
    static getFlame(instance, scene){
        let wick = instance.setup.getLighterGroupe(scene, 'docht1').children[0];
        // flame
        var flameMaterials = [];
        function flame(isFrontSide){
            let flameGeo = new SphereGeometry(0.5, 32, 32);
                flameGeo.translate(0, 0.5, 0);
            let flameMat = getFlameMaterial(true);
                flameMaterials.push(flameMat);
            let flame = new Mesh(flameGeo, flameMat);
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
    static async getThumbnail(scene, instance, src, src_normalMap, name = "", color = 0xe8b000, isHidden = false){
        let double = false;
        let material = null;
        if(color == 0xe8b000){
            src = MaterialHelper.getTransparentTexture(src, {r: 255, g: 247, b: 214, a: 100}, function(data, color, i){
                return data[i] <= color.r
                && data[i + 1] <= color.g
                && data[i + 2] <= color.b
                && data[i + 3] >= color.a;
            });
        } else {
            src = MaterialHelper.getTransparentTexture(src, {r: 100, g: 100, b: 100, a: 100}, function(data, color, i){
                return data[i] >= color.r
                && data[i + 1] >= color.g
                && data[i + 2] >= color.b
                && data[i + 3] >= color.a;
            });
        }
            
            return MaterialsEngraving.EngravingMain(color, src, src_normalMap, async function(texture, mat = null){
                if(mat != null){
                    material = mat;
                }      
                let plane1 = SPLINT.object.Plane(3.4/1000, 1.976/1000, 1, 1);
                    plane1.plane.castShadow = false;
                    plane1.plane.receiveShadow = false;
                    plane1.rotate(0, 180, 180);
                    plane1.position(1.92, 0.99, 0.668);
                    plane1.material = material.clone();
                    plane1.setMapOffset(0, 1);
                    plane1.setMapRepeat(1, 0.38401);

                    plane1.plane.scale.set(1000, 1000, 1000);
                    // plane1.plane.scale.set(10, 10, 10);
                    plane1.get().material.needsUpdate = true;
                    plane1.get().name = name;
                    scene.children[0].children[0].add(plane1.get()); 
                let plane2 = SPLINT.object.Plane(3.4/1000, 3.169/1000, 1, 1);
                    plane2.rotate(0, 180, 180);
                    plane2.position(0, 1.845, 0.668);
                    plane2.get().material.needsUpdate = true;
                    material.map = material.map.clone();
                    // material.normalMap = material.normalMap.clone();
                    // material.bumpMap = material.bumpMap.clone();
                    if(material.normalMap != null){
                        material.normalMap = material.normalMap.clone();
                    } 
                    if(material.bumpMap != null){
                        material.bumpMap = material.bumpMap.clone();
                    }
                    plane2.material = material;
                    plane2.setMapOffset(0, 0.3844);
                    plane2.setMapRepeat(1, 0.61599);
                    plane2.plane.scale.set(1000, 1000, 1000);
                    plane2.get().material.needsUpdate = true;
                    plane2.get().name = name;
                    // plane2.get().visible = false;
                    let p2 = plane2.get();
                    scene.children[1].children[0].add(p2); 
                    p2.receiveShadow = false;
                    p2.castShadow = false;
                    // requestAnimationFrame(instance.animate.bind(instance));
                    
                    if(isHidden){
                        plane1.get().material.opacity = 0;
                        plane2.get().material.opacity = 0;
                    }
                if(double){
                    let plane1_0 = SPLINT.object.Plane(3.4/1000, 1.976/1000, 1, 1);
                        plane1_0.rotate(0, 180, 180);
                        plane1_0.position(1.92, 0.99, 0.67);
                        plane1_0.material = material.clone();
                        plane1_0.setMapOffset(0, 1);
                        plane1_0.setMapRepeat(1, 0.38401);

                        plane1_0.plane.scale.set(1000, 1000, 1000);
                        plane1_0.get().material.needsUpdate = true;
                        plane1_0.get().name = name + "1";
                        scene.children[0].children[0].add(plane1_0.get()); 

                    let plane2_0 = SPLINT.object.Plane(3.4/1000, 3.169/1000, 1, 1);
                        plane2_0.rotate(0, 180, 180);
                        plane2_0.position(0, 1.845, 0.668);
                        plane2_0.get().material.needsUpdate = true;
                        // material.normalMap = material.normalMap.clone();
                        // material.bumpMap = material.bumpMap.clone();
                        material.map = material.map.clone();
                        plane2_0.material = material;
                        plane2_0.setMapOffset(0, 0.3844);
                        plane2_0.setMapRepeat(1, 0.61599);

                        plane2_0.plane.scale.set(1000, 1000, 1000);
                        plane2_0.get().name = name + "1";
                        scene.children[1].children[0].add(plane2_0.get()); 
                        if(isHidden){
                            plane1_0.get().material.opacity = 0;
                            plane2_0.get().material.opacity = 0;
                        }
                        // requestAnimationFrame(instance.animate.bind(instance));
                }
                // return Promise.resolve("ok");
                // let b = SPLINT.SVGModelLoader.load(SPLINT.resources.SVGs.lighter_engraving_thumbnail_head, plane1.get());
                //     b.object.position.set(-0.002, 0, 0);
                // plane1.get().add(b.object);
                // b.update(1);
                // const boxH = new THREE.BoxHelper( b.object, 0xffff00 ); plane1.get().add( boxH );
                // let c = SPLINT.SVGModelLoader.load(SPLINT.resources.SVGs.lighter_engraving_thumbnail_body,plane2.get());
                // plane2.get().add(c.object);
                // c.update(1);
                return true;
            }.bind(this));
    }
}

function getFlameMaterial(isFrontSide){
    let side = isFrontSide ? THC.FrontSide : THC.BackSide;
    return new ShaderMaterial({
      uniforms: {
        time: {value: 0}
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying float hValue;

        //https://thebookofshaders.com/11/
        // 2D Random
        float random (in vec2 st) {
            return fract(sin(dot(st.xy,
                                 vec2(12.9898,78.233)))
                         * 43758.5453123);
        }

        // 2D Noise based on Morgan McGuire @morgan3d
        // https://www.shadertoy.com/view/4dS3Wd
        float noise (in vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);

            // Four corners in 2D of a tile
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));

            // Smooth Interpolation

            // Cubic Hermine Curve.  Same as SmoothStep()
            vec2 u = f*f*(3.0-2.0*f);
            // u = smoothstep(0.,1.,f);

            // Mix 4 coorners percentages
            return mix(a, b, u.x) +
                    (c - a)* u.y * (1.0 - u.x) +
                    (d - b) * u.x * u.y;
        }

        void main() {
          vUv = uv;
          vec3 pos = position;

          pos *= vec3(0.8, 2, 0.725);
          hValue = position.y;
          //float sinT = sin(time * 2.) * 0.5 + 0.5;
          float posXZlen = length(position.xz);

          pos.y *= 1. + (cos((posXZlen + 0.25) * 3.1415926) * 0.25 + noise(vec2(0, time)) * 0.125 + noise(vec2(position.x + time, position.z + time)) * 0.5) * position.y; // flame height

          pos.x += noise(vec2(time * 2., (position.y - time) * 4.0)) * hValue * 0.0312; // flame trembling
          pos.z += noise(vec2((position.y - time) * 4.0, time * 2.)) * hValue * 0.0312; // flame trembling

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
        }
      `,
      fragmentShader: `
        varying float hValue;
        varying vec2 vUv;

        // honestly stolen from https://www.shadertoy.com/view/4dsSzr
        vec3 heatmapGradient(float t) {
          return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
        }

        void main() {
          float v = abs(smoothstep(0.0, 0.4, hValue) - 1.);
          float alpha = (1. - v) * 0.99; // bottom transparency
          alpha -= 1. - smoothstep(1.0, 0.97, hValue); // tip transparency
          gl_FragColor = vec4(heatmapGradient(smoothstep(0.0, 0.3, hValue)) * vec3(0.95,0.95,0.4), alpha) ;
          gl_FragColor.rgb = mix(vec3(0,0,1), gl_FragColor.rgb, smoothstep(0.0, 0.3, hValue)); // blueish for bottom
          gl_FragColor.rgb += vec3(1, 0.9, 0.5) * (1.25 - vUv.y); // make the midst brighter
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.66, 0.32, 0.03), smoothstep(0.95, 1., hValue)); // tip
        }
      `,
      transparent: true,
      side: side
    });
  }