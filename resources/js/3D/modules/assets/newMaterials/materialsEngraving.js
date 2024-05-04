
import * as THREE from "@THREE";
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';

export default class MaterialsEngraving {
    static loadBase(color, src){
        color = new THREE.Color(0xe8b000)
        
        let texture = MaterialHelper.getTexture(src);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // texture.repeat.set(1, 0.6156);
            texture.flipY = false;
            texture.mapping = THREE.UVMapping;
            texture.generateMipmaps = true;
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.anisotropy = 16;
            texture.premultiplyAlpha = true;
            texture.needsUpdate = true;
        let bumpTexture = null;
            bumpTexture = MaterialHelper.getTexture(src);
            bumpTexture.wrapS = THREE.RepeatWrapping;
            bumpTexture.wrapT = THREE.RepeatWrapping;
            // bumpTexture.repeat.set(1, 0.6156);
            bumpTexture.flipY = false;
            bumpTexture.mapping = THREE.EquirectangularReflectionMapping;
            bumpTexture.generateMipmaps = true;
            bumpTexture.magFilter = THREE.NearestFilter;
            bumpTexture.minFilter = THREE.LinearFilter;
            bumpTexture.anisotropy = 16;
            bumpTexture.premultiplyAlpha = true;
            bumpTexture.needsUpdate = true;

        let material = new THREE.MeshPhysicalMaterial( {
                map: texture,
                color: color,
                // normalMap: bumpTexture,
                // normalScale: new THREE.Vector2(1, 1),
                // normalMapType: THREE.TangentSpaceNormalMap,
                side: THREE.BackSide,
                blending: THREE.NormalBlending,
                opacity: 180,
                metalness: 0, 
                roughness: 0, 
                emissive: color,
                emissiveIntensity: 1,
                reflectivity: 0,
                clearcoat: 10,
                // iridescence: 0,
                // iridescenceIOR: 0,
                clearcoatRoughness: 0,
                specularColor:  0x434343,
                specularIntensity: 0,
                thickness: 1,
                sheenColor: color,
                sheenRoughness: 0.1,
                sheen: 0,
                // ior: 1.5,
                fog: false,
                // transmission: 1,
                dithering: false,
            });
            // material.normalMap.needsUpdate = true;
            material.color.convertSRGBToLinear();
        return material;
    }
    static loadEnvMap(material, texture){
        material.envMap = texture;
        material.envMapIntensity = 0.5;
        material.needsUpdate = true;
    }
    static loadAlphaMap(material, texture){
        let AlphaTexture = MaterialHelper.getTexture(texture);
            AlphaTexture.wrapS = THREE.RepeatWrapping;
            AlphaTexture.wrapT = THREE.RepeatWrapping;
            AlphaTexture.flipY = false;
            AlphaTexture.mapping = THREE.UVMapping;
            AlphaTexture.generateMipmaps = true;
            AlphaTexture.magFilter = THREE.NearestFilter;
            AlphaTexture.minFilter = THREE.LinearFilter;
            AlphaTexture.premultiplyAlpha = true;
            AlphaTexture.anisotropy = 16;
            AlphaTexture.needsUpdate = true;
        material.setValues( {
            side: THREE.BackSide,
            blending: THREE.NormalBlending,
            depthTest: true,
            depthWrite: true,
            // alphaHash: true,
            alphaMap: AlphaTexture,
            // alphaTest: 0.8,
            transparent: true,
            alphaToCoverage: false,
        });
        material.color.convertSRGBToLinear();
        material.needsUpdate = true;
        material.alphaMap.needsUpdate = true;
        return material;
    }
    static loadNormalMap(material, texture){

        let NormalMapTexture = MaterialHelper.getTexture(texture);
            NormalMapTexture.wrapS = THREE.RepeatWrapping;
            NormalMapTexture.wrapT = THREE.RepeatWrapping;
            // NormalMapTexture.repeat.set(512, 512);
            NormalMapTexture.flipY = false;
            NormalMapTexture.mapping = THREE.UVMapping;
            NormalMapTexture.generateMipmaps = true;
            NormalMapTexture.magFilter = THREE.NearestFilter;
            NormalMapTexture.minFilter = THREE.LinearMipMapLinearFilter;
            NormalMapTexture.premultiplyAlpha = true;
            NormalMapTexture.anisotropy = 16;
            // NormalMapTexture.type = THREE.UnsignedIntType
            // NormalMapTexture.format = THREE.DepthFormat;
            NormalMapTexture.needsUpdate = true;
            let color = new THREE.Color(0xe8b000)
            material.setValues( {
                color: color,
                // map: NormalMapTexture,
                // bumpMap: bumpTexture,
                // bumpScale: 0,
                // emissiveMap: NormalMapTexture,
                normalMap: NormalMapTexture,
                normalScale: new THREE.Vector2(100, 100),
                normalMapType: THREE.TangentSpaceNormalMap ,
                side: THREE.BackSide,
                // blending: 1,
                opacity: 50,
                metalness: 1,  
                roughness: 1.5, 
                depthTest: true,
                depthWrite: true,
                emissive: color,
                emissiveIntensity: 0.2,
                alphaToCoverage: true,
                transparent: true,
                reflectivity: 10,
                clearcoat: 0,
                clearcoatRoughness: 0,
                specularColor: color,
                specularIntensity: 1,
                thickness: 10,
                sheenColor: color,
                sheenRoughness: 0,
                sheen: 0.5,
                ior: 1.5,
                fog: true,
                transmission: 1,
                dithering: false,
            });
        // material.setValues( {
        //     normalMap: NormalMapTexture,
        //     normalScale: new THREE.Vector2(10, 10),
        //     normalMapType: THREE.TangentSpaceNormalMap ,
        //     side: THREE.BackSide,
        //     blending: THREE.NormalBlending,
        //     opacity: 100,
        //     metalness: 0.5,  
        //     roughness: 0.2, 
        //     emissive: 0x3b3b3b,
        //     emissiveIntensity: 0.25,
        //     reflectivity: 1,
        //     clearcoat: 0,
        //     clearcoatRoughness: 0,
        //     specularColor: 0x3d3d3d,
        //     specularIntensity: 1,
        //     thickness: 10,
        //     sheenColor: 0x3d3d3d,
        //     sheenRoughness: 0.1,
        //     sheen: 0.1,
        //     ior: 0,
        //     fog: false,
        //     // transmission:1.5,
        //     dithering: true,
        // });
        material.color.convertSRGBToLinear();
        material.normalMap.needsUpdate = true;
        material.map.needsUpdate = true;
        material.needsUpdate = true;
        return material;
    }
}

