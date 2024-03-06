
// import * as THREE from 'three';
import SPLINT from 'SPLINT';
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import { MeshStandardMaterial } from "@THREE_ROOT_DIR/src/materials/MeshStandardMaterial.js";
import { MeshMatcapMaterial } from "@THREE_ROOT_DIR/src/materials/MeshMatcapMaterial.js";
import { MeshPhysicalMaterial } from "@THREE_ROOT_DIR/src/materials/MeshPhysicalMaterial.js";
import { ShadowMaterial } from "@THREE_ROOT_DIR/src/materials/ShadowMaterial.js";
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';
import { Vector2 } from "@THREE_ROOT_DIR/src/math/Vector2.js";


export class other {
    static converterBackground(){
        return new MeshStandardMaterial( {
            color: 0xe6e6e6,
            side: THC.DoubleSide,
            roughness: 0.8,
            metalness: 0.2,
            opacity: 0.1
          } );
    }
    static converterBackgroundTransparent(){
        return new ShadowMaterial( {
            color: 0x515151,
            side: THC.DoubleSide,
            opacity: 0.8
          } );
    }
    static projectBackground(){
        return new MeshStandardMaterial( {
            color: 0xe6e6e6,
            side: THC.DoubleSide,
            roughness: 0.1,
            metalness: 0.1,
            opacity: 1
          } );
    }
    static async indexBackground(map = null, normalMap = null, envMap = null){
        let material = null;
        if(map != null && normalMap != null){
            let texture = MaterialHelper.getTexture(map);
                texture.wrapS = THC.RepeatWrapping;
                texture.wrapT = THC.RepeatWrapping;
                texture.repeat.set(10, 10);
                texture.flipY = false;
                texture.mapping = THC.UVMapping;
                texture.generateMipmaps = true;
                texture.magFilter = THC.NearestFilter;
                texture.minFilter = THC.LinearMipmapLinearFilter;
                texture.anisotropy = 32;
                texture.premultiplyAlpha = true;
                texture.needsUpdate = true;

            let NormalTexture = MaterialHelper.getTexture(normalMap);
                NormalTexture.wrapS = THC.RepeatWrapping;
                NormalTexture.wrapT = THC.RepeatWrapping;
                texture.repeat.set(10, 10);
                NormalTexture.flipY = false;
                NormalTexture.mapping = THC.UVMapping;
                NormalTexture.generateMipmaps = true;
                NormalTexture.magFilter = THC.NearestFilter;
                NormalTexture.minFilter = THC.LinearMipmapLinearFilter;
                NormalTexture.anisotropy = 32;
                NormalTexture.premultiplyAlpha = false;
                NormalTexture.needsUpdate = true;
                
            material = new MeshPhysicalMaterial( {
                color: 0x878787 ,
                map: texture,
                envMap: envMap,
                envMapIntensity:0.1,
                opacity: 0.2,
                normalMap: NormalTexture,
                normalScale: new Vector2(1, 1),
                normalMapType: THC.ObjectSpaceNormalMap,
                metalness: 0,   
                roughness: 0, 
                depthFunc: THC.LessEqualDepth,
                depthTest: true,
                emissive: 0x000000,
                emissiveIntensity: 0,
                alphaToCoverage: true,
                transparent: false,
                reflectivity: 1,
                side: THC.DoubleSide,
                clearcoat: 0,
                clearcoatRoughness: 0,
                specularColor: 0xffffff,
                specularIntensity: 1,
                sheenColor: 0x793600,
                sheenRoughness: 0,
                sheen: 0,
                // ior: 0,
                fog: false,
                transmission: 0
                // attenuationDistance: 0.00001,
                // attenuationColor: 0xff0000
                } );
                material.normalMap.needsUpdate = true;
                material.map.needsUpdate = true;
                material.color.convertSRGBToLinear();
        } else {
            material = new MeshPhysicalMaterial( {
                color: 0xffffff,
                opacity: 1,
                metalness: 0,   
                roughness: 3, 
                depthFunc: THC.LessEqualDepth,
                depthTest: true,
                emissive: 0xffffff,
                emissiveIntensity: 0.1,
                alphaToCoverage: true,
                transparent: true,
                reflectivity: 5,
                side: THC.BackSide,
                clearcoat: 0.2,
                clearcoatRoughness: 0,
                specularColor: 0x000000,
                specularIntensity: 0.1,
                sheenColor: 0xffffff,
                sheenRoughness: 10,
                sheen: 2,
                // ior: 0,
                fog: true,
                transmission: 0
                // attenuationDistance: 0.00001,
                // attenuationColor: 0xff0000
                } );
        }
        
        return material;
        // // 0xffd7af
        // return new MeshStandardMaterial({
        //     color: 0xcdcdcd,
        //     side: THC.BackSide,
        //     fog: true,
        //     emissive: 0x000000,
        //     roughness: 0,
        //     metalness: 0.5
        // });
        // // 
    }
    static backgroundMain(color = 0xddb997){
        // 0xffd7af
        return new MeshStandardMaterial( {
            color: color,
            side: THC.BackSide,
            roughness: 0.2,
            metalness: 0.5,
            opacity: 1
          } );
    }
    //d
    static materialChrome(){
        let matcapMap = SPLINT.resources.textures.lighter_reflectionENVMap;

        let material =  new MeshStandardMaterial( {
            color: "#555",
            metalness: 2.0,
            roughness: 0.0,

            envMap: matcapMap,
            envMapIntensity: 5.0
            // color: 0x727272,
            // // blending: THREE.NormalBlending,
            // // opacity: 0,
            // metalness: 1,   
            // roughness: 0.68, 
            // // depthFunc: THC.LessEqualDepth,
            // // depthTest: true,
            // emissive: 0x000000,
            // emissiveIntensity: 0.0,
            // alphaToCoverage: true,
            // transparent: false,
            // reflectivity: 0,
            // side: THC.BackSide,
            // clearcoat: 0.8,
            // clearcoatRoughness: 1,
            // specularColor: 0x000000,
            // specularIntensity: 0,
            // sheenColor: 0x4d4d4d,
            // sheenRoughness: 2,
            // sheen: 2,
            // // ior: 0,
            // // fog: true,
            // transmission: 0.5
            // attenuationDistance: 0.00001,
            // attenuationColor: 0xff0000
            } );
            return material;
    }
    
    static shadowCatcher(){
        let material = new ShadowMaterial({
            // color: 0xffffff,
            side: THC.BackSide,
            opacity : 0.5
        });
        return material;
    }
}
