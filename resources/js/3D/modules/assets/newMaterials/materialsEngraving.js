import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import { MeshPhysicalMaterial } from "@THREE_ROOT_DIR/src/materials/MeshPhysicalMaterial.js";
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';
import { Vector2 } from "@THREE_ROOT_DIR/src/math/Vector2.js";

export default class MaterialsEngraving {
    static async EngravingBasic(color, src = null, onload = function(){}){
        let material = null;
        let texture = null;
        texture = MaterialHelper.getTexture(src);
            texture.wrapS = THC.RepeatWrapping;
            texture.wrapT = THC.RepeatWrapping;
            texture.repeat.set(1, 0.6156);
            texture.flipY = false;
            texture.mapping = THC.EquirectangularReflectionMapping;
            texture.generateMipmaps = true;
            texture.magFilter = THC.NearestFilter;
            texture.minFilter = THC.LinearMipmapLinearFilter;
            texture.anisotropy = 32;
            texture.premultiplyAlpha = true;
            texture.needsUpdate = true;

        let bumpTexture = null;
            bumpTexture = MaterialHelper.getTexture(src);
            bumpTexture.wrapS = THC.RepeatWrapping;
            bumpTexture.wrapT = THC.RepeatWrapping;
            bumpTexture.repeat.set(1, 0.6156);
            bumpTexture.flipY = false;
            bumpTexture.mapping = THC.EquirectangularReflectionMapping;
            bumpTexture.generateMipmaps = true;
            bumpTexture.magFilter = THC.NearestFilter;
            bumpTexture.minFilter = THC.LinearMipmapLinearFilter;
            bumpTexture.anisotropy = 32;
            bumpTexture.premultiplyAlpha = false;
            bumpTexture.needsUpdate = true;

            material = new MeshPhysicalMaterial( {
                color: color,
                map: texture,
                normalMap: bumpTexture,
                normalScale: new Vector2(10, 10),
                normalMapType: THC.TangentSpaceNormalMap,
                side: THC.FrontSide,
                blending: THC.NormalBlending,
                opacity: 4,
                metalness: 3, 
                roughness: 1, 
                depthTest: true,
                depthWrite: true,
                emissive: color,
                emissiveIntensity: 0.4,
                alphaToCoverage: false,
                transparent: true,
                reflectivity: 0,
                clearcoat: 0,
                iridescence: 0,
                iridescenceIOR: 0,
                clearcoatRoughness: 0,
                specularColor: 0x434343,
                specularIntensity: 1,
                thickness: 1,
                sheenColor: color,
                sheenRoughness: 0.1,
                sheen: 0.3,
                ior: 1,
                fog: false,
                transmission: 0,
                dithering: false,
            });
            material.normalMap.needsUpdate = true;
            material.color.convertSRGBToLinear();
        await onload(null, material);
        return material;
    }
    static async EngravingMain(color = 0xffc400, src = null, src_normalMap = null, onload = function(){}){
        if(src_normalMap == null){
            return this.EngravingBasic(color, src, onload)
        }
        let material = null;
        let texture = MaterialHelper.getTexture(src);
            texture.wrapS = THC.RepeatWrapping;
            texture.wrapT = THC.RepeatWrapping;
            texture.repeat.set(1, 0.6156);
            texture.flipY = false;
            texture.mapping = THC.EquirectangularReflectionMapping;
            texture.generateMipmaps = true;
            texture.magFilter = THC.NearestFilter;
            texture.minFilter = THC.LinearMipmapLinearFilter;
            texture.anisotropy = 32;
            texture.premultiplyAlpha = false;
            texture.needsUpdate = true;
  
        let NormalMapTexture = MaterialHelper.getTexture(src_normalMap);
            NormalMapTexture.wrapS = THC.RepeatWrapping;
            NormalMapTexture.wrapT = THC.RepeatWrapping;
            NormalMapTexture.repeat.set(1, 0.6156);
            NormalMapTexture.flipY = false;
            NormalMapTexture.mapping = THC.EquirectangularReflectionMapping;
            NormalMapTexture.generateMipmaps = true;
            NormalMapTexture.magFilter = THC.NearestFilter;
            NormalMapTexture.minFilter = THC.LinearMipmapLinearFilter;
            NormalMapTexture.anisotropy = 32;
            NormalMapTexture.premultiplyAlpha = false;
            NormalMapTexture.needsUpdate = true;
            NormalMapTexture.encoding = THC.LinearEncoding;
  
  
            material = new MeshPhysicalMaterial( {
                color: color,
                map: texture,
                // bumpMap: bumpTexture,
                // bumpScale: 0,
                // emissiveMap: NormalMapTexture,
                normalMap: NormalMapTexture,
                normalScale: new Vector2(100, 100),
                normalMapType: THC.TangentSpaceNormalMap ,
                side: THC.FrontSide,
                blending: 1,
                opacity: 40,
                metalness: 0.1,  
                roughness: 0.2, 
                depthTest: true,
                depthWrite: true,
                emissive: color,
                emissiveIntensity: 0.1,
                alphaToCoverage: true,
                transparent: true,
                reflectivity: 10,
                clearcoat: 0.1,
                clearcoatRoughness: 10,
                specularColor: 0x3d3d3d,
                specularIntensity: 0.1,
                thickness: 10,
                sheenColor: color,
                sheenRoughness: 0.1,
                sheen: 0.4,
                ior: 1,
                fog: false,
                transmission: 2,
                dithering: true,
            });
            material.normalMap.needsUpdate = true;
            material.color.convertSRGBToLinear();
        await onload(null, material);
        return material;
    }
}