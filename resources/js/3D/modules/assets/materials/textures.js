
// import * as THREE from 'three';
import SPLINT from 'SPLINT';
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import SRC from '../Helper.js';

export class Lighter_textures {
    static Engraving( instance, src = SPLINT.URIs.project + "/" + SRC().lighter.engraving.thumbnail, color, onload = function(){}){
      let texture = null;
      if(typeof src == 'string'){
        texture = SPLINT.texture.load(src, onload);
      } else {
        texture = src.clone();
      }
            let maxAnisotropy = instance.renderer.capabilities.getMaxAnisotropy();
            console.log(maxAnisotropy);
          texture.wrapS = THC.RepeatWrapping;
          texture.wrapT = THC.RepeatWrapping;
          // texture.repeat.set(1, 0.6156);
          texture.flipY = false;
          texture.mapping = THC.EquirectangularRefractionMapping;
          // texture.generateMipmaps = false;
          texture.magFilter = THC.LinearFilter;
          texture.minFilter = THC.LinearMipMapLinearFilter;
          texture.anisotropy = instance.renderer.capabilities.getMaxAnisotropy();

      return texture;
    }
  }
  