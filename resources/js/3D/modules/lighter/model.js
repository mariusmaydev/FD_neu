
import * as THREE from 'threeJS';
import SPLINT from 'SPLINT';
import * as MATERIALS from '../assets/materials/materials.js';
import S_MATERIALS from '@SPLINT_THREE_DIR/materials/M_materials.js';
import SETUP from './setup.js';
// import * as TEXTURES from '../assets/materials/textures.js';
// import { SVGLoader } from '@THREE_MODULES_DIR/loaders/SVGLoader.js';
// import { TWEEN } from '@THREE_MODULES_DIR/libs/tween.module.min.js'


var FLAG_sceneLoaded = 0;

export default class Model {
    static textureScale = 2;
    static loaded = false;

    static async init(instance, name = "lighter", loaderCount = 1, GoldFlag = true){
        THREE.Cache.enabled = true;
        // if(FLAG_sceneLoaded < loaderCount){
            let SRCscene = null;
            const pos = new THREE.Vector3( 0, 0, 0 );
            // Model.loaded = new Promise(function(resolve){
                
            //     SRCscene = Model.load(SPLINT.resources.models.lighter_glb.scene.clone(), pos);
            //     // instance.loadThumbnail(name, GoldFlag);     
            //     let a = await instance.thumbnailSRC;         
            //     SPLINT.resources.models.lighter_glb.scene = SRCscene;
            //     Model.getThumbnail(SRCscene, instance, a, "gold", 0xe8b000, !GoldFlag);

            //     Model.loaded = true;
            // }.bind(this));

            if(Model.loaded){
                SRCscene = SPLINT.resources.models.lighter_glb.scene.clone();
                SRCscene.position.copy(pos);
            } else {
                SRCscene = Model.load(SPLINT.resources.models.lighter_glb.scene.clone(), pos);
                // Model.createThumbnailPlanes(SRCscene, instance, "gold", false)   
                SPLINT.resources.models.lighter_glb.scene = SRCscene.clone();
                // Model.getThumbnail(SRCscene, instance, a, "gold", 0xe8b000, !GoldFlag);

                Model.loaded = true;
            }    
            // instance.thumbnailSRC.then(async function(tex){
            //     instance.scene.traverse(function(obj){
            //         if(obj.name == "Thumbnail_gold"){
            //             console.log(obj.material);
            //             MATERIALS.Lighter.EngravingSetTexture(obj.material, tex);
            //             obj.material.needsUpdate = true;
            //         }
            //     })
            //     instance.render();
            // });   
            // if(loaderCount > 1){ 
            //     SRCscene = Model.load(SPLINT.resources.models.lighter_glb.scene, pos);
            //     // SPLINT.resources.models.lighter_glb.scene = SRCscene; 
            // } else {
            //     SRCscene = Model.load(SPLINT.resources.models.lighter_glb.scene, pos); 
            //     // SPLINT.resources.models.lighter_glb.scene = SRCscene; 
            // }  

            // let gltfScene = SRCscene;
            SRCscene.name = name;
            SRCscene.rotation.x = Math.PI / 2;
            instance.scene.add(SRCscene);
            await instance.loadThumbnail(name, GoldFlag);    

            // SPLINT.resources.models.lighter_glb.scene = instance.scene.clone();
            // FLAG_sceneLoaded = parseInt(FLAG_sceneLoaded) + 1;
        // }
        Model.getFlame(instance, instance.setup.getLighterGroupe(instance.scene, name));

        // if(FLAG_sceneLoaded >= loaderCount){
            // instance.onFinishLoading(name);
        // }
        return true;
        
    }
    static _rotate(obj, dX, dY, dZ){
        obj.rotation.y += dY / 100;
        obj.rotation.x += dX / 100;
        obj.rotation.z += dZ / 100;
    }

