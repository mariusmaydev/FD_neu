
import * as THREE from 'three';
import SPLINT from 'SPLINT';
import SRC from '../Helper.js';

export class Lighter_textures {
    static Engraving( instance, src = SPLINT.URIs.project + "/" + SRC().lighter.engraving.thumbnail, color, onload = function(){}){
      let texture = null;
      if(typeof src == 'string'){
        texture = SPLINT.texture.load(src, onload);
      } else {
        texture = src.clone();
      }

          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          // texture.repeat.set(1, 0.6156);
          texture.flipY = false;
          texture.mapping = THREE.EquirectangularRefractionMapping;
          // texture.generateMipmaps = false;
          texture.magFilter = THREE.LinearFilter;
          texture.minFilter = THREE.LinearMipMapLinearFilter;
          texture.anisotropy = instance.renderer.capabilities.getMaxAnisotropy();

      return texture;
    }
  }
  