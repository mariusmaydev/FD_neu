import * as THREE from "@THREE";
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';
import SPLINT from 'SPLINT';

export default class MaterialsLighterGeneral {
    static BODY_COLOR_LIST = new Object();
    static {
        this.BODY_COLOR_LIST.green  = 0x006800;
        this.BODY_COLOR_LIST.base   = "base";
    }            
    static bodyColor(instance, color){
        if(MaterialHelper.get("bodyColor_" + color) != false){
            return MaterialHelper.get("bodyColor_" + color);
        }
        let material = MaterialHelper.cloneMaterial(MaterialHelper.get("lighterBlackRough"));
        material.color = new THREE.Color(color);
        material.roughness = 0.34;
        material.metalness = 0.88;
        material.emissive = 0x000000;
        material.emissiveIntensity = 0.5;
        material.map.dispose();
        material.map = null;
        material.normalScale = new THREE.Vector2(0.05, 0.05);
        material.name = "bodyColor_" + color;

        // if(instance.cubeRenderTarget != undefined){
        //     material.envMap = instance.cubeRenderTarget.texture;
        //     material.envMapIntensity= 0.98;
            material.needsUpdate = true;
        // }

        SPLINT.GUI.loadObj(material);
        material.color.convertSRGBToLinear();
        material.needsUpdate = true;
        MaterialHelper.set(material);
        return material;
    }
    static wheel(instance, materialBase){
        if(MaterialHelper.get("wheel") != false){
            return MaterialHelper.get("wheel");
        }
        console.dir(materialBase)
        let material = MaterialHelper.cloneMaterial(materialBase);
        material.color = new THREE.Color(0xffffff);
        material.roughness = 0.61;
        material.metalness = 0.5;
        material.emissive = 0x000000;
        material.emissiveIntensity = 1;
        // material.map.dispose();
        // material.map = null;
        material.map.repeat.set(2.4, 0.8);
        material.map.wrapT = THREE.RepeatWrapping;
        material.map.wrapS = THREE.RepeatWrapping;
        // let nTexture = material.normalMap;//MaterialHelper.getTexture(MaterialHelper.get("lighterBlackRough").normalMap).clone();
        material.normalMap.wrapT = THREE.RepeatWrapping;
        material.normalMap.wrapS = THREE.RepeatWrapping;
        material.normalMap.repeat.set(2.4, 0.8)
        material.normalMap.flipY = false;
        material.normalMap.mapping = THREE.EquirectangularReflectionMapping;
        material.normalMap.generateMipmaps = true;
        material.normalMap.magFilter = THREE.NearestFilter;
        material.normalMap.minFilter = THREE.LinearMipmapLinearFilter;
        material.normalMap.needsUpdate = true;
        material.normalScale = new THREE.Vector2(10, 10);
        material.name = "wheel";

        // material.envMap = instance.cubeRenderTarget.texture;
        // material.envMapIntensity= 0.98;
        material.normalMap.needsUpdate = true;
        material.needsUpdate = true;

        SPLINT.GUI.loadObj(material);
        material.color.convertSRGBToLinear();
        material.needsUpdate = true;
        MaterialHelper.set(material);
        return material;
    }
    static chrome(instance = null){
        if(MaterialHelper.get("chrome") != false){
            return MaterialHelper.get("chrome");
        }
        let material = new THREE.MeshStandardMaterial({
            // color: 0xd4d4d4,
            // metalnessMap: g2,
            // roughnessMap: g,
            // blending: THREE.NormalBlending,
            // opacity: 1,
            // fog: false,
            // vertexColors: false,
            // aoMap: g1,
            // aoMapIntensity: 3,
            roughness: 0.5,
            // alphaToCoverage: true,
            metalness: 1.5,
            emissive: 0x000000,
            emissiveIntensity: 1,

        });
        material.name = "chrome";
        // reflectionCube.mapping = THREE.CubeReflectionMapping;
        // if(instance != null) {
        //     material.envMap = instance.cubeRenderTarget.texture;
        //     material.envMapIntensity= 1;
            material.needsUpdate = true;
        // }
        // SPLINT.ResourceManager.cubeTextures.swedishRoyalCastle.then(async function(data){
            // material.envMap = data;
            // material.envMapIntensity= 0.71;
            // material.needsUpdate = true;
        // });
            // material.envMap = instance.cubeRenderTarget.texture;
            // material.envMapIntensity= 1;
            // material.needsUpdate = true;
        SPLINT.GUI.loadObj(material);
        // stdmat.metalnessMap.needsUpdate = true;
        // stdmat.roughnessMap.needsUpdate = true;
        // stdmat.aoMap.needsUpdate = true;
        material.color.convertSRGBToLinear();
        material.needsUpdate = true;
        MaterialHelper.set(material);
        return material;
    }
    static chrome1(){
        if(MaterialHelper.get("chrome1") != false){
            return MaterialHelper.get("chrome1");
        }
        let material = new THREE.MeshLambertMaterial( { 
            color: 0xffffff, 
            refractionRatio: 2 ,
            reflectivity: 1,
            emissive: 0x000000,
            emissiveIntensity: 1,
            combine: THREE.MixOperation,
            fog: false
        } );
        material.name = "chrome1";
        SPLINT.ResourceManager.cubeTextures.swedishRoyalCastle.then(async function(data){
            data.mapping = THREE.CubeRefractionMapping;
            material.envMap = data;
            material.needsUpdate = true;
            SPLINT.GUI.loadObj(material);
        });
        material.color.convertSRGBToLinear();
        material.needsUpdate = true;
        console.log(material)
        MaterialHelper.set(material);
        return material;
    }
    static chrome2(){
        if(MaterialHelper.get("chrome2") != false){
            return MaterialHelper.get("chrome2");
        }
        // let n = MaterialHelper.cloneMaterial(MaterialHelper.get("lighterBlackRough")).normalMap;
        //     n.wrapT = THREE.RepeatWrapping;
        //     n.wrapS = THREE.RepeatWrapping;
        //     n.repeat.set(0.1, 1)
        let material = new THREE.MeshPhongMaterial({
            color: 0x9a9a9a,
            // aoMap: g1,
            // aoMapIntensity: 0,
            // map: n,
            // normalMap: n,
            // normalScale: new THREE.Vector2(0, 0),
            opacity: 1,
            // wireframe: true,
            alphaToCoverage: false,
            emissive: 0x000000,
            side: THREE.FrontSide,
            vertexColors: false,
            blending: THREE.NormalBlending  ,
            dithering: false,
            emissiveIntensity: 0,
            specular: 0xa6a6a6,
            shininess: 0,
            combine: THREE.MixOperation,
            reflectivity: 0.47,
            refractionRatio: 1.25,
            fog: false
        })
        material.name = "chrome2";
        SPLINT.ResourceManager.cubeTextures.swedishRoyalCastle.then(async function(data){
            data.mapping = THREE.CubeReflectionMapping;
            material.envMap = data;
            material.envMapIntensity = 0.2;
            material.needsUpdate = true;
        SPLINT.GUI.loadObj(material);
        });
        material.color.convertSRGBToLinear();
        material.needsUpdate = true;
        MaterialHelper.set(material);
        return material;
    }
    
