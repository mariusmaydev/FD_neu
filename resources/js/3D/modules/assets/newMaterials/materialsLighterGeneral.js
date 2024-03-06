import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import { MeshStandardMaterial } from "@THREE_ROOT_DIR/src/materials/MeshStandardMaterial.js";
import { MeshLambertMaterial } from "@THREE_ROOT_DIR/src/materials/MeshLambertMaterial.js";
import { MeshPhongMaterial } from "@THREE_ROOT_DIR/src/materials/MeshPhongMaterial.js";
import { MeshPhysicalMaterial } from "@THREE_ROOT_DIR/src/materials/MeshPhysicalMaterial.js";
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';
import { Vector2 } from "@THREE_ROOT_DIR/src/math/Vector2.js";
import SPLINT from 'SPLINT';
import { Color } from "@THREE_ROOT_DIR/src/math/Color.js";

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
        material.color = new Color(color);
        material.roughness = 0.34;
        material.metalness = 0.88;
        material.emissive = 0x000000;
        material.emissiveIntensity = 0.5;
        material.map.dispose();
        material.map = null;
        material.normalScale = new Vector2(0.05, 0.05);
        material.name = "bodyColor_" + color;

        material.envMap = instance.cubeRenderTarget.texture;
        material.envMapIntensity= 0.98;
        material.needsUpdate = true;

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
        material.color = new Color(0xffffff);
        material.roughness = 0.61;
        material.metalness = 0.5;
        material.emissive = 0x000000;
        material.emissiveIntensity = 1;
        // material.map.dispose();
        // material.map = null;
        material.map.repeat.set(2.4, 0.8);
        material.map.wrapT = THC.RepeatWrapping;
        material.map.wrapS = THC.RepeatWrapping;
        // let nTexture = material.normalMap;//MaterialHelper.getTexture(MaterialHelper.get("lighterBlackRough").normalMap).clone();
        material.normalMap.wrapT = THC.RepeatWrapping;
        material.normalMap.wrapS = THC.RepeatWrapping;
        material.normalMap.repeat.set(2.4, 0.8)
        material.normalMap.flipY = false;
        material.normalMap.mapping = THC.EquirectangularReflectionMapping;
        material.normalMap.generateMipmaps = true;
        material.normalMap.magFilter = THC.NearestFilter;
        material.normalMap.minFilter = THC.LinearMipmapLinearFilter;
        material.normalMap.needsUpdate = true;
        material.normalScale = new Vector2(10, 10);
        material.name = "wheel";

        material.envMap = instance.cubeRenderTarget.texture;
        material.envMapIntensity= 0.98;
        material.normalMap.needsUpdate = true;
        material.needsUpdate = true;

        SPLINT.GUI.loadObj(material);
        material.color.convertSRGBToLinear();
        material.needsUpdate = true;
        MaterialHelper.set(material);
        return material;
    }
    static chrome(instance){
        if(MaterialHelper.get("chrome") != false){
            return MaterialHelper.get("chrome");
        }
        let material = new MeshStandardMaterial({
            color: 0xe3e3e3,
            // metalnessMap: g2,
            // roughnessMap: g,
            blending: THC.NormalBlending,
            opacity: 1,
            fog: false,
            vertexColors: false,
            // aoMap: g1,
            // aoMapIntensity: 3,
            roughness: 0.15,
            alphaToCoverage: true,
            metalness: 0.9,
            emissive: 0x000000,
            emissiveIntensity: 0.5,

        });
        material.name = "chrome";
        // reflectionCube.mapping = THC.CubeReflectionMapping;
        SPLINT.ResourceManager.cubeTextures.swedishRoyalCastle.then(async function(data){
            material.envMap = data;
            material.envMapIntensity= 0.71;
            material.needsUpdate = true;
        });
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
        let material = new MeshLambertMaterial( { 
            color: 0xffffff, 
            refractionRatio: 2 ,
            reflectivity: 1,
            emissive: 0x000000,
            emissiveIntensity: 1,
            combine: THC.MixOperation,
            fog: false
        } );
        material.name = "chrome1";
        SPLINT.ResourceManager.cubeTextures.swedishRoyalCastle.then(async function(data){
            data.mapping = THC.CubeRefractionMapping;
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
        //     n.wrapT = THC.RepeatWrapping;
        //     n.wrapS = THC.RepeatWrapping;
        //     n.repeat.set(0.1, 1)
        let material = new MeshPhongMaterial({
            color: 0x9a9a9a,
            // aoMap: g1,
            // aoMapIntensity: 0,
            // map: n,
            // normalMap: n,
            // normalScale: new Vector2(0, 0),
            opacity: 1,
            // wireframe: true,
            alphaToCoverage: false,
            emissive: 0x000000,
            side: THC.FrontSide,
            vertexColors: false,
            blending: THC.NormalBlending  ,
            dithering: false,
            emissiveIntensity: 0,
            specular: 0xa6a6a6,
            shininess: 0,
            combine: THC.MixOperation,
            reflectivity: 0.47,
            refractionRatio: 1.25,
            fog: false
        })
        material.name = "chrome2";
        SPLINT.ResourceManager.cubeTextures.swedishRoyalCastle.then(async function(data){
            data.mapping = THC.CubeReflectionMapping;
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
    // static chrome4(instance){
    //     if(MaterialHelper.get("chrome4") != false){
    //         return  MaterialHelper.cloneMaterial(MaterialHelper.get("chrome4"));
    //     }
    //     // let n = MaterialHelper.cloneMaterial(MaterialHelper.get("lighterBlackRough")).normalMap;
    //     //     n.wrapT = THC.RepeatWrapping;
    //     //     n.wrapS = THC.RepeatWrapping;
    //     //     n.repeat.set(0.1, 1)
    //     let material = new MeshPhysicalMaterial( {
    //         color: 0xd4d4d4,
    //         // bumpMap: bumpTexture,
    //         // bumpScale: 0,
    //         // emissiveMap: NormalMapTexture,
    //         side: THC.DoubleSide,
    //         blending: THC.NormalBlending,
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
    //         data.mapping = THC.CubeReflectionMapping;
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