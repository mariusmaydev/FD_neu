
import SPLINT from 'SPLINT';
import * as THREE from "@THREE";
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';


export class other {
    static indexFloor(){
        let material = new THREE.MeshPhongMaterial({
            fog: true,
            // map:
            alphaToCoverage: true,
            // alphaTest
            opacity: 1,
            dithering: false,
            side: THREE.DoubleSide,
            transparent: false,
            color: 0xffffff,
            emissive: 0x000000,
            emissiveIntensity: 1,
            reflectivity: 1,
            refractionRatio: 0.98,
            shininess: 30,
            specular: 0x111111,

        });
        return material;
    }
    static indexBackgroundNEW(){
    }
    static converterBackground(){
        return new THREE.MeshStandardMaterial( {
            color: 0xe6e6e6,
            side: THREE.DoubleSide,
            roughness: 0.8,
            metalness: 0.2,
            opacity: 0.1
          } );
    }
    static converterBackgroundTransparent(){
        return new THREE.ShadowMaterial( {
            color: 0x515151,
            side: THREE.DoubleSide,
            opacity: 0.8
          } );
    }
    static projectBackground(){
        return new THREE.MeshStandardMaterial( {
            color: 0xe6e6e6,
            side: THREE.DoubleSide,
            roughness: 0.1,
            metalness: 0.1,
            opacity: 1
          } );
    }

    static async indexBackground(map = null, normalMap = null, envMap = null){
        let material = null;
        if(map != null && normalMap != null){
            let texture = MaterialHelper.getTexture(map);
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10);
                texture.flipY = false;
                texture.mapping = THREE.UVMapping;
                texture.generateMipmaps = true;
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.anisotropy = 32;
                texture.premultiplyAlpha = true;
                texture.needsUpdate = true;

            let NormalTexture = MaterialHelper.getTexture(normalMap);
                NormalTexture.wrapS = THREE.RepeatWrapping;
                NormalTexture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(10, 10);
                NormalTexture.flipY = false;
                NormalTexture.mapping = THREE.UVMapping;
                NormalTexture.generateMipmaps = true;
                NormalTexture.magFilter = THREE.NearestFilter;
                NormalTexture.minFilter = THREE.LinearMipmapLinearFilter;
                NormalTexture.anisotropy = 32;
                NormalTexture.premultiplyAlpha = false;
                NormalTexture.needsUpdate = true;
                
            material = new THREE.MeshPhysicalMaterial( {
                color: 0x878787 ,
                map: texture,
                envMap: envMap,
                envMapIntensity:0.1,
                opacity: 0.2,
                normalMap: NormalTexture,
                normalScale: new THREE.Vector2(1, 1),
                normalMapType: THREE.ObjectSpaceNormalMap,
                metalness: 0,   
                roughness: 0, 
                depthFunc: THREE.LessEqualDepth,
                depthTest: true,
                emissive: 0x000000,
                emissiveIntensity: 0,
                alphaToCoverage: true,
                transparent: false,
                reflectivity: 1,
                side: THREE.DoubleSide,
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
            material = new THREE.MeshPhysicalMaterial( {
                color: 0xffffff,
                opacity: 1,
                metalness: 0,   
                roughness: 3, 
                depthFunc: THREE.LessEqualDepth,
                depthTest: true,
                emissive: 0xffffff,
                emissiveIntensity: 0.1,
                alphaToCoverage: true,
                transparent: true,
                reflectivity: 5,
                side: THREE.BackSide,
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
        //     side: THREE.BackSide,
        //     fog: true,
        //     emissive: 0x000000,
        //     roughness: 0,
        //     metalness: 0.5
        // });
        // // 
    }
    static backgroundMain(color = 0xddb997){
        // 0xffd7af
        return new THREE.MeshStandardMaterial( {
            color: color,
            side: THREE.BackSide,
            roughness: 0.2,
            metalness: 0.5,
            opacity: 1
          } );
    }
    //d
    static materialChrome(){
        let matcapMap = SPLINT.resources.textures.lighter_reflectionENVMap;

        let material =  new THREE.MeshStandardMaterial( {
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
            // // depthFunc: THREE.LessEqualDepth,
            // // depthTest: true,
            // emissive: 0x000000,
            // emissiveIntensity: 0.0,
            // alphaToCoverage: true,
            // transparent: false,
            // reflectivity: 0,
            // side: THREE.BackSide,
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
        let material = new THREE.ShadowMaterial({
            // color: 0xffffff,
            side: THREE.BackSide,
            opacity : 0.5
        });
        return material;
    }
}