    static FlameMaterial(isFrontSide){
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
    // static chrome4(instance){
    //     if(MaterialHelper.get("chrome4") != false){
    //         return  MaterialHelper.cloneMaterial(MaterialHelper.get("chrome4"));
    //     }
    //     // let n = MaterialHelper.cloneMaterial(MaterialHelper.get("lighterBlackRough")).normalMap;
    //     //     n.wrapT = THREE.RepeatWrapping;
    //     //     n.wrapS = THREE.RepeatWrapping;
    //     //     n.repeat.set(0.1, 1)
    //     let material = new MeshPhysicalMaterial( {
    //         color: 0xd4d4d4,
    //         // bumpMap: bumpTexture,
    //         // bumpScale: 0,
    //         // emissiveMap: NormalMapTexture,
    //         side: THREE.DoubleSide,
    //         blending: THREE.NormalBlending,
    //         opacity: 1,
    //         metalness: 0.6,  
    //         roughness: 1, 
    //         depthTest: true,
    //         depthWrite: true,
    //         emissive: 0x000000,
    //         emissiveIntensity: 0.1,
    //         alphaToCoverage: true,
    //         transparent: false,
    //         reflectivity: 1,
    //         clearcoat: 1,
    //         clearcoatRoughness: 0,
    //         specularColor: 0xffffff,
    //         specularIntensity: 1,
    //         thickness: 0,
    //         sheenColor: 0x000000,
    //         sheenRoughness: 0,
    //         sheen: 0,
    //         ior: 0,
    //         fog: false,
    //         transmission: 0,
    //         dithering: false,
    //     });
    //     material.name = "chrome4";
    //     SPLINT.ResourceManager.cubeTextures.swedishRoyalCastle.then(async function(data){
    //         data.mapping = THREE.CubeReflectionMapping;
    //         material.envMap = data;
    //         material.envMapIntensity = 1;
    //         material.needsUpdate = true;
    //     });
    //     material.color.convertSRGBToLinear();
    //     material.needsUpdate = true;
    //         SPLINT.GUI.loadObj(material);
    //     MaterialHelper.set(material);
    //     return material;
    // }
}