    static load(scene, pos, rotate = true){
        for(const element of scene.children){
            scene.position.copy(pos);
            scene.scale.set(5, 5, 5);
                this.#loadParts(element);
            element.children[0].castShadow = true;
            element.children[0].receiveShadow = true;
          }
          scene.receiveShadow = true;
          scene.castShadow = true;
        return scene;
    }
    static #loadParts(element){
        switch(element.name){
            case 'unteres_teil1'        : {
                // // assignUVs(element.children[0].geometry);

                element.children[0].material = MATERIALS.Lighter.Body(element.children[0].material);
                // const bumpTexture = new THREE.TextureLoader().load("../../../../fd/data/3Dmodels/Lighter/normalMap_lighterBody.png");
                //         material.normalMap = bumpTexture
                //         material.normalMap.repeat.x = 2;
                //         material.normalMap.repeat.y = 2;
                //         material.normalScale.set(1, 1);
                //         material.normalMap.wrapS = THREE.RepeatWrapping;
                //         material.normalMap.wrapT = THREE.RepeatWrapping;
                        // material.bumpMap.repeat.y = 0.5;
                        // material.bumpScale = 0
                        // console.log(material)
             } break;
            case 'oberes_teil1'         : {
                // element.children[0].material.roughness = 0;
                // element.children[0].material.metalness = 0.5;
                // element.children[0].material.dithering = false;
                element.children[0].geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 1.919, 0, 0 ) );
                // element.children[0].position.y = -0.001; 
                element.children[0].position.x = -0.01919; 
                //element.children[0].rotation.z = -134 * Math.PI / 180;
                this.setTextureScale(element, 2);
                element.children[0].material = MATERIALS.Lighter.Body(element.children[0].material);
             } break;
            case 'stab1'                : {
                // element.children[0].material = S_MATERIALS.chrome();
            }  break;
            case 'verbindung_oben1'     : {
                // element.children[0].geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 1.919, 0, 0 ) );
                // // element.children[0].position.y = -0.001; 
                // element.children[0].position.x = -0.01919; 
                element.children[0].geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, -2.08, -0.475 ) );
                element.children[0].position.z = 0.00475; 
                element.children[0].position.y = 0.0208; 
                let boundingBox = new THREE.Box3().setFromObject(element.children[0])
                element.children[0].rotation.x = -135 * Math.PI / 180;
            } break;
            case 'verbindung_unten1'    : {
                // element.children[0].geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, -2.08, -0.475 ) );
                // element.children[0].position.z = 0.00475; 
                // element.children[0].position.y = 0.0208; 

            } break; element.children[0].material = MATERIALS.chrome; break;
            case 'Innenleben11'          : {
                // this.setTextureScale(element, 2);
                // element.children[0].material = MATERIALS.chrome3;
                let mesh = element.children[0];
                let geo = mesh.geometry;
                    // geo.faces.map(f => f.vertexNormals = []);
                // mesh.geometry = BufferGeometryUtils.mergeVertices(mesh.geometry, 0.01);
                // mesh.geometry.computeVertexNormals();
                // mesh.geometry = mg;
                mesh.material = S_MATERIALS.chrome();
                mesh.material.needsUpdate = true;
                // mesh.material.shading = 2;
                // mesh.geometry.attributes.normal.needsUpdate = true;
                // const mergedGeometry = THREE.BufferGeometryLoader.mergeVertices(mesh.geometry);
                // mergedGeometry.computeVertexNormals();
                // mesh.geometry = mergedGeometry;
                // material.color.setHex(0xffffff)

                // element.children[0].material.needsUpdate = true;
            } break;
            case 'Rad1'                 : {
                let material = element.children[0].material;
                    material.map.repeat.x = 1;
                    material.map.repeat.y = 1;
                    material.metalness = 0.2;
                    material.roughness = 0.5;

                    material.normalMap.repeat.x = 2;
                    material.normalMap.repeat.y = 2;
                    material.normalScale.x = 8;
                    material.normalScale.y = 8;
                // element.children[0].material = MATERIALS.gray;
                element.children[0].rotation.y = -100 * Math.PI / 180;
            } break;
            case 'Bolzen_Rad1'          : element.children[0].material = S_MATERIALS.chrome(); break;
            case 'Bolzen_Rad2'          : element.children[0].material = S_MATERIALS.chrome(); break;
            case 'Bolzen_Scharnier2'          : element.children[0].material = S_MATERIALS.chrome(); ; break;
            case 'Feuersteinauflage1'          : element.children[0].material = S_MATERIALS.chrome(); break;
            case 'Feuersteinhalter1'          : element.children[0].material = S_MATERIALS.chrome(); break;
            case 'Schraube1'          : element.children[0].material = S_MATERIALS.chrome(); break;
            case 'Feder1'          : {  
                element.children[0].children[0].material = S_MATERIALS.chrome();
                element.children[0].children[0].castShadow = true;
                element.children[0].children[1].material = S_MATERIALS.chrome();
                element.children[0].children[1].castShadow = true;
                element.children[0].material = S_MATERIALS.chrome();
            } break;
            case 'Feuerstein1'          : element.children[0].material = S_MATERIALS.chrome(); break;
            case 'Scharnier1'          : {
                element.children[0].material = S_MATERIALS.chrome(0xc2c2c2);
                element.children[0].geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 7.573, 0, -11.183 ) );
                element.children[0].rotation.y = 105 * Math.PI / 180;
                element.position.x = -0.0135; 
                // element.children[0].position.y = 0; 
                element.position.z = -0.038; 
            } break;
            case 'docht1'          : element.children[0].material = S_MATERIALS.chrome(); break;
        }
    }
    static setTextureScale(element){
        for(const index in element.children){
            element.children[index].material.map.repeat.x *= this.textureScale;
            element.children[index].material.map.repeat.y *= this.textureScale;
        }
    }
    static getFlame(instance, scene){
        let wick = instance.setup.getLighterGroupe(scene, 'docht1').children[0];
        // flame
        var flameMaterials = [];
        function flame(isFrontSide){
            let flameGeo = new THREE.SphereGeometry(0.5, 32, 32);
                flameGeo.translate(0, 0.5, 0);
            let flameMat = getFlameMaterial(true);
                flameMaterials.push(flameMat);
            let flame = new THREE.Mesh(flameGeo, flameMat);
            flame.position.set(0.0, 3.6, 0.00);
            flame.rotation.y = -45 *(Math.PI / 180);
            flame.name = "flame";
            flame.visible = false;
            wick.add(flame);
            return flame;
        }

        // flame(false);
        return flame(true);
    }
    static createThumbnailPlanes(scene, instance, name, isHidden = false){
        name = "Thumbnail_" + name;
        let material = MATERIALS.Lighter.EngravingBase();
        let plane1 = SPLINT.object.Plane(3.4/1000, 1.976/1000, 1, 1);
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
            if(material.map != null){
                material.map = material.map.clone();
            }
            // material.normalMap = material.normalMap.clone();
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
            scene.children[1].children[0].add(plane2.get()); 
            // requestAnimationFrame(instance.animate.bind(instance));
            
            if(isHidden){
                plane1.get().material.opacity = 0;
                plane2.get().material.opacity = 0;
            }
    }
    static async getThumbnail(scene, instance, src , name = "", color = 0xe8b000, isHidden = false){
        let double = false;
        let material = null;
            return MATERIALS.Lighter.Engraving3(instance, src, undefined, color, async function(texture, mat = null){
                if(mat != null){
                    material = mat;
                }      
                let plane1 = SPLINT.object.Plane(3.4/1000, 1.976/1000, 1, 1);
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
                    material.bumpMap = material.bumpMap.clone();
                    plane2.material = material;
                    plane2.setMapOffset(0, 0.3844);
                    plane2.setMapRepeat(1, 0.61599);

                    plane2.plane.scale.set(1000, 1000, 1000);
                    plane2.get().material.needsUpdate = true;
                    plane2.get().name = name;
                    // plane2.get().visible = false;
                    scene.children[1].children[0].add(plane2.get()); 
                    // requestAnimationFrame(instance.animate.bind(instance));
                    
                    if(isHidden){
                        plane1.get().material.opacity = 0;
                        plane2.get().material.opacity = 0;
                    }
                if(double){
                    let plane1_0 = SPLINT.object.Plane(3.4/1000, 1.976/1000, 1, 1);
                        plane1_0.rotate(0, 180, 180);
                        plane1_0.position(1.92, 0.99, 0.668);
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
                        material.bumpMap = material.bumpMap.clone();
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
    let side = isFrontSide ? THREE.FrontSide : THREE.BackSide;
    return new THREE.ShaderMaterial({
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