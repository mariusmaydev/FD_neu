
// import * as THREE from 'three';
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import { MeshStandardMaterial } from "@THREE_ROOT_DIR/src/materials/MeshStandardMaterial.js";
import { ShadowMaterial } from "@THREE_ROOT_DIR/src/materials/ShadowMaterial.js";
// import {
//     ShadowMaterial,
//     MeshStandardMaterial,
// } from 'three';
// import { MeshPhongMaterial } from "@THREE_ROOT_DIR/src/materials/MeshPhongMaterial.js";
// import SPLINT from 'SPLINT';

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
    static indexBackground(color = 0xddb997){
        // 0xffd7af
        return new MeshStandardMaterial( {
            color: color,
            side: THC.BackSide,
            roughness: 0.2,
            metalness: 0.5,
            opacity: 1
          } );
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