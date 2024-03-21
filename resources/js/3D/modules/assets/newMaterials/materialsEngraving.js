
import * as THREE from "@THREE";
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';

export default class MaterialsEngraving {
    static loadBase(color, src){
        
        let texture = MaterialHelper.getTexture(src);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // texture.repeat.set(1, 0.6156);
            texture.flipY = false;
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.generateMipmaps = true;
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
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
            bumpTexture.minFilter = THREE.LinearMipmapLinearFilter;
            bumpTexture.anisotropy = 16;
            bumpTexture.premultiplyAlpha = false;
            bumpTexture.needsUpdate = true;

        let material = new THREE.MeshPhysicalMaterial( {
                color: color,
                // map: texture,
                normalMap: bumpTexture,
                normalScale: new THREE.Vector2(1, 1),
                normalMapType: THREE.TangentSpaceNormalMap,
                side: THREE.BackSide,
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
                specularColor: color,// 0x434343,
                specularIntensity: 1,
                thickness: 1,
                sheenColor: color,
                sheenRoughness: 0.1,
                sheen: 0.3,
                ior: 0,
                fog: false,
                transmission: 0,
                dithering: false,
            });
            material.normalMap.needsUpdate = true;
            material.color.convertSRGBToLinear();
        return material;
    }
    static loadEnvMap(material, texture){
        material.envMap = texture;
        material.envMapIntensity = 1;
        material.needsUpdate = true;
    }
    static loadAlphaMap(material, texture){
  
        // console.log()
        // ctx.fillText("Hello world", 50, 100);

        let AlphaTexture = MaterialHelper.getTexture(texture);
            AlphaTexture.wrapS = THREE.RepeatWrapping;
            AlphaTexture.wrapT = THREE.RepeatWrapping;
            // NormalMapTexture.repeat.set(512, 512);
            AlphaTexture.flipY = false;
            AlphaTexture.mapping = THREE.UVMapping;
            AlphaTexture.generateMipmaps = true;
            AlphaTexture.magFilter = THREE.LinearFilter;
            AlphaTexture.minFilter = THREE.LinearMipMapLinearFilter;
            AlphaTexture.premultiplyAlpha = true;
            AlphaTexture.anisotropy = 1024;
            // NormalMapTexture.type = THREE.UnsignedIntType
            // NormalMapTexture.format = THREE.DepthFormat;
            AlphaTexture.needsUpdate = true;
            // NormalMapTexture.encoding = THREE.LinearEncoding;
        material.setValues( {
            // color: color,
            // map: NormalMapTexture,
            // bumpMap: bumpTexture,
            // bumpScale: 0,
            // emissiveMap: NormalMapTexture,
            side: THREE.BackSide,
            blending: THREE.NormalBlending,
            opacity: 10,
            metalness: 0.2,  
            roughness: 0.3, 
            depthTest: true,
            alphaMap: AlphaTexture,
            alphaTest: 0.1,
            depthWrite: true,
            emissive: 0x3b3b3b,
            emissiveIntensity: 1,
            transparent: true,
            alphaToCoverage: false,
            reflectivity: 10,
            clearcoat: 0.1,
            clearcoatRoughness: 10,
            // specularColor: 0x3d3d3d,
            specularIntensity: 100,
            thickness: 1,
            // sheenColor: color,
            sheenRoughness: 0.1,
            sheen: 0.1,
            ior: 0,
            fog: false,
            // transmission:1.5,
            dithering: true,
        });
        material.color.convertSRGBToLinear();
        material.needsUpdate = true;
        material.alphaMap.needsUpdate = true;
        return material;
    }
    static loadNormalMap(material, texture){
            
        // console.log()
        // ctx.fillText("Hello world", 50, 100);

        // let AlphaTexture = MaterialHelper.getTexture(t2);
        //     AlphaTexture.wrapS = THREE.RepeatWrapping;
        //     AlphaTexture.wrapT = THREE.RepeatWrapping;
        //     // NormalMapTexture.repeat.set(512, 512);
        //     AlphaTexture.flipY = false;
        //     AlphaTexture.mapping = THREE.UVMapping;
        //     AlphaTexture.generateMipmaps = true;
        //     AlphaTexture.magFilter = THREE.LinearFilter;
        //     AlphaTexture.minFilter = THREE.LinearMipMapLinearFilter;
        //     AlphaTexture.premultiplyAlpha = true;
        //     AlphaTexture.anisotropy = 1024;
        //     // NormalMapTexture.type = THREE.UnsignedIntType
        //     // NormalMapTexture.format = THREE.DepthFormat;
        //     AlphaTexture.needsUpdate = true;
            // NormalMapTexture.encoding = THREE.LinearEncoding;

        let NormalMapTexture = MaterialHelper.getTexture(texture);
            NormalMapTexture.wrapS = THREE.RepeatWrapping;
            NormalMapTexture.wrapT = THREE.RepeatWrapping;
            // NormalMapTexture.repeat.set(512, 512);
            NormalMapTexture.flipY = false;
            NormalMapTexture.mapping = THREE.UVMapping;
            NormalMapTexture.generateMipmaps = true;
            NormalMapTexture.magFilter = THREE.LinearFilter;
            NormalMapTexture.minFilter = THREE.LinearMipMapLinearFilter;
            NormalMapTexture.premultiplyAlpha = true;
            NormalMapTexture.anisotropy = 1024;
            // NormalMapTexture.type = THREE.UnsignedIntType
            // NormalMapTexture.format = THREE.DepthFormat;
            NormalMapTexture.needsUpdate = true;
            // NormalMapTexture.encoding = THREE.LinearEncoding;
  
        // let Gold = new Color(0xe8b000);
        // let Chrome = new Color(0xc0c0c0);

        material.setValues( {
            // color: color,
            // map: NormalMapTexture,
            // bumpMap: bumpTexture,
            // bumpScale: 0,
            // emissiveMap: NormalMapTexture,
            normalMap: NormalMapTexture,
            normalScale: new THREE.Vector2(1, 1),
            normalMapType: THREE.TangentSpaceNormalMap ,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
            opacity: 100,
            metalness: 0.2,  
            roughness: 0.3, 
            depthTest: true,
            // alphaMap: AlphaTexture,
            // alphaTest: 0.1,
            depthWrite: true,
            emissive: 0x3b3b3b,
            emissiveIntensity: 0,
            transparent: true,
            alphaToCoverage: false,
            reflectivity: 10,
            clearcoat: 0.1,
            clearcoatRoughness: 10,
            // specularColor: 0x3d3d3d,
            specularIntensity: 1,
            thickness: 10,
            // sheenColor: color,
            sheenRoughness: 0.1,
            sheen: 0.1,
            ior: 0,
            fog: false,
            // transmission:1.5,
            dithering: false,
        });
        material.color.convertSRGBToLinear();
        material.normalMap.needsUpdate = true;
        material.needsUpdate = true;
        return material;
    }
}

