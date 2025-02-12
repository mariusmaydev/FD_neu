
import SPLINT from 'SPLINT';
import * as THREE from "@THREE";
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';

export class Lighter {
    // static Body(material = new MeshStandardMaterial()){
    //   let bumpTexture = SPLINT.resources.textures.lighter_body_bumpMap;
    //       material.roughness = 0.5;
    //       material.metalness = 0.2;
    //       material.dithering = false;
    //       material.emissiveIntensity = 0;
    //       material.map.repeat.x = 1;
    //       material.map.repeat.y = 1;
    //       material.map.anisotropy = 16;
    //       bumpTexture.anisotropy = 16;
    //       material.bumpMap = bumpTexture
    //       material.bumpMap.repeat.x = 1;
    //       material.bumpMap.repeat.y = 1;
    //       material.bumpScale = 0.5;

    //       material.color.convertSRGBToLinear();
    //   return material;
    // }      
    static async EngravingStandard(color = 0xffc400, src = null, onload = function(){}){
        let material = null;
        let texture = null;
        texture = MaterialHelper.getTexture(src);
        
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 0.6156);
            texture.flipY = false;
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.generateMipmaps = true;
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.anisotropy = 32;
            texture.premultiplyAlpha = false;
            texture.needsUpdate = true;
  
