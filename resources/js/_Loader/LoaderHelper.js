
class LoaderHelper {
    static async initModules(){
        return SPLINT_loaderHelper.loadScript('@PROJECT_ROOT/3D/modules/module_3D_init.js', false, "module");
    }
    static async prefetchCSS(fileName){
        
        let list = document.styleSheets;
        for (let i = 0; i < list.length; i++) {
            let item = list.item(i);
            if(item.ownerNode.name == fileName){
                return;
            }
        }
            let fileref = document.createElement("link");
                fileref.rel = "prefetch";
                fileref.as = "style";
                fileref.name = fileName;
                fileref.href = SPLINT.projectRootPath + "css/Output/" + fileName + ".css";
                fileref.onload = function(ev){
                    this.name = fileName;
                    this.disabled = "true";
                    this.rel = "stylesheet";
                    this.as = "";
                    this.onload = null;
                }
                document.head.appendChild(fileref)
    }
    static async loadCSS(fileName){
        return new Promise(async function(resolve){
            let flag = false;
            let list = document.styleSheets;
            for (let i = 0; i < list.length; i++) {
                let item = list.item(i);
                if(item.ownerNode.name == fileName){
                    flag = true;
                }
            }
            if(flag){
                resolve(true);
                return;
            }
            let fileref = document.createElement("link");
                fileref.rel = "stylesheet";
                fileref.name = fileName;
                // fileref.type = "text/css";
                // fileref.title = "CSS_" + fileName;
                fileref.href = SPLINT.projectRootPath + "css/Output/" + fileName + ".css";
                fileref.onload = function(){
                    resolve(true);
                }
                document.head.appendChild(fileref)
        });

    }
    static async prefetchProject(){
            for(const file of SPLINT.PATH.project.JS){
                let flag = false;
                if(SPLINT_loaderHelper.isFileExcluded(file)){
                    continue;
                }
                if(file.includes("/ADMIN/")){
                    continue;
                }
                
                for(const key in SPLINT_Loader.LOADED_DOCS){
                    let e = SPLINT_Loader.LOADED_DOCS[key];
                    if(e.path == file){
                        flag = true;
                        break;
                    }
                }   
                if(!flag){
                    let preloadLink = document.createElement("link");
                        preloadLink.href = file;
                        preloadLink.rel = "prefetch";
                        preloadLink.as = "script";
                        // preloadLink.type = "text/javascript";
                        document.head.appendChild(preloadLink);
                }
            }
            return true;
    }
    static async prefetchSplint(){
            // SArray.assort(SPLINT.PATH.splint.JS, "/");

            for(const file of SPLINT.PATH.splint.JS){
                let flag = false;
                if(SPLINT_loaderHelper.isFileExcluded(file)){
                    continue;
                }
                if(file.includes("/modules/")){
                    continue;
                }
                for(const key in SPLINT_Loader.LOADED_DOCS){
                    let e = SPLINT_Loader.LOADED_DOCS[key];
                    if(e.path == file){
                        flag = true;
                        break;
                    }
                }   
                if(!flag){
                    let preloadLink = document.createElement("link");
                       preloadLink.href = file;
                       preloadLink.rel = "prefetch";
                       preloadLink.as = "script";
                       // preloadLink.type = "text/javascript";
                       document.head.appendChild(preloadLink);
                }
            }
            return true;
    }
    static async preloadScript(){
        await SPLINT.require('@PROJECT_ROOT/GLOBAL/Paths.js');
        await SPLINT.require('@PROJECT_ROOT/Pages/pagesTemplate.js');
        await SPLINT.require('@PROJECT_ROOT/assets/functionsShoppingCart.js');
        await SPLINT.require('@PROJECT_ROOT/Pages/NavigationBar/NavigationBarHelper.js');
        await SPLINT.require('@PROJECT_ROOT/Pages/NavigationBar/NavigationBar.js');
        await SPLINT.require('@PROJECT_ROOT/Login/LoginHelper.js');
        return true;
    }
    static async preloadPage(list){
        return new Promise(async function(resolve){

            let stack = []
            for(const e of list){
                let file = "@PROJECT_ROOT" + e;
                if(SPLINT_loaderHelper.isFileExcluded(file)){
                    continue;
                }
                stack.push(SPLINT_loaderHelper.loadScript(file, false, null, {
                    "fetchpriority": "high"
                }));
            }
            await Promise.allSettled(stack)
            resolve(true)
        });
    }
}