
import { TextGeometry } from '@SPLINT_MODULES_DIR/ThreeJS/objects/TextGeometry_Modified.js';
import { FontLoader } from '@SPLINT_MODULES_DIR/ThreeJS/loader/FontLoader_Modified.js';
import { Vector3 } from '@THREE_ROOT_DIR/src/math/Vector3.js';
import { Group } from "@THREE_ROOT_DIR/src/objects/Group.js";
import { MeshPhongMaterial } from "@THREE_ROOT_DIR/src/materials/MeshPhongMaterial.js";
import { Mesh } from "@THREE_ROOT_DIR/src/objects/Mesh.js";
import { BufferGeometry } from "@THREE_ROOT_DIR/src/core/BufferGeometry.js";
import { LineBasicMaterial } from "@THREE_ROOT_DIR/src/materials/LineBasicMaterial.js";
import { Line } from "@THREE_ROOT_DIR/src/objects/Line.js";

export default class projectCommunication {
    constructor(instance){
        this.inst = instance;
        this.progress = false;
        this.dataStack = [];
        this.DimensionsLoaded = false;
        this.init();
    }
    init(){
        this.inst.canvas.S_toModule = function(event, data){
            if(data.type == "changeColor"){
                if(data.value.name == "Basis"){
                    this.inst.changeColor("base", data.value.hex.replace('0x', '#'));
                    return;
                }
                this.inst.changeColor(data.value.name, data.value.hex.replace('0x', '#'));

            } if(data.type == "changeEPType"){
                this.inst.changeEngravingColor(data.value);

            }else if(data.type == 'showDimensions'){
                if(data.value){
                    this.showDimensions();
                } else {
                    this.hideDimensions();
                }
            } else if(data.type == 'zoom'){
                if(data.value){
                    this.inst.Animations.lighter_zoom.start();
                } else {
                    this.inst.Animations.lighter_zoom.start(false)
                }
            }
        }.bind(this);

    }
    hideDimensions(){
        if(this.group != undefined){
            this.group.visible = false;
            this.inst.render();
        }
    }
    showDimensions(){
        if(this.DimensionsLoaded){
            this.group.visible = true;
            this.inst.render();
            return;
        }
        this.DimensionsLoaded = true;
        const loader = new FontLoader();
        loader.load( window.location.origin + '/fd/resources/fonts/arial/Arial_Regular.json', function ( font ) {
            this.font = font;
            let points;
            this.LighterGroup = this.inst.setup.getLighterGroupe(this.inst.scene, 'lighter');
            points = []
            points.push(new Vector3(-0.019, 0.01, 0))
            points.push(new Vector3(0.019, 0.01, 0))
            let m1 = this.getMessurement(points, {x:0, y:1, z:0})
            let pos = new Vector3(0, 0.013, 0);
            let rot = new Vector3(0, 2, 0);
            let t1 = this.getText("35", pos, rot)

            points = []
            points.push(new Vector3(-0.023, 0, 0))
            points.push(new Vector3(-0.023, 0, -0.057))
            let m2 = this.getMessurement(points, {x:1, y:0, z:0})

            pos = new Vector3(-0.026, 0, -0.0285);
            rot = new Vector3(1, 2, 1);
            let t2 = this.getText("57", pos, rot)

            points = []
            points.push(new Vector3(0.023, -0.0065, 0))
            points.push(new Vector3(0.023, 0.0065, 0))
            let m3 = this.getMessurement(points, {x:1, y:0, z:0})
            pos = new Vector3(0.026, 0, 0);
            rot = new Vector3(0, 2, -1);
            let t3 = this.getText("13", pos, rot)

            this.group = new Group();
            this.group.add(t1)
            this.group.add(t2)
            this.group.add(t3)
            this.group.add(m1)
            this.group.add(m2)
            this.group.add(m3)
            this.group.name = "Dimensions";
            this.LighterGroup.add(this.group);

            this.inst.render();
        }.bind(this));
    }
    getText(text, pos, rot){
        let font = this.font;
        var textShapes = new TextGeometry( text,  {
            font: font,
            size: 0.004,
            height: 0.0001,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: 0.00005,
            bevelSize: 0.00005,
            bevelOffset: 0,
            bevelSegments: 1
        } );
        
        const material = new MeshPhongMaterial( 
            { 
                color: 0x000000, 
                specular: 0x3e3e3e ,
                shininess: 100
            }
          );
        const mesh = new Mesh( textShapes, material ) ;
                mesh.translateX(pos.x);
                mesh.translateY(pos.y);
                mesh.translateZ(pos.z);
                mesh.rotateX((Math.PI/2) * rot.x);
                mesh.rotateY(-(Math.PI/2) * rot.y);
                mesh.rotateZ(-(Math.PI/2) * rot.z);
        let c = this.getCenterPoint(mesh)
            mesh.translateX(-c.x);
            mesh.translateY(-c.y);
            mesh.translateZ(-c.z);
        return mesh;

    }
    getMessurement(pointsIn, rot = {x:0, y:0, z:0}){
        let v0 = pointsIn[0];
        let v1 = pointsIn[1];
        let points;
        points = []
        points.push(new Vector3(v0.x, v0.y, v0.z))
        points.push(new Vector3(v1.x, v1.y, v1.z))
        let l1 = this.getLine(points, rot);

        points = []
        points.push(new Vector3(v0.x+(rot.x*-0.0015), v0.y+(rot.y*-0.0015), v0.z+(rot.z*-0.0015)))
        points.push(new Vector3(v0.x+(rot.x*+0.0015), v0.y+(rot.y*+0.0015), v0.z+(rot.z*+0.0015)))
        let l2 = this.getLine(points, rot);

        points = []
        points.push(new Vector3(v1.x+(rot.x*-0.0015), v1.y+(rot.y*-0.0015), v1.z+(rot.z*-0.0015)))
        points.push(new Vector3(v1.x+(rot.x*+0.0015), v1.y+(rot.y*+0.0015), v1.z+(rot.z*+0.0015)))
        let l3 = this.getLine(points, rot);
        let group = new Group();
        group.add(l1);
        group.add(l2);
        group.add(l3);
        return group;
    }
    getLine(points, rot){
        const geometry = new BufferGeometry().setFromPoints(points)
        const material = new LineBasicMaterial({
        // for normal lines
            color: 0x000000,
            linewidth: 105,
            linecap: 'round', //ignored by WebGLRenderer
            linejoin: 'round', //ignored by WebGLRenderer
        })
        const line = new Line(geometry, material)
        return line;

    }
    getCenterPoint(mesh) {
        let middle = new Vector3();
        let geometry = mesh instanceof Mesh || mesh.isMesh ? mesh.geometry : mesh;
    
        geometry.computeBoundingBox();
        geometry.boundingBox.getSize(middle);
    
        middle.x = middle.x / 2;
        middle.y = middle.y / 2;
        middle.z = middle.z / 2;
    
        mesh.localToWorld(middle);
        return middle;
    }
}