        // let bumpTexture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_bumpMap);
        let testTexture = null;
          testTexture = MaterialHelper.getTexture(src);
        testTexture.wrapS = THREE.RepeatWrapping;
        testTexture.wrapT = THREE.RepeatWrapping;
        testTexture.repeat.set(1, 0.6156);
        testTexture.flipY = false;
        testTexture.mapping = THREE.EquirectangularReflectionMapping;
        testTexture.generateMipmaps = true;
        testTexture.magFilter = THREE.LinearFilter;
        testTexture.minFilter = THREE.LinearMipmapLinearFilter;
        testTexture.anisotropy = 32;
        testTexture.premultiplyAlpha = false;
        testTexture.needsUpdate = true;
        testTexture.encoding = THREE.LinearEncoding;
  
  
            material = new THREE.MeshPhysicalMaterial( {
              color: color,
              map: texture,
              // bumpMap: bumpTexture,
              // bumpScale: 0,
              // emissiveMap: testTexture,
              normalMap: testTexture,
              normalScale: new THREE.Vector2(1, 1),
              normalMapType: THREE.TangentSpaceNormalMap ,
              side: THREE.DoubleSide,
              blending: THREE.NormalBlending,
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

    // static EngravingBase(){
    //   let material = new MeshPhysicalMaterial( {
    //     color: 0xffc400,
    //     // map: texture,
    //     // bumpMap: bumpTexture,
    //     bumpScale: 10,
    //     side: THREE.FrontSide,
    //     blending: THREE.NormalBlending,
    //     opacity: 2,
    //     metalness: 1.6,   // between 0 and 1
    //     roughness: 6, // between 0 and 1
    //     // depthFunc: THREE.LessEqualDepth,
    //     depthTest: true,
    //     emissive: 0xffc400,
    //     emissiveIntensity: 0.8,
    //     alphaToCoverage: false,
    //     transparent: true,
    //     reflectivity: 0,
    //     clearcoat: 1.1,
    //     clearcoatRoughness: 0.8,
    //     specularColor: 0x000000,
    //     specularIntensity: 0.1,
    //     thickness: 0,
    //     sheenColor: 0x7b5e00,
    //     sheenRoughness: 0.5,
    //     sheen: 0.2,
    //     ior: 0,
    //     transmission: 0,
    //     dithering: false
    //     } );
    //     // material.bumpMap.needsUpdate = true;
    //     material.color.convertSRGBToLinear();
    //     return material;
    // }  
    // static async EngravingSetTexture(materialIn, src = null){
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

    //   materialIn.map = texture;
    //   materialIn.bumpMap = bumpTexture;
    //   materialIn.bumpMap.needsUpdate = true;
    //   materialIn.map.needsUpdate = true;
    //   materialIn.needsUpdate = true;
    //   return materialIn;
    // }
    static async Engraving4(color, src = null, d = null, onload = function(){}){
        let material = null;
      //   let HELPER = new MaterialHelper("gold");
        // if(HELPER.material != undefined){
        //     material =  MaterialHelper.cloneMaterial(HELPER.material);
        //     // material.color.set(0xffc400);
        //     // material.needsUpdate = true;
        //     onload(null, material);
        //     return material;
        // };
        let texture = null;
        if(src != null){
          texture = MaterialHelper.getTexture(src);
        } else {
          texture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_thumbnail)
        }
        // let texture = SPLINT.resources.textures.lighter_engraving_thumbnail;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // texture.repeat.set(1, 0.6156);
            texture.flipY = false;
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.generateMipmaps = true;
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.anisotropy = 16;
            texture.premultiplyAlpha = false;
            texture.needsUpdate = true;
  
        // let bumpTexture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_bumpMap);
        let bumpTexture = null;
        // if(src != null){
        //   bumpTexture = MaterialHelper.getTexture(src);
        // } else {
          bumpTexture = MaterialHelper.getTexture(SPLINT.resources.textures.ligher_NormalMapEngraving)
        // }
            bumpTexture.wrapS = THREE.RepeatWrapping;
            bumpTexture.wrapT = THREE.RepeatWrapping;
            // texture.repeat.set(1, 0.6156);
            bumpTexture.flipY = false;
            bumpTexture.mapping = THREE.EquirectangularReflectionMapping;
            bumpTexture.generateMipmaps = true;
            bumpTexture.magFilter = THREE.NearestFilter;
            bumpTexture.minFilter = THREE.LinearMipmapLinearFilter;
            bumpTexture.anisotropy = 16;
            bumpTexture.premultiplyAlpha = false;
            bumpTexture.needsUpdate = true;
  
            material = new THREE.MeshPhysicalMaterial( {
              color: 0xffc400,
              map: texture,
              bumpMap: bumpTexture,
              bumpScale: 1000,
              side: THREE.FrontSide,
              blending: THREE.NormalBlending,
              opacity: 2,
              metalness: 1.6,   // between 0 and 1
              roughness: 6, // between 0 and 1
              // depthFunc: THREE.LessEqualDepth,
              depthTest: true,
              emissive: 0xffc400,
              emissiveIntensity: 0.8,
              alphaToCoverage: false,
              transparent: true,
              reflectivity: 0,
              clearcoat: 1.1,
              clearcoatRoughness: 0.8,
              specularColor: 0x000000,
              specularIntensity: 0.1,
              thickness: 0,
              sheenColor: 0x7b5e00,
              sheenRoughness: 0.5,
              sheen: 0.2,
              ior: 0,
              transmission: 0,
              dithering: false,
              });
              material.bumpMap.needsUpdate = true;
              material.color.convertSRGBToLinear();
        await onload(null, material);
        return material;
      }
    static async Engraving3(color = 0xffc400, src = null, src_normalMap = null, onload = function(){}){
      let material = null;
      let texture = null;
      texture = MaterialHelper.getTexture(src);
        // texture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_thumbnail)
      
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
      let testTexture = null;
      if(src_normalMap != null){
        testTexture = startup(src)//MaterialHelper.getTexture(src_normalMap);
      } else {
        testTexture = startup(src)// MaterialHelper.getTexture(src);
        // testTexture = MaterialHelper.getTexture(SPLINT.resources.textures.ligher_NormalMapEngraving)
      }
      testTexture.wrapS = THREE.RepeatWrapping;
      testTexture.wrapT = THREE.RepeatWrapping;
      testTexture.repeat.set(1, 0.6156);
      testTexture.flipY = false;
      testTexture.mapping = THREE.EquirectangularReflectionMapping;
      testTexture.generateMipmaps = true;
      testTexture.magFilter = THREE.NearestFilter;
      testTexture.minFilter = THREE.LinearMipmapLinearFilter;
      testTexture.anisotropy = 32;
      testTexture.premultiplyAlpha = false;
      testTexture.needsUpdate = true;
      testTexture.encoding = THREE.LinearEncoding;


          material = new THREE.MeshPhysicalMaterial( {
            color: color,
            map: texture,
            // bumpMap: bumpTexture,
            // bumpScale: 0,
            // emissiveMap: testTexture,
            normalMap: testTexture,
            normalScale: new THREE.Vector2(10, 10),
            normalMapType: THREE.TangentSpaceNormalMap ,
            side: THREE.DoubleSide,
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
//     static Engraving2( instance, src = SPLINT.URIs.project + "/" + SRC().lighter.engraving.thumbnail, srcMap = SPLINT.URIs.project + "/" + SRC().lighter.engraving.normalMap, color, onload = function(){}){
      
//       let texture = SPLINT.resources.textures.lighter_engraving_thumbnail;
//           texture.wrapS = THREE.RepeatWrapping;
//           texture.wrapT = THREE.RepeatWrapping;
//           // texture.repeat.set(1, 0.6156);
//           texture.flipY = false;
//           texture.mapping = THREE.CubeUVReflectionMapping;
//           texture.generateMipmaps = true;
//           texture.magFilter = THREE.LinearFilter;
//           texture.minFilter = THREE.LinearMipmapLinearFilter;
//           texture.anisotropy = 16;
//           texture.premultiplyAlpha = true;
//           texture.needsUpdate = true;

//           let bumpTexture = SPLINT.resources.textures.lighter_engraving_bumpMap;
//           bumpTexture.wrapS = THREE.RepeatWrapping;
//           bumpTexture.wrapT = THREE.RepeatWrapping;
//           // texture.repeat.set(1, 0.6156);
//           bumpTexture.flipY = false;
//           bumpTexture.mapping = THREE.CubeUVReflectionMapping;
//           bumpTexture.generateMipmaps = true;
//           bumpTexture.magFilter = THREE.LinearFilter;
//           bumpTexture.minFilter = THREE.LinearMipmapLinearFilter;
//           bumpTexture.anisotropy = 16;
//           bumpTexture.premultiplyAlpha = true;
//           bumpTexture.needsUpdate = true;

//       let material = new MeshStandardMaterial( {
//         color: 0xffc400,//e8b000,
//         map: texture,
//         bumpMap: bumpTexture,
//         side: THREE.FrontSide,
//         blending: THREE.NormalBlending,
//         transparent: true,
//         flatShading: true,
//         fog: true,
//         stencilWrite: true,
//         emissive: 0xa37d00,
//         emissiveIntensity: 1,
//         bumpScale: -10,
//         alphaToCoverage: true,
//         // depthFunc: THREE.AlwaysDepth
//         // alphaTest:0.0003
//         // emissive: 0xe8b000,
//         // emissiveIntensity: 0.2
//       });
//           // material.transparent = true;
//           // material.map = texture;
//           material.roughness = 5
//           material.metalness = 1.5;
//           material.opacity = 5;
//           material.depthTest = true;
//           material.dithering = false;
//           // material.emissive = 0xfec300;
//           // material.emissiveIntensity = 100;
//       //     material.map.repeat.x = 5;
//       //     material.map.repeat.y = 5;
      
//           // material.bumpMap.repeat.x = 5;
//           // material.bumpMap.repeat.y = 5;
//           // material.bumpScale = 100;
//           material.bumpMap.needsUpdate = true;
//       //     console.log(material);
// material.color.convertSRGBToLinear();
//       onload(null, material);
//       return material;
//     }
//     static Engraving1( instance, src = SPLINT.URIs.project + "/" + SRC().lighter.engraving.thumbnail, srcMap = SPLINT.URIs.project + "/" + SRC().lighter.engraving.normalMap, color, onload = function(){}){
//       // let normalTexture = null;
//       if(srcMap != null){

//       }
//       let loadFlag = 0;
//       let normalTexture = SPLINT.texture.load(srcMap, function(){
//         loadFlag += 1;
//         // material.normalMap.premultiplyAlpha = true;
//         material.normalMap.needsUpdate = true;
//         if(loadFlag == 2){
//           onload(null, material);
//         }
//       });
//       let texture = null;
//       if(typeof src == 'string'){
//         texture = SPLINT.texture.load(src, function(){
//           loadFlag += 1;
//           if(loadFlag == 2){
//             onload(null, material);
//           }
//         });
//       } else {
//         texture = src.clone();
//         loadFlag += 1;
//       }
//       // texture.anisotropy = instance.renderer.getMaxAnisotropy();

//           texture.wrapS = THREE.RepeatWrapping;
//           texture.wrapT = THREE.RepeatWrapping;
//           // texture.repeat.set(1, 0.6156);
//           texture.flipY = false;
//           texture.mapping = THREE.CubeUVReflectionMapping;
//           // texture.generateMipmaps = true;
//           texture.magFilter = THREE.LinearFilter;
//           texture.minFilter = THREE.LinearMipmapLinearFilter;
//           texture.anisotropy = 16;
//           // texture.premultiplyAlpha = true;
//           texture.needsUpdate = true;

//       let material = new MeshPhongMaterial ( {
//           color: color,//e8b000
//           map: texture,
//           normalMap: normalTexture,
//           side: THREE.FrontSide,
//           blending: THREE.NormalBlending,
//           transparent: true,
//           reflectivity: 1,
//           shininess: 1,
//           specular: 0x1b1b1b,
//           refractionRatio: 1,
//           flatShading: false,
//           fog: false,
//           // alphaTest:0.0003
//           // emissive: 0xe8b000,
//           // emissiveIntensity: 0.2
//         });
//           material.normalMap = normalTexture;
//           material.normalScale.set(10, 10);
//           material.normalMap.wrapS = THREE.RepeatWrapping;
//           material.normalMap.wrapT = THREE.RepeatWrapping;
//           material.normalMap.mapping = THREE.EquirectangularRefractionMapping;
//           // texture.generateMipmaps = false;
//           material.normalMap.magFilter = THREE.LinearFilter;
//           material.normalMap.minFilter = THREE.LinearMipMapLinearFilter;
//           material.normalMap.flipY = false;
//             material.normalMapType = THREE.ObjectSpaceNormalMap;
//             material.normalMap.anisotropy = 16;
//             material.map.needsUpdate = true;
//       if(instance.thumbnailSRC_specularMap != undefined){
//         // material.specularMap = instance.thumbnailSRC_specularMap;
//       }
//       // material.needsUpdate = true;
//       // if(typeof src != 'string'){
//       //   onload(null, material);
//       // }
// material.color.convertSRGBToLinear();
//       return material;
//     }
    // static Wheel(){
    //   let material = new MeshStandardMaterial( {
    //     color:    0x757575,
    //     // envMap: texture,
    //     // combine: THREE.MultiplyOperation,
    //     roughness: 0.5,
    //     metalness: 0.1
    //     });
    //     material.color.convertSRGBToLinear();
    //   return material;
    // }
  }
  
  