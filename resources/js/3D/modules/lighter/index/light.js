
import * as SPLINT from 'SPLINT';

export default function light(scene){
    let c1 = 0xffd7af;
    const lights = new SPLINT.lights.lightCluster(scene, false);
          lights.helper.size = 0.1;

    let atmo = lights.new.AmbientLight(0xffd8b2 , 3);
        // atmo.bind();

    let hemi  = lights.new.HemisphereLight( 0xffffff, 0x000000, 0 );
    hemi.helper.size = 0.8;
    hemi.position.set(0, 1,0)
        // hemi.bind();

    let spot = lights.new.SpotLight(0xffd8b2, 100, 2, 0.3, 0.4, 0);
        spot.position.set(-0.7,0.5, 0.7);
        spot.target.position.set(0, 0.1, 0);
        spot.castShadow = false;
        spot.shadow.bias = -0.0005;
        spot.target.updateMatrixWorld();
        spot.power = 7;
        spot.bind();
        
    let spot1 = lights.new.SpotLight(0xffc285, 100, 2, 0.3, 0.4, 0);
        spot1.position.set(1,0.7, 1);
        spot1.target.position.set(0, 0.1, 0);
        spot1.shadow.bias = -0.0005;
        spot1.castShadow = false;
        spot1.shadow.mapSize.width = 128
        spot1.shadow.mapSize.height = 1024
        spot1.shadow.camera.near =0.05
        spot1.shadow.camera.far = 20
        spot1.shadow.camera.left = -1; 
        spot1.shadow.camera.right = 1;
        spot1.shadow.camera.top = 1;
        spot1.shadow.camera.bottom = -1;
        spot1.target.updateMatrixWorld();
        spot1.power = 7;
        spot1.bind();
        

    let directional1 = lights.new.DirectionalLight( 0xf8e5d1, 2 );
        directional1.position.set(-0.8, 0.6, 0.8);
        directional1.target.updateMatrixWorld();
        directional1.target.position.set( 0, 0.1, 0);
        directional1.shadow.bias = -0.0005;
        directional1.castShadow = true;
        directional1.shadow.mapSize.width = 1024
        directional1.shadow.mapSize.height = 1024
        directional1.shadow.camera.near =0.05
        directional1.shadow.camera.far = 20
        directional1.shadow.camera.left = -1; 
        directional1.shadow.camera.right = 1;
        directional1.shadow.camera.top = 1;
        directional1.shadow.camera.bottom = -1;
        // directional1.shadow.needsUpdate = true;
        // directional1.shadowDarkness = 0.5;
        // directional1.target.updateMatrixWorld();
        directional1.bind();
        // console.log(directional1)
        
    let directional2 = lights.new.DirectionalLight( 0xffe6cd, 1 );
        directional2.position.set(0.4, 0.3, 0.4);
        directional2.target.updateMatrixWorld();
        directional2.target.position.set( 0, 0.1, 0);
        directional2.shadow.bias = -0.0005;
        directional2.castShadow = true;
        directional2.shadow.mapSize.width = 1024
        directional2.shadow.mapSize.height = 1024
        directional2.shadow.camera.near =0.05
        directional2.shadow.camera.far = 20
        directional2.shadow.camera.left = -1; // or whatever value works for the scale of your scene
        directional2.shadow.camera.right = 1;
        directional2.shadow.camera.top = 1;
        directional2.shadow.camera.bottom = -1;
        directional2.bind();
    // let directional1 = lights.new.DirectionalLight( 0xfff8e0, 2 );
    //     directional1.position.set( 0.3, 1.5, 0.3);
    //     directional1.target.updateMatrixWorld();
    //     directional1.target.position.set( 0, 0.1, 0);
                    
    //     directional1.shadow.bias = -0.0005;
    //     directional1.castShadow = true;
    //     directional1.shadow.mapSize.width = 2024
    //     directional1.shadow.mapSize.height = 2024
    //     directional1.shadow.camera.near =0.05
    //     directional1.shadow.camera.far = 20
    //     directional1.shadow.camera.left = -1; // or whatever value works for the scale of your scene
    //     directional1.shadow.camera.right = 1;
    //     directional1.shadow.camera.top = 1;
    //     directional1.shadow.camera.bottom = -1;
    //     directional1.bind();
        
    // newDL(lights, 0.3, 0.6, 0.3);
    // newDL(lights, -0.3, 0.3, 0.3, true);
    // newDL(lights, -0.3, 0.3, -0.3);
    // newDL(lights, 0.3, 0.3, -0.3);
    // let directional2 = lights.new.DirectionalLight( 0xfff8e0, 2 );
    //     directional2.position.set( -0.3, 1.5, 0.3);
    //     directional2.target.updateMatrixWorld();
    //     directional2.target.position.set( 0, 0.1, 0);
    //     directional2.castShadow = true;
    //     directional2.shadow = directional1.shadow.clone();
    //     directional2.bind();

    // let directional3 = lights.new.DirectionalLight( 0xfff8e0, 6 );
    //     directional3.position.set( 0, 0.5, 0);
    //     directional3.target.updateMatrixWorld();
    //     directional3.target.position.set( 0, 0.1, 0);
    //     directional3.castShadow = true;
    //     directional3.shadow = directional1.shadow.clone();
        // directional3.bind();

        // let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
        // this.scene.add(hemiLight);

        // let light = new THREE.SpotLight(0xffffff, 20, 100, 10, 2, 0.8);
        // light.castShadow = true;
        // light.target.position.set( 0.1, 0.1, 0.1);
        // light.position.set(0.5,0.5,0.5);
        // light.castShadow = true;
        // const helper2 = new THREE.SpotLightHelper(light, 50, 0xfcd3d3);
        // this.scene.add(light.target);
        // this.scene.add( light );
        // this.scene.add(helper2);

        // const pointlight = new THREE.PointLight( 0xffffff, 10, 0.1, 10);
        //         pointlight.position.set( 0.1, 0.1, 0.1 );
        // this.scene.add( pointlight );
        // const helper2 = new THREE.PointLightHelper(pointlight, 0.01);
        // this.scene.add(helper2);
}

function newDL(lights, x, y, z, shadow = true){

    let directional1 = lights.new.DirectionalLight( 0xfff0e1, 4 );
        directional1.position.set( x, y, z);
        directional1.target.updateMatrixWorld();
        directional1.target.position.set( 0, 0.1, 0);
                    
        directional1.shadow.bias = -0.0005;
        directional1.castShadow = shadow;
        directional1.shadow.mapSize.width = 2024
        directional1.shadow.mapSize.height = 2024
        directional1.shadow.camera.near =0.05
        directional1.shadow.camera.far = 20
        directional1.shadow.camera.left = -1; // or whatever value works for the scale of your scene
        directional1.shadow.camera.right = 1;
        directional1.shadow.camera.top = 1;
        directional1.shadow.camera.bottom = -1;
        directional1.bind();
}