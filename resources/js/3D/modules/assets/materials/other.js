
import * as THREE from 'three';
import SPLINT from 'SPLINT';

export class other {
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
    static indexBackground(color = 0xddb997){
        // 0xffd7af
        return new THREE.MeshStandardMaterial( {
            color: color,
            side: THREE.BackSide,
            roughness: 0.2,
            metalness: 0.5,
            opacity: 1
          } );
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