const shimCodeUrl = "https://ga.jspm.io/npm:es-module-shims@1.6.2/dist/es-module-shims.wasm.js"

// const importMap = {
//     "imports": {
//         "three":"/whatever_path/three/build/three.module.js",
//         "three/":"/whatever_path/three/"
//     }
// }
onmessage = function(e) {
    if(e.data.msg == "initLoader") {
        // postMessage("loaded loader");
        importScripts(shimCodeUrl);
        let importmap = JSON.parse(e.data.importMap)
        // for(const i of Object.entries(e.data.o)){
        //     self.SPLINT[i[0]] = i[1];
        // }
        importShim.addImportMap(importmap);
        console.dir(e.data.o)
        
        // let funcArray1 = '(' + loadFunc.toString() + ".bind(null, " + ob1 + ")" + ')()';
        // new Blob(["(", SPLINT_loaderHelper.toString(), ")"]
        // let ret =  e.toString() + "\n" + funcArray1 + "\n" + text;
        importShim(URL.createObjectURL(new Blob(
            [
              `
              importShim.addImportMap(${JSON.stringify(importShim.getImportMap())});
              importShim('${new URL('http://localhost/fd/resources/js/_WebWorker/_module/_testW.js').href}').catch(e => setTimeout(() => { throw e; }))`+
              e.data.o
            ],
            { type: 'application/javascript' }))) /*controllerworker.module.js*/
            .then((res) => {
                console.log("module has been loaded");
            })
            .catch(e => setTimeout(() => { throw e; }));
    }
}