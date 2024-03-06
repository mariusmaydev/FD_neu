import MaterialsEngraving from "../../assets/newMaterials/materialsEngraving.js";
import SPLINT from 'SPLINT';
import MaterialHelper from "@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js";

export default class LighterThumbnail {

    constructor(instance, name = "lighter"){
        this.name = name;
        this.instance = instance;
        this.lighterGroup = instance.setup.getLighterGroupe(this.scene, name);
        this.loadThumbnailPlanes()
        this.thumbnailObj = LighterThumbnail.getThumbnailObj(this.lighterGroup);
    }
    loadThumbnailPlanes(){
        let plane1 = SPLINT.object.Plane(3.4/1000, 1.976/1000, 1, 1);
            plane1.plane.castShadow = false;
            plane1.plane.receiveShadow = false;
            plane1.rotate(0, 180, 180);
            plane1.position(1.92, 0.99, 0.668);

            plane1.plane.scale.set(1000, 1000, 1000);
            plane1.get().name = "ThumbnailUpper";
            this.lighterGroup.children[0].children[0].add(plane1.get()); 

        let plane2 = SPLINT.object.Plane(3.4/1000, 3.169/1000, 1, 1);
            plane2.plane.receiveShadow  = false;
            plane2.plane.castShadow     = false;
            plane2.rotate(0, 180, 180);
            plane2.position(0, 1.846, 0.668);

            plane2.plane.scale.set(1000, 1000, 1000);
            plane2.get().name = "ThumbnailLower";
            this.lighterGroup.children[1].children[0].add(plane2.get()); 
    }
    precomputeAlpha(texture, color){
        let textureOut = null;
        if(color == 0xe8b000){
            textureOut = MaterialHelper.getTransparentTexture(texture, {r: 255, g: 247, b: 214, a: 100}, function(data, color, i){
                return data[i] <= color.r
                && data[i + 1] <= color.g
                && data[i + 2] <= color.b
                && data[i + 3] >= color.a;
            });
        } else {
            textureOut = MaterialHelper.getTransparentTexture(texture, {r: 100, g: 100, b: 100, a: 100}, function(data, color, i){
                return data[i] >= color.r
                && data[i + 1] >= color.g
                && data[i + 2] >= color.b
                && data[i + 3] >= color.a;
            });
        }
        return textureOut;
    }
    loadThumbnailMaterial(texture, color = 0xe8b000, precomputeAlpha = false){
        if(precomputeAlpha){
            texture = this.precomputeAlpha(texture, color);
        }
        let material = MaterialsEngraving.loadBase(color, texture);
        
        let matUpperMesh = MaterialHelper.cloneMaterial(material);

            MaterialHelper.setMapOffset(matUpperMesh, 0, 1);
            MaterialHelper.setMapRepeat(matUpperMesh, 1, 0.38401);

            this.thumbnailObj.upperMesh.material = matUpperMesh;
            this.thumbnailObj.upperMesh.material.needsUpdate = true;

        let matLowerMesh = MaterialHelper.cloneMaterial(material);
            MaterialHelper.setMapOffset(matLowerMesh, 0, 0.38401);
            MaterialHelper.setMapRepeat(matLowerMesh, 1, 0.61599);

            this.thumbnailObj.lowerMesh.material = matLowerMesh;
            this.thumbnailObj.lowerMesh.material.needsUpdate = true;

        return true;
    }
    static getThumbnailObj(lighterGroup){
        let obj = new Object(); 
            obj.upperMesh = lighterGroup.children[0].children[0].children[0];
            obj.lowerMesh = lighterGroup.children[1].children[0].children[0];
        return obj;
    }
    setColor(color){
        let thumbnail = this.thumbnailObj;
        // let Gold = new Color(0xe8b000);
        // let Chrome = new Color(0xc0c0c0);
        thumbnail.upperMesh.material.color = color;
        thumbnail.upperMesh.material.sheenColor = color;
        thumbnail.upperMesh.material.emissive = color;
        thumbnail.upperMesh.material.needsUpdate = true;
        
        thumbnail.lowerMesh.material.color = color;
        thumbnail.lowerMesh.material.sheenColor = color;
        thumbnail.lowerMesh.material.emissive = color;
        thumbnail.lowerMesh.material.needsUpdate = true;
    }
    loadNormalMap(texture){
        let material = this.thumbnailObj.upperMesh.material;
        MaterialsEngraving.loadNormalMap(material, texture)

        let material1 = this.thumbnailObj.lowerMesh.material;
        MaterialsEngraving.loadNormalMap(material1, texture)
    }
    loadEnvMap(texture){
        let material = this.thumbnailObj.upperMesh.material;
        MaterialsEngraving.loadEnvMap(material, texture)

        let material1 = this.thumbnailObj.lowerMesh.material;
        MaterialsEngraving.loadEnvMap(material1, texture)
    }

}