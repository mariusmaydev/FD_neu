

import SPLINT from 'SPLINT';
SPLINT.threeJS = new Object();
SPLINT.threeJS.scenes = []

async function init3D(){
    async function callback(records) {
        records.forEach(async function (record) {
            record.removedNodes.forEach(function (node) {
                if(node instanceof HTMLElement){
                    let elements = node.querySelectorAll('[saveContext=false]');
                    if(elements.length > 0){
                        for(const ele of elements){
                            for(const i in SPLINT.threeJS.scenes){
                                if(ele.firstChild.id == SPLINT.threeJS.scenes[i].canvas.id){
                                    console.dir(SPLINT);
                                    SPLINT.threeJS.scenes[i].remove();
                                    SPLINT.threeJS.scenes.splice(i, 1);
                                }
                            }
                        }
                    }
                }
            });
            let element = record.target;
            switch(element.getAttribute("render")){
                case '3D_Lighter_INDEX' :  {
                    if(false){

                        let text = "";
                        await fetch(location.origin + "/fd/resources/js/_WebWorker/_module/_testW.js").then(async function(res){
                            text = await res.text();
                            return text;
                        }.bind(this))
                        console.log(text)

                        let ob = Object.assign({}, Object.getPrototypeOf(Object.getPrototypeOf(SPLINT)));
                            delete ob.threeJS;
                            delete ob.isWorker;
                                ob.referrer = document.URL;
                            let ob1 = JSON.stringify(ob);
                        console.log(ob)
                        let loadFunc = function(){
                            for(const e of Object.entries(arguments[0])){
                                try {
                                    SPLINT[e[0]] = e[1];
                                } catch {}
                            }
                        };
                        let res = await fetch(location.origin + "/Splint/js/vanillaExtensions/StringExtensions.js");
                        let Extensions = await res.text();
                        let funcArray1 = '(' + loadFunc.toString() + ".bind(null, " + ob1 + ")" + ')()';
                        let funcArray = 
                            Extensions 
                        + "\n" + funcArray1 + "\n" +text;
                            let renderWorker = new Worker(location.origin + "/fd/resources/js/_WebWorker/_module/_ThreeJSWorkerLoader.js", 
                            { 
                                // type : 'module',
                                name : 'ThreeRenderWorker_index' 
                            });
                            let importmap = document.querySelector('script[type="importmap"]');
                            console.dir(importmap)
                            renderWorker.postMessage({msg: "initLoader", importMap: importmap.textContent, o: funcArray});
                            
                            // renderWorker.postMessage({msg: "init", canvas : offscreencanvas}, [offscreencanvas]);
                            async function setupOffscreen(){
                                // return
                                setTimeout(() => {
                                    let context = element.firstChild.getContext("bitmaprenderer");
                                    let offscreencanvas = new OffscreenCanvas(element.firstChild.width, element.firstChild.height);
                                    renderWorker.postMessage({msg: "init", canvas : offscreencanvas}, [offscreencanvas]);
                                    console.log("send")
                                    renderWorker.onmessage = function(e){
                                        context.transferFromImageBitmap(e.data.bitmap);
                                    }.bind(this)
                                }, 2000);
                            }
                            await setupOffscreen();
                    } else {
                        import("./lighter/index/Core.js").then(function(res){
                            SPLINT.threeJS.scenes.push(res.draw.get(element.firstChild));
                        })
                    }
                 } break;
                case '3D_Lighter_CONVERTER' :       {
                    import("./lighter/converter/Core.js").then(function(res){
                        SPLINT.threeJS.scenes.push(res.draw.get(element.firstChild));
                    })
                 } break;
                case '3D_Lighter_PROJECT' :       {
                    import("./lighter/project/Core.js").then(function(res){
                        SPLINT.threeJS.scenes.push(res.draw.get(element.firstChild));
                    })
                 } break;
                // case '3D_Lighter_PROJECT_NEW' :       {
                //     import("./_old/projectNew/Core.js").then(function(res){
                //         SPLINT.threeJS.scenes.push(res.draw.get(element.firstChild));
                //     })
                //  } break;
                //  case '3D_Lighter_NEW_PROJECT' :       {
                //      import("./lighter/NewProject/Core.js").then(function(res){
                //          SPLINT.threeJS.scenes.push(res.draw.get(element.firstChild));
                //      })
                //   } break;
                case '3D_Background' :       {
                    // import("./background/Core.js").then(function(res){
                    //     SPLINT.threeJS.scenes.push(res.draw.get(element.firstChild));
                    // })
                 } break;
            }
        });
      }
      
      let observer = new MutationObserver(callback);
      observer.observe(document.body, {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: true
      });
}

init3D();

function hasChildWithClass(element, className, callback = function(child){}){
    if(element.children == undefined){
        return false;
    }
    for(const child of element.children){
        if(child.className == className){
            callback(child);
            return;
        } else {
            hasChildWithClass(child, className, callback);
        }
    }
    return false;
}

function renderList() {
    var tlist = threeList;
    for ( var i = 0; i < tlist.length; i++ ) {
        var threeDict = tlist[i];
        threeDict["renderer"].render( threeDict["scene"], threeDict["camera"] );
    }
}

