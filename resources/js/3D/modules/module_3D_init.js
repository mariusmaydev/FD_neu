

import SPLINT from 'SPLINT';
SPLINT.threeJS = new Object();
SPLINT.threeJS.scenes = []
SPLINT.threeJS.activeRenderer = 0;

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
                    import("./lighter/index/Core.js").then(function(res){
                        SPLINT.threeJS.scenes.push(res.draw.get(element.firstChild));
                    })
                 } break;
                case '3D_Lighter_CONVERTER' :       {
                    import("./lighter/converter/Core.js").then(function(res){
                        SPLINT.threeJS.scenes.push(res.draw.get(element.firstChild));
                    })
                 } break;
                case '3D_Lighter_PROJECT' : {
                    import("./lighter/project/Core.js").then(function(res){
                        let ren;
                        if(element.getAttribute("mouseevents") == "true"){
                            ren = res.draw.get(element.firstChild, false);
                            ren.isStaticRenderer = false;
                            ren.initDynamic();
                            return
                        } else {
                            ren = res.draw.get(element.firstChild, false);
                        }
                        
                        SPLINT.threeJS.scenes.push(ren);
                        function checkRenderer(ren1){
                            console.dir(SPLINT.threeJS.activeRenderer)
                            if(ren1 != undefined && SPLINT.threeJS.activeRenderer <= 0){
                                SPLINT.threeJS.activeRenderer += 1;
                                ren1.onFinish = function(){
                                    SPLINT.threeJS.activeRenderer -=1
                                    for(const i in SPLINT.threeJS.scenes){
                                        if(SPLINT.threeJS.scenes[i].drawID == ren1.drawID){
                                            console.dir(SPLINT.threeJS.scenes)
                                            SPLINT.threeJS.scenes.splice(i, 1);
                                        }
                                    }
                                    checkRenderer(SPLINT.threeJS.scenes[0]);
                                };
                                // if(ren1.isStaticRenderer == undefined || ren1.isStaticRenderer == true){
                                    ren1.initStatic();
                                // }
                            }
                        }
                        checkRenderer(ren);
                    })
                 } 
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
