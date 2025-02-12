export * from './other.js';
import * as THREE from "@THREE";
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';

export class Lighter {   
    static async EngravingBasic(color, src = null, onload = function(){}){
        let material = null;
        let texture = null;
          texture = MaterialHelper.getTexture(src);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 0.6156);
            texture.flipY = false;
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.generateMipmaps = true;
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.anisotropy = 32;
            texture.premultiplyAlpha = true;
            texture.needsUpdate = true;
  
        let bumpTexture = null;
            bumpTexture = MaterialHelper.getTexture(src);
            bumpTexture.wrapS = THREE.RepeatWrapping;
            bumpTexture.wrapT = THREE.RepeatWrapping;
            bumpTexture.repeat.set(1, 0.6156);
            bumpTexture.flipY = false;
            bumpTexture.mapping = THREE.EquirectangularReflectionMapping;
            bumpTexture.generateMipmaps = true;
            bumpTexture.magFilter = THREE.NearestFilter;
            bumpTexture.minFilter = THREE.LinearMipmapLinearFilter;
            bumpTexture.anisotropy = 32;
            bumpTexture.premultiplyAlpha = false;
            bumpTexture.needsUpdate = true;

            material = new THREE.MeshPhysicalMaterial( {
              color: color,
              map: texture,
              normalMap: bumpTexture,
              normalScale: new THREE.Vector2(10, 10),
              normalMapType: THREE.TangentSpaceNormalMap,
              side: THREE.DoubleSide,
              blending: THREE.NormalBlending,
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
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(1, 0.6156);
          texture.flipY = false;
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.generateMipmaps = true;
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.anisotropy = 32;
          texture.premultiplyAlpha = false;
          texture.needsUpdate = true;

      // let bumpTexture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_bumpMap);
      let NormalMapTexture = null;
      if(src_normalMap != null){
        NormalMapTexture = MaterialHelper.getTexture(src_normalMap);
      } else {
        NormalMapTexture = MaterialHelper.getTexture(src)
      }
        // let d = MaterialHelper.getTexture(src);
        // let t = await startup(d);
        NormalMapTexture.wrapS = THREE.RepeatWrapping;
        NormalMapTexture.wrapT = THREE.RepeatWrapping;
          NormalMapTexture.repeat.set(1, 0.6156);
        NormalMapTexture.flipY = false;
        NormalMapTexture.mapping = THREE.EquirectangularReflectionMapping;
        NormalMapTexture.generateMipmaps = true;
        NormalMapTexture.magFilter = THREE.NearestFilter;
        NormalMapTexture.minFilter = THREE.LinearMipmapLinearFilter;
        NormalMapTexture.anisotropy = 32;
        NormalMapTexture.premultiplyAlpha = false;
        NormalMapTexture.needsUpdate = true;
        NormalMapTexture.encoding = THREE.LinearEncoding;


          material = new THREE.MeshPhysicalMaterial( {
            color: color,
            map: texture,
            // bumpMap: bumpTexture,
            // bumpScale: 0,
            // emissiveMap: NormalMapTexture,
            normalMap: NormalMapTexture,
            normalScale: new THREE.Vector2(1, 1),
            normalMapType: THREE.TangentSpaceNormalMap ,
            side: THREE.FrontSide,
            blending: 1,
            opacity: 40,
            metalness: 0.1,   // between 0 and 1
            roughness: 0.2, // between 0 and 1
            depthTest: true,
            emissive: color,
            emissiveIntensity: 0.1,
            alphaToCoverage: false,
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
            dithering: false,
            });
            material.normalMap.needsUpdate = true;
            // material.bumpMap.needsUpdate = true;
            material.color.convertSRGBToLinear();
      await onload(null, material);
      return material;
    }
    // static Engraving( instance, src = null, srcMap = SPLINT.URIs.project + "/" + SRC().lighter.engraving.normalMap, color, onload = function(){}){
      
    //   let material = null;
    //   let HELPER = new MaterialHelper("gold");
    //   // if(HELPER.material != undefined){
    //   //     material =  MaterialHelper.cloneMaterial(HELPER.material);
    //   //     // material.color.set(0xffc400);
    //   //     // material.needsUpdate = true;
    //   //     onload(null, material);
    //   //     return material;
    //   // };
    //   let texture = null;
    //   if(src != null){
    //     texture = MaterialHelper.getTexture(src);
    //   } else {
    //     texture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_thumbnail)
    //   }
    //   // let texture = SPLINT.resources.textures.lighter_engraving_thumbnail;
    //       texture.wrapS = THREE.RepeatWrapping;
    //       texture.wrapT = THREE.RepeatWrapping;
    //       // texture.repeat.set(1, 0.6156);
    //       texture.flipY = false;
    //       texture.mapping = THREE.EquirectangularReflectionMapping;
    //       texture.generateMipmaps = true;
    //       texture.magFilter = THREE.NearestFilter;
    //       texture.minFilter = THREE.LinearMipmapLinearFilter;
    //       texture.anisotropy = 16;
    //       texture.premultiplyAlpha = true;
    //       texture.needsUpdate = true;

    //   // let bumpTexture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_bumpMap);
    //   let bumpTexture = null;
    //   if(src != null){
    //     bumpTexture = MaterialHelper.getTexture(src);
    //   } else {
    //     bumpTexture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_thumbnail)
    //   }
    //       bumpTexture.wrapS = THREE.RepeatWrapping;
    //       bumpTexture.wrapT = THREE.RepeatWrapping;
    //       // texture.repeat.set(1, 0.6156);
    //       bumpTexture.flipY = false;
    //       bumpTexture.mapping = THREE.EquirectangularReflectionMapping;
    //       bumpTexture.generateMipmaps = true;
    //       bumpTexture.magFilter = THREE.NearestFilter;
    //       bumpTexture.minFilter = THREE.LinearMipmapLinearFilter;
    //       bumpTexture.anisotropy = 16;
    //       bumpTexture.premultiplyAlpha = true;
    //       bumpTexture.needsUpdate = true;

    //       material = new MeshPhysicalMaterial( {
    //         color: 0xffc400,
    //         map: texture,
    //         bumpMap: bumpTexture,
    //         bumpScale: 10,
    //         side: THREE.FrontSide,
    //         blending: THREE.NormalBlending,
    //         opacity: 2,
    //         metalness: 1.6,   // between 0 and 1
    //         roughness: 6, // between 0 and 1
    //         // depthFunc: THREE.LessEqualDepth,
    //         depthTest: true,
    //         emissive: 0xffc400,
    //         emissiveIntensity: 0.8,
    //         alphaToCoverage: false,
    //         transparent: true,
    //         reflectivity: 0,
    //         clearcoat: 1.1,
    //         clearcoatRoughness: 0.8,
    //         specularColor: 0x000000,
    //         specularIntensity: 0.1,
    //         thickness: 0,
    //         sheenColor: 0x7b5e00,
    //         sheenRoughness: 0.5,
    //         sheen: 0.2,
    //         ior: 0,
    //         transmission: 0,
    //         dithering: false
    //         } );
    //         material.bumpMap.needsUpdate = true;
    //         material.color.convertSRGBToLinear();
    //     HELPER.material = material.clone();
    //   onload(null, material);
    //   return material;
    // }
  }
  
  
