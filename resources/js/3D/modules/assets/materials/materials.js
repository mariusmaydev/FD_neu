export * from './other.js';
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import SPLINT from 'SPLINT';
import { MeshPhysicalMaterial } from "@THREE_ROOT_DIR/src/materials/MeshPhysicalMaterial.js";

import SRC from '../Helper.js';
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';
import { Vector2 } from "@THREE_ROOT_DIR/src/math/Vector2.js";
import { Texture } from '@THREE_ROOT_DIR/src/textures/Texture.js';

export class Lighter {   
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
              side: THC.DoubleSide,
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

      // let bumpTexture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_bumpMap);
      let NormalMapTexture = null;
      if(src_normalMap != null){
        NormalMapTexture = MaterialHelper.getTexture(src_normalMap);
      } else {
        NormalMapTexture = MaterialHelper.getTexture(src)
      }
        // let d = MaterialHelper.getTexture(src);
        // let t = await startup(d);
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
            normalScale: new Vector2(1, 1),
            normalMapType: THC.TangentSpaceNormalMap ,
            side: THC.FrontSide,
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
    static Engraving( instance, src = null, srcMap = SPLINT.URIs.project + "/" + SRC().lighter.engraving.normalMap, color, onload = function(){}){
      
      let material = null;
      let HELPER = new MaterialHelper("gold");
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
          texture.wrapS = THC.RepeatWrapping;
          texture.wrapT = THC.RepeatWrapping;
          // texture.repeat.set(1, 0.6156);
          texture.flipY = false;
          texture.mapping = THC.EquirectangularReflectionMapping;
          texture.generateMipmaps = true;
          texture.magFilter = THC.NearestFilter;
          texture.minFilter = THC.LinearMipmapLinearFilter;
          texture.anisotropy = 16;
          texture.premultiplyAlpha = true;
          texture.needsUpdate = true;

      // let bumpTexture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_bumpMap);
      let bumpTexture = null;
      if(src != null){
        bumpTexture = MaterialHelper.getTexture(src);
      } else {
        bumpTexture = MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_thumbnail)
      }
          bumpTexture.wrapS = THC.RepeatWrapping;
          bumpTexture.wrapT = THC.RepeatWrapping;
          // texture.repeat.set(1, 0.6156);
          bumpTexture.flipY = false;
          bumpTexture.mapping = THC.EquirectangularReflectionMapping;
          bumpTexture.generateMipmaps = true;
          bumpTexture.magFilter = THC.NearestFilter;
          bumpTexture.minFilter = THC.LinearMipmapLinearFilter;
          bumpTexture.anisotropy = 16;
          bumpTexture.premultiplyAlpha = true;
          bumpTexture.needsUpdate = true;

          material = new MeshPhysicalMaterial( {
            color: 0xffc400,
            map: texture,
            bumpMap: bumpTexture,
            bumpScale: 10,
            side: THC.FrontSide,
            blending: THC.NormalBlending,
            opacity: 2,
            metalness: 1.6,   // between 0 and 1
            roughness: 6, // between 0 and 1
            // depthFunc: THC.LessEqualDepth,
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
            dithering: false
            } );
            material.bumpMap.needsUpdate = true;
            material.color.convertSRGBToLinear();
        HELPER.material = material.clone();
      onload(null, material);
      return material;
    }
  }
  
  


async function startup(texture) {
    return new Promise(async function(resolve){
    let input, output, ctx_i, ctx_o, w, h;
    let img;
    img = texture.source.data;//new Image();//MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_thumbnail).source.data;;
    img.crossOrigin = "Anonymous";
    //img.src = "https://i.imgur.com/a4N2Aj4.jpg"; //128x128 - Tiny but fast.
    // img.src = "http://localhost/fd/data/3Dmodels/Lighter/textures/thumbnail.png"; //256x256 - Takes about a minute.
    input = document.createElement("canvas");

    //img.src = "https://i.imgur.com/bm4pXrn.jpg"; //512x512 - May take 5 or 10 minutes.
    //img.src = "https://i.imgur.com/aUIdxHH.jpg"; //original - Don't do it! It'll take hours.
    // img.onload = function () {
        ctx_i = input.getContext("2d");
        ctx_i.fillStyle = "#000000";
        ctx_i.fillRect(0, 0, input.width, input.height);
        if(img.height > img.width){
            w = img.height;
            h = img.height;
        } else { 
            w = img.width;
            h = img.width;
        }
        w = (265) - 1;
        h = (265) - 1;
        input.width = w + 1;
        input.height = h + 1;
        ctx_i.save();
        ctx_i.imageSmoothingEnabled = true;
        ctx_i.imageSmoothingQuality  = "high";
        ctx_i.globalAlpha = 0.5;
        ctx_i.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
        ctx_i.restore();
        // ctx_i.scale(0.25, 0.25)
        output = document.createElement("canvas");
        ctx_o = output.getContext("2d");
        output.width = w + 1;
        output.height = h + 1;
        await totallyNormal();
        // input.width = img.width;
        // input.height = img.height;
        // ctx_i.clearRect(0, 0,input.width, input.height);
        // ctx_i.drawImage(output, 0, 0, w*4, h*4);
        // let im = new Image();
        //     im.src = await output.toDataURL("image/png", 1);
        //     im.onload = function(){
            let e = await output.toDataURL("image/png", 1);
            console.log(e)
                let im = new Image();
                    let t = new Texture();
                        t.image = im;
                    im.onload = function(){
                        t.needsUpdate = true;
                        resolve(t);
                    }
                    im.src = e;

            // }
            async function totallyNormal() {
                let pixel, x_vector, y_vector;
            
                for (let y = 0; y < w + 1; y += 1) {
                  for (let x = 0; x < h + 1; x += 1) {
                    let data = [0, 0, 0, 0, x > 0, x < w, y > 1, y < h, x - 1, x + 1, x, x, y, y, y - 1, y + 1];
                    for (let z = 0; z < 4; z +=1) {
                      if (data[z + 4]) {
                        pixel = ctx_i.getImageData(data[z + 8], data[z + 12], 1, 1);
                        data[z] = ((0.299 * (pixel.data[0] / 100)) + (0.587 * (pixel.data[1] / 100)) + (0.114 * (pixel.data[2] / 100)) / 3);
                      } else {
                        pixel = ctx_i.getImageData(x, y, 1, 1);
                        data[z] = ((0.299 * (pixel.data[0] / 100)) + (0.587 * (pixel.data[1] / 100)) + (0.114 * (pixel.data[2] / 100)) / 3);
                      }
                    }
                    x_vector = parseFloat((Math.abs(data[0] - data[1]) + 1) * 0.5) * 255;
                    y_vector = parseFloat((Math.abs(data[2] - data[3]) + 1) * 0.5) * 255;
                    ctx_o.fillStyle = "rgba(" + x_vector + "," + y_vector + ",255,255)";
                    ctx_o.fillRect(x, y, 1, 1);
                  }
                }
                return true;
            }
            
    });
    // };
}

