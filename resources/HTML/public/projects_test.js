
class S_ObjectFunctions {
    constructor(instance){
        // this.instance = instance;      
        Object.defineProperty(S_ObjectFunctions.prototype, "instance", {
            value: instance,
            writable: true,

            configurable : false,
            enumerable: false,
        })
        // this.toMap = this.toMap;
    }
    secureValues(recursive = false){
        for(const e of Object.entries(this.instance)){
            Object.defineProperty(this.instance, e[0], {
                value: e[1],
                enumerable: true,
                configurable: false,
                writable: false
            })
            if(recursive){
                if(e[1] instanceof Object){
                    e[1].SPLINT.secureValues(recursive);
                }
            }
        }
    }
    log(){
        SPLINT.debugger.logUser(typeof this.instance, this.instance);
    }
    getMap(){
        return SPLINT.Tools.parse.ObjectToMap(this);
    }  
    /**
     * @param {object | string} name {variable} | 'variable' 
     */
    hideProperty(name){
        if(typeof name == 'object'){
            name = Object.keys(name)[0];
        }
        let desc = Object.getOwnPropertyDescriptor(this.instance, name);
        if(desc != undefined && (desc.get != undefined || desc.set != undefined)){
            Object.defineProperty(this.instance, name, {
                configurable : false,
                enumerable: false,
              });
              return;
        }
        Object.defineProperty(this.instance, name, {
            writable: true,
            configurable : false,
            enumerable: false,
          });
    }
    // Object.defineProperty(Object.prototype.constructor, "SPLINT1", {
    //     get: function(){
    //         return new S_ObjectFunctions(this);
    //     }
    // })
    // static eachRecursive(obj, callback = function(){}){
    //     for (var k in obj){
    //         callback(k)
    //         if (typeof obj[k] == "object" && obj[k] !== null){
    //             this.eachRecursive(obj[k], callback);
    //         } else {

    //         }
    //     }
    // }
    // static iter(obj_in, callback_in = function(element, entry, key, index){}){
    //     function func(obj, callback){
    //         for(const property in obj) {
    //             if(obj.hasOwnProperty(property)) {
    //                 callback(obj, property)
    //                 if(typeof obj[property] == "object") {
    //                     iterate(obj[property], stack + '.' + property);
    //                 } else {
    //                     console.log(property + "   " + obj[property]);
    //                     $('#output').append($("<div/>").text(stack + '.' + property))
    //                 }
    //             }
    //         }
    //     }
    //     func(obj_in, callback_in, e_in);
    // }
    static iter(obj_in, e_in, callback_in = function(element, entry, key, index){}){
        function func(obj, callback, ...args){
            let entries = Object.entries(obj);
            let keys    = Object.keys(obj);
            for (const [key, value] of entries.reverse()) {
                let entry = obj[key]
                let element = callback(args[0], entry, key, keys.indexOf(key), obj);
                    if(element == false){
                        continue;
                    }
                    element.setAttribute("ivalue", (args[0].getAttribute("ivalue") + "." + key));
                if(typeof entry == 'object'){
                    func(entry, callback, element);
                }
            }
        }
        func(obj_in, callback_in, e_in);
    }
    toDOMStructure(parent, callback = function(element, key, value){}){
        parent.setAttribute("ivalue", "start");
        let obj = this.instance;
        if(this.instance instanceof autoObject){
            obj = this.instance.parseToObject();
        }
        S_ObjectFunctions.iter(obj, parent, callback);
        return obj;
    }
}
class autoObject extends Object {
    static get [Symbol.species]() { return Object; }
    static {
        Object.defineProperty(Object.prototype, "SPLINT", {
            get: function(){
                return new S_ObjectFunctions(this);
            }, 
            enumerable: false,
            configurable: true
        })
        Object.defineProperty(Object.prototype, "log", {
            value: function(){
                SPLINT.debugger.logUser(typeof this, this);
            },
            enumerable: false,
            writable: false,
            configurable: false
        })
    }
    constructor(stack = "OBJ", saveStack = false){
        super();
        if(stack === true){
            saveStack = true;
            // this.saveStack = true;
            stack = "OBJ";
            this.stack = "OBJ";
        } else if(stack === false){
            // this.stack = false;
            // this.saveStack = false;
        } else {
            this.stack = stack;
            // this.saveStack = saveStack;
        }
        // if(saveStack){

        Object.defineProperty(this, "stack", {
            // value: "AAA",
            writable: false,
            configurable: false,
            enumerable: false  
        
        });
        // Object.defineProperty(autoObject.prototype, "stack", {
        //     get(){
        //         return stack;
        //     },
        //     set(v){
        //         SPLINT.debugger.error("autoObject", "cannot modify 'AO-stack'")
        //     },
        //     configurable: false,
        //     enumerable: false  
        
        // });
        // }
        return new Proxy(this, {
            get(target, prop, receiver){
                if (prop === 'toJSON') {
                  return () => (target)
                }
                if(Reflect.has(target, prop)){
                    return target[prop];
                } else {
                    if(typeof prop == 'symbol'){
                        prop = prop.toString();
                    }
                    SPLINT.debugger.warn("autoObject", "generated -> " + target.stack + "[" + prop + "]", [["[", "]"], "color: orange; font-weight: bold"]);
                    console.groupEnd();
                    stack = target.stack + "." + prop;

                    if(stack.includes("undefined")){
                        stack = false;
                    }
                    target[prop] = new autoObject(stack);

                    return target[prop];
                }
            },
            set(target, symbol, value, receiver){
                target[symbol] = value;
                return true;
            }
        })
    }
    log(){
        console.log(this.parseToObject());
    }
    dir(){
        console.dir(this.parseToObject());
    }
    parseToObject(){
        function unproxify(val) {
            if (val instanceof Array){
                let b = val.map(unproxify);
                return b
            } 
            if (val instanceof Object) {
                let a = Object.fromEntries(Object.entries(Object.assign({},val)).map(([k,v])=>[k,unproxify(v)]))
                return a
            }
            return val
        }
        return unproxify(this);
    }
    toDOMStructure(parent, callback = function(element, key, value){}){
        parent.setAttribute("ivalue", "start");
        let obj = this.parseToObject();
        S_ObjectFunctions.iter(obj, parent, callback);
        return obj;
    }
    getKeys(){
        return Object.keys(this);
    }
    getSize(){
        return this.getKeys().length;
    }
    isEmpty(){
        if(Object.keys(this).length > 0){
            return false;
        }
        return true;
    }
}
class DOMElement_manager {
    static bind2class(baseID, instance, nameIsClass = false){
        instance.DOMElement_manager = new SPLINT.DOMElement_manager(baseID, instance);
        instance.DOMElement_manager.nameIsClass = nameIsClass;
    }
    constructor(baseID, instance = null){
        this.baseID = baseID;
        this.instance = instance;
        this.nameIsClass = false;
        if(this.instance != null){
            this.instance.getElement = function(name, type, parent = null){
                return this.getElement(name, type, parent);
            }.bind(this);
        }
    }
    setBaseID(id){
      this.baseID = id;
      // if(this.instance != null){
      //   this.instance.baseID()
      // }

    }
    getElement(name, type, parent = null){
        if(typeof type == 'object'){
          parent = type;
          type = "div";
        }
        let element = new SPLINT.DOMElement(this.baseID + name, type, parent);
        if(this.nameIsClass){
          element.Class(name);
        }
        return element;
    }
}




  class DOMElement {
    static get Manager(){
      return DOMElement_manager;
    }
    /**
     * @param id      : ElementID | null = uniqeID | "/UID( {empty or 1 - 10} )/" = uniqeID
     * @param tag     : HTMLtag | null = div
     * @param parent  : parentElement | parentID | null = get element if exist {element/ false}
     */
    constructor(id, tag, parent, oncreate = function(){}){
      this.oncreate = oncreate;
      this.#getID(id);
      this.#getTag(tag);
      this.#createElement();
      if(parent != undefined){
        if(document.getElementById(parent) == null){
          this.parent = parent;
        } else {
          this.parent = document.getElementById(parent);
        }
        this.parent.append(this.element);
      }
      return this.element;
    }
    #getID(id){
      if(id == undefined){
        this.id   = "UID_" + this.#uniqueID();
      } else if(id == null){
        this.id = null;
      } else {
        if(id.includes("/UID(")){
          if(!isNaN(id[id.indexOf("/UID(") + 5])){
            this.id = id.replace("/UID(", "_" + this.#uniqueID(id[id.indexOf("/UID(") + 5]));
            this.id = this.id.replace(")/", "");
          } else {
            this.id = id.replace("/UID()/", this.#uniqueID());
          }
        } else {
          this.id = id;
        }
      }
    }
    #getTag(tag){
      if(tag == undefined){
        this.tag  = "div";
      } else {
        this.tag  = tag;
      }
    }

    #createElement(){
      if(this.id != null && document.getElementById(this.id) != null && document.getElementById(this.id).tagName == this.tag.toUpperCase()){
        this.element = document.getElementById(this.id);
      } else {
        this.oncreate();
        this.element = document.createElement(this.tag);
        if(this.id != null){
          this.element.id = this.id;
        }
      }
    }
    #uniqueID(count = 10) {
      return Math.floor(Math.random() * Date.now()).toString().slice(0, count - 1);
    }
    static get SVG(){
      return S_SVGElement;
    }
    static get Button(){
      return S_Button;
    }
    static get SpanDiv(){
      return SpanDiv;
    }
    static get HorizontalLine(){
      return S_HorizontalLine;
    }
    static get Label(){
      return Label;
    }
    static get simple(){
      return SimpleElement;
    }
    static get InputDiv(){
      return n_InputDiv;
    }
    static get FolderInput(){
        return S_folderInput;
    }
    static get InputText(){
      return TextInputDiv;
    }
    static get InputAddress(){
      return S_AddressInput;
    }
    static get InputAmount(){
      return AmountInput;
    }
    static get InputDropDown(){
      return DropDownInput_S;
    }
    static get InputDynamic(){
      return S_DynamicInput;
    }
    static get popupWindow(){
      return S_popupWindow;
    }
    static get TextView(){
        return S_TextView;
    }
    static get Table(){
      return Table;
    }
    static get Nesting(){
      return S_Nesting;
    }
    static get ChartContainer(){
        return S_ChartContainer;
    }
    static get ObjectEditor(){
        return S_ObjectEditor;
    }
  }
  class S_CallPHPManager {
    static bind2class(path, instance){
        instance.S_CallPHPManager = new S_CallPHPManager(path, instance);
    }
    static callPHP(key){
        if(this.prototype instanceof S_CallPHPManager){
            return new SPLINT.CallPHP(this.PATH, key);
        }
    }
    constructor(path, instance = null){
        this.path = path;
        this.instance = instance;
        if(this.instance != null){
            this.instance.callPHP = function(key){
                return this.call(key);
            }.bind(this);
        }
    }
    call(key){
        return new SPLINT.CallPHP(this.path, key);
    }
}
class S_CallPHP {
    static #STACK = [];
    static #EXECUTING_STACK = true;
    static get Manager(){
        return S_CallPHPManager;
    }
    static AccessSplint(key){
        return new S_CallPHP(SPLINT.PATHS.Access, key);
    }
    constructor(url = null, accessKey = null){
        this.url            = url;

        this.activeCall     = null;
        this.ACCESS_KEY     = accessKey;
        this.method         = "POST";
        this.mode           = "cors";
        this.cache          = "force-cache";
        this.processData    = true;
        this.credentials    = "same-origin";
        this.redirect       = "follow";
        this.referrerPolicy = "no-referrer";
        this.keepalive      = true;
        this.data           = new Object();
        this.controller     = new AbortController();
        this.headers        = new Object();
        // this.headers["Content-Type"] =  'application/json';
        // this.headers["X-Requested-With"] =  'XMLHttpRequest';
        // this.headers["accept"] = "application/json; charset=utf-8";
        // this.headers["content-encoding"] = "application/json; charset=utf-8";
        this.headers["Content-Type"] = 'application/x-www-form-urlencoded; charset=UTF-8';
        this.onBeforeSend   = function(){};
        this.onError        = function(){};
        this.onSuccess      = function(){};
        this.onFinish       = function(){};
        this.onAbort        = function(){};
        this.isPending      = false;
        this.callbackPromise = null;
        this.callbackPromiseTrigger = null;
    }
    abort(){
        this.controller.abort();
    }
    sendInSequence(preventMultipleRequests = false){
        if(preventMultipleRequests){
            if(!this.isPending){
                this.callbackPromise = new Promise(function(resolve){
                    this.callbackPromiseTrigger = resolve;
                }.bind(this));
                S_CallPHP.#STACK.push(this);
                S_CallPHP.#loopStack();
            }
        } else {
            this.callbackPromise = new Promise(function(resolve){
                this.callbackPromiseTrigger = resolve;
            }.bind(this));
            S_CallPHP.#STACK.push(this);
            S_CallPHP.#loopStack();
        }
        return this.callbackPromise;
    }
    async send(){
        if(this.isPending){
            return this.activeCall;
        }
        this.isPending = true;
        return this.sendRequest();
    }
    async sendRequest(){
        if(this.url == null){
            SPLINT.debugger.error("CallPHP", "no url provided");
            return;
        }
        this.url += "?" + SPLINT.PROJECT_NAME;
        this.headers["X-SPLINT-ACCESS_KEY"] =  this.ACCESS_KEY;

        let obj = new SPLINT.autoObject();
            obj.method                  = this.method;
            // obj.mode                    = this.mode;
            obj.cache                   = this.cache;
            // obj.credentials             = this.credentials;
            obj.headers                 = this.headers;
            obj.keepalive               = this.keepalive;
            // obj.redirect                = this.redirect;
            // obj.referrerPolicy          = this.referrerPolicy;
            if(this.processData){
                obj.body                    = this.#serialize(this.data);  
                obj = obj.parseToObject(); 
            } else {
                obj = obj.parseToObject(); 
                obj.body = this.data;
            }
            obj.signal                  = this.controller.signal;
        this.onBeforeSend(obj);
            this.activeCall = fetch(this.url, obj)
            .then(function(r){
                return r.text();
            }.bind(this))
            .then(function(r){
                this.activeCall = null;
                this.isPending = false;
                let a =  S_JSON.parseIf(r);
                this.onFinish(a);
                this.onSuccess(a);
                return a;
            }.bind(this))
            .catch(function(e){
                this.isPending = false;
                this.onFinish(e);
                if(e.name == "AbortError"){
                    this.onAbort(e);
                } else {
                    this.onError(e);
                }
                return e;
            }.bind(this));
        return this.activeCall;
    }
    #parseData(){
        this.data = Object.entries(this.data);
        let newData = [];
        for (const property in this.data) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(this.data[property]);
            newData.push(encodedKey + "=" + encodedValue);
        }
        return newData.join("&");
    }
    static call(uri, data){
        let call = new S_CallPHP(uri, key);
            call.#parseData.data = data;
        return call.send();
    }
    static async #loopStack(){
        if(S_CallPHP.#STACK.length == 0){
            S_CallPHP.#EXECUTING_STACK = true;
        }
        if(S_CallPHP.#STACK.length > 0 && S_CallPHP.#EXECUTING_STACK){
            S_CallPHP.#EXECUTING_STACK = false;
                let a = await S_CallPHP.#STACK[0].sendRequest();
                S_CallPHP.#STACK[0].callbackPromiseTrigger(a)
                S_CallPHP.#STACK.splice(0, 1);
                S_CallPHP.#EXECUTING_STACK = true;
                S_CallPHP.#loopStack();
        } 
    }
    #serialize(obj, prefix) {
        var str = [], p;
        for (p in obj) {
          if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
              v = obj[p];
              if(v == null || v == undefined){
                v = '';
              }
            str.push((v !== null && typeof v === "object") ?
                
                this.#serialize(v, k) :
              encodeURIComponent(k) + "=" + encodeURIComponent(v));
          }
        }
        return str.join("&");
      }
    
}
class SArray extends Array {
    static {
        this.removeValues = function(array, value){
            return this.prototype.removeValues.call(array, value);
        }
        this.assort = function(array, divider = '/', up = true){
            return this.prototype.assort.call(array, divider, up);
        }
        this.combine = function(array1, array2){
            return this.prototype.combine.call(array1, array2);
        }
        this.unique = function(array){
            return this.prototype.unique.call(array);
        }
    }
    static get [Symbol.species]() {
      return Array;
    }

    #onPush = function(...items){};
    constructor(...array){
        super(...array)
        this.length = array.length;
    }
    // static to
    set onPush(func){
        this.#onPush = func;
    }
    get onPush(){
        return this.#onPush;
    }
    push(...items){
        this.onPush(...items);
        return super.push(...items);
    }
    assort(divider = '/', up = true) {
        this.sort(function (a, b) {
            let la = a.split(divider).length;
            let lb = b.split(divider).length;
            if(up){
                return la - lb;
            }
            return lb - la;
          });
          return this;
    }
    combine(array){
        return SArray.unique([...this, ...array]);
    }
    unique(){
        return this.filter(function(item, pos) {
            return this.indexOf(item) == pos;
        }.bind(this), SArray);
    }
    removeValues(values) {
        return this.filter.call(this, function(e) { return !values.includes(e); });
    }
}

class SPLINT_LOADER_helper {
    static {
        this.ELEMENTS = this.#queryElements();
    }
    static #queryElements(){
        function parse(element){
            let obj = new Object();
                obj.name    = element.tagName.toLowerCase();
                obj.src     = element.getAttribute("src");
                obj.element = element;

                return obj;
        }
        let res = new Object();
            res.scripts_pre     = [];
            res.scripts_first   = [];
            res.scripts         = [];
            res.stylesheets     = [];
            res.modules         = [];
            res.loader          = [];

        let elements = document.querySelectorAll("s-part, s-loader, s-style, s-module")
        for(const element of elements){
            let tagName = element.tagName.toLowerCase();
            switch(tagName){
                case 's-style'  : res.stylesheets.push(parse(element)); break;
                case 's-module'   : res.modules.push(parse(element)); break;
                case 's-part'     : {
                    if(element.hasAttribute("pre")){
                        res.scripts_pre.push(parse(element));
                        break;
                    } else if(element.hasAttribute("first")){
                        res.scripts_first.push(parse(element));
                        break;
                    }
                    res.scripts.push(parse(element)); 
                } break;  
                case 's-loader'   : res.loader.push(parse(element)); break;
                default : console.error("SPLINT - load Elements"); continue;
            }
        }
        return res;
    }
}
class SPLINT_LOADER extends SPLINT_LOADER_helper {
    static cacheResources = false;
    static isLoaded(URI){
        return SPLINT_Loader.LOADED_DOCS.includes(URI);
    }
    static parseSRC(URIin){
        let path = null;
        if(URIin.startsWith('@')){
            let map = JSON.parse(document.getElementById("SPLINT_importmap").innerHTML).imports;
            let a = URIin.substring(0, URIin.indexOf('/') + 1);
            if(map.hasOwnProperty(a)){
                path = URIin.replace(a, map[a]);
            }
        } else if(URIin.startsWith('http') || URIin.startsWith('https')){
            path = URIin;
        } else {
            if(document.currentScript == null || document.currentScript.src == ""){
                return null;
            }
            let src;
            if(URIin.startsWith('../')){
                URIin = URIin.replace('../', "")
                src = document.currentScript.src.split('/').slice(0, -2).join('/') + "/";
            } else {
                src = document.currentScript.src.split('/').slice(0, -1).join('/') + "/";
            }
            path = src + URIin;
        }
        if(path.endsWith("/")){
            return Splint_bindJS.getProjectPATH(path);
        }
        return path;
    }

}
class SPLINT {
    static loadedScripts = [];
    static computeFlag = false;
    static #config = null;
    static PATH = new Object();
    static async start(){
        console.log("start")
        SPLINT_Loader.start();
    }
    static {
        this.config = new Object();
        // window.SPLINT = SPLINT;
    }
    static get Events(){
        return S_Events;
    }
    static get CONSTANTS(){
        return S_constants;
    }
    static get DataStorage(){
        return S_DataStorage;
    }
    static get BufferStorage(){
        return S_BufferStorage;
    }
    static get DOMElement(){
        return DOMElement;
    }
    static get EX(){
        return SPLINT_Experimental;
    }
    static get SessionsPHP(){
        return S_SessionsPHP;
    }
    static get autoObject(){
        return autoObject;
    }
    static get SArray(){
        return SArray;
    }
    static get debugger(){
        return SPLINT_debugger;
    }
    static get Error(){
        return SplintError;
    }
    static get CallPHP(){
        return S_CallPHP;
    }
    static get ViewPort(){
        return ViewPort;
    }
    static get API(){
        return S_API;
    }
    static require_now(uri){
        return SPLINT_loaderHelper.loadScript(uri, true);
    }
    static require(uri, type = null){
        return SPLINT_loaderHelper.loadScript(uri, false, type);
    }
    static Tools = class {
        static get Location(){
            return nS_Location;
        }
        static get parse(){
            return S_Tparser;
        }
        static get DateTime(){
            return S_DateTime;
        }
    }
    static get Utils(){
        return S_Utils;
    }
    static get CONFIG(){
        if(SPLINT.#config == null){
            try {
                let projectName = location.pathname.split('/')[1];
                SPLINT.#config = SPLINT_loaderHelper.getConfig(projectName)
            } catch {
                let projectName = location.pathname.split('/')[1] + "/" + location.pathname.split('/')[2];
                SPLINT.#config = SPLINT_loaderHelper.getConfig(projectName)
            }
            return SPLINT.#config;
        }
        return SPLINT.#config;
    }
    // static isDebuggMode(){
    //     return this.CONFIG.settings.debugging;
    // }
    static log(){
        SPLINT.debugger.logUser(SPLINT);
    }
}

const SPLINT_loadedDocs = [];
class SPLINT_loaderHelper {
    static async loadScript(classPath, sync = false, type = null){
        let obj1 = new Object();
            obj1.resolved = false;
        let path = SPLINT_LOADER.parseSRC(classPath);
            obj1.path = path;
        for(const key in SPLINT_Loader.LOADED_DOCS){
            let e = SPLINT_Loader.LOADED_DOCS[key];
            if(e.path == path){
                if(sync){
                    obj1 = e;
                } else {
                    return e.promise;
                }
            }
        }
        SPLINT_Loader.LOADED_DOCS.push(obj1);
        
        obj1.promise =  new Promise(async function(resolve, reject){
            // let sc = document.createElement("script");
            // sc.type = "text/javascript"
            // sc.async = true;
            // sc.id = Math.random();
            // document.head.appendChild(sc)
            let cache = false;
            if(path.includes(SPLINT.projectRootPath)){
                cache = SPLINT.config.main.settings.cacheResources.project.js
            } else if(path.includes(SPLINT.rootPath + "/js/")){
                cache = SPLINT.config.main.settings.cacheResources.splint.js
            }
            if(sync){
                let dataType = 'text';
                if(!SPLINT.computeFlag){
                    dataType = 'script';
                }
                $.ajax({
                    beforeSend: function(){
                    },
                    dataFilter : function(data){
                        if(data.includes("SPLINT.require_now")){
                            let res = data.match(/(?<=SPLINT.require_now\(['"]).*(?=['"]\))/g);
                            for(const r of res){
                                SPLINT.require_now(r);
                            }
                        }
                        if(obj1.resolved){
                            return "";
                        } else {
                            return data;
                        }
                    },
                    type: 'GET',
                    url: path,
                    async: !sync,
                    cache: cache,
                    dataType: dataType,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        reject(arguments);
                    }
                }).done(function(){
                    obj1.resolved = true;
                    resolve(true);
                });
            } else {
                function load(){
                    let tag = document.createElement('script');
                    tag.type = "text/javascript";
                    if(cache){
                        tag.src = path;
                    } else {
                        tag.src = path + "?v=" + Math.round(Date.now()/1000);
                    }
                    tag.defer = true;
                    if(type != null){
                        tag.type = type;
                    }
                    tag.setAttribute("async", "true");
                    // S_Loader.loadScriptByAjax(src);
                    tag.onload = function(){
                        obj1.resolved = true;
                        resolve(true)
                    };
                    tag.onerror = function(){
                        SPLINT.Error.FileNotFound(path);
                        // SPLINT.debugger.error("init - loader", "try reloading is you have changed the file tree")
                        Splint_bindJS.loadPATH();
                        SPLINT_loaderHelper.queryPaths();
                        // load();
                        obj1.resolved = true;

                        reject(false);
                    }
                    document.body.appendChild(tag);
                }
                load();

            }
        }.bind(this))

        return obj1.promise;
    }
    static async initLoader(){
            let f = async function(uri){
                let path = Splint_bindJS.getSplintPATH("/Splint/js" + uri)[0];
                for(const e of SPLINT_Loader.LOADED_DOCS){
                    if(e.path == path){
                        return e.promise;
                    }
                }
                let cache = false;
                if(path.includes(SPLINT.projectRootPath)){
                    cache = SPLINT.config.main.settings.cacheResources.project.js
                } else if(path.includes(SPLINT.rootPath + "/js/")){
                    cache = SPLINT.config.main.settings.cacheResources.splint.js
                }
                let promise = $.ajax({
                        beforeSend: function(g){
                            console.log(path);
                        },
                        dataFilter :function(data){
                            // String
                            const regexp = /\r\n/g;
                            const str = data;
                            const matches = str.matchAll(regexp);
                            let last = 0;
                            let flag = false;
                            let substr = "";
                            for (const match of matches) {
                                substr = data.substring(last, match.index)
                                if(/\S/.test(substr) && !substr.includes("SPLINT.require")){
                                    if(flag){
                                        break;
                                    }    
                                    flag = true;

                                } else if(substr.includes("SPLINT.require")){
                                    flag = false;
                                }
                                last = match.index + match.length;
                              }
                            substr = data.substring(0, last);

                            if(substr.includes("SPLINT.require")){
                                let res = substr.match(/(?<=SPLINT.require_now\(['"]).*(?=['"]\))/g);
                                let res1 = substr.match(/(?<=SPLINT.require\(['"]).*(?=['"]\))/g);
                                if(res != null){
                                    for(const r of res){
                                        SPLINT.require_now(r)
                                    }
                                }
                                if(res1 != null){
                                    for(const r of res1){
                                        SPLINT.require(r)
                                    }
                                }
                            }
                            if(!SPLINT.computeFlag){
                                let f = document.createElement("script");
                                let a = document.createTextNode(data);    
                                f.appendChild(a);
                                document.body.appendChild(f);
                            }
                            return data;
                        },
                        type: 'GET',
                        url: path,
                        async: true,
                        cache: cache,
                        dataType: 'text',
                    }).done(function(){
                        return true;
                    });
                    
                SPLINT_Loader.LOADED_DOCS.push({path: path, promise: promise});
                return promise;
            }.bind(this);
        return Promise.allSettled([
                f("/INIT/loaderHelper.js").then(function(){
                    return f("/INIT/loader.js");
                }),
                f("/paths.js")]);
    }
    static async createCommonLinkTag(src){
        for(const e of SPLINT_Loader.LOADED_DOCS){
            if(e.path == src){
                return e.promise;
            }
        }
        let cache = false;
        if(src.includes(SPLINT.projectRootPath)){
            cache = SPLINT.config.main.settings.cacheResources.project.css
        } else if(src.includes(SPLINT.rootPath + "/scss/")){
            cache = SPLINT.config.main.settings.cacheResources.splint.css
        }
        let obj = new Object();
        obj.path = src;
        obj.resolved = false;
        obj.promise =  new Promise(async function(resolve, reject){
            let tag = document.createElement('link');
            tag.rel = "stylesheet";
            if(cache){
                tag.href = src;
            } else {
                tag.href = src + "?v=" + (new Date()).getTime();
            }
            tag.defer = true;
            tag.type = "text/css";
            tag.setAttribute("async", "true");
            document.head.appendChild(tag);
            tag.onload = function(){
                resolve(true);
            }
            tag.onerror = function(){
                SPLINT.Error.FileNotFound(src);
                resolve(false);
            }
            return true;
        })
        SPLINT_Loader.LOADED_DOCS.push(obj)
        return obj.promise;
    }
    static getConfig(projectPath){
        let uri = location.origin + "/" + projectPath + "/Splint/" + "splint.config/config.main.json";
        
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", uri, false);
        rawFile.onreadystatechange = function() {
            if(rawFile.readyState === 4) {
                if(rawFile.status === 200 || rawFile.status == 0){
                    return rawFile.responseText;
                } else {
                    return false;
                }
            }
        }

        rawFile.send(null);
        return JSON.parse(rawFile.responseText);
    }
}

class SPLINT_Loader extends SPLINT_loaderHelper{
    static LOADED_DOCS = [];
    // static LOADED_DOCS = [];
    static async start(){
        return new Promise(async function(resolve, reject){
            this.loadGoogleIcons();
            await Promise.all([
                this.loadJQuery(),
                this.loadConfig()]);
            await Promise.all([
                this.loadImportMap(),
                Splint_bindJS.loadPATH()]);
                // Splint_bindJS.preload();
            SPLINT_loaderHelper.initLoader().then(async function(){
                this.bind().CSS();
                await SPLINT.require("@SPLINT_ROOT/Events/Events.js");
                await Promise.allSettled([
                    
                    SPLINT.require("@SPLINT_ROOT/Utils/ANSI.js"),
                    SPLINT.require("@SPLINT_ROOT/constants.js"),
                    SPLINT.require("@SPLINT_ROOT/DOMElements/DOMElementTemplate.js"),
                    SPLINT.require("@SPLINT_ROOT/DataManagement/callPHP/CallPHP.js"),
                    SPLINT.require("@SPLINT_ROOT/Utils/debugger/SplintError.js"),
                    SPLINT.require("@SPLINT_ROOT/Utils/debugger/debugger.js"),
                    SPLINT.require("@SPLINT_ROOT/Tools/json.js"),
                    SPLINT.require("@SPLINT_ROOT/dataTypes/SArray.js"),
                    SPLINT.require("@SPLINT_ROOT/dataTypes/autoObject.js")
                    ]);
                this.bind().MODULES();
                this.bind().PRE().then(async function(){
                    await this.loadChartJS();
                    await this.bind().ALL();
                    resolve(true);
                }.bind(this));
                // this.loadGoogleLogin();
                // await this.#bindLoaderHelper();
            }.bind(this));
        }.bind(this)).then(async function(){
            await Splint_bindJS.loader();
            Splint_bindJS.removeSplintTags();
            let f = []
            for(const e of Object.values(SPLINT_Loader.LOADED_DOCS)){
                f.push(e.promise);
            }
            Promise.allSettled(f).then(function(){
                SPLINT.Events.onInitComplete.dispatch();
            })
            return true;
        }.bind(this))
        
    }
    /**
     * @return  {Object}  config file object
     */
    static async loadConfig(){
        return new Promise(async function(resolve){
            try {
                let projectName = location.pathname.split('/')[1];
                SPLINT.config.main = SPLINT_loaderHelper.getConfig(projectName)
            } catch {
                let projectName = location.pathname.split('/')[1] + "/" + location.pathname.split('/')[2];
                SPLINT.config.main = SPLINT_loaderHelper.getConfig(projectName)
            }
            let port = "";
            if(SPLINT.config.main.port != ""){
                port = ":" + SPLINT.config.main.port;
            }
            // SPLINT.rootPath = SPLINT.config.main.SSL + "://" + SPLINT.config.main.host + port + "/Splint";
            SPLINT.rootPath = window.location.origin + "/Splint";
            SPLINT.projectRootPath = window.location.origin + SPLINT.config.main.paths.project_root;
            SPLINT.cssRootPath = window.location.origin + SPLINT.config.main.paths.css_root;
            resolve(SPLINT.config.main);
            return SPLINT.config.main;
        });
    }
    // static get
    static bind(){
        return Splint_bindJS;
    }
    static async loadChartJS(){
        let tag = document.createElement("script");
            tag.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.1.1/chart.js";
            tag.type = "text/javascript";
            tag.defer = true;
            tag.setAttribute("async", true);
            document.head.appendChild(tag);
            return getPromiseFromEvent(tag, "load");
    }
    static async loadJQuery(){
        let tag = document.createElement("script");
            tag.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js";
            tag.setAttribute("async", true);
            // tag.onload = function(){
            //     fetch(this.src)
            //     .then(res => {
            //         return res.text();
            //     })
            //     .then(text => {
            //         console.log(text);
            //     });
            // }
            document.body.appendChild(tag);
        return getPromiseFromEvent(tag, "load");
    }
    static loadGoogleLogin(){
        let tag = document.createElement("script");
            tag.src = "https://accounts.google.com/gsi/client";
            document.body.appendChild(tag);
            getPromiseFromEvent(tag, "load");
    }
    static async loadGoogleIcons(){
        let link = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,1&display=block";
        let tag1 = document.createElement('link');
            tag1.rel = "preconnect";
            tag1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(tag1);
        let tag = document.createElement("link");
            tag.href = link;
            tag.rel = "stylesheet";
            tag.async = true;
            document.head.appendChild(tag);
        return;
    }
    static loadImportMap(){
        return new Promise(function(resolve){
        let tag = document.createElement("script");
            tag.setAttribute("type", "importmap");
            tag.setAttribute("id", "SPLINT_importmap");
            let mapJSON = {
                "imports": {
                  "SPLINT"                  : SPLINT.rootPath + "/js/modules/ThreeJS/CORE.js",
                  "splint"                  : SPLINT.rootPath + "/js/modules/ThreeJS/CORE.js",
                  "three"                   : SPLINT.rootPath + "/lib/threeJS/build/three.module.min.js",
                  "@THREE_ROOT_DIR/"        : SPLINT.rootPath + "/lib/threeJS/",
                  "@THREE_MODULES_DIR/"     : SPLINT.rootPath + "/lib/threeJS/examples/jsm/",
                  "@SPLINT_MODULES_DIR/"    : SPLINT.rootPath + "/js/modules/",
                  "@SPLINT_THREE_DIR/"      : SPLINT.rootPath + "/js/modules/ThreeJS/",
                  "@PROJECT_ROOT/"          : SPLINT.projectRootPath + "js/",
                  "@SPLINT_ROOT/"           : SPLINT.rootPath + "/js/",
                  "@NODE_MODULES_DIR/*"     : SPLINT.rootPath + "/node_modules/"
                }
              }
            tag.innerHTML = JSON.stringify(mapJSON, null, 2);
            document.body.appendChild(tag);
            tag.onload = function(){
                resolve(true);
            }.bind(this);
            resolve(true);
        });
    }
}

function getPromiseFromEvent(item, event) {
    return new Promise((resolve) => {
      const listener = (e) => {
        item.removeEventListener(event, listener);
        resolve();
      }
      item.addEventListener(event, listener);
    })
  }


class Splint_bindJS {
    // static async preload(){
    //     async function f(obj, as){
    //         for(const entry of obj){
    //             function load(){
    //                 let tag = document.createElement('link');
    //                 tag.rel = "preload";
    //                 if(SPLINT.CONFIG.settings.cacheResources){
    //                     tag.href = entry;
    //                 } else {
    //                     tag.href = entry + "?v=" + (new Date()).getTime();
    //                 }
    //                 tag.as = as;
    //                 tag.setAttribute("async", "true");
    //                 document.head.appendChild(tag);
    //                 tag.oerror = function(){
    //                     Splint_bindJS.loadPATH();
    //                     load();
    //                     console.log(arguments);
    //                 }
    //             }
    //             load();
    //         }
    //     }
    //     f(SPLINT.PATH.splint.JS, "script");
    //     f(SPLINT.PATH.project.CSS, "stylesheet");
    //     return;
    // }
    static async loadPATH(configIn = null, res = null){
        let config = configIn;
        if(configIn == null){
            config = SPLINT.config.main;
        }
        if(res == null){
            res = new Object();
        }
        console.log(SPLINT.rootPath)
        return Promise.all([
            $.ajax({
                type: 'GET',
                url: SPLINT.rootPath + "/loadFolderFromHTML.php?forceReload=" + !config.settings.cacheResources.project.fileTree + "&projectName=" + config.projectName,
                async: true,
                cache: config.settings.cacheResources.project.fileTree,
                dataType: 'JSON',
                success: function(data) {
                    if(configIn == null){
                        SPLINT.PATH.project = data;
                    } else {
                        res.a = data;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    SPLINT.debugger.error("loader", "")
                }
            }),
            $.ajax({
                type: 'GET',
                url: SPLINT.rootPath + "/loadFromHTML.php?forceReload=" + !config.settings.cacheResources.splint.fileTree + "&projectName=" + config.projectName,
                async: true,
                cache: config.settings.cacheResources.splint.fileTree,
                dataType: 'JSON',
                success: function(data) {
                    if(configIn == null){
                        SPLINT.PATH.splint = data;
                    } else {
                        res.b = data;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    SPLINT.debugger.error("loader", "")
                }
            })]);
    }
    static getSplintPATH(uri_part){
        let stack = [];
        for(const e of SPLINT.PATH.splint.JS){
            if(e.includes(uri_part)){
                stack.push(e);
            }
        }
        return stack;
    }
    static getProjectPATH(uri_part){
        let stack = [];
        for(const e of SPLINT.PATH.project.JS){
            if(e.includes(uri_part)){
                stack.push(e);
            }
        }
        return stack;
    }
    static async CSS(){
        let parts = SPLINT_LOADER.ELEMENTS.stylesheets;
        for(const e of parts){
            let src = SPLINT.cssRootPath + e.src;
            SPLINT_loaderHelper.createCommonLinkTag(src)
        }
        return;
    }
    static async FIRST(){
        let stack = [];
        let parts = SPLINT_LOADER.ELEMENTS.scripts_first;
        for(let i = 0; i < parts.length; i++){
            let val = parts[i].src;
            if(!val.startsWith("@") && !val.startsWith("http") && !val.startsWith("https")){
                val = '@PROJECT_ROOT' + val;
            }
            let f = SPLINT_LOADER.parseSRC(val.replace("/js", ""));
            if(typeof f == 'object'){
                SArray.assort(f, "/");
                for(const e of f){
                    stack.push(SPLINT.require_now(e));
                }
            } else {
                stack.push(SPLINT.require_now(f));
            }
        }
        return Promise.allSettled(stack);
    }
    static async PRE(){
        let stack = [];
        let parts = SPLINT_LOADER.ELEMENTS.scripts_pre;
        for(let i = 0; i < parts.length; i++){
            let val = parts[i].src;
            if(!val.startsWith("@") && !val.startsWith("http") && !val.startsWith("https")){
                val = '@PROJECT_ROOT' + val;
            }
            let f = SPLINT_LOADER.parseSRC(val.replace("/js", ""));
            if(typeof f == 'object'){
                SArray.assort(f, "/");
                for(const e of f){
                    stack.push(SPLINT.require_now(e));
                }
            } else {
                stack.push(SPLINT.require_now(f));
            }
        }
        return Promise.allSettled(stack);
    }
    static async ALL(computeFlag = false){
        return new Promise(async function(resolve, reject){
            // this.MODULES();

            SArray.assort(SPLINT.PATH.splint.JS, "/");

            let stack = []
            for(const file of SPLINT.PATH.splint.JS){
                stack.push(SPLINT_loaderHelper.loadScript(file, false));
            }
            await Promise.allSettled(stack);
            await this.FIRST();
            await this.parts();
            resolve(true);
        }.bind(this));
    }
    static async loader(){
        let src = SPLINT_LOADER.ELEMENTS.loader[0].src;
            if(!src.startsWith("@") && !src.startsWith("http") && !src.startsWith("https")){
                src = '@PROJECT_ROOT' + src;
            }
            src = SPLINT_LOADER.parseSRC(src.replace("/js", ""));
            return SPLINT.require(src);
    }
    static async parts(){
        let stack = [];
        let parts = SPLINT_LOADER.ELEMENTS.scripts;
        for(let i = 0; i < parts.length; i++){
            let val = parts[i].src;
            if(!val.startsWith("@") && !val.startsWith("http") && !val.startsWith("https")){
                val = '@PROJECT_ROOT' + val;
            }
            let f = SPLINT_LOADER.parseSRC(val.replace("/js", ""));
            if(typeof f == 'object'){
                SArray.assort(f, "/");
                for(const e of f){
                    stack.push(SPLINT.require(e));
                }
            } else {
                stack.push(SPLINT.require(f));
            }
        }
        return Promise.allSettled(stack);
    }
    static async MODULES(){
        let stack = [];
        let parts = SPLINT_LOADER.ELEMENTS.modules;
        for(let i = 0; i < parts.length; i++){
            let val = parts[i].src;
            if(!val.startsWith("@") && !val.startsWith("http") && !val.startsWith("https")){
                val = '@PROJECT_ROOT' + val;
            }
            let f = SPLINT_LOADER.parseSRC(val.replace("/js", ""));
            if(typeof f == 'object'){
                SArray.assort(f, "/");
                for(const e of f){
                    stack.push(SPLINT.require(e, 'module'));
                }
            } else {
                stack.push(SPLINT.require(f, 'module'));
            }
        }
        return Promise.allSettled(stack);
    }
    static removeSplintTags(){
        for(const entry of Object.entries(SPLINT_LOADER.ELEMENTS)){
            for(const element of entry[1]){
                element.element.remove();
            }
        }
    }
}




SPLINT.PATHS = new Object();

SPLINT.PATHS.php = new Object();

if(SPLINT.PATHS.rootPath == undefined){
    SPLINT.PATHS.rootPath = location.protocol + "//" + location.host + "/Splint";
}
SPLINT.PATHS.php.email          = SPLINT.PATHS.rootPath + "/php/email/emailAccess.php";
SPLINT.PATHS.php.DataStorage    = SPLINT.PATHS.rootPath + "/php/DataStorage/DataStorageAccess.php";
SPLINT.PATHS.Access             = SPLINT.PATHS.rootPath + "/php/Communication/AccessSplint.php";
SPLINT.PATHS.php.moonraker      = SPLINT.PATHS.rootPath + "/php/API/moonraker/moonrakerAccess.php";

SPLINT.PATHS.php.JSBuilder      = SPLINT.PATHS.rootPath + "/php/JSBuilder/JSBuilderAccess.php";

SPLINT.PATHS.images = new Object();
SPLINT.PATHS.images.error = SPLINT.PATHS.rootPath + "/src/images/error.png";


class S_API {
    static get IPapi(){
        return S_API_ipapi;
    }
    static get IPinfo(){
        return S_API_IPinfo;
    }
    static get ChartJS(){
        return S_API_ChartJS;
    }
    static get Paypal(){
        return S_API_Paypal;
    }
    static get Moonraker(){
        return S_moonraker;
    }
}


class S_API_ChartJS {
    static get Container(){
        return S_ChartContainer;
    }    
    static parseGradient(S_colorGradient){
        let Storage = [];
        for(const index in S_colorGradient){
            let c = S_Colors.parse(S_colorGradient[index], 'rgba');
                let r = String(c.r).split('.')[0];
                let g = String(c.g).split('.')[0];
                let b = String(c.b).split('.')[0];
                let a = String(c.a).substring(0, 4);
            let str = "rgba" + "( " + r + " , " + g + " , " + b + " , " + a + " )"; 
            Storage.push(str);
        }
        return Storage;
    }
}

class S_chartObject {
    constructor(type = 'line', ...dataSets){
        this.type = type;
        this.data = new Object();
        this.data.datasets = [];
        if(dataSets.length > 0){
            for(const e of dataSets){
                e.update();
            }
            this.data.datasets.push(...dataSets);
        }
        this.plugins = [];
        this.options = new SPLINT.autoObject();
        this.options.maintainAspectRatio = false;
        // this.options.scales.x.type = 'linear';
        this.options.layout.padding = 20;
        this.options.scales.x.grid.display = false;
        // this.options.scales.x.ticks = {};
        // this.options.scales.x.ticks.max = 300;
        this.options = this.options.parseToObject();
    }
    setXdata(...labels){
        this.data.labels = labels;
    }
    update(){
        for(const e of this.data.datasets){
            e.update();
        }
    }
    addDataSet(dataSet){
        this.data.datasets.push(dataSet);
    }
}

class S_chartDataSet {
    constructor(data = null, backgroundColor = null, label = []){
        if(data != null){
            this.addData(data);
        }
        if(backgroundColor != null){
            this.backgroundColor = backgroundColor;
        }
        this.options = new SPLINT.autoObject();
        this.type = 'bar';
        this.label = label;
        this.base = 0;
        this.barThickness = 'flex';
        this.borderColor = 'black';
        this.borderWidth = 1;
    }
    #data = [];
    get data(){
        return this.#data;
    }
    update(){
        if(this.gradient instanceof SPLINT.Utils.Colors.Gradient){
            this.gradient.steps = this.#data.length;
            this.#backgroundColor = S_API_ChartJS.parseGradient(this.gradient);
        }
    }
    #backgroundColor;
    borderColor;
    color;
    set backgroundColor(color){
        if(color instanceof SPLINT.Utils.Colors.Gradient){
            this.gradient = color.clone();
            this.gradient.steps = this.#data.length;
            this.#backgroundColor = S_API_ChartJS.parseGradient(this.gradient);
        } else {
            this.gradient = null;
            this.#backgroundColor = color.clone();
        }
    }
    get backgroundColor(){
        return this.#backgroundColor;
    }
    /**
     * @example 
     * if(x2 != null){
     *      x1  stands for  X
     *      x2  stands for  Y
     * } else {
     *      x1  stands for  Y
     * }
     * 
     * @param {any} x1 
     * @param {string|number|null} x2  
     */
    #addDataPairs(x1, x2 = null){
        if(x2 != null){
            this.#data.push({x:x1.toString(), y:x2});
        } else {
            let x = this.#data.length + 1;
            this.#data.push({x:x.toString(), y:x1});
        }

    }
    /**
     * @example 
     * if(x2 != null){
     *      x1  stands for  X
     *      x2  stands for  Y
     * } else {
     *      x1  stands for  Y
     * }
     * 
     * @param {any} x1 
     * @param {any} x2  
     */
    addData(data, data2 = undefined){
        switch(typeof data){
            case 'string' : {
                this.#addDataPairs(data, data2); break;
            }
            case 'number' : {
                this.#addDataPairs(data, data2); break;
            }
            case 'BigInt' : {
                this.#addDataPairs(data, data2); break;
            }
            case 'object' : {
                if(data instanceof Map){
                    this.#addDataMap(data); break;
                }
                if(data instanceof Array){
                    this.#addDataArray(data); break;
                }
                if(data instanceof Object){
                    this.#addDataObject(data); break;
                }
                SPLINT.debugger.error("wrong input data", "data must be an instanceof 'Object', 'Array' or 'Map'"); break;
            }
            default : {
                console.group("Error - ChartDataSet");
                SPLINT.debugger.error("wrong input data", "data must be type of 'string', 'number', 'BigInt', 'Object', 'Array' or 'Map'"); 
                SPLINT.debugger.error("data1", typeof data); 
                SPLINT.debugger.error("data2", typeof data2); 
                console.groupEnd();
            } break;
        }
    }
    #addDataMap(mapIn){
        for(const [key, value] of mapIn){
            this.#addDataPairs(key, value);
        }
    }
    #addDataObject(obj){
        return this.#addDataMap(SPLINT.Tools.parse.ObjectToMap(obj));
    }
    #addDataArray(array){
        for(const e of array){
            if(e instanceof Object && (Object.entries(e).length > 0)){
                let f = Object.entries(e);
                this.#addDataPairs(f[0][0], f[0][1]);
            } else {
                this.#addDataPairs(e);
            }
        }
    }
    // parseObject(array){
    //     return Object.entries(object).map(([key, value]) => ({key,value}));
    // }
}
// function require(anyPath, name){
//     return window.Chart;
// // }
// const { Chart } = require("chart.js");

class S_ChartContainer {
    /**
     * 
     * @param {string} name 
     * @param {HTMLElement} parent 
     * @param {object | S_chartObject} config 
     */
    constructor(name, parent, config){
        this.id = "S-ChartContainer__" + name + "__";
        this.parent = parent;
        this.#mainElement = new SPLINT.DOMElement(this.id + "_Body", "div", this.parent);
        this.#mainElement.Class("S-chartContainer");
        this.#labelContainer = new SPLINT.DOMElement(this.id + "_labelContainer", "div", this.#mainElement);
        this.#labelContainer.Class("labelContainer");
        this.#canvas = new SPLINT.DOMElement(this.id + "_Canvas", "canvas", this.#mainElement);
        this.#context = this.#canvas.getContext("2d");
        this._config = config;
        if(this._config instanceof S_chartObject){
            this.#Chart = new Chart(this.#context, this._config);
        } else {
            this.#Chart = new Chart(this.#context, this._config);
        }
        this.name = name;
        this.#initEvents();
    }
    #initEvents(){
        this.#mainElement.onresize = function(){
            this.resize();
        }.bind(this);
    }
    resize(){
        this.#Chart.resize()
    }
    update(){
        for(const e of this.#Chart.data.datasets){
            e.update();
        }
       this.#Chart.update();
    }
    #mainElement
    #canvas
    #context
    #Chart
    #name;
    #label;
    #labelContainer;
    #labelElement;
    set label(v){
        this.#label = v;
        if(v != null){
            this.#labelElement = new SPLINT.DOMElement.SpanDiv(this.#labelContainer, "label", v);
        } else {
            this.#labelContainer.clear();
        }
    }
    get name(){
        return this.#name;
    }
    set name(v){
        this.#name = v;
        this.#mainElement.setAttribute("name", v);
        this.#canvas.setAttribute("name", v);
    }
    get Chart(){
        return this.#Chart;
    }
    get container(){
        return this.#mainElement;
    }
    get canvas(){
        return this.#canvas;
    }
    get context(){
        return this.#context;
    }
    get ctx(){
        return this.#context;
    }
    get config(){
        return this._config;
    }
    set config(v){
        this._config = v;
        if(v.options != undefined){
            this.#Chart.options = v.options;
        }
        if(v.type != undefined){
            this.#Chart.type = v.type;
        }
        if(v.data != undefined){
            this.#Chart.data = v.data;
        }
        this.update();
    }
}
// SPLINT.require('@SPLINT_ROOT/DataManagement/callPHP/');

class S_API_ipapi {
    static PATH = SPLINT.PATHS.Access;
    static async get(){
        return fetch('https://ipapi.co/json/')
        .then(async function(response) {
          return await response.json();
        })
        .catch(async function(error) {
          return error;
        });
    }
    static async evaluate(IP){
        let call = new SPLINT.CallPHP(this.PATH, "API.IPAPI.EVAL");
            call.data.IP    = IP;
            call.method = "GET";
            call.headers["Content-Type"] = 'json';
        return call.send();
    }
}



class S_API_IPinfo {
    static async execute(){
        let res = (await this.get());
        // return this.evaluate(res);
    }
    static async get(){
        return new Promise(async function(resolve, reject){
            let response = await fetch("http://ipinfo.io?token=9d0ea8a90ffa46")
            let json = await response.json();
            resolve(json);
            // .then(async function(response){
            //     return await response.json()
            // })
            // .catch(async function(){
            //     return fetch("http://ipinfo.io/json")
            //     .then(async function(response){
            //         return await response.json()
            //     })
            //     .catch(function(){
            //         return false;
            //     })
            // });
        });
        
    }
    static async evaluate(data){
        let call = new SPLINT.CallPHP(this.PATH, "API.IPINFO.EVAL");
            call.data.data    = data;
            call.method = "GET";
            call.headers["Content-Type"] = 'json';
        return call.send();
    }
}

class S_moonraker {
    static {
        this.domain = SPLINT.config.main.moonraker.SSL + "://" + SPLINT.config.main.moonraker.host;
        this.PATH = SPLINT.PATHS.php.moonraker;
    }
    static async test(){
        let call = new SPLINT.CallPHP(this.PATH, "TEST");
        
        let res = call.send();
        return res;
    }
    static async printFile(filePath){
        let name =  "New_Model";
        let code = (await SPLINT.API.Moonraker.loadGCode(filePath));
        await SPLINT.API.Moonraker.uploadGCode(code, name);
        let g = SPLINT.API.Moonraker.startPrint(name);
        this.Helper.onReady = function(){
            console.log("ok")
            this.deleteFile(name + ".gcode");
        }.bind(this);
        console.dir(g);
        return g;
    }
    static getServerConfig(){
        return this.#call("/server/config", "GET");
    }
    static getServerInfo(){
        return this.#call("/server/info", "GET");
    }
    static getPrintInfo(){
        return this.#call("/printer/objects/list", "GET");
    }
    static queryPrinterObjectStatus(){
        return this.#call("/printer/objects/list", "GET");
    }
    static async subscribePrinterObjectStatus(){
        await this.Helper.createWebsocket();
        return this.#call("/printer/objects/subscribe?connection_id=" + this.Helper.websocketID + "&gcode_move&toolhead", "POST");
    }
    static getPrinterGCodeStore(amount){
        return this.#call("/server/gcode_store?count=" + amount + "", "GET");
    }
    static deleteFile(fileName){
        return this.#call("/server/files/gcodes/" + fileName, "DELETE");
    }
    static cancelPrint(){
        return this.#call("/printer/print/cancel", "POST")
    }
    static pausePrint(){
        return this.#call("/printer/print/pause", "POST")
    }
    static resumePrint(){
        return this.#call("/printer/print/resume", "POST")
    }
    static startPrint(fileName){
        let path = "/printer/print/start?filename=" + fileName + ".gcode";
        return this.#call(path, "POST");
    }
    static loadGCode(path){
        return SPLINT.Utils.Files.read(path);
    }
    static async uploadGCode(code, name){    
        return new Promise(async function(resolve){
            let data         = new FormData();
                data.append("file", new File([code], name + ".gcode", {type : "text/plain"}));
            let ajaxData = new Object();
                ajaxData.url          = this.domain + "/server/files/upload";
                ajaxData.type         = "POST";
                ajaxData.contentType  = false;
                ajaxData.processData  = false;
                ajaxData.data         = data;
                ajaxData.async        = true;
                ajaxData.success      = function(data){
                    resolve(data);
                    console.log(data)
                }.bind(this);
                ajaxData.error      = function(data){
                    resolve(data);
                }.bind(this);
            $.ajax(ajaxData);
        }.bind(this));
    }
    static async #call(path, method, sync = false){
        return new Promise(async function(resolve){
        let uri = this.domain + path;
            let rawFile = new XMLHttpRequest();
            rawFile.open(method, uri, !sync);
            rawFile.setRequestHeader('Content-type', 'application/json');
            rawFile.onreadystatechange = function() {
                console.dir(rawFile)
                if(rawFile.readyState === 4) {
                    if(rawFile.status === 200 || rawFile.status == 0){
                        resolve(SPLINT.Tools.parse.toJSON(rawFile.responseText));
                    } else {
                        resolve(false);
                    }
                }
            }
            rawFile.send();
        }.bind(this));
    }
    static get Helper(){
        return S_moonrakerHelper;
    }
}

class S_moonrakerHelper {
    static {
        this.activeSocket   = null;
        this.websocketID    = null;
        this.printProgress  = 1;
        this.onReadyStack   = []; 
        this.createWebsocket();   
    }

    static set onReady(func){
        this.onReadyStack.push(func);
    }

    static createWebsocket(){
        try {
            if(this.activeSocket == null){
                let host = 'ws://192.168.178.82/websocket';
                let socket = new WebSocket(host);
                socket.onopen = function(){
                    socket.send(JSON.stringify({
                        "jsonrpc": "2.0",
                        "method": "server.websocket.id",
                        "id": 4656
                    }))
                    socket.send(JSON.stringify({
                        "jsonrpc": "2.0",
                        "method": "printer.objects.subscribe",
                        "params": {
                            "objects": {
                                "gcode_move": null,
                                "display_status" :["progress"]
                            }
                        },
                        "id": 5434
                    }))
                }
                socket.onmessage = function(e) {
                    e = JSON.parse(e.data);
                    if(e.id == 4656){
                        this.websocketID = e.result.websocket_id;
                        // console.log(e)
                    } else if(e.params instanceof Array && e.params[0] == "Done printing file"){
                        this.printProgress = 1;
                        for(const a of this.onReadyStack){
                            a();
                        }
                    } 
                    if(e.id == 5434){
                        console.log(e)
                        this.printProgress = e.result.status.display_status.progress;
                    }
                    // console.dir(S_JSON.parseIf(e.data));
                }.bind(this);
                this.activeSocket = socket;
                return socket;
            }
        } catch (e) {
            SPLINT.debugger.error("moonraker", "cannot connect to server");
        }
        return this.activeSocket;
    }
    static closeWebsocket(){
        if(this.activeSocket != null){
            this.activeSocket.close();
            this.activeSocket = null;
            this.websocketID  = null;
        }
    }
}

            // SPLINT.API.Paypal.ScriptLoader.authorize();

class S_PaypalButtons {
        // constructor(parent) {
        //     this.parent = parent;
        //     this.drawButtons()
        // }
        static async draw(parent){
            let button = new SPLINT.DOMElement("paypal-button-container", "div", parent);
            let orderObject = await (S_API_Paypal.Object.preparePaypal());
        
            paypal.Buttons({
                style: {
                layout: 'horizontal',
                color: 'gold',
                shape: 'rect',
                label: 'paypal',
                tagline: 'false'
                },
                onClick: (data) => {
                    // fundingSource = "venmo"
                    fundingSource = data.fundingSource;
            
                    // Use this value to determine the funding source used to pay
                    // Update your confirmation pages and notifications from PayPal to Venmo
                },
                // createSubscription(data, actions) {
                //   return actions.subscription.create({
                //     'plan_id': 'P-2UF78835G6983425GLSM44MA'
                //   });
                // },
                createOrder: (data, actions) => {
                    return actions.order.create(orderObject);
                },
                onApprove: (data, actions) => {
                return actions.order.capture().then(function(orderData) {
                    console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
                    const transaction = orderData.purchase_units[0].payments.captures[0];
        
                    console.log(transaction);
                    // S_Location.goto(PATH.location.paymentComplete).call();
                    alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
                });
                },
                onCancel: function (data) {
                // Show a cancel page, or return to cart
                },
                onError: function (err) {
                // For example, redirect to a specific error page
                window.location.href = "/your-error-page-here";
                }
            }).render('#paypal-button-container');
        
        }
    }





/////////------   TESTX

// function fx(...args){
//     return Reflect.construct(class S_PaypalButtons {
//         static {
//             // this.s = new S_PaypalButtons();
//         } 
//         constructor(...args) {
//             if(!args.includes("init")){
//                 // return this;
//             console.log(arguments)
//             }
//             // return new.target;
//         // super('...args', 'return this._bound._call(...args)')
//         // Or without the spread/rest operator:
//         // super()
//         // this._bound = this.bind(this)
    
//         // return this
//         }
        
//         // _call(...args) {
//         // console.log(this, args)
//         // }
    
        
//         test(a){
//             return "ok53465463"
//         }
//         static async drawButtons(parent){
//             let button = new SPLINT.DOMElement("paypal-button-container", "div", parent);
//             let orderObject = await preparePaypal();
        
//             paypal.Buttons({
//                 style: {
//                 layout: 'horizontal',
//                 color: 'gold',
//                 shape: 'rect',
//                 label: 'paypal',
//                 tagline: 'false'
//                 },
//                 createOrder: (data, actions) => {
//                     return actions.order.create(orderObject);
//                 },
//                 onApprove: (data, actions) => {
//                 return actions.order.capture().then(function(orderData) {
//                     console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
//                     const transaction = orderData.purchase_units[0].payments.captures[0];
        
//                     console.log(transaction);
//                     // S_Location.goto(PATH.location.paymentComplete).call();
//                     alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
//                 });
//                 },
//                 onCancel: function (data) {
//                 // Show a cancel page, or return to cart
//                 },
//                 onError: function (err) {
//                 // For example, redirect to a specific error page
//                 window.location.href = "/your-error-page-here";
//                 }
//             }).render('#paypal-button-container');
        
//         }
//     }, args);
// }
// Object.setPrototypeOf(fx, fx("init"))
// fx.prototype.name = "fx";
// // fx.prototype.test = "ok";
// // Object.defineProperty(fx.pto, "test", {
//     // get(){
//         // return this;
//     // }
// // })
// console.dir(fx)

class S_PaypalCheckout {
    constructor(parent, name){
        
    }
}

class S_PaypalFastCheckout {
    constructor(parent){
      this.id = "fastCheckout_";
      this.parent = parent;
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
      this.mainElement.Class("fastCheckout");
      S_API_Paypal.draw.Buttons.draw(this.mainElement);
    }

}

class S_PaypalObject {
    constructor(){

    }
    // set 
    
    static async preparePaypal(){
        let CouponObj = null;
        let Items = (await ShoppingCart.get()).shoppingCart;
        let FullPrice = 0;
        let productsData = await productHelper.getProducts();
        for(const item of Items){
            item.price = parseFloat(productsData[item.ProductName].price);
            FullPrice += S_Math.multiply(item.price, item.amount);
        }
        let orderObject = '{' +
        '"purchase_units": [{' +
            '"amount": {' +
            '"currency_code": "EUR",' +
            '"value": "' + FullPrice + '",' +
            '"breakdown": {' +
                '"item_total": {' +
                '"currency_code": "EUR",' +
                '"value": "' + FullPrice + '"' +
                '}' +
            '}' +
            '},' +
            '"items": [';

        for(let i = 0; i < Items.length; i++){
        orderObject +=
        '{' +
            '"name": "' + Items[i].ProductName + '",';
        if(CouponObj != null){
            orderObject +=   '"description": "CouponCode:' + CouponObj.code + '  Wert: ' + CouponObj.value + '  Für alle Produkte: ' + CouponObj.eachItem + '",';
        } else {
            orderObject +=   '"description": "",';
        }
        orderObject +=
            '"unit_amount": {' +
            '"currency_code": "EUR",' +
            '"value": "' + Items[i].price + '"' +
            '},' +
            '"quantity": "' + Items[i].amount + '"' +
        '}';
        if(i < Items.length - 1){
            orderObject += ',';
        }
        }

        orderObject += ']}]}';
        orderObject = JSON.parse(orderObject);
        return orderObject;
    }
}
// const { loadScript } = require("@paypal/paypal-js");

// const {loadScript} = require('@paypal/paypal-js');
// loadScript(options)
SPLINT.require('@SPLINT_ROOT/API/paypal/draw/PaypalButtons.js');
SPLINT.require('@SPLINT_ROOT/API/paypal/draw/PaypalFastCheckout.js');
SPLINT.require('@SPLINT_ROOT/API/paypal/draw/PaypalCheckout.js');
SPLINT.require('@SPLINT_ROOT/API/paypal/generateObject.js');

class S_API_Paypal {
    constructor(){
    }
    static draw = class {
        static get fastCheckout(){
            return S_PaypalFastCheckout;
        }
        static get checkout(){
            return S_PaypalCheckout;
        }
        static get Buttons(){
            return S_PaypalButtons;
        }
        // Paypal
    }
    static get Object(){
        return S_PaypalObject;
    }
    static ScriptLoader = class {
        static ClientID = "AcY69ITexNWNGhhjCZTpjHIyM-KiqjWbTaACjMNj5SLRvXd8fMKysveevIZ4fffuBXEevk5Jf_LDw0nw";
        static src;
        static {
            this.src = new Object();
            this.src.authorize = "https://www.paypal.com/sdk/js?client-id=CLIENT_ID&intent=authorize";
            this.src.init = "https://www.paypal.com/sdk/js?client-id=CLIENT_ID&components=buttons,payment-fields,marks,funding-eligibility&enable-funding=giropay&currency=EUR";
        }
        static async init(){
            return this.#load(this.src.init.replace('CLIENT_ID', this.ClientID));
        }
        static async authorize(){
            return this.#load(this.src.authorize.replace('CLIENT_ID', this.ClientID));
        }
        static async #load(uri){
            return SPLINT.require(uri);
        }
    }
}

class S_API_unsplash {
    static {
        this.clientID = "mW5_smybRtwEzjFVNM2SegjYzoJ24Lj9vV_tw_scXtk";
    }
    constructor(){

    }
    static search(str){
        // this.value = value;
        // if(value == "" || value == undefined){
        //   this.getStartImages();
        //   return this;
        // }
        this.url = this.urlBaseSearch + 
        '?query=' + str + 
        '&per_page=' + this.count + 
        '&page=' + this.page + 
        '&orientation=' + "portrait" +
        '&client_id=' + this.client_id; 
        this.response = this.call();
        return this;
    }
    static call(url){
      return fetch(url)
      .then(response => {
        console.log(response)
        if (!response.ok) throw Error(response.statusText);
          return response.json();
       })
       .then(data => {
        if(data.total == 0){
          return data;
        }
        console.log(data)
        // this.response = data;
        // data = this.getImageData(flag);
        // this.callback(data, this);
        return data;
       })
       .catch(error => console.dir(error));
    }
    static test(){
        
        let url = "https://api.unsplash.com/photos" + 
        '?per_page=' + "30" + 
        '&page=' + "1" + 
        '&client_id=' + this.clientID;   
        let response = this.call(url);
        // console.dir(response);
        return response;
    }
}

class S_unsplashMenu {
    constructor(parent){
        this.parent = parent;
        this.id = "S_unsplashMenu_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("s-UnsplashMenu");
        this.contentElement = new SPLINT.DOMElement(this.id + "content", "div", this.mainElement);
        this.contentElement.Class("content");
        this.drawList();
    }
    async drawList(){
        let dataIn = await S_API_unsplash.test();
        console.dir(dataIn);
        let list = new SPLINT.DOMElement.Table.List(this.contentElement, "imageList", dataIn);
            list.func_drawListElement = function(data, index, listElement){
                console.dir(data);
                let img = new SPLINT.DOMElement(listElement.id + "_img", "img", listElement);
                    img.src = data.urls.thumb;
            }
            list.draw();
    }
}

class JSBuilder {
    static PATH = SPLINT.PATHS.php.JSBuilder;
    static #call(data){
        return CallPHP_S.call(this.PATH, data);
    }
    static async test(paths, config){
        let call = new SPLINT.CallPHP(this.PATH, "TEST");
            call.data.paths = paths;
            call.data.config = config;
            // data.path = "/settings.json";
            // data.content = "content";

        return call.send();//this.#call(data).toObject(true);
    }
    static edit(path, content = ""){
      let data = CallPHP_S.getCallObject("EDIT");
          data.path = path;
          data.content = content;
      return this.#call(data).toObject(true);
    }
    static get(path){
      let data = CallPHP_S.getCallObject("GET");
          data.path = path;
      return this.#call(data).toObject(true);
    }
}

class AddressMenu {
    constructor(parent, name = ""){
      this.parent = parent;
      this.id     = name + "_AddressMenu_";
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
      this.mainElement.Class("AddressMenuMain");
      this.newAddressElement = new SPLINT.DOMElement(this.id + "NewAddressMain", "div", this.mainElement);
      this.newAddressElement.Class("NewAddressMain");
      this.data   = login.getData();
      this.drawNewAddress();
      this.drawList();
    }
    drawNewAddress(){
      this.newAddressMain = new drawAddressMenu_NEW(this.mainElement);
      this.newAddressMain.drawSwitch();
      this.newAddressMain.unsetActive();
      this.newAddressMain.onsubmit = function(){
        this.newAddressMain.unsetActive();
        this.drawList();
      }.bind(this);
    }
    drawList(){
      this.listAddressMain = new drawAddressMenu_LIST(this.mainElement);
    }
  }
  
  class drawAddressMenu_NEW {
    constructor(parent, name = "", headline){
      this.parent = parent;	
      this.name   = name;
      this.directSave = true;
      this.drawSubmit = true;
      this.values = AddressObject.getTemplate();
      this.id     = name + "_AddressMenuNew_";
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
      this.mainElement.Class("addressMenuNewMain");
      if(headline != ""){
        this.headline = new SpanDiv(this.mainElement, "headline", headline);
      }
      this.switch = new S_switchButton(this.mainElement, "switchNewAddress");
      this.menuElement = new SPLINT.DOMElement(this.id + "menuElement", "div", this.mainElement);
      this.mainElement.Class("addressMenuListMain");
      this.onsubmit = function(){};
      this.draw();
    }
    toggle(){
  
    }
    setActive(){
      this.switch.bindIcon("close");
      this.menuElement.style.display = "block";
    }
    unsetActive(){
      this.switch.bindIcon("add");
      this.menuElement.style.display = "none";
    }
    drawSwitch(){
      this.switch.onactive = function(){
        this.setActive();
      }.bind(this);
      this.switch.onpassive = function(){
        this.unsetActive();
      }.bind(this);
      this.switch.toggle();
    }
    getValues(){
      return this.address_input.getValues();
    }
    setValues(values){
      this.values = values;
    }
    DrawSubmit(flag){
      this.drawSubmit = flag;
      this.draw();
    }
    draw(){
      this.address_input = new addressInput_C(this.menuElement, "input");
      this.address_input.drawSubmit = this.drawSubmit;
      this.address_input.onsubmit = function(values){
        if(this.directSave){
          AddressHelper.add(values);
        }
        this.onsubmit(values);
      }.bind(this);
  
      this.address_input.draw();
      this.address_input.setValues(this.values);
    }
  }
  
  class drawAddressMenu_LIST {
    constructor(parent, name = ""){
      this.parent = parent;
      this.id = name + "_addressMenuList_";
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
      this.mainElement.Class("addressMenuListMain");
      this.head = new SPLINT.DOMElement(this.id + "head", "div", this.mainElement);
      this.switch = new S_switchButton(this.head, "switchNewAddress");
      this.listElement = new SPLINT.DOMElement(this.id + "AddressListMain", "div", this.mainElement);
      this.draw();
      this.iconActive   = "close";
      this.iconPassive  = "add";
    }
    setActive(){
      this.switch.bindIcon(this.iconActive);
      this.listElement.style.display = "block";
    }
    unsetActive(){
      this.switch.bindIcon(this.iconPassive);
      this.listElement.style.display = "none";
    }
    drawSwitch(){
      this.switch.onactive = function(){
        this.setActive();
      }.bind(this);
      this.switch.onpassive = function(){
        this.unsetActive();
      }.bind(this);
    }
    draw(){
      let addressData = AddressHelper.get().toObject(true);
      this.listElement.innerHTML = "";
      this.listElement.Class("AddressListMain");
      new SPLINT.DOMElement.HorizontalLine(this.listElement);
      if(addressData == null){
        return;
      }
      for(let i = 0; i < addressData.length; i++){
        let data = addressData[i];
        // let listElement = new SPLINT.DOMElement(this.id + "addressListElement_" + i, "div", this.listElement);
            // getHorizontalLine(this.listElement);
            let AddressElement = new drawAddressElement(this.listElement, data, i);
                let buttonEdit = new S_Button(AddressElement.buttonDiv, "edit");
                    buttonEdit.bindIcon("edit");
                    buttonEdit.button.onclick = function(){
  
                    }
                let buttonRemove = new S_Button(AddressElement.buttonDiv, "remove");
                    buttonRemove.bindIcon("delete");
                    buttonRemove.button.onclick = function(){
                      AddressHelper.remove(data.AddressID);
                      this.draw();
                    }.bind(this);
                    getHorizontalLine(this.listElement);
      }
    }
  }
  
  class drawAddressElement{
    constructor(parent, data, index){
      this.data   = data;
      this.id     = "ListElement_" + index + "_";
      this.parent = parent;
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
      this.mainElement.Class("AddressListElement");
      this.draw();
    }
    draw(){
      let informationDiv = new SPLINT.DOMElement(this.id + "addressListElementInformation_", "div", this.mainElement);
          informationDiv.Class("information");
          let row1 = new SPLINT.DOMElement(this.id + "addressListElement_" + "row1", "div", informationDiv);
              if(this.data.Salutation != undefined && this.data.Salutation != ""){
                let salutation = new SPLINT.DOMElement.SpanDiv(row1, "salutation_", getSalutationForCode(this.data.Salutation));
              }
              if(this.data.Title != undefined){
                  let title = new SPLINT.DOMElement.SpanDiv(row1, "title_", this.data.Title);
              }
                
              let firstName = new SPLINT.DOMElement.SpanDiv(row1, "firstName_", this.data.FirstName);
              let lastName = new SPLINT.DOMElement.SpanDiv(row1, "lastName_", this.data.LastName);
  
          let row2 = new SPLINT.DOMElement(this.id + "addressListElement_" + "row2", "div", informationDiv);
              let street = new SPLINT.DOMElement.SpanDiv(row2, "street_", this.data.Street);
              let housenumber = new SPLINT.DOMElement.SpanDiv(row2, "housenumber_", this.data.HouseNumber);
  
          let row3 = new SPLINT.DOMElement(this.id + "addressListElement_" + "row3", "div", informationDiv);
              let city = new SPLINT.DOMElement.SpanDiv(row3, "city_", this.data.City);
              let postcode = new SPLINT.DOMElement.SpanDiv(row3, "postcode_", this.data.Postcode);
  
          let row4 = new SPLINT.DOMElement(this.id + "addressListElement_" + "row4", "div", informationDiv);
              let country = new SPLINT.DOMElement.SpanDiv(row4, "country_", getCountryForCode(this.data.Country));
  
      let contactTable = new Table2D(this.mainElement, "contactTable_" + this.id + "_", 2, 2);
          if(this.data.Email != undefined){
            new SPLINT.DOMElement.SpanDiv(contactTable.getData(0, 0), "", "Emailadresse:");
            new SPLINT.DOMElement.SpanDiv(contactTable.getData(0, 1), "", this.data.Email);
          }
          if(this.data.Phone != undefined){
            new SPLINT.DOMElement.SpanDiv(contactTable.getData(1, 0), "", "Telefonnummer:");
            new SPLINT.DOMElement.SpanDiv(contactTable.getData(1, 1), "", this.data.Phone);
          }
  
      this.buttonDiv = new SPLINT.DOMElement(this.id + "_buttonDiv_", "div", this.mainElement);
      this.buttonDiv.Class("buttonsDiv");
    }
  }

  class addressInput_C {
    constructor(parent, name){
      this.parent = parent;
      this.name = name;
      this.id = name + "_addressInput_";
      this.data = [];
      this.onsubmit = function(){};
      this.expanded = true;
      this.drawSubmit = true;
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
      this.mainElement.Class("AddressInput");
    //   this.draw();
    }
    draw(){
      this.mainElement.innerHTML = "";
      // this.input_name = new InputDiv(this.mainElement, "name", "Name der Addresse");
  
      this.dropdown_salutation = new n_SelectInput(this.mainElement, "salutation", "Anrede");
      this.dropdown_salutation.Class("dropdown_salutation");
      this.dropdown_salutation.addEntry("Mr", "Herr");
      this.dropdown_salutation.addEntry("Mrs", "Frau");
      this.dropdown_salutation.addEntry("Mx", "Divers");
  
      this.title_input = new n_InputDiv(this.mainElement, "title", "Titel");
      this.title_input.Class("title_input");
  
      this.firstName_input = new n_InputDiv(this.mainElement, "firstName", "Vorname");
      this.firstName_input.Class("firstName_input");
  
      this.lastName_input = new n_InputDiv(this.mainElement, "lastName", "Nachname");
      this.lastName_input.Class("lastName_input");
      
      this.postcode_input = new n_InputDiv(this.mainElement, "postcode", "Postleitzahl");
      this.postcode_input.Class("postcode_input");
      
      this.city_input = new n_InputDiv(this.mainElement, "city", "Stadt");
      this.city_input.Class("city_input");
  
      console.trace("draw")
      this.dropdown_country = new n_SelectInput(this.mainElement, "country", "Land");
      this.dropdown_country.Class("dropdown_country");
      this.dropdown_country.addEntry("DE", "Deutschland");
      this.dropdown_country.addEntry("AU", "Österreich");
  
      this.street_input = new n_InputDiv(this.mainElement, "street", "Straße");
      this.street_input.Class("street_input");
  
      this.housenumber_input = new n_InputDiv(this.mainElement, "housenumber", "Hausnummer");
      this.housenumber_input.Class("housenumber_input");
  
      if(this.expanded){
        this.email_input = new n_InputDiv(this.mainElement, "email", "Emailadresse");
    
        this.phone_input = new n_InputDiv(this.mainElement, "phone", "Telefonnummer");
      }
      if(this.drawSubmit){
        this.buttonsDiv = new SPLINT.DOMElement(this.id + "buttons", "div", this.mainElement);
          let button_save = new S_Button(this.buttonsDiv, "save", "speichern");
              button_save.button.onclick = function(){
                this.onsubmit(this.getValues());
              }.bind(this);
  
      }
    }
    setValues(data){
      if(data != null){
        this.title_input.value = data.Title;
        this.dropdown_salutation.value = data.Salutation;
        this.firstName_input.value = data.FirstName;
        this.lastName_input.value = data.LastName;
        this.postcode_input.value = data.Postcode;
        this.city_input.value = data.City;
        this.dropdown_country.value = data.Country;
        this.street_input.value = data.Street;
        this.housenumber_input.value = data.HouseNumber;
        if(this.expanded){
          this.email_input.value = data.Email;
          this.phone_input.value = data.Phone;
        }
      }
    }
    getValues(){
      let obj = new Object();
          obj.Title       = this.title_input.value;
          obj.FirstName   = this.firstName_input.value;
          obj.LastName    = this.lastName_input.value;
          obj.Street      = this.street_input.value;
          obj.Country     = this.dropdown_country.value;
          obj.City        = this.city_input.value;
          obj.Postcode    = this.postcode_input.value;
          obj.HouseNumber = this.housenumber_input.value;
          obj.Salutation  = this.dropdown_salutation.value;
          if(this.expanded){
            obj.Email       = this.email_input.value;
            obj.Phone       = this.phone_input.value;
          } else {
            obj.Email = "";
            obj.Phone = "";
          }
      return obj;
    }
  }
  

  // class AddressObject {
  //   constructor(){
  //     this.AddressID    = "";
  //     this.AddressName  = "";
  //     this.Country      = "DE";
  //     this.City         = "";
  //     this.Postcode     = "";
  //     this.Street       = "";
  //     this.HouseNumber  = "";
  //     this.FirstName    = "";
  //     this.LastName     = "";
  //     this.Title        = "";
  //     this.Email        = "";
  //     this.Phone        = "";
  //     this.Salutation   = "";
  //     return this;
  //   }
  //   static getTemplate(){
  //     let inst = new AddressObject();
  //     return inst.get();
  //   }
  //   get(){
  //     let Storage = new Object();
  //         Storage.AddressID   = this.AddressID;
  //         Storage.AddressName = this.AddressName;
  //         Storage.Country     = this.Country;
  //         Storage.City        = this.City;
  //         Storage.Postcode    = this.Postcode;
  //         Storage.Street      = this.Street;
  //         Storage.HouseNumber = this.HouseNumber;
  //         Storage.FirstName   = this.FirstName;
  //         Storage.LastName    = this.LastName;
  //         Storage.Title       = this.Title;
  //         Storage.Phone       = this.Phone;
  //         Storage.Email       = this.Email;
  //         Storage.Salutation  = this.Salutation;
  //     return Storage;
  //   }
  // }

  function getCountryForCode(code){
    switch(code){
      case 'AU' : return "Österreich"; break;
      case 'DE' : return "Deutschland"; break;
    }
  }
  
  function getSalutationForCode(code){
    switch(code){
      case 'Mr' : return "Herr"; break;
      case 'Mx' : return ""; break;
      case 'Mrs' : return "Frau"; break;
    }
  }


class AddressHelper {
    static GET = "GET";
    static ADD = "ADD";
    static REMOVE = "REMOVE";
    static EDIT = "EDIT";
  
    static PATH = "http//localhost/fd/resources/php/userdata/adress/addressAccess.php";
    static get(){
      let data = CallPHP_S.getCallObject(AddressHelper.GET);
      return CallPHP_S.call(AddressHelper.PATH, data);
    }
    static add(address){
      let data = CallPHP_S.getCallObject(AddressHelper.ADD);
          data.address = address;
      return CallPHP_S.call(AddressHelper.PATH, data);
    }
    static edit(){
      let data = CallPHP_S.getCallObject(AddressHelper.EDIT);
          data.address = address;
      return CallPHP_S.call(AddressHelper.PATH, data);
    }
    static remove(addressID){
      let data = CallPHP_S.getCallObject(AddressHelper.REMOVE);
          data.AddressID = addressID;
      return CallPHP_S.call(AddressHelper.PATH, data);
    }
  }
  
  class AddressObject {
    constructor(){
      this.AddressID    = "a";
      this.AddressName  = "a";
      this.Country      = "DE";
      this.City         = "a";
      this.Postcode     = "a";
      this.Street       = "a";
      this.HouseNumber  = "a";
      this.FirstName    = "a";
      this.LastName     = "a";
      this.Title        = "a";
      this.Email        = "Marius006@gmx.de";
      this.Phone        = "a";
      this.Salutation   = "";
      return this;
    }
    static getTemplate(){
      let inst = new AddressObject();
      return inst.get();
    }
    get(){
      let Storage = new Object();
          Storage.AddressID   = this.AddressID;
          Storage.AddressName = this.AddressName;
          Storage.Country     = this.Country;
          Storage.City        = this.City;
          Storage.Postcode    = this.Postcode;
          Storage.Street      = this.Street;
          Storage.HouseNumber = this.HouseNumber;
          Storage.FirstName   = this.FirstName;
          Storage.LastName    = this.LastName;
          Storage.Title       = this.Title;
          Storage.Phone       = this.Phone;
          Storage.Email       = this.Email;
          Storage.Salutation  = this.Salutation;
      return Storage;
    }
  }
  
  function addressInput(parent, name, data = null){
    let main = getElement("DrawNewAddressMenu_" + name, "div", parent.id);
        main.Class("AddressInput");
    this.div = main;
  
    this.ELE_AddressName  = document.getElementById("AddressName_" + name);
    this.ELE_Title        = document.getElementById("Title_" + name);
    this.ELE_Email        = document.getElementById("Email_" + name);
    this.ButtonsDivID     = main.id + "_buttonsDiv_" + name;
    let submit_func = function(){};
    let return_func = function(){};
    this.draw = function(extend = false){
      let AddressName_inputDiv  = new SPLINT.DOMElement.InputDiv(main, "AddressName_" + name, "Name der Adresse");
          AddressName_inputDiv.div.setAttribute("name", "name");
  
      let Salutation_dropDownInput = new dropdownInput(main, "Salutation_" + name, "Anrede");
          Salutation_dropDownInput.addOption("Mr", "Herr");
          Salutation_dropDownInput.addOption("Mrs", "Frau");
          Salutation_dropDownInput.addOption("Mx", "Divers");
  
      let Title_inputDiv        = new SPLINT.DOMElement.InputDiv(main, "Title_" + name, "Titel");
          Title_inputDiv.div.setAttribute("name", "title");
  
      let FirstName_inputDiv    = new SPLINT.DOMElement.InputDiv(main, "FirstName_" + name, "Vorname");
          FirstName_inputDiv.div.setAttribute("name", "firstName");
  
      let LastName_inputDiv     = new SPLINT.DOMElement.InputDiv(main, "LastName_" + name, "Nachname");
          LastName_inputDiv.div.setAttribute("name", "lastName");
  
      let Postcode_inputDiv     = new SPLINT.DOMElement.InputDiv(main, "Postcode_" + name, "Postleizahl");
          Postcode_inputDiv.div.setAttribute("name", "postcode");
  
      let City_inputDiv         = new SPLINT.DOMElement.InputDiv(main, "City_" + name, "Stadt");
          City_inputDiv.div.setAttribute("name", "city");
  
      let Country_dropDownInput = new dropdownInput(main, "Country_" + name, "Land");
          Country_dropDownInput.div.setAttribute("name", "country");
          Country_dropDownInput.addOption("DE", "Deutschland");
          Country_dropDownInput.addOption("AU", "Öserreich");
          Country_dropDownInput.setValue("DE");
  
      let Street_inputDiv       = new SPLINT.DOMElement.InputDiv(main, "Street_" + name, "Straße");
          Street_inputDiv.div.setAttribute("name", "street");
  
      let Housenumber_inputDiv  = new SPLINT.DOMElement.InputDiv(main, "Housenumber_" + name, "Hausnummer");
          Housenumber_inputDiv.div.setAttribute("name", "housenumber");
  
      let Email_inputDiv;
      let Phone_inputDiv;
      if(extend){
        Email_inputDiv = new SPLINT.DOMElement.InputDiv(main, "Email_" + name, "Emailadresse");
        Email_inputDiv.div.setAttribute("name", "email");
        
        Phone_inputDiv = new SPLINT.DOMElement.InputDiv(main, "Phone_" + name, "Telefonnummer");
        Phone_inputDiv.div.setAttribute("name", "phone");
      }
      
      if(data != null){
        AddressName_inputDiv.value = data.AddressName;
        Title_inputDiv.value = data.Title;
        FirstName_inputDiv.value = data.FirstName;
        LastName_inputDiv.value = data.LastName;
        Postcode_inputDiv.value = data.Postcode;
        City_inputDiv.value = data.City;
        Country_dropDownInput.value = data.Country;
        Street_inputDiv.value = data.Street;
        Housenumber_inputDiv.value = data.HouseNumber;
        if(extend){
          Email_inputDiv.value = data.Email;
          Phone_inputDiv.value = data.Phone;
        }
      }
      setData();
      let buttonsDiv = getElement(main.id + "_buttonsDiv_" + name, "div", parent.id);
          let button_submit = getButton(buttonsDiv, "NewAddressButtonSubmit_" + name, "bestätigen");
          button_submit.setAttribute("name", "submit");
          button_submit.onclick = function(){
            let flag = true;
            if(Salutation_dropDownInput.getValue() == ""){
              Salutation_dropDownInput.invalid();
              flag = false;
            }
            if(FirstName_inputDiv.input.value == ""){
              FirstName_inputDiv.invalid();
              flag = false;
            }
            if(LastName_inputDiv.input.value == ""){
              LastName_inputDiv.invalid();
              flag = false;
            }
            if(Country_dropDownInput.getValue() == ""){
              Country_dropDownInput.invalid();
              flag = false;
            }
            if(City_inputDiv.input.value == ""){
              City_inputDiv.invalid();
              flag = false;
            }
            if(Postcode_inputDiv.input.value == ""){
              Postcode_inputDiv.invalid();
              flag = false;
            }
            if(Street_inputDiv.input.value == ""){
              Street_inputDiv.invalid();
              flag = false;
            }
            if(Housenumber_inputDiv.input.value == ""){
              Housenumber_inputDiv.invalid();
              flag = false;
            } 
            if(extend){
              if(Email_inputDiv.input.value == ""){
                Email_inputDiv.invalid();
                flag = false;
              } else if(!EMail.isReal(Email_inputDiv.input.value)){
                Email_inputDiv.invalid("Bitte gib eine gültige Emailadresse ein");
                flag = false;
              }
            }
            if(flag){
              let obj = new Object();
                  obj.AddressName = AddressName_inputDiv.getValue();
                  obj.Title       = Title_inputDiv.getValue();
                  obj.FirstName   = FirstName_inputDiv.getValue();
                  obj.LastName    = LastName_inputDiv.getValue();
                  obj.Street      = Street_inputDiv.getValue();
                  obj.City        = City_inputDiv.getValue();
                  obj.Country     = Country_dropDownInput.getValue();
                  obj.HouseNumber = Housenumber_inputDiv.getValue();
                  obj.Postcode    = Postcode_inputDiv.getValue();
                  obj.Salutation  = Salutation_dropDownInput.getValue();
                  if(extend){
                    obj.Email     = Email_inputDiv.getValue();
                    obj.Phone     = Phone_inputDiv.getValue(); 
                  }
              submit_func(obj);
            }
          }
  
          let buttonReturn = getButton(buttonsDiv, "NewAddressButtonReturn_" + name, "abbrechen");
              buttonReturn.onclick = function(){
                return_func();
              }
    }
    this.setData = function(obj){
      data = obj;
    }
    function setData(){
    }
    this.onreturn = function(func){
      return_func = func;
    }
    this.onsubmit = function(func){
      submit_func = func;
    }
    this.removeInput = function(name){
      document.getElementsByName(name)[0].remove();
    }
  }
  
  function getCountryForCode(code){
    switch(code){
      case 'AU' : return "Österreich"; break;
      case 'DE' : return "Deutschland"; break;
    }
  }
  
  function getSalutationForCode(code){
    switch(code){
      case 'Mr' : return "Herr"; break;
      case 'Mx' : return ""; break;
      case 'Mrs' : return "Frau"; break;
    }
  }
  
  
  function addAddress(AddressObject){
    let data = CallPHPObject(AddressHelper.ADD);
        data.Storage = AddressObject;
    CallPHP(AddressHelper.PATH, data);
  }
  
  function getAddress(AddressID){
    let data = CallPHPObject(AddressHelper.GET);
        data.AddressID = AddressID;
    return CallPHP(AddressHelper.PATH, data).toObject();
  }
  
  function removeAddress(AddressID){
    let data = CallPHPObject(AddressHelper.REMOVE);
        data.AddressID = AddressID;
    CallPHP(AddressHelper.PATH, data);
  }
  
  function editAddress(AddressObject){
    let data = CallPHPObject(AddressHelper.EDIT);
        data.Storage = AddressObject;
    CallPHP(AddressHelper.PATH, data);
  }
  
  

class component_Template {
    constructor(id, parent = document.body) {
        this.id     = id + "_";
        this.parent = parent;
        this.mainElement = new SPLINT.DOMElement(id + "main", 'div', parent);
    }
}

class S_BufferStorage {
    #KEY;
    #Buffer = [];
    constructor(name, encrypted = false, Key = null){
        this.name = name;
        this.encrypted = encrypted;
        this.KEY = Key;
    }
    set KEY(v){
        this.#KEY = v;
    }
    get KEY(){}
    setFromObject(arr){
        let value   = arr[0];
        let key     = this.name + "_" + arr[1];
        if(this.encrypted){
            value = S_encryption.simple.encrypt(this.#KEY, value)
        }
        let o = {key: key, value: value};
        this.#Buffer.push(o);
        return o;
    }
    set(key, value){
        if(this.encrypted){
            value = S_encryption.simple.encrypt(this.#KEY, value)
        }
        let o = {key: this.name + "_" + key, value: value};
        this.#Buffer.push(o);
        return o;
    }
    get(key, expanded = false){
        let e = this.#get(this.name + "_" + key);
        if(e == null){
            return null;
        }
        let value = e.value;
        if(this.encrypted){
            value =  S_encryption.simple.decrypt(this.#KEY, value);
        }
        if(expanded){
            return {value: value, key: key};
        }
        return value;
    }
    #get(key){
        for(const e of this.#Buffer){
            if(e.key == key){
                return e
            }
        }
        return null;
    }
    getAll(){
        return this.#Buffer;
    }
}

SPLINT.require_now('@SPLINT_ROOT/DataManagement/callPHP/CallPHPManager.js');


// class S_CallPHP_ENCODER {
//     constructor(){
//         this.levels = [];
//         this.actualKey = null;
//     }
//     static is(className, object) {
//         return Object.prototype.toString.call(object) === '[object '+ className +']';
//     }
//     encode(data) {
//         if (!S_CallPHP_ENCODER.is('Object', data) || !Object.keys(data).length) return null;
//         return this.__dataEncoding(data).slice(0, -1);
//     }
//     __dataEncoding(data){
//         let uriPart = '';
//         const levelsSize = this.levels.length;
//         if (levelsSize) {
//           uriPart = this.levels[0];
//           for(let c = 1; c < levelsSize; c++) {
//             uriPart += '[' + this.levels[c] + ']';
//           }
//         }
//         let finalString = '';
//         if (S_CallPHP_ENCODER.is('Object', data)) {
//             const keys = Object.keys(data);
//             const l = keys.length;
//             for(let a = 0; a < l; a++) {
//                 const key = keys[a];
//                 let value = data[key];
//                 this.actualKey = key;
//                 this.levels.push(this.actualKey);
//                 finalString += this.__dataEncoding(value);
//             }
//         } else if (S_CallPHP_ENCODER.is('Array', data)) {
//             if (!this.actualKey) throw new Error("Directly passed array does not work")
//             const aSize = data.length;
//             for (let b = 0; b < aSize; b++) {
//                 let aVal = data[b];
//                 this.levels.push(b);
//                 finalString += this.__dataEncoding(aVal);
//             }
//         } else {
//             finalString += uriPart + '=' + encodeURIComponent(data) + '&';
//         }
//         this.levels.pop();
//         return finalString;
//     }
// }







var asyncProgress = false;
  class CallPHP_S {
    constructor(path, method = null){
      this.path   = path;
      this.method = method;
    }
    call(data, type = "POST", sync = true, callBack = function(){}){
      if(this.method == null && data.METHOD == null){
        console.error("Call Methode fehlt");
        return;
      } 
      if(data.METHOD == null){
        data.METHOD = this.method;
        console.warn("Call Methode nicht neu definiert. Vordefinierte Methode verwendet: " + this.method);
      }
      return this.call(this.path, data, type, sync, callBack);
    }
    static getCallObject(method){
      let callObj = new Object();
          callObj.METHOD = method;
      return callObj;
    }
    static call(path, callObj, type = "POST", sync = true, callBack = function(){}){
      path += "?" + SPLINT.PROJECT_NAME;
      if(!sync){
        // if(asyncProgress){
        //   callBack(null);
        //   return new obj(null);
        // }
        asyncProgress = true;
      }
      let response = $.ajax({
          url     : path,
          type    : type,
          data    : callObj,
          async   : !sync,
          success: function(response){
            asyncProgress = false;
            callBack(response);
          },
          complete: function(){
            asyncProgress = false;
          }
        }).responseText;
        function obj(response){
          this.toObject = function(flag = false){
            if(typeof response == "string"){
              try {
                if(flag){
                  return JSON.parse(response);
                } else {
                  return JSON.parse(response, function(k, v) { 
                    if(!isNaN(v) && typeof v != 'boolean'){
                      return parseInt(v, 10);
                    } 
                    return v;
                  });
                }
              } catch {
                return response;
              }
            }
          }
          this.text   = response;
      }  
      return new obj(response);
    }
  }

  class FileUpload_S {
    static UPLOAD = "UPLOAD";

    constructor(path){
      this.path = path;
      this.data         = new FormData();
    }
    #call(){
      let data = new CallPHP_S.getCallObject(this.UPLOAD);
      return CallPHP_S.call(this.path, data);
    }
    static getFileData(srcElement){
      let element = $('#' + srcElement.id);
      if (typeof element.prop('files')[0] != 'undefined') {
        return element.prop('files')[0];
      } else {
        return false;
      }
    }
    direct(srcElement, type, onsuccess, args = null){
      let file_data = FileUpload_S.getFileData(srcElement);
      
      if(file_data != false){
            this.data.append("METHOD", type);
            this.data.append("file", file_data);
            this.data.append("Storage", args);
            this.onsuccess = onsuccess;
            this.upload();
        return true;
      }
      return false;
    }
    upload(){
      let ajaxData = new Object();
          ajaxData.url          = this.path;
          ajaxData.type         = "POST";
          ajaxData.contentType  = false;
          ajaxData.processData  = false;
          ajaxData.data         = this.data;
          ajaxData.async        = true;
          ajaxData.success      = function(data){
            console.log(this);
            this.onsuccess(data);
          }.bind(this);
      $.ajax(ajaxData);
    }
  }
class Cookie {
    constructor(){

    }
    static isEnabled(){
      let cookieEnabled = navigator.cookieEnabled;
  
      if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) { 
          document.cookie = "testcookie";
          if(document.cookie.indexOf("testcookie") != -1) {
            cookieEnabled = true;
          } else {
            cookieEnabled = false;
          }
      }
      return cookieEnabled;
    }
    static set(name, value, exdays = 1){
      let date = new Date();
          date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
      let expires = "expires="+ date.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";" + "path=/;";
    }
    static get(name = null){
      let cookies = document.cookie.split("; ");
      let response = new Object();
          for(const cookie of cookies){
            let array = cookie.split('=');
                response[array[0]] = S_JSON.parseIf(array[1]);
          }
          if(name != null){
            return response[name];
          }
      return response;
    }
    static showAll(){
      Cookie.set("test2", "123456789");
      console.log(Cookie.get());
    }
  }


class S_DataStorage extends SPLINT.CallPHP.Manager {
    static PATH = SPLINT.PATHS.Access;
    static edit(path, content = ""){
        let call = this.callPHP("EDIT");
            call.data.path    = path;
            call.data.content = content;
        return call.send();
    }
    static editAny(path, content = ""){
        let call = this.callPHP("EDIT.ANY");
            call.data.path    = path;
            call.data.content = content;
        return call.send();
    }
    static get(path){
        let call = this.callPHP("GET");
            call.data.path = path;
        return call.send();
    }
    static AccessSplint(method, obj){
        let call = this.callPHP(method);
            call.data = obj;
        return call.send();
    }
}


class IndexedDB {
    constructor(DBName){
      this.DBName = DBName;
      this.StorageName = "test12";
      this.db = null;
      this.state = [
        {
          title: "Einkaufen gehen2",
          person: "Max2",
          message: "Für das Wochenende einkaufen gehen2",
        },
        {
          title: "Wohnung putzen",
          person: "Anna",
          message: "Küche und Kinderzimmer müssen aufgeräumt werden",
        },
        {
          title: "Müll raus bringen",
          person: "Max",
          message: "Jeden zweiten Tag muss mal der ganze Müll raus",
        },
      ];
      this.#open();
      this.#eventHandler();
    }
    addStorage(StorageName){
      this.db = null;
      this.request = null;
      this.StorageName = StorageName;
      this.#open(4);
      this.#eventHandler();
    }
    addDataSet(){
      this.#newDataSet();
    }
    removeDataSet(){

    }
    #open(version){
      this.request = window.indexedDB.open(this.DBName, version);
      console.log(this.request);
    }
    #eventHandler(){
      this.request.addEventListener("upgradeneeded", this.#upgradeNeeded.bind(this));
      this.request.addEventListener("success", this.#success.bind(this));
      this.request.addEventListener("error", this.#error.bind(this));
    }
      #success(event){
        console.log("Success");
        this.db = event.target.result;
      
        if (typeof this.state !== "undefined") {
          let notes = this.#transaction(this.StorageName, "readwrite", function() {
            // viewNoteList();
          });
          let request = notes.getAll();
          request.addEventListener("success", function(event) {
            console.log("success2");
            if (event.target.result.length === 0) {
              this.state.forEach((data) => {
                data.date = Date.now();
                let addRequest = notes.add(data);
                addRequest.addEventListener("success", (event) => {
                  console.log("added data");
                  
                });
              });
            }
          }.bind(this));
        } else {
        }
        this.db.close();
      }
      #error(event){
        console.log(event.target.error);
      }
      #upgradeNeeded(event){
        console.log(event.oldVersion + " to " + event.newVersion);
        this.db = event.target.result;

        console.log(this.db.objectStoreNames);
        this.#newStorage();
        //db.createObjectStore("test1234");
        if (this.db.objectStoreNames.contains("test1234")) {
          this.db.deleteObjectStore("test1234");
        }
      }
    #transaction(storeName, mode, callback = null) {
      let transaction = this.db.transaction(storeName, mode);
      transaction.addEventListener("error", (event) => {
        console.log(event.target.error);
      });
      transaction.addEventListener("complete", (event) => {
        console.log(event)
        console.log("Transaction Complete");
        if (typeof callback === "function") callback();
      });
    
      return transaction.objectStore(storeName);
    }
    getAllStorages(){

    }
    getStorage(){

    }
    #newDataSet(){
      
        let newNote = {
          title: "sdafasdf",
          person: "sadfasdfs",
          message: "sadfasdf",
          date: Date.now(),
        };
      
        let notes = this.#transaction(this.StorageName, "readwrite");
      
        let request = notes.add(newNote);
        request.addEventListener("success", (event) => {
          console.log(event.target.result);
          // document.querySelector("#myForm").reset();
          // viewNoteList();
        });
        request.addEventListener("error", (event) => {
          console.log(event.target.error);
        });
    }
    removeStorage(){

    }
    updateStorage(){

    }
    #newStorage(){
      if (!this.db.objectStoreNames.contains(this.StorageName)) {
        let objectStore = this.db.createObjectStore(this.StorageName, {
          keyPath: "id",
          autoIncrement: true,
        });
    
        objectStore.createIndex("titleIDX", "title", { unique: false });
        objectStore.createIndex("personIDX", "person", { unique: false });
        objectStore.createIndex("dateIDX", "date", { unique: false });
      }
    }
  }
SPLINT.require_now('@SPLINT_ROOT/DataManagement/callPHP/CallPHP.js');
class S_SessionsPHP {
    static GET            = "GET_DATA";
    static GET_ALL        = "GET_ALL";
    static GET_ALL_JS     = "GET_ALL_JS";
    static SET            = "SET_DATA";
    static REMOVE         = "REMOVE_DATA";
    static USER_ID        = "USER_ID";
    static GUEST          = "GUEST";
    static PROJECT_NAME   = "PROJECT_NAME";
    static PROJECT_ID     = "PROJECT_ID";
    static CONVERTER_MODE = "CONVERTER_MODE";
      static MODE_EDIT_PROJECT  = "EDIT_PROJECT";
      static MODE_EDIT_CART     = "EDIT_CART";
    
  
    static PATH = location.protocol + "//" + location.host + "/Splint/php/DataManagement/sessions/sessionsAccess.php";
    // static MANAGER;
    static {
        this.MANAGER = new SPLINT.CallPHP.Manager(S_SessionsPHP.PATH);
    }
    constructor(){
    }

    static async set(name, value, js = true){
      let call = this.MANAGER.call(this.SET);
          call.data.value    = value;
          if(js){
            call.data.name   = "jsGen_" + name;
          } else {
            call.data.name   = name;
          }
          return call.send();//CallPHP_S.call(SPLINT.SessionsPHP.PATH, data);
    }
    static async getSessionID(){
      let call = this.MANAGER.call("GET_SESSION_ID");
      return call.send();
    }
    static async get(name, js = true){
      let call = this.MANAGER.call(this.GET)//.getCallObject(SPLINT.SessionsPHP.GET);
          if(js){
            call.data.name = "jsGen_" + name;
          } else {
            call.data.name = name;
          }
      return call.send();//CallPHP_S.call(SPLINT.SessionsPHP.PATH, data).toObject(true);
    }
    static async remove(name, js = true){
      let call = this.MANAGER.call(this.REMOVE);
      if(js){
        call.data.name   = "jsGen_" + name;
      } else {
        call.data.name   = name;
      }
      return call.send();//CallPHP_S.call(SPLINT.SessionsPHP.PATH, data);
    }
    static async getAllJS(){
        let call = this.MANAGER.call(this.GET_ALL_JS);
        return call.send();
      let data = CallPHP_S.getCallObject(SPLINT.SessionsPHP.GET_ALL_JS);
      return CallPHP_S.call(SPLINT.SessionsPHP.PATH, data).toObject(true);
    }
    static async getAll(){
        let call = this.MANAGER.call(this.GET_ALL);
        return call.send();
      let data = CallPHP_S.getCallObject(SPLINT.SessionsPHP.GET_ALL);
      return CallPHP_S.call(SPLINT.SessionsPHP.PATH, data).toObject(true);
    }
    static async showAll(){
        return new Promise(async function(resolve){
            let s = await SPLINT.SessionsPHP.getAll()
            console.log(s);
            resolve(s);
            return s;
        });
    }
  }

class S_sessionStorage {
    static edit(key, value){
        if(typeof value == 'object' || value instanceof Object){
            window.sessionStorage.setItem(key, JSON.stringify(value));
        } else {
            window.sessionStorage.setItem(key, value)
        }
    }
    static get(key, expanded = false){
        if(expanded){
            let obj = new Object();
            obj.key = key;
            obj.data = SPLINT.Tools.parse.toJSON(window.sessionStorage.getItem(key));
            return obj;
        }
        return SPLINT.Tools.parse.toJSON(window.sessionStorage.getItem(key));
    }
    static getByIndex(index, expanded = false){
        if(expanded){
            let obj = new Object();
            obj.key = window.sessionStorage.key(index);
            obj.data = this.get(obj.key);
            obj.index = index;
            return obj;
        }
        return this.get(window.sessionStorage.key(index));
    }
    static remove(key){
        window.sessionStorage.removeItem(key)
    }
    static clear(){
        window.sessionStorage.clear();
    }
    static get length(){
        return window.sessionStorage.length;
    }
    static showAll(){
        for(let i = 0; i < this.length; i++){
            let element = this.getByIndex(i, true);
            console.dir(element)
        }
    }
}
SPLINT.Events.onInitComplete = function(){

S_sessionStorage.showAll();
}






class S_MappedObject {
    #name;
    #value;
    #attributes = [];
    #map = [];
    #HTMLElement;
    constructor(parentMap = "BASE", name = "BASE", value = []){
        if(typeof parentMap == 'object'){
            this.#map   = [...parentMap];
        } else {
            this.#map.push(parentMap);
        }
        this.value  = value;
        if(name != undefined){
            this.name   = name;
        }
    }
    set HTMLElement(v){
        this.#HTMLElement = v;
    }
    get HTMLElement(){
        if(this.#HTMLElement == undefined){
            this.#HTMLElement = new SPLINT.DOMElement("ST_BASE", "div", document.body);
        }
        return this.#HTMLElement;
    }
    set name(v){
        this.#name = v;
        if(this.#map[this.#map.length -1] != v){
            this.#map.push(v);
        }
    }
    get name(){
        return this.#name;
    }
    set value(v){
        this.#value = v;
    }
    get value(){
        return this.#value;
    }
    get map(){
        return this.#map;
    }
    get attributes(){
        return this.#attributes;
    }
    getByMap(mapIn){
        let result = false;
        let map = [...mapIn];
            map.shift();
            function f(x, map){
                for(const v of x){
                    if(v.name == map[0]){
                        map.shift();
                        if(map.length > 0){
                            f(v.value, map);
                        } else {
                            result = v;
                            break;
                        }
                    }
                }
            }
            f(this.value, map)
            return result;
    }
    bind(name, value, HTMLElement){
        if(typeof value != 'object'){
            this.#attributes.push(value);
            return false;
        }
        let obj = new S_MappedObject(this.map, name, value);
            obj.HTMLElement = HTMLElement;
        this.value.push(obj);
        return obj;
    }
}

class S_ObjectMapper {
    #objectOut;
    constructor(object){
        this.objectIn = object;
        this.#objectOut = new S_MappedObject();
        this.callback = function(l){};
    }
    get(){
        this.#generateMap(this.objectIn, undefined, this.callback)
        return this.#objectOut;
    }
    #generateMap(objIn, lastOBJ){
        if(lastOBJ == undefined){
            lastOBJ = new S_MappedObject();
            this.#objectOut = lastOBJ;
        }
        let keys = Object.keys(objIn);
        for(const key of keys) {
            if(objIn.hasOwnProperty(key)) {
                if(typeof objIn[key] == 'object'){
                    let element = new SPLINT.DOMElement("ST_" + lastOBJ.map.join(".") + "." + key, "div", lastOBJ.HTMLElement)
                    element.setAttribute("layer", lastOBJ.map.length);
                    element.setAttribute("index", keys.indexOf(key));
                    let l = lastOBJ.bind(key, [objIn[key]], element);
                    this.callback(l);
                    this.#generateMap(objIn[key], l);
                } else {
                    let element = new SPLINT.DOMElement("ST_" + lastOBJ.map.join(".") + "." + key, "div", lastOBJ.HTMLElement)
                        element.setAttribute("layer", lastOBJ.map.length);
                        element.setAttribute("index", keys.indexOf(key));
                    lastOBJ.bind(key, objIn[key], element)
                }
            }
        }
    }
    static fromObject(objIn, callback = function(MappedObj){}){
        let c = new S_ObjectMapper(objIn);
            c.callback = callback;
        return c.get();
    }
}

class S_ObjectMapParser {
    #objOut;
    #mappedObj;
    constructor(mappedObject){
        this.#objOut = new SPLINT.autoObject();
        this.#mappedObj = mappedObject;
    }
    get(){
        this.#generate(this.#mappedObj);
        console.log(this.#objOut)
        return this.#objOut;
    }
    #generate(mappedObjIn){
        for(const entry of mappedObjIn.value){
            if(typeof entry == 'object'){
                this.#objOut[entry.map] = new SPLINT.autoObject();
                console.log(entry);
                if (Symbol.iterator in Object(entry.value)) {
                    this.#generate(entry);
                }
            }
        }
    }
}
class S_Button {
    static STYLE_DEFAULT  = "button_Default";
    static STYLE_STANDARD = "button_General";
    static STYLE_NONE     = "NONE";

    constructor(parent, name, value = ""){
      if(typeof parent == 'object'){
        this.parent = parent;
      } else if(typeof parent == 'string') {
        this.parent = document.getElementById(parent);
      } else {
        console.error("wrong parentElement <new Button>");
      }
      this.name   = name;
      this._value  = value;
      this.onclick = function(){};
      this.draw();
    }
    set value(v){
        this._value = v;
        this.span.innerHTML = v;
        this.span.classList.remove("material-symbols-outlined");
    }
    get value(){
        return this._value;
    }
    setTooltip(value, direction){
        this.button.setTooltip(value, direction);
    }
    Class(className){
        this.button.Class(className);
    }
    /**
     * Set the basic styling
     * @param {SPLINT_constants.BUTTON_STYLES} styleConst
     */
    set basicStyling(styleConst){
        for(const e of Object.values(S_constants.BUTTON_STYLES)){
            this.button.classList.remove(e);
        }
        if(styleConst != null){
            this.button.classList.add(styleConst);
        }
    }
    setStyleTemplate(type){
      if(type == this.STYLE_NONE){
        this.button.classList.remove(this.STYLE_STANDARD);
        this.button.classList.remove(this.STYLE_DEFAULT);
        return;
      }
      switch(type){
        case S_Button.STYLE_DEFAULT : this.button.classList.remove(S_Button.STYLE_STANDARD); break;
        case S_Button.STYLE_STANDARD : this.button.classList.remove(S_Button.STYLE_DEFAULT); break;
        case S_Button.STYLE_NONE : this.button.classList.remove(S_Button.STYLE_DEFAULT); this.button.classList.remove(S_Button.STYLE_STANDARD); break;
      }
      this.button.classList.add(type);
    }
    setStyleTemplate(type){
      if(type == this.STYLE_NONE){
        this.button.classList.remove(this.STYLE_STANDARD);
        this.button.classList.remove(this.STYLE_DEFAULT);
        return;
      }
      switch(type){
        case S_Button.STYLE_DEFAULT : this.button.classList.remove(S_Button.STYLE_STANDARD); break;
        case S_Button.STYLE_STANDARD : this.button.classList.remove(S_Button.STYLE_DEFAULT); break;
        case S_Button.STYLE_NONE : this.button.classList.remove(S_Button.STYLE_DEFAULT); this.button.classList.remove(S_Button.STYLE_STANDARD); break;
      }
      this.button.classList.add(type);
    }
    disableStandard(disable = true){
      if(disable){
        this.button.classList.remove("button_General");
      } else {
        this.button.classList.add("button_General");
      }
    }
    draw(){
      this.button = new SPLINT.DOMElement(this.parent.id + "_button_" + this.name, "button", this.parent);
      this.button.Class("button_General");
      this.button.onclick = function(e){ 
        this.onclick(e); 
      }.bind(this);
      
        this.span = new SPLINT.DOMElement(this.parent.id + "_span_" + this.name, "span", this.button);
        this.span.innerHTML = this._value;
    }
    bindDropdown(func){
      this.dropdownDiv = new SPLINT.DOMElement(this.parent.id + "_button_" + this.name + "_dropdown", "div", this.button);
      func(this.dropdownDiv);
      this.dropdownDiv.classList.add("dropdown");
        this.dropdownDiv.style.visibility = "hidden";
      
    }
    toggleDropdown(){
      // this.button.style.pointerEvents = "none";
      this.dropdownDiv.style.visibility = "hidden";
      this.button.state().toggle();
      if(this.button.state().isActive()){
        this.dropdownDiv.style.visibility = "visible";
        window.onmousedown = function(event){
          if(!event.target.path().includes(this.button)){
            this.toggleDropdown();
          }
        }.bind(this);
      } else {
        window.onmousedown = function(){}
        this.dropdownDiv.style.visibility = "hidden";
      }
    }
    click(){
        this.button.click();
    }
    bindIcon(IconName, Class){
      this.span.bindIcon(IconName, Class);
    }
    removeIcon(IconName){
      this.span.removeIcon(IconName);
    }
    setAttribute(name, value){
      this.button.setAttribute(name, value);
    }
    static get Radio(){
      return S_radioButton;
    }
    static get Switch(){
      return S_switchButton;
    }
    static get Toggle(){
      return S_toggleButton;
    }
    static get Toggle2(){
        return nS_ToggleButton;
    }
    static get Choice(){
        return S_ChoiceButton;
    }
  }

class S_ChoiceButton extends S_DOMElement_TEMPLATE {
    buttons = [];
    constructor(parent, name){
        super("S-ButtonChoice", parent, name);
    }
    add(name, value){
        let bt = new SPLINT.DOMElement.Button(this.mainElement, name, value);
            bt.button.addEventListener("click", function(){
                this.focus(bt);
            }.bind(this))
            this.buttons.push(bt);
        return bt;
    }
    focus(button){
        for(const e of this.buttons){
            e.button.state().unsetActive();
            if(e.button.id == button.button.id){
                e.button.state().setActive();
            } else {
            }
        }
    }
}


class FileUploadButton_S extends S_Button {
    constructor(parent, name, accept, type, path2php){
      super(parent, name);
      this.parent = parent;
      this.name   = name;
      this.accept = accept;
      this.type   = type;
      this.path2php   = path2php;
      this.onsuccess = function(data){};
      this.id     = "ImageUpload_" + name;
      this.#draw();
    }
    preventDirect(){
      this.#draw(true);
    }
    get FileData(){
      return this.file_data;
    }
    #draw(preventDirect = false){
      this.input = new SPLINT.DOMElement(this.id + "_input", "input", this.parent);
      this.input.type = "file";
      this.input.accept = this.accept;
      this.input.name = "inputfile";
      this.input.oninput = function(){
            let fileupload = new FileUpload_S(this.path2php);
            if(preventDirect){
              this.file_data = FileUpload_S.getFileData(this.input);
            } else {
              fileupload.direct(this.input, this.type, this.onsuccess);
            }
            // UploadDirect(this.input);
            this.input.clear();
          }.bind(this);
    
      this.button.onclick = function(){
            this.input.click();
          }.bind(this);
    }
  }


class S_radioButton extends S_Button {
    constructor(parent, name){
      super(parent, name);
      this.id   = parent.id + "_radioButton_" + name + "_";
      this.name = name;
      this.parent = parent;
      this.data = [];
      this.lineFlag = true;
      this.preventLines = false;
      this.headline = null;
      this.onChange = function(e){};
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
      this.mainElement.Class("n_RadioButton");
      this.button.remove();
    }
    Class(className){
      this.mainElement.Class(className);
    }
    get dataObj(){
      function obj(instance){
        this.add = function(id, name, dataIn){
          let data = new Object();
              data.id   = id;
              data.name = name;
              data.data = dataIn;
          instance.data.push(data);
        }
      }
      return new obj(this);
    }
    get Value(){
      return $(`input[name="${CSS.escape(this.name)}"]:checked`).val();
    }
    get headline_ele(){
      return this.headline;
    }
    setValue(value){
      if(value != null && value != false){
        $(`input[name="${CSS.escape(this.name)}"]`).filter("[value='" + value + "']").prop('checked', true);
        $(`div[name="${CSS.escape(this.name)}"]`).filter("[value='" + value + "']").attr('state', 'active');
      }
    }
    Headline(str){
      this.headline = str;
    }
    drawRadio(){
      if(this.headline != null){
        this.headline = new spanDiv(this.mainElement, "headline", this.headline);
        this.headline.div.Class("radio_headline");
      }
      let radioDiv = new SPLINT.DOMElement(this.id + "_RadioDiv", "div", this.mainElement);
          radioDiv.Class("inner");
      for(let i = 0; i < this.data.length; i++){
        if(this.lineFlag){
          new SPLINT.DOMElement.HorizontalLine(radioDiv);
        } else {
          this.lineFlag = true;
        }
        let data = this.data[i];
        let inputDiv = new SPLINT.DOMElement(this.id + "inputDiv_" + i, "div", radioDiv);
            inputDiv.onclick = function(e){
              input.click();
              e.stopPropagation();
            }
            let inputBody = new SPLINT.DOMElement(this.id + "inputBody_" + i, "div", inputDiv);
                inputBody.Class("inputBody");
                let input = new SPLINT.DOMElement(this.id + "input_" + i, "input", inputBody);
                    input.setAttribute("type", "radio");
                    input.setAttribute("name", this.name);
                    input.checked = true;
                    input.value = data.id;
                let inputSpan = new SPLINT.DOMElement(this.id + "input_span_" + i, "span", inputBody);
            let labelDiv = new SPLINT.DOMElement(parent.id + "_radioButtonLabelDiv_" + this.name + "_" + i, "div", inputDiv.id);
                labelDiv.Class("labelDiv");
                let span0 = new spanDiv(labelDiv, "span0", data.name);
                    span0.Class("name").set();
                labelDiv.setAttribute("value", data.id);
                labelDiv.setAttribute("state", "passive");
                labelDiv.setAttribute("name", this.name);
                if(data.data != undefined){
                  let span1 = new spanDiv(labelDiv, "span1", data.data);
                }
            if(data.price != undefined){
              let price = new priceDiv(inputDiv, data.price);
            }
            let displayDiv = new SPLINT.DOMElement(parent.id + "_radioButtonDisplayDiv_" + this.name + "_" + i, "div", labelDiv.id);
                displayDiv.Class("displayDiv");
                displayDiv.setAttribute("name", this.name + "_display");
                displayDiv.setAttribute("value", data.id);

      }
      $(`input[type="radio"][name="${CSS.escape(this.name)}"]`).on('change', function(e) {
        $(`div[name="${CSS.escape(this.name)}"]`).attr('state', 'passive');
        $(`div[name="${CSS.escape(this.name)}"]`).filter("[value='" + e.currentTarget.value + "']").attr('state', 'active');
        // console.log(e);
        this.onChange(e);
      }.bind(this));
    }
    getDisplayDiv(value){
      return $(`div[name="${CSS.escape(this.name + "_display")}"]`).filter("[value='" + value + "']")[0];
    }
  }



class S_switchButton extends S_Button {
    constructor(parent, name, value, extended = false){
      super(parent, name, value);
      this.extended = extended;
      this.parent = parent;
      this.id     = parent.id + "_" + name + "_switchButton_";
      this.onchange   = function(){};
      this.onactive   = function(){};
      this.onpassive  = function(){};
      this.onMouseEnter = function(){};
      this.onMouseLeave = function(){};
      this.drawSwitch();
      this.button.Class("switchButton");
    }  
    Class(className){
      this.button.Class(className);
    }
    disableStandardSwitch(){
      this.button.classList.remove("switchButton");
    }
    setActive(){
      this.button.state().setActive();
      this.onactive();
    }
    unsetActive(){
      this.button.state().unsetActive();
      this.onpassive();
    }
    toggle(){
      if(this.button.state().isActive()){
        this.unsetActive();
      } else {
        this.setActive();
      }
    }
    drawSwitch(){
      this.button.onclick = function(){
        this.toggle();
        this.onchange(this.button.state().get());
      }.bind(this);
      if(this.extended){
        this.button.onmouseenter = function(){
          this.toggle();
          this.onMouseEnter(this.button.state().get());
        }.bind(this);
    
        this.button.onmouseleave = function(){
          this.toggle();
          this.onMouseLeave(this.button.state().get());
        }.bind(this);
      }
    }
  }

class S_toggleButton {
    constructor(parent, name) {
        this.id = "toggleButton_" + name + "_" + parent.id + "_";
        this.name = name;
        this.parent = parent;
        this.elements = [];
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
        this.mainElement.Class("toggleButton");
    }
    get value(){
        for(const element of this.elements){
            if(element.element.button.state().isActive()){
                return element.name;
            }
        }
    }
    addElement(value, name, onclick = function(){}){
        for(const element of this.elements){
            if(element.name == name){
                return;
            }
        }
        let ele = new S_Button(this.mainElement, name, value);
            ele.setStyleTemplate(S_Button.STYLE_NONE);
            ele.onclick = function(){
                ele.button.state().setActive();
                for(const element of this.elements){
                    if(element.name != name){
                        element.element.button.state().unsetActive();
                    }
                }
                onclick();
            }.bind(this);
        let obj = new Object();
            obj.value   = value;
            obj.name    = name;
            obj.element = ele;
        this.elements.push(obj);
    }
    setActive(name){
        for(const element of this.elements){
            if(element.name != name){
                element.element.button.state().unsetActive();
            } else {
                element.element.button.state().setActive();
            }
        }
    }
}

class nS_ToggleButton {
    constructor(parent, name, valueTRUE = "ON", valueFALSE = "OFF"){
        this.parent = parent;
        this.name = name;
        this.valueFALSE = valueFALSE;
        this.valueTRUE  = valueTRUE;
        this.id = "S_ToggleButton_" + name + "_" + parent.id + "__";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("s-ToggleButton_2");
        this.onToggle = function(flag){};
        this.draw();
    }
    #state = false;
    set state(v){
        this.#state = SPLINT.Tools.parse.stringToBool(v);
        if(this.#state == true){
            this.button1.button.state().setActive();
            this.button2.button.state().unsetActive();
        } else {
            this.button2.button.state().setActive();
            this.button1.button.state().unsetActive();
        }
    }
    get state(){
        return this.#state;
    }
    draw(){
        this.button1 = new SPLINT.DOMElement.Button(this.mainElement, this.name + "_1", this.valueTRUE);
        this.button1.Class("btTRUE");
        this.button1.setStyleTemplate(S_Button.STYLE_DEFAULT)
        this.button1.onclick = function(){
            this.#state = true;
            this.button1.button.state().setActive();
            this.button2.button.state().unsetActive();
            this.onToggle(true);

        }.bind(this);
        this.button2 = new SPLINT.DOMElement.Button(this.mainElement, this.name + "_2", this.valueFALSE);
        this.button2.Class("btFALSE");
        this.button2.setStyleTemplate(S_Button.STYLE_DEFAULT)
        this.button2.onclick = function(){
            this.#state = false;
            this.button2.button.state().setActive();
            this.button1.button.state().unsetActive();
            this.onToggle(false);
        }.bind(this);

    }
}
// class radioButton_C extends Button {
//     constructor(parent, name){
//       super(parent, name);
//       this.id   = parent.id + "_radioButton_" + name + "_";
//       this.name = name;
//       this.parent = parent;
//       this.data = [];
//       this.lineFlag = true;
//       this.preventLines = false;
//       this.headline = null;
//       this.onChange = function(e){};
//       this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
//       this.mainElement.Class("RadioButton");
//       this.button.remove();
//     }
//     get dataObj(){
//       function obj(instance){
//         this.add = function(id, name, dataIn){
//           let data = new Object();
//               data.id   = id;
//               data.name = name;
//               data.data = dataIn;
//           instance.data.push(data);
//         }
//       }
//       return new obj(this);
//     }
//     get Value(){
//       return $(`input[name="${CSS.escape(this.name)}"]:checked`).val();
//     }
//     get headline_ele(){
//       return this.headline;
//     }
//     setValue(value){
//       if(value != null && value != false){
//         $(`input[name="${CSS.escape(this.name)}"]`).filter("[value='" + value + "']").prop('checked', true);
//         $(`div[name="${CSS.escape(this.name)}"]`).filter("[value='" + value + "']").attr('state', 'active');
//       }
//     }
//     Headline(str){
//       this.headline = str;
//     }
//     drawRadio(){
//       if(this.headline != null){
//         this.headline = new spanDiv(this.mainElement, "headline", this.headline);
//         this.headline.div.Class("radio_headline");
//       }
//       let radioDiv = new SPLINT.DOMElement(this.id + "_RadioDiv", "div", this.mainElement);
//           radioDiv.Class("inner");
//       for(let i = 0; i < this.data.length; i++){
//         if(this.lineFlag){
//           new HorizontalLine(radioDiv);
//         } else {
//           this.lineFlag = true;
//         }
//         let data = this.data[i];
//         let inputDiv = new SPLINT.DOMElement(this.id + "inputDiv_" + i, "div", radioDiv);
//             inputDiv.onclick = function(e){
//               input.click();
//               e.stopPropagation();
//             }
//             let input = new SPLINT.DOMElement(this.id + "input_" + i, "input", inputDiv);
//                 input.setAttribute("type", "radio");
//                 input.setAttribute("name", this.name);
//                 input.checked = true;
//                 input.value = data.id;
//             let labelDiv = new SPLINT.DOMElement(parent.id + "_radioButtonLabelDiv_" + this.name + "_" + i, "div", inputDiv.id);
//                 let span0 = new spanDiv(labelDiv, "span0", data.name);
//                 labelDiv.setAttribute("value", data.id);
//                 labelDiv.setAttribute("state", "passive");
//                 labelDiv.setAttribute("name", this.name);
//                 if(data.data != undefined){
//                   let span1 = new spanDiv(labelDiv, "span1", data.data);
//                 }
//             if(data.price != undefined){
//               let price = new priceDiv(inputDiv, data.price);
//             }
//             let displayDiv = new SPLINT.DOMElement(parent.id + "_radioButtonDisplayDiv_" + this.name + "_" + i, "div", labelDiv.id);
//                 displayDiv.setAttribute("name", this.name + "_display");
//                 displayDiv.setAttribute("value", data.id);

//       }
//       $(`input[type="radio"][name="${CSS.escape(this.name)}"]`).on('change', function(e) {
//         $(`div[name="${CSS.escape(this.name)}"]`).attr('state', 'passive');
//         $(`div[name="${CSS.escape(this.name)}"]`).filter("[value='" + e.currentTarget.value + "']").attr('state', 'active');
//         // console.log(e);
//         this.onChange(e);
//       }.bind(this));
//     }
//     getDisplayDiv(value){
//       return $(`div[name="${CSS.escape(this.name + "_display")}"]`).filter("[value='" + value + "']")[0];
//     }
//   }


class checkbox_S {
    constructor(parent, name, checked = false){
        this.checked = checked;
        this.parent = parent;
        this.name = name;
        this.id = "checkbox_" + name + "_" + parent.id + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("checkbox");
        this.draw();
        this.events();
    }
    draw(){
        this.input = new SPLINT.DOMElement(this.id + "input", "input", this.mainElement);
        this.input.type = "checkbox";

        this.label = new Label(this.mainElement, this.input, this.name);
        this.label.before();
    }
    get state(){
        return this.input.state().get();
    }
    events(){
        this.input.onclick = function(){
            if(this.input.checked == true){
                this.input.state().setActive();
            } else {
                this.input.state().unsetActive();
            }
        }.bind(this);
        if(this.checked){
            this.input.state().setActive();
            this.input.checked = true;
        } else {
            this.input.state().unsetActive();
        }
    }
}

class S_DataList {
    options = [];
    constructor(name, parent = document.body){
        this._name  = name;
        this.parent = parent;
        this._id     = "s_dataList__";
        this.mainElement = new SPLINT.DOMElement(this._id + name, "datalist", parent);
    }
    get id(){
        return this._id + this._name;
    }
    remove(){
        this.mainElement.remove();
        this.options = [];
    }
    appendTo(element){
        element.setAttribute("list", this.id);
    }
    addOption(value, label = ""){
        let optionElement = this.#createOption(value, label);
        this.options.push(optionElement)
        return optionElement;
    }
    removeOption(value){
        return this.getOption(value).remove();
    }
    getOption(value){
        return this.mainElement.querySelectorAll('[value="' + value + '"]');
    }
    #createOption(value, label = ""){
        let ele =  new SPLINT.DOMElement(this.id + "_" + this.options.length, "option", this.mainElement);
            ele.value       = value;
            ele.label       = label;
        return ele;
    }
}


//   customElements.define('dom-elementr', DOMElement);

  class SimpleElement {
    constructor(parent, value = " ", name = null){
      value = value.replace(" ", "\xa0");
      if(name == null){
        name = 0;
        while(document.getElementById(parent.id + "_" + name + "_simple" + "_div") != null){
          name++;
        }
      }
      let main = new spanDiv(parent, name + "_simple", value);
      return main;
    }
  }

class S_DOMElement_TEMPLATE {
    constructor(elementName, parent, name){
        this.id = "S_" + elementName + "__" + name + "__";
        this.parent = parent;
        this.name = name;
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
    }
    Class(className){
        this.mainElement.Class(className);
    }
    remove(){
        this.mainElement.remove();
    }
}

class d_AdaptiveTable {
    constructor(parent, name = "") {
        this.name = name;
        this.parent = parent;
        this.innerWidth   = 0;
        this.ColumnCount  = 0;
        this.index = 0;
        this.offset = 0;
        this.id = "AdaptiveTable_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("AdaptiveTableMain");
        this.initEvents();
    }
    reset(){
      if(this.mainCover != undefined){
        // this.main.remove();
        this.mainElement.innerHTML = "";
        this.innerWidth   = 0;
        this.ColumnCount  = 0;
        this.index = 0;
        this.offset = 0;
      }
    }
    initEvents(){
        window.addEventListener("resize", function(e){
            this.generate(this.name, this.objectArray, this.drawElement_func);
        }.bind(this));
    }
    clear(){
      this.mainCover.innerHTML = "";
    }
    async expand(objectArray, offset){
      if(this.mainCover != undefined){
        this.offset = offset;
        this.objectArray  = objectArray;
        this.index++;
        await this.drawListElements();
      }
    }
    generate(name, objectArray, drawElement_func){
      this.drawElement_func = drawElement_func;
          this.reset();
  
      this.main = new SPLINT.DOMElement(this.parent.id + "_List_" + name + "_Main", "div", this.mainElement, function(){console.log("c")});
      this.mainWidth    = this.main.getBoundingClientRect().width;
      this.mainLeft     = this.main.getBoundingClientRect().left;
      this.objectArray  = objectArray;
      this.calculateColumns();
      this.drawListElements();
    }
    calculateColumns(){
      while(this.mainWidth > this.innerWidth){
        let Column = new SPLINT.DOMElement(this.id + "Column_" + this.ColumnCount, "div", this.main);
            Column.Class("column");
            Column.setAttribute("index", this.ColumnCount);
  
        this.innerWidth = Column.getBoundingClientRect().right - this.mainLeft;
        this.ColumnCount++;
      }
    }
    async drawListElements(){
      if(this.objectArray.length <= 0){
        return false;
      }
      while(await this.draw(this.index) == 'loaded'){
        if(this.index < this.objectArray.length - 1 + this.offset){
          this.index++;
        } else {
          break;
        }
      }
      return true;
    }
    draw(index){
        return new Promise(resolve => {
            let value = f1(this.ColumnCount);
            
            let columnElement = document.querySelector(`div[index="${CSS.escape(value)}"]`);
    
            console.log(this.ColumnCount);
            let resolve_func = function(){
                resolve('loaded');
            };
            let listElement = new SPLINT.DOMElement(this.id + "ListElement", "div", columnElement);
                listElement.Class("ListElement");
            this.drawElement_func(columnElement, index, resolve_func);
        });
        function f1(ColumnCount){
          let value = 100000;
          let index = 0;
          for(let i = 0; i < ColumnCount; i++){
            let height = document.querySelector(`div[index="${CSS.escape(i)}"]`).getBoundingClientRect().height;
            if(height < value){
              value = height;
              index = i;
            }
          }
          return index;
        }
    }
  }


class InputDiv_S {
  constructor(parent, id = "", name = "") {
    this.parent = parent;
    this.name = name;
    this.id     = "InputDiv_" + id + "_"; 
    this.draw();
    this.initEvents();
  }
  draw(){
    this.div = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
    this.div.Class("S_InputDiv");
        this.input = new SPLINT.DOMElement(this.id + "input", "input", this.div);
        this.input.placeholder = this.name;
        this.label = new Label(this.div, this.input, this.name);
        this.label.element.Class("switchLabel");
        this.label.before();

        this.responseDiv = new spanDiv(this.div, this.id + "response", "");
        this.responseDiv.div.Class("response");
  }
  invalid(value = ""){
    this.responseDiv.setValue(value);
    this.input.state().unsetActive();
  }
  valid(){
    this.responseDiv.setValue("");
    this.input.state().setActive();
  }
  initEvents(){
    this.input.oninput = function(){
      this.valid();
      if(this.input.value == ""){
        this.input.Class("filled").remove();
        this.label.element.style.visibility = "hidden";
      } else {
        this.label.element.style.visibility = "visible";
        this.input.Class("filled");
      }
    }.bind(this);
    this.input.S_onStateChange = function(e, state){
    }.bind(this);
  }
  drawSwitchButton(value = ""){
    this.button = new S_switchButton(this.div, this.id + "button", value);
    this.button.unsetActive();
    this.button.disableStandard();
    this.div.insertBefore(this.button.button, this.responseDiv.div);
    this.input.Class("button");

    return this.button;
  }
  get value(){
    return this.input.value;
  }
  set value(value){
    this.input.value = value;
    this._value = value;
  }
  set type(type){
    this.input.type = type;
  }
}





/**
 * @deprecated
 *
 * @param   {[type]}  parent     [parent description]
 * @param   {[type]}  name       [name description]
 * @param   {[type]}  labelName  [labelName description]
 *
 * @return  {[type]}             [return description]
 */
function dropdownInput(parent, name, labelName){
  let options = [];
  this.OnInput = function(value){}

  let div = new SPLINT.DOMElement(parent.id + "_div_" + name, "div", parent.id);
      div.Class("DropDownInputMain");
  this.div = div;
  let select = new SPLINT.DOMElement(parent.id + "_select_" + name, "select", div.id);
      select.oninput = SwitchPlaceholder.bind(this);
      let label = new Label(div, select, labelName);
          label.before();
      let responseSpanDiv = new spanDiv(div, parent.id + "_" + name + "_response", "div");
          responseSpanDiv.div.style.display = "none";    
          addOption("", labelName, true);
          select.selected = labelName;

  draw();
  function draw(){
    for(let i = 0; i < options.length; i++){
        let option = new SPLINT.DOMElement(parent.id + "_option_" + i + "_" + name, "option", select.id);
            option.value = options[i].value;
            option.innerHTML = options[i].text;
            if(options[i].hidden == true){
              option.setAttribute("hidden", "hidden");
            }
    }
    select.selected = labelName;
  }
  
  function SwitchPlaceholder() {
    select.classList.remove("invalidInput");
    responseSpanDiv.div.style.display = "none";
    if(select.value != ""){
        label.element.style.visibility = "visible";
        select.classList.add("inputFilled");
        div.classList.add("inputFilled");
        this.OnInput(select.value);
    } else {
        label.element.style.visibility = "hidden";
        select.classList.remove("inputFilled");
        div.classList.remove("inputFilled");
    }
  }
  // this.OnInput = OnInput();
  // function OnInput(func){
  //   func();
  // }
  this.addOption = addOption; 
  function addOption(value, text, hidden = false){
    let obj = new Object();
        obj.value = value;
        obj.text = text;
        obj.hidden = hidden;
    options.push(obj);
    draw();
  }
  this.setValue = function(value){
    if(value != undefined && value != ""){
      this.addOption("", value, true);
      select.selected = value;
      select.value = value;
      SwitchPlaceholder.bind(this);
    }
  }.bind(this);
  this.getValue = function(){
    return select.value;
  }
  this.invalid = function(value){
    if(!select.classList.contains("invalidInput")){
      select.classList.add("invalidInput");
      if(value != undefined){
        responseSpanDiv.value(value);
        responseSpanDiv.div.style.display = "block";
      }
    }
  }
  this.valid = function(){
    if(select.classList.contains("invalidInput")){
      select.classList.remove("invalidInput");
      if(value != undefined){
        responseSpanDiv.div.style.display = "none";
      }
    }
  }
}
class Header {
    constructor(){
        this.parent = document.body;
        this.name = "HEADER";
        this._logoSRC = splint_PATHS.images.error;
        this.logoHref = false
        this._logoText = "";

        this.buttons = [];

        this.id = "splint_header_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent)
        this.mainElement.Class("header");
        this.draw();
    }
    draw(){
        this.logoLinkBox = new SPLINT.DOMElement(this.id + "logoLinkBox", "a", this.mainElement);
        this.logoLinkBox.Class("logoLinkBox");
        this.logoLinkBox.onclick = function(){
            if(this.logoHref != false){
                S_Location.goto(this.logoHref).call();
            }
        }.bind(this);

            this.logoImg = new SPLINT.DOMElement(this.id + "logoImg", "img", this.logoLinkBox);
            this.logoImg.Class("logoIcon");
            this.logoImg.src = this._logoSRC;

            this.logoTextEle = new SPLINT.DOMElement(this.id + "logoText", "span", this.logoLinkBox);
            this.logoTextEle.Class("logoText");
            this.logoTextEle.innerHTML = this._logoText;

        this.headerNavigation = new SPLINT.DOMElement(this.id + "Navigation", "nav", this.mainElement);
        this.headerNavigation.Class("headerNavigation");
    }
    /**
     * add Button to NavBar
     *
     * @param   {string}  value     text
     * @param   {function|string}  onclick   function or href
     *
     * @return  {S_Button}           return button element
     */
    addButton(value, onclick = function(){}){
        let button = new S_Button(this.headerNavigation, this.buttons.length, value);
        if(typeof onclick !== 'function'){
            button.onclick = function(){
                S_Location.goto(onclick).call();
            }
        } else {
            button.onclick = onclick;
        }
        this.buttons.push(button);
        return button;
    }
    setAttribute(name, value){
        this.mainElement.setAttribute(name, value);
    }
    getAttribute(name){
        return this.mainElement.getAttribute(name);
    }
    set logoText(v){
        this._logoText = v;
        this.draw();
    }
    set logoSRC(v){
        this._logoSRC = v;
        this.draw();
    }
}

class S_HorizontalLine {
    constructor(parent, Class = "horizontalLine") {
        this.parent = parent;
        this.index = 0;
        this.Class = Class;
        return this.draw();
    }
    draw(){
        while(document.getElementById(this.parent.id + "_HorizontalLine_" + this.index, "hr") != null){
          this.index++;
        }
        let element = new SPLINT.DOMElement(this.parent.id + "_HorizontalLine_" + this.index, "hr", this.parent);
            element.Class(this.Class);
        return element;
    }
}

class ImgElement {
    constructor(parent, name = "") {
        this.id = "ImageElement_" + name + "_";
        this.name = name;
        this.parent = parent;
        this.div = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.img = new SPLINT.DOMElement(this.id + "img", "img", this.div);
    }
}

class S_AddressInput extends S_DOMElement_TEMPLATE {
    constructor(parent, name, expanded = true){
        super("AddressInput", parent, name);
        this.mainElement.Class("S-AddressInput");
        this.expanded = expanded;
        this.onsubmit = function(){};
        this.draw();
    }
    submit(){
        return this.onsubmit();
    }
    draw(){
        this.mainElement.clear();
  
      this.dropdown_salutation = new n_SelectInput(this.mainElement, "salutation", "Anrede");
      this.dropdown_salutation.Class("dropdown_salutation");
      this.dropdown_salutation.addEntry("Mr", "Herr");
      this.dropdown_salutation.addEntry("Mrs", "Frau");
      this.dropdown_salutation.addEntry("Mx", "Divers");
  
      this.title_input = new SPLINT.EX.DOMElement.Input(this.mainElement, "Titel");
      this.title_input.identifier = "title";
      this.title_input.Class("title_input");
  
      this.firstName_input = new SPLINT.EX.DOMElement.Input(this.mainElement, "Vorname", "Vorname");
      this.firstName_input.identifier = "firstName";
      this.firstName_input.Class("firstName_input");
  
      this.lastName_input = new SPLINT.EX.DOMElement.Input(this.mainElement, "Nachname");
      this.lastName_input.identifier = "lastName";
      this.lastName_input.Class("lastName_input");
      
      this.postcode_input = new SPLINT.EX.DOMElement.Input(this.mainElement, "Postleitzahl");
      this.postcode_input.identifier = "postcode";
      this.postcode_input.Class("postcode_input");
      
      this.city_input = new SPLINT.EX.DOMElement.Input(this.mainElement, "Stadt");
      this.city_input.identifier = "city";
      this.city_input.Class("city_input");
  
      this.dropdown_country = new n_SelectInput(this.mainElement, "country", "Land");
      this.dropdown_country.Class("dropdown_country");
      this.dropdown_country.addEntry("DE", "Deutschland");
      this.dropdown_country.addEntry("AU", "Österreich");
  
      this.street_input = new SPLINT.EX.DOMElement.Input(this.mainElement, "Straße");
      this.street_input.identifier = "street";
      this.street_input.Class("street_input");
  
      this.housenumber_input = new SPLINT.EX.DOMElement.Input(this.mainElement, "Hausnummer");
      this.housenumber_input.identifier = "housenumber";
      this.housenumber_input.Class("housenumber_input");
  
      if(this.expanded){
        this.email_input = new SPLINT.EX.DOMElement.Input(this.mainElement, "Emailadresse");
        this.email_input.identifier = "email";
    
        this.phone_input = new SPLINT.EX.DOMElement.Input(this.mainElement, "Telefonnummer");
        this.phone_input.identifier = "phone";
      }
    }
    drawSumbit(){
        if(this.buttonsDiv != undefined){
            this.buttonsDiv.remove();
        }
        this.buttonsDiv = new SPLINT.DOMElement(this.id + "buttons", "div", this.mainElement);
            let button_save = new SPLINT.DOMElement.Button(this.buttonsDiv, "save", "speichern");
                button_save.onclick = function(){
                    this.onsubmit();
                }.bind(this);

    }
    set value(data){
      if(data != null){
        this.title_input.value = data.Title;
        this.dropdown_salutation.value = data.Salutation;
        this.firstName_input.value = data.FirstName;
        this.lastName_input.value = data.LastName;
        this.postcode_input.value = data.Postcode;
        this.city_input.value = data.City;
        this.dropdown_country.value = data.Country;
        this.street_input.value = data.Street;
        this.housenumber_input.value = data.HouseNumber;
        if(this.expanded){
          this.email_input.value = data.Email;
          this.phone_input.value = data.Phone;
        }
      }
    }
    get value(){
        let obj = new Object();
            obj.Title       = this.title_input.value;
            obj.FirstName   = this.firstName_input.value;
            obj.LastName    = this.lastName_input.value;
            obj.Street      = this.street_input.value;
            obj.Country     = this.dropdown_country.value;
            obj.City        = this.city_input.value;
            obj.Postcode    = this.postcode_input.value;
            obj.HouseNumber = this.housenumber_input.value;
            obj.Salutation  = this.dropdown_salutation.value;
            if(this.expanded){
              obj.Email       = this.email_input.value;
              obj.Phone       = this.phone_input.value;
            } else {
              obj.Email = "";
              obj.Phone = "";
            }
        return obj;
    }
}

class S_AddressObject {
    constructor(debuggMode = false){
        if(debuggMode){
            this.AddressID    = "a";
            this.AddressName  = "a";
            this.Country      = "DE";
            this.City         = "a";
            this.Postcode     = "a";
            this.Street       = "a";
            this.HouseNumber  = "a";
            this.FirstName    = "a";
            this.LastName     = "a";
            this.Title        = "a";
            this.Email        = "Marius006@gmx.de";
            this.Phone        = "a";
            this.Salutation   = "";
        } else {
            this.AddressID    = "";
            this.AddressName  = "";
            this.Country      = "DE";
            this.City         = "";
            this.Postcode     = "";
            this.Street       = "";
            this.HouseNumber  = "";
            this.FirstName    = "";
            this.LastName     = "";
            this.Title        = "";
            this.Email        = "";
            this.Phone        = "";
            this.Salutation   = "";
        }
      return this;
    }
    static getTemplate(){
      let inst = new AddressObject();
      return inst.get();
    }
    get(){
      let Storage = new Object();
          Storage.AddressID   = this.AddressID;
          Storage.AddressName = this.AddressName;
          Storage.Country     = this.Country;
          Storage.City        = this.City;
          Storage.Postcode    = this.Postcode;
          Storage.Street      = this.Street;
          Storage.HouseNumber = this.HouseNumber;
          Storage.FirstName   = this.FirstName;
          Storage.LastName    = this.LastName;
          Storage.Title       = this.Title;
          Storage.Phone       = this.Phone;
          Storage.Email       = this.Email;
          Storage.Salutation  = this.Salutation;
      return Storage;
    }
  }

class AmountInput {
    constructor(parent, name, amount = 1, arg = "test"){
      this.parent = parent;
      this.name = name;
      this.arg = arg;
      this.min = 1;
      this.amount = amount;
      this.id = "AmountInput_" + name + "_" + parent.id + "_";
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
      this.mainElement.Class("AmountDiv");
      this.oninput = function(){};
      this.draw();
    }
    draw(){
      let button_sub = new S_Button(this.mainElement, "sub");
          button_sub.bindIcon("remove");
          button_sub.onclick = function(){
            if(parseInt(this.amountInput.value.replace(this.arg, "")) > this.min){
              this.amount = parseInt(this.amountInput.value.replace(this.arg, "")) - 1;
              this.amountInput.value = this.amount + this.arg;
            }
            this.oninput(this.amount);
          }.bind(this);
  
      this.amountDiv = new SPLINT.DOMElement(this.id + "inputDiv", "div", this.mainElement);
          this.amountInput = new SPLINT.DOMElement(this.id + "input", "input", this.amountDiv);
          this.amountInput.value = this.amount + this.arg;
          this.amountInput.oninput = function(){
            this.amount = parseInt(this.amountInput.value.replace(this.arg, ""));
            this.oninput(this.amount);
          }.bind(this);
  
  
      let button_add = new S_Button(this.mainElement, "add");
          button_add.bindIcon("add");
          button_add.onclick = function(){
            this.amount = parseInt(this.amountInput.value.replace(this.arg, "")) + 1;
            this.amountInput.value = this.amount + this.arg;
            this.oninput(this.amount);
          }.bind(this);
    }
  }

class DropDownInput_S {
    constructor(parent, name = ""){
        this.parent = parent;
        this.name = name;
        this.id = "DropDownInput_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("DropDownInputMain_S");
        this.draw();
        this.initEvents();
        this.onValueChange = function(){};
    }
    Class(className){
        this.mainElement.Class(className);
    }
    initEvents(){
        window.addEventListener("click", function(e){
            if(!e.target.hasParentWithClass("DropDownInputMain_S")){
                this.closeDropDown();
            }
        }.bind(this));
    }
    draw(){
        this.input = new SPLINT.DOMElement.InputDiv(this.mainElement, this.id + "input", this.name);
        this.input.inputBody.onclick = function(e){
            if(!e.target.hasParentWithClass("switchButton")){
                this.openDropDown();
            }
        }.bind(this);
        this.button = this.input.drawToggleButton();
        this.button.bindIcon("expand_more");

        this.button.onactive = function(){
            this.openDropDown();
            this.button.bindIcon("chevron_left");
        }.bind(this); 

        this.button.onpassive = function(){
            this.closeDropDown();
            this.button.bindIcon("expand_more");
        }.bind(this); 
        this.dropDown = new SPLINT.DOMElement(this.id + "dropdown", "div", this.mainElement);
        this.dropDown.Class("DropDown_expander");
    }
    openDropDown(){
        this.dropDown.state().setActive();
        if(!this.button.button.state().isActive()){
            this.button.setActive();
        }
    }
    closeDropDown(){
        this.dropDown.state().unsetActive();
        if(this.button.button.state().isActive()){
            this.button.unsetActive();
        }
    }
    addEntry(name, value){
        let entry = new SPLINT.DOMElement.SpanDiv(this.dropDown, name, value);
            entry.div.setAttribute("value", value);
            entry.div.onclick = function(){
                this.value = entry.value;              
                    for(let i = 0; i < this.dropDown.children.length; i++){
                        let ele = document.getElementById(this.dropDown.children[i].id);
                            ele.setAttribute("state", "passive");
                    }
                    entry.div.setAttribute("state", "active");
            }.bind(this);
    }
    set value(v){
        this.onValueChange(v);
        this.input.value = v;  
        this.input.input.dispatchEvent(new Event('input', {bubbles:true}));
        for(let i = 0; i < this.dropDown.children.length; i++){
            let ele = document.getElementById(this.dropDown.children[i].id);
            if(ele.getAttribute("value") == v){
                ele.setAttribute("state", "active");
            } else {
                ele.setAttribute("state", "passive");
            }
        }
    }
}

class S_DynamicInput extends S_DOMElement_TEMPLATE {
    #listElements = [];
    #headline = null;
    #HeadlineContainer = null;
    constructor(parent, name, headline = null){
        super("DynamicInput", parent, name);
        this.Class("s-DynamicInput");
        this.contentElement = new SPLINT.DOMElement(this.id + "content", "div", this.mainElement);
        this.contentElement.Class("content");
        this.#headline = headline;
        this.template = function(contentElement, listElement, index, id){
            let input1 = new SPLINT.DOMElement.InputDiv(contentElement, "1", "input1");
            let input2 = new SPLINT.DOMElement.InputDiv(contentElement, "2", "input2");
        }
        this.onAdd = function(contentElement, listElement){

        }
        this.onSub = function(contentElement, listElement){

        }
    }
    set headline(v){
        this.#headline = v;
        this.#drawHeadline();
    }
    get headline(){
        return this.#headline;
    }
    get headlineContainer(){
        return this.#HeadlineContainer;
    }
    get list(){

        let res = [];
        for(const i in this.#listElements){
            let e = this.#listElements[i];
            if(e == null){
                continue;
            }
            let obj = new Object();
                obj.listElement = e;
                obj.contentElement = e.querySelector(".content");
            res.push(obj)
        }
        return res;
    }
    #drawHeadline(){
        if(this.#headline != null){
            this.#HeadlineContainer = new SPLINT.DOMElement(this.id + "headline_container", "div", this.mainElement);
            this.#HeadlineContainer.Class("headlineContainer");
                let headlineElement = new SPLINT.DOMElement.SpanDiv(this.#HeadlineContainer, "headline", this.#headline);
                    headlineElement.Class("headline");
                new SPLINT.DOMElement.HorizontalLine(this.#HeadlineContainer);

            this.mainElement.insertBefore(this.#HeadlineContainer, this.mainElement.firstChild);
        } else {
            this.#HeadlineContainer.remove();
        }
    }
    draw(){
        let index = this.#listElements.length;
        let lE_ID = this.id + "listElement_" + index + "_";
        let listElement = new SPLINT.DOMElement(lE_ID + "main", "div", this.contentElement);
            listElement.Class("listElement");
            listElement.setAttribute("index", index);
        this.#listElements.push(listElement);
            let listElementContent = new SPLINT.DOMElement(lE_ID + "content", "div", listElement);
                listElementContent.Class("content");
                this.template(listElementContent, listElement, index, lE_ID);
            let listElementButtons = new SPLINT.DOMElement(lE_ID + "buttons", "div", listElement);
                listElementButtons.Class("buttons");
                let buttonAdd = new SPLINT.DOMElement.Button(listElementButtons, "add");
                    buttonAdd.bindIcon("add")
                    buttonAdd.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT)
                    buttonAdd.onclick = function(){
                        this.onAdd(listElementContent, listElement);
                        this.draw();
                    }.bind(this);
                let buttonSub = new SPLINT.DOMElement.Button(listElementButtons, "sub");
                    buttonSub.bindIcon("remove")
                    buttonSub.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT)
                    buttonSub.onclick = function(){
                        this.onSub(listElementContent, listElement);
                        // for(const i in this.#listElements){
                        //     let e = this.#listElements[i];
                        //     if(e.index == index){
                                this.#listElements[index] = null;
                            // }
                        // }
                        listElement.remove();
                    }.bind(this);
    }
}


class n_InputDiv extends S_DOMElement_TEMPLATE {
    constructor(parent, name, _value, transitionMultiplyer = 10){
        super("InputDiv", parent, name + "_" + parent.id)
        this.Class("n_inputDiv");
        this._value = _value;

            this.inputBody = new SPLINT.DOMElement(this.id + "input_Body", "div", this.mainElement);
            this.inputBody.Class("inputBody");
                this.input = new SPLINT.DOMElement(this.id + "input", "input", this.inputBody);
                this.input.setAttribute("type", "value");
                this.input.setAttribute("required", "");
                this.input.setAttribute("name", name);

                this.label = new SPLINT.DOMElement(this.id + "label", "label", this.inputBody);
                this.transitionMultiplyer = transitionMultiplyer;

            this.responseDiv = new spanDiv(this.mainElement, "response", "");
            this.responseDiv.div.Class("response");
        this.draw();
        this.oninput = function(e){};
        this._onEnter = function(e){};
        this.initEvents();
    }
    set onEnter(func){
        this._onEnter = func;
        this.initEvents();
    }
    get onEnter(){
        return this._onEnter;
    }
    draw(){
        for(const index in this._value){
            let val = this._value[index];
            let valuePart = new SPLINT.DOMElement(this.id + "valuePart_" + index, "span", this.label);
                valuePart.innerHTML = val;
                valuePart.setAttribute("index", index);
                if(this.transitionMultiplyer != 0){
                    valuePart.style.transitionDelay = index * this.transitionMultiplyer + "ms";
                }
        };
    }
    Class(className){
        this.mainElement.Class(className);
    }
    valid(value = ""){
        this.responseDiv.setValue(value);
        this.input.state().setActive();
    }
    invalid(value = ""){
      this.responseDiv.setValue(value);
      this.input.state().unsetActive();
    }
    initEvents(){ 
        this.input.oninput = function(e){
            this.oninput(e);
            this.valid();
            if(this.input.value == ""){
            this.input.Class("filled").remove();
            } else {
            this.input.Class("filled");
            }
        }.bind(this);
        this.input.S_onStateChange = function(e, state){
        }.bind(this);
        this.input.onEnter = this._onEnter;
    }
    drawToggleButton(value){
        this.button = new S_switchButton(this.inputBody, "button", value);
        return this.button;
    }
    disableAnimation(){
        this.input.oninput = function(){};
    }
    get value(){
      return this.input.value;
    }
    set value(value){
      this.input.value = value;
      this._value = value;
    }
    set type(type){
      this.input.type = type;
    }
}

class n_SelectInput extends S_DOMElement_TEMPLATE {
    constructor(parent, name = "", labelName = ""){
        super("SelectInput", parent, name);
        this.labelName = labelName;
        this.Class("n_SelectInputMain");
        this.draw();
        this.initEvents();
        this.onValueChange = function(){};
    }
    initEvents(){
        window.addEventListener("mousedown", function(e){
            e.stopPropagation();
            if(!e.target.hasParentWithID(this.mainElement.id)){
                this.closeSelect();
            }
        }.bind(this));
    }
    draw(){
        this.input = new n_InputDiv(this.mainElement, "input", this.labelName);
        this.input.input.onclick = function(e){
            if(!e.target.hasParentWithClass("switchButton")){
                this.openSelect();
            }
        }.bind(this);
        this.button = this.input.drawToggleButton();
        this.button.bindIcon("expand_more");

        this.button.onactive = function(){
            this.openSelect();
            this.button.bindIcon("chevron_left");
        }.bind(this); 

        this.button.onpassive = function(){
            this.closeSelect();
            this.button.bindIcon("expand_more");
        }.bind(this); 
        this.Select = new SPLINT.DOMElement(this.id + "select", "div", this.mainElement);
        this.Select.Class("Select_expander");
        this.closeSelect();
    }
    openSelect(){
        this.Select.state().setActive();
        if(!this.button.button.state().isActive()){
            this.button.setActive();
        }
    }
    closeSelect(){
        this.Select.state().unsetActive();
        if(this.button.button.state().isActive()){
            this.button.unsetActive();
        }
    }
    addEntry(name, value){
        let entry = new SpanDiv(this.Select, name, value);
            entry.div.setAttribute("value", value);
            entry.div.onclick = function(){
                this.value = entry.value;              
                    for(let i = 0; i < this.Select.children.length; i++){
                        let ele = document.getElementById(this.Select.children[i].id);
                            ele.setAttribute("state", "passive");
                    }
                    entry.div.setAttribute("state", "active");
            }.bind(this);
            entry.div.click();
    }
    set value(v){
        this.onValueChange(v);
        this.input.value = v;  
        this.input.input.dispatchEvent(new Event('input', {bubbles:true}));
        for(let i = 0; i < this.Select.children.length; i++){
            let ele = document.getElementById(this.Select.children[i].id);
            if(ele.getAttribute("value") == v){
                ele.setAttribute("state", "active");
            } else {
                ele.setAttribute("state", "passive");
            }
        }
    }
    get value(){
        return this.input.value;
    }
}
class TextInputDiv {
    constructor(parent, name, value, autoHeight = true){
      this.parent = parent;
      this.name   = name;
      this.value  = value; 
      this.autoHeight = autoHeight;
      this.id     = parent.id + "_" + name + "_TextInput";
      this.div = new SPLINT.DOMElement(this.id + "_div", "div", this.parent);
      this.div.Class("TextInputDiv");
      this.oninput = function(){};
      this.draw();
    }
    Class(className){
        this.div.Class(className);
    }
    get Value(){
      return this.textarea.value;
    }
    draw(){
      this.textarea  = new SPLINT.DOMElement(this.id + "_textarea", "textarea", this.div);
      this.textarea.placeholder = this.value;
      this.textarea.onclick = this.OnClick;
      this.label = new Label(this.div, this.textarea, this.value);
      this.label.before();
      this.divider = new SPLINT.DOMElement.HorizontalLine(this.div);
      this.divider.style.visibility = "hidden";
      this.textarea.oninput = function(e){
        this.#SwitchPlaceholder();
        this.oninput(e);
        if(this.autoHeight){
          this.adjustHeight();
        }
      }.bind(this);
    }
    setLabel(text){
      this.label = new Label(this.div, this.textarea, text);
      this.label.before();
      return this.label;
    }
    OnClick = function(e){};
    get isChecked(){
      return this.input.checked;
    }
    setValue(value){
      if(value != undefined){
        this.textarea.value = value;
        this.#SwitchPlaceholder();
        if(this.autoHeight){
          this.adjustHeight();
        }
      }
    }
    #SwitchPlaceholder() {
      if(this.textarea.value != ""){
          this.label.element.style.visibility = "visible";
          this.divider.style.visibility = "visible";
          this.textarea.classList.add("inputFilled");
          this.div.classList.add("inputFilled");
      } else {
          this.label.element.style.visibility = "hidden";
          this.divider.style.visibility = "hidden";
          this.textarea.classList.remove("inputFilled");
          this.div.classList.remove("inputFilled");
      }
    }
    adjustHeight() {
      this.textarea.style.height = 'auto';
      this.textarea.style.height = this.textarea.scrollHeight + 'px';
    }
  }

class Label {
    constructor(parent, elementFor, value, uniqueID = true){
        this.parent     = parent;
        this.elementFor = elementFor;
        this._value     = value;
        if(uniqueID){
            this.id = parent.id + "_label_/UID()/_";
        } else {
            this.id = parent.id + "_label_";
        }
        this.element = new SPLINT.DOMElement(this.id + "main", "label", elementFor);
        this.element.innerHTML = this._value;
    }
    set value(v){
        this._value = v;
    }
    get value() { return this._value; }
    before() {
      this.elementFor.parentNode.insertBefore(this.element, this.elementFor);
    }
    after() {
        this.elementFor.parentNode.insertBefore(this.element, this.elementFor.nextSibling);
    }
}
// function Label(parent, element, value){
//     this.element = createLabel(parent, element.id, value);
//     this.before = function(){
//       element.parentNode.insertBefore(this.element, element);
//     }
//     this.after = function(){
//       element.parentNode.insertBefore(this.element, element.nextSibling);
//     }
//   }

// /**
//  * @deprecated
//  */
//   function createLabel(grandfather, parentID, content){
//     let label = new SPLINT.DOMElement(parentID + "_label_/UID()/", "label", grandfather.id);
//         label.setAttribute("for", grandfather.id);
//         label.innerHTML = content;
//     return label;
//   }

class S_SideBarMobile extends S_DOMElement_TEMPLATE {
    constructor(parent, name,){
        super("S-SideBarMobile", parent, name);
        this.mainElement.Class("s-sideBarMobile");
        this.open();
        this.head = new SPLINT.DOMElement(this.id + "headContainer", "div", this.mainElement);
        this.head.Class("headContainer");
        this.contentElement = new SPLINT.DOMElement(this.id + "content", "div", this.mainElement);
        this.contentElement.Class("content");
        this.draw();
    }
    #value = "head";
    set buttonClose(v){
        if(v){
            this.bt_close = new SPLINT.DOMElement.Button(this.head, "close");
            this.bt_close.bindIcon("close");
            this.bt_close.Class("buttonClose");
            this.bt_close.onclick = this.close.bind(this);
        }
    }
    set value(v){
        this.#value = v;
        this.headline.value = v;
    }
    get value(){
        return this.#value;
    }
    close(){
        this.mainElement.SPLINT.state.setPassive();
    }
    open(){
        this.mainElement.SPLINT.state.setActive();

    }
    draw(){
        this.headline = new SPLINT.DOMElement.SpanDiv(this.head, "headline", this.#value);
        this.headline.Class("headline");

        this.buttonClose = true;
    }
}

class S_Nesting {
    constructor(parent, name, obj = new SPLINT.autoObject()){
        this._data = obj;
        this.parent = parent;
        this.name = name;
        this.id = "S_Nesting_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "Body", "div", this.parent);
        this.mainElement.Class("S-Nesting");
        this.mainElement.Class("S-DOMComponent");
        this.callBack = function(element, entry, key, index, id){};
        this.onEnter    = null;
        this.onEdit     = null;
        this.onRemove   = null;
        this.onAdd      = null;
    }
    
    set data(obj) {
        this._data = obj;
    }
    // set callBack(func){
    //     // this.callBack = func;
    // }
    set header(v){
        this._header = v;
    }
    set input(v){
        this._input = v;
    }
    draw(){
        // this._data = this._data.parseToObject();
        let counter = 0;
        this.obj = this._data.SPLINT.toDOMStructure(this.mainElement, function(element, entry, key, index, obj){
            let id = this.id + "_" + key + "" + element.getAttribute("ivalue") + "" + index + "_";
            if(key != "attr"){
            let ele = new SPLINT.DOMElement(id + "expander", "div", element);
                let headBody = new SPLINT.DOMElement(id + "headBody", "div", ele);
                    headBody.Class("I_headBody");

                    let head = null;
                  if(entry.attr != undefined && entry.attr.name != undefined){
                        head = new SPLINT.DOMElement.SpanDiv(headBody, "head", entry.attr.name);
                        head.Class("I_header");
                  } else {
                        head = new SPLINT.DOMElement.SpanDiv(headBody, "head", key);
                        head.Class("I_header");
                  }
                    let head_buttons = new SPLINT.DOMElement(id + "headButtons", "div", headBody);
                        head_buttons.Class("I_headButtons");

                        
                        if(this.onEdit != null){
                            let buttonEdit = new S_Button(head_buttons, "edit");
                                buttonEdit.bindIcon("edit");
                                buttonEdit.onclick = function(event){
                                    event.stopPropagation();
                                    let c = ele.attributes.ivalue.value;
                                    let path = c.split(".");
                                        path.splice(0, 1);
                                    head.div.state().setActive();
                                    let editInput = new SPLINT.DOMElement.InputDiv(head.div, "I_editInput", head.value);
                                        editInput.Class("I_editInputDiv");
                                        editInput.input.onclick = function(e){
                                            e.stopPropagation();
                                        }
                                    let button_submit = new S_Button(editInput.inputBody, "submit_editCategory");
                                        button_submit.bindIcon("done");
                                        button_submit.onclick = async function(event){
                                            event.stopPropagation();
                                            head.div.state().unsetActive();
                                            editInput.remove();
                                            this.onEdit(event, path, editInput.value);

                                        //   let a = await HashtagHelper.getTag();
                                        //   console.log(a)  
                                          // ProjectHelper.Design().addTags(input.value).then(function(){

                                            // });
                                        }.bind(this);
                                }.bind(this);
                        }

                        if(this.onRemove != null){
                            let buttonRemove = new S_Button(head_buttons, "remove");
                                buttonRemove.bindIcon("delete");
                                buttonRemove.onclick = function(event){
                                    event.stopPropagation();
                                    let c = ele.attributes.ivalue.value;
                                    let path = c.split(".");
                                        path.splice(0, 1);
                                    this.onRemove(event, path);
                                }.bind(this);
                        }

                        if(this.onAdd != null){
                            let buttonAdd = new S_Button(head_buttons, "add");
                                buttonAdd.bindIcon("add");
                                buttonAdd.onclick = function(event){
                                    event.stopPropagation();
                                    let c = ele.attributes.ivalue.value;
                                    let path = c.split(".");
                                        path.splice(0, 1);
                                    // this.onAdd(event, path);
                                    let n_Expander = new SPLINT.DOMElement(id + "new_expander", "div", ele);
                                        n_Expander.Class("I_expander");
                                        n_Expander.before(ele.children[1]);
                                        n_Expander.setAttribute("ivalue", element.getAttribute("ivalue") + ".new");
                                        let n_headBody = new SPLINT.DOMElement(id + "new_headBody", "div", n_Expander);
                                            n_headBody.Class("I_headBody");
                                            let n_head = new SPLINT.DOMElement.SpanDiv(n_headBody, "head", "new");
                                                n_head.Class("I_header");
                                                n_head.div.state().setActive();
                                            let n_editInput = new SPLINT.DOMElement.InputDiv(n_head.div, "I_editInput", n_head.value);
                                                n_editInput.Class("I_editInputDiv");
                                                n_editInput.input.onclick = function(event){
                                                    
                                                    event.stopPropagation();
                                                }
                                            let n_button_submit = new S_Button(n_editInput.inputBody, "submit_newCategory");
                                                n_button_submit.bindIcon("done");
                                                n_button_submit.onclick = async function(event){
                                                    event.stopPropagation();
                                                    n_head.div.state().unsetActive();
                                                    n_editInput.remove();
                                                    this.onAdd(event, path, n_editInput.value);
                                                }.bind(this);
                                            let n_button_cancel = new S_Button(n_editInput.inputBody, "cancel_newCategory");
                                                n_button_cancel.bindIcon("close");
                                                n_button_cancel.onclick = async function(event){
                                                    event.stopPropagation();
                                                    n_head.div.state().unsetActive();
                                                    n_editInput.remove();
                                                    n_Expander.remove();
                                                    // this.onAdd(event, path, n_editInput.value);
                                                }.bind(this);
                                }.bind(this);
                        }

                    headBody.onmouseenter = function(){
                        head_buttons.style.visibility = "visible";
                    }
                    headBody.onmouseleave = function(){
                        head_buttons.style.visibility = "hidden";
                    }
                  
                //   if(this.onEnter != null){
                //     let ele1 = new SPLINT.DOMElement(id + "inputBody", "div", headBody);
                //         ele1.Class("I_inputBody");
                //         let input = new n_InputDiv(ele1, "I_input", "test", 0);
                //             input.onEnter = function(event){
                //                 let c = ele.attributes.ivalue.value;
                //                 let path = c.split(".");
                //                     path.splice(0, 1);
                //                 this.onEnter(event, path);
                //             }.bind(this);
                //             input.disableAnimation();
                //   }
                ele.Class("I_expander");
                let path = "";
                if(element.attributes.ivalue != undefined){
                    let c = element.attributes.ivalue.value;
                        path = c.split(".");
                        path.splice(0, 1);
                }
                this.callBack(ele, path, key, index, id, obj);
                counter++;
                return ele;
            }
            return false;
        }.bind(this));
    }
}
// let testOBJ = new SPLINT.autoObject();
// testOBJ.b.attr.name = "test";
// testOBJ.b.b.attr.name = "o";
// testOBJ.a.f.h.d.attr.name = "ok";
// testOBJ.a.f.h.f.attr.name = "ok";
// console.dir(testOBJ);
// testOBJ.toDOMStructure(document.body, function(element, entry, key, index){
//   console.log(index);
//   if(key != "attr"){
//     let ele = new SPLINT.DOMElement("/UID()/", "div", element);
//         let headBody = new SPLINT.DOMElement(ele.id + "_headBody", "div", ele);
//             headBody.Class("I_headBody");

//           if(entry.attr != undefined){
//             let head = new SPLINT.DOMElement.SpanDiv(headBody, "head", entry.attr.name);
//                 head.Class("I_header");
//           } else {
//             let head = new SPLINT.DOMElement.SpanDiv(headBody, "head", key);
//                 head.Class("I_header");
//           }

//           if(index == 0){
//             let ele1 = new SPLINT.DOMElement("/UID()/_inputBody", "div", headBody);
//                 ele1.Class("I_inputBody");
//                 let input = new n_InputDiv(ele1, "I_input", "test", 0);
//                     input.disableAnimation();
//           }
//         ele.Class("I_expander");
//     return ele;
//   }
//   return false;
// });


class S_TestNesting {
    constructor(parent, name){
        this.parent = parent;
        this.name = name;
        

    }

}

class S_ObjectEditor {
    constructor(parent, name, obj, drawDirect = true){
        this.parent = parent;
        this.name = name;
        if(obj instanceof Array){
            this.obj = obj[1];
            this.obj_name = obj[0];

        } else {
            this.obj = obj;
            this.obj_name = null;
        }
        this.drawDirect = drawDirect;
        this.id = "s_ObjectEditor_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("s-ObjectEditor");
        this.Table = new SPLINT.DOMElement.Table.Grid(this.mainElement, name, Object.entries(this.obj).length, 3);
        this.onedit = function(obj, newValue){};
        this.onPattern = function(e){};
        this.patterns = [];
        if(drawDirect){
            this.draw();
        }
    }
    getPart(i_name){
        return document.querySelector("[i_name=" + i_name + "]");
    }
    draw(){
        let index = 0;
        for(const e of Object.entries(this.obj)){
            let gen = SPLINT.DOMElement.SpanDiv.get;
            if(typeof e[1] == 'object'){
                if(this.patterns.includes(e[0])){
                    this.onPattern(e, this.obj, this.obj_name);
                    continue;
                }
                let sp = gen(this.Table.getData(index, 0), "", e[0]);
                    sp.span.setAttribute("i_name", e[0]);
                let ele = this.Table.getData(index, 1);
                ele.parentElement.setAttribute("container", "true");
                let objEditor = new SPLINT.DOMElement.ObjectEditor(ele, ele.id + "_branch_" + Math.random(), e, this.drawDirect);
                    objEditor.onPattern = this.onPattern;
                    objEditor.patterns = this.patterns;
                    objEditor.onedit = function(obj, val){
                        this.obj[e[0]] = obj;
                        this.onedit(this.obj, obj);
                    }.bind(this);
                    if(!this.drawDirect){
                        objEditor.draw();
                    }
                index = index+ 1;
                continue;
            }
            // continue;
            
            gen(this.Table.getData(index, 0), "", e[0]);
            if(typeof e[1] == 'boolean' || e[1] == "true" || e[1] == "false"){
                let bt = new SPLINT.DOMElement.Button.Toggle2(this.Table.getData(index, 1), e[0]);
                    bt.state = e[1]
                    bt.onToggle = function(flag){
                        e[1] = flag;
                        this.obj[e[0]] = e[1];
                        this.onedit(this.obj, flag);
                    }.bind(this);
                index = index + 1;
                continue;
            }

            gen(this.Table.getData(index, 1), "", e[1]);
            let input = new SPLINT.DOMElement.InputDiv(this.Table.getData(index, 1), e[0], e[1]);
                input.mainElement.style.display = "none";
            let bt_edit = new SPLINT.DOMElement.Button.Switch(this.Table.getData(index, 2), "edit");
                bt_edit.bindIcon("edit");
                bt_edit.unsetActive();
                bt_edit.onactive = function(){
                    bt_edit.bindIcon("done");
                    this.Table.getData(bt_edit.button.parentElement.getAttribute("row"), 1).firstChild.style.display = "none";
                    input.mainElement.style.display = "flex";
                }.bind(this);
                bt_edit.onpassive = function(){
                    bt_edit.bindIcon("edit");
                    this.Table.getData(bt_edit.button.parentElement.getAttribute("row"), 1).firstChild.style.display = "block";
                    e[1] = input.value;
                    this.obj[e[0]] = e[1];
                    this.onedit(this.obj, e);
                    // SP_inspectProjects.saveConfig(this.data.config, this.data.uri);
                    input.mainElement.style.display = "none";
                }.bind(this)
                index = index + 1;
        }
                
        // gen(c_serverTable.getData(1, 0), "", "host", config.host);
        // gen(c_serverTable.getData(2, 0), "", "port", config.port);

    }
}
function priceDiv(parent, price, index = "", divider = function(price){ return price.toString().split(".");}){
    parent.setAttribute("ItemPrice", price);
    price = divider(price);
    if(price[1] == undefined){  
      price[1] = "00";
    }
    let main = new SPLINT.DOMElement("PriceDiv_Main_" + index + parent.id, "div", parent.id);
        let part1 = new SPLINT.DOMElement("PricePart1_" + index + parent.id, "span", main.id);
            part1.innerHTML = price[0];
        let part2 = new SPLINT.DOMElement("PricePart2_" + index + parent.id, "span", main.id);
            part2.innerHTML = price[1];
            part2.style.fontSize        = parseInt(window.getComputedStyle(main).fontSize.replace("px", "")) * 0.4 + "pt";
            window.addEventListener("resize", function(){
              part2.style.fontSize        = parseInt(window.getComputedStyle(main).fontSize.replace("px", "")) * 0.4 + "pt";
            });
            part2.style.verticalAlign   = "text-top";
            part2.style.textDecoration  = "underline";
        let part3 = new SPLINT.DOMElement("PricePart3_" + index + parent.id, "span", main.id);
            part3.innerHTML = "&thinsp;€";
    
    this.main = main; 
  }

  class PriceDiv_S {
    constructor(parent, name, value){
      this.id     = name + "_PriceDiv_" + parent.id + "_";
      this.name = name;
      this.parent = parent;
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
      this.mainElement.Class("PriceDiv");
      this.parent.setAttribute("ItemPrice", value);
      this.mainElement.setAttribute("ItemPrice", value);
      this.mainElement.setAttribute("name", "priceDiv_S_" + this.name);
      this.price  = this.divider(value);
      this.draw();
    }
    setPrice(value){
      this.price  = this.divider(value);
      this.draw();
    }
    divider(price){
      this.price = price.toString().split(".");
      return this.price;
    }
    draw(){
      if(this.price[1] == undefined){  
        this.price[1] = "00";
      }
      let part1 = new SPLINT.DOMElement(this.id + "part1", "span", this.mainElement);
          part1.innerHTML = this.price[0];

      let part2 = new SPLINT.DOMElement(this.id + "part2", "span", this.mainElement);
          part2.innerHTML = this.price[1];
          part2.style.fontSize        = parseInt(window.getComputedStyle(this.mainElement).fontSize.replace("px", "")) * 0.4 + "pt";
          window.addEventListener("resize", function(){
            part2.style.fontSize        = parseInt(window.getComputedStyle(this.mainElement).fontSize.replace("px", "")) * 0.4 + "pt";
          }.bind(this));
          part2.style.verticalAlign   = "text-top";
          part2.style.textDecoration  = "underline";

      let part3 = new SPLINT.DOMElement(this.id + "part3", "span", this.mainElement);
          part3.innerHTML = "&thinsp;€";
    }
    static getByName(name){
      return document.getElementsByName("priceDiv_S_" + name)[0];
    }
    static setValue(name, value){
      let parent = PriceDiv_S.getByName(name).parentNode;
      let priceDivEle = new PriceDiv_S(parent, name, value);
    }
    set value(v){
      this.mainElement.setAttribute("ItemPrice", v);
      this.parent.setAttribute("ItemPrice", v);
      this.price = this.divider(v);
      this.draw();
    }
    get value(){
      return this.mainElement.getAttribute("ItemPrice");
    }
  }

class progressBar {
    constructor(parent, name, value = 50){
        this.parent     = parent;
        this.name       = name;
        this.id         = "progressBar_" + parent.id + "_" + name + "_"; 
        this._value     = value;
        this.mainElement    = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("progressBar_Splint");
        this.draw();
    }
    set value(v){
        this._value = v;
        this.draw();
    }
    draw(){
        this.BodyElement   = new SPLINT.DOMElement(this.id + "_body", "div", this.mainElement);
        this.BodyElement.Class("S_progressBar_Body");
        this.BodyElement.setAttribute("value", this._value);

        this.InnerElement   = new SPLINT.DOMElement(this.id + "_inner", "div", this.BodyElement);
        this.InnerElement.Class("S_progressBar_Inner");
        this.InnerElement.setAttribute("value", this._value);
        this.InnerElement.style.width = this._value + "%";
    }
    /**
    * false = disable
    */
    set label(value){
        if(value == false && this._label != undefined){
            this._label.element.remove();
            this._label = undefined;
            return;
        }
        this._label = new Label(this.mainElement, this.BodyElement, value, false);
        return this._label;
    }
    get label() { return this._label; }
}

class scriptElement_S {
    constructor(src){
        this.element = new SPLINT.DOMElement(null, "script", document.body);
        this.element.src = src
    }
    static loadFromSplint(src){
        src = location.protocol + "//" + location.host + "/Splint/js/" + src;
        new scriptElement_S(src);   
    }
}
class Slider_S {
  constructor(parent, name, signFlag = true){
    this.parent = parent;
    this.signFlag = signFlag;
    this.name = name;
    this.val  = 10;
    this.min  = 0;
    this.max  = 0;
    this.step = 1;
    this.id = "Slider_" + name + "_";
    this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
    this.mainElement.Class("Slider_main");
  }
  events(){
    this.oninput = function(){};
    this.inputElement.oninput = function(e){
      this.oninput(e);
      this.signElement.setValue(this.inputElement.value);
    }.bind(this);
  }
  draw(separators = true){

      this.inputBody = new SPLINT.DOMElement(this.id + "inputBody", "div", this.mainElement);
      this.inputBody.Class("Slider_inputBody");
      this.inputBody.style = "--size:" + this.max;
        this.inputElement = new SPLINT.DOMElement(this.id + "input", "input", this.inputBody);
        this.inputElement.Class("Slider_input");
        this.inputElement.type  = "range";
        this.inputElement.min   = this.min;
        this.inputElement.max   = this.max;
        this.inputElement.step  = this.step;
        this.inputElement.setAttribute("value", this.val);
        if(this.signFlag){
          this.signElement = new SPLINT.DOMElement.SpanDiv(this.inputBody, "sign", this.inputElement.value);
          this.signElement.Class("sign");
        }

        if(separators){
          for(let i = this.min; i <= this.max; i += this.step){
            let sep = new SPLINT.DOMElement.HorizontalLine(this.inputBody);
                sep.style = "--index:" + i;
          }
        }
        this.events();
  }
  get value(){
    return this.inputElement.value;
  }
  set value(val){
    this.val = val;
    if(this.inputElement != undefined){
      this.inputElement.value = val;
    }
  }

  setLabel(text){
    this.label = new Label(this.mainElement, this.inputBody, text);
    this.label.before();
  }
}


class Slider {
    #_label;
    #_min               = 0;
    #_max               = 10;
    #_step              = 1;
    #_value             = 5;
    #_disabled          = false;
    #_drawTickMarks     = false;
    #_valueExtension    = "";

    constructor(parent, name, label = ""){
      this.id       = "S-Slider__" + name + "__";
      this.parent   = parent;
      this.name     = name;
      this.#_label  = label;
      this.dataList = null;
      this.oninput          = function(value){};
      this.oninputFinished  = function(value){};
      this.oninputStart     = function(){};
      this.draw();
    }
  
    draw(){
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("S-SliderMain");
            this.labelElement = new SPLINT.DOMElement.SpanDiv(this.mainElement, "label", this.label);
            this.labelElement.Class("label");

            this.contentBody = new SPLINT.DOMElement(this.id + "contentBody", "div", this.mainElement);
            this.contentBody.Class("contentBody");
                this.sliderBody = new SPLINT.DOMElement(this.id + "sliderBody", "div", this.contentBody);
                this.sliderBody.Class("sliderBody");
                    this.inputElement = new SPLINT.DOMElement(this.id + "slider", "input", this.sliderBody);
                    this.inputElement.type  = "range";
                    this.inputElement.min   = this.min;
                    this.inputElement.max   = this.max;
                    this.inputElement.value = this.value;
                    this.inputElement.step  = this.step;

                this.valueElement = new SPLINT.DOMElement.SpanDiv(this.contentBody, "value", this.value + this.valueExtension);
                this.valueElement.Class("valueOutput");
            this.#events();
    //   this.element.div = new spanDiv(this.parent, "slider_div_" + this.name, "Label");
    //   this.element.div.Class("SliderMain").set();
    //   if(this.moveSign){
    //     this.element.div.Class("static").remove();
    //   } else {
    //     this.element.div.Class("static").add();
    //   }
    //   this.drawSign();
    //     this.element.sliderDiv = new SPLINT.DOMElement(this.id + "_sliderDiv", "div", this.element.div.div);
    //     this.element.sliderDiv.Class("ScaleDiv");
    //       this.element.slider = new SPLINT.DOMElement(this.id + "_slider", "input", this.element.sliderDiv);
    //       this.element.slider.type = "range";
    //       this.element.slider.min = this.min;
    //       this.element.slider.max = this.max;
    //       this.element.slider.setAttribute("value", this.val);
  
    //       let slider    = this.element.slider;
    //       let sliderDiv = this.element.sliderDiv;
    //       let sign      = this.element.sign.div;
  
    //       if(this.moveSign){
    //         sign.style.left = sliderDiv.offsetLeft + (((slider.offsetWidth) - (sign.offsetWidth) ) / 100) * this.val + "px";
    //       }
    //       this.element.slider.oninput = function(){
    //         this.val  = slider.value;
    //         this.element.sign.setValue(this.val);
    //         if(this.moveSign){
    //           this.element.sign.div.style.left =  sliderDiv.offsetLeft + (((slider.offsetWidth) - (sign.offsetWidth) ) / 100) * this.val + "px";
    //         }
    //       }.bind(this);
  
    //     if(this.event != undefined){
    //       this.element.slider.addEventListener(this.event, this.func.bind(this));
    //     }
    //     this.#calcScale();
    }
    set valueExtension(v){
        this.#_valueExtension = v;
        this.valueElement.value = this.value + this.#_valueExtension;
    }
    get valueExtension(){
        return this.#_valueExtension;
    }
    set drawDivider(flag){
        if(flag){
            this.mainElement.setAttribute("drawDivider", true);
        } else {
            this.mainElement.removeAttribute("drawDivider");
        }
    }
    set disabled(flag){
        this.#_disabled = flag;
        this.inputElement.disabled = flag;
    }
    get disabled(){
        return this.#_disabled;
    }
    get max(){
        return this.#_max;
    }
    get min(){
        return this.#_min;
    }
    get step(){
        return this.#_step;
    }
    get value(){
        return this.#_value;
    }
    set max(v){
        this.#_max = v;
        this.inputElement.max = v;
        this.drawTickMarks = this.#_drawTickMarks;
    }
    set min(v){
        this.#_min = v;
        this.inputElement.min = v;
        this.drawTickMarks = this.#_drawTickMarks;
    }
    set step(v){
        this.#_step = v;
        this.inputElement.step = v;
        this.drawTickMarks = this.#_drawTickMarks;
    }
    set value(v){
        this.#_value = v;
        this.valueElement.value = v + this.valueExtension;
        this.inputElement.value = v;
    }
    set drawTickMarks(flag){
        this.#_drawTickMarks = flag;
        if(flag){
            this.dataList = new S_DataList(this.name, this.sliderBody);
            let amount = (this.max - this.min) / this.step;
            for(let i = 0; i < amount; i++){
                this.dataList.addOption(i * this.step);
            }
            this.inputElement.setAttribute("list", this.dataList.id);
        } else {
            if(this.dataList != null){
                this.dataList.remove();
                this.dataList = null;
                this.inputElement.removeAttribute("list");
            }
        }
    }
    set label(v){
        this.#_label = v;
        this.labelElement.value = v;
    }
    get label(){
        return this.#_label;
    }
    set showValue(flag){
        this.valueElement.hide = !flag;
    }
    #events(){
        this.inputElement.oninput = function(){
            this.value = this.inputElement.value;
            this.oninput(this.value);
        }.bind(this);
        this.inputElement.onmouseup = function(){
            this.oninputFinished(this.value);
        }.bind(this);
        this.inputElement.onmousedown = function(){
            this.oninputStart(this.value);
        }.bind(this);
    }
    get(){
      return this.element;
    }
  }

class SlideShow_S {
    constructor(parent, name){
        this.parent = parent;
        this.name = name;
        this.id = "slideShow_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("SlideShow_S");
        this.list = [];
        this.onClickElement = function(){};
        this.draw();
    }
    draw(){
        this.mainElement.addEventListener("wheel", function(e){
            if (e.deltaY > 0) {
                this.mainElement.scrollLeft += 100;
                e.preventDefault();
            // prevenDefault() will help avoid worrisome 
            // inclusion of vertical scroll 
            } else {
                this.mainElement.scrollLeft -= 100;
                  e.preventDefault();
            }
        }.bind(this));
        this.innerElement = new SPLINT.DOMElement(this.id + "inner", "div", this.mainElement);
        this.innerElement.Class("inner");
    }
    appendElement(element){
        let listElement = new SPLINT.DOMElement(this.id + "listElement_" + this.list.length, "div", this.innerElement);
            listElement.Class("listElement");
            if(element.getAttribute("value") != null){
                listElement.setAttribute("value", element.getAttribute("value"));
            }
            listElement.onclick = function(){
                this.onClickElement(element, listElement);         
                for(let i = 0; i < this.innerElement.children.length; i++){
                    let ele = document.getElementById(this.innerElement.children[i].id);
                        ele.setAttribute("state", "passive");
                }
                listElement.setAttribute("state", "active");
            }.bind(this);
            listElement.appendChild(element);
            this.list.push(listElement);
    }
    set value(v){
        for(const ele of this.list){
            if(ele.getAttribute("value") == v){
                ele.click();
                return;
            }
        }
    }
    getElement(value = null){
        if(value != null){
            for(const ele of this.list){
                if(ele.getAttribute("value") == value){
                    return ele;
                }
            }
        }
        let ele = new SPLINT.DOMElement(this.id + "listElement_" + this.list.length, "div", this.innerElement);
            ele.setAttribute("value", value);
            ele.Class("listElement");
            this.list.push(ele);
        return ele;
    }
}
/**
 * @deprecated
 */
function spanDiv(parent, name, value){
    let div = new SPLINT.DOMElement(parent.id + "_" + name + "_div", "div", parent);
    // let div = new SPLINT.DOMElement(parent.id + "_" + name + "_div", "div", parent);
    let span = new SPLINT.DOMElement(parent.id + "_" + name + "_span", "span", div);
        span.innerHTML = value;
    this.div  = div;
    this.span = span;
    this.value = function(value){
      span.innerHTML = value;
    }
    this.getValue = function(){
      return span.innerHTML;
    }
    this.setValue = function(value){
      span.innerHTML = value;
    }
    this.Class = function(Newclass){
      function obj(){
        this.set    = function(){
          div.className = Newclass;
          return;
        }
        this.add    = function(){
          div.classList.add(Newclass);
          return;
        }
        this.remove = function(){
          div.classList.remove(Newclass);
          return;
        }
      }
      return new obj();
    }
  }


class SpanDiv {
    static get(parent, name, value){
      return new SpanDiv(parent, name, value);
    }
    constructor(parent, name, value){
        this.id         = "SpanDiv_" + parent.id + "_" + name + "_";
        this.name       = name;
        this.parent     = parent;
        this._value     = value;
        this._hide      = false;
        this.div = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.span = new SPLINT.DOMElement(this.id + "span", "span", this.div);
        this.span.innerHTML = this._value;
    }
    set hide(flag){
        this._hide = flag;
        this.div.setAttribute("hidden", flag);
    }
    isHidden(){
        return this._hide;
    }
    Class(className){
      this.div.Class(className);
    }
    set value(v){
      this.span.innerHTML = v;
      this._value = v;
    }
    get value(){
      return this._value;
    }
}

class Spinner1 {
    constructor(parent, name = "/UID()/"){
        this.parent = parent;
        this.name = name;
        this.id = "Spinner1_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("Spinner1");
        this.mainElement.state().setActive();
        this.draw();
    }
    draw(){
        new SPLINT.DOMElement(null, "div", this.mainElement);
        new SPLINT.DOMElement(null, "div", this.mainElement);
        new SPLINT.DOMElement(null, "div", this.mainElement);
        new SPLINT.DOMElement(null, "div", this.mainElement);
    }
    remove(){
        this.mainElement.remove();
    }
    show(){
        this.mainElement.state().setActive();
    }
    hide(){
        this.mainElement.state().unsetActive();
    }
}

class S_popupWindow {
  constructor(name = "", showBackground = true, drawButtonClose = true){
    this.id = "subWindow_" + name + "_";
    this.showBackground = showBackground;
    this.element  = new SPLINT.DOMElement(this.id + "main", "div", document.body);
    this.element.Class("subWindow_MAIN");
    if(showBackground){
      this.background   = new SPLINT.DOMElement(this.id + "background", "div", this.element);
      this.background.Class("background");
      this.#events();
    }
    this.content      = new SPLINT.DOMElement(this.id + "content", "div", this.element);
    this.content.Class("content");
    if(drawButtonClose){
      this.drawButtonClose();
    }
    this.close = function(){
        this.element.remove();
    }.bind(this)
  }
  get Element(){
    return this.content;
  }
  #events(){
    this.background.onclick = function(e){
      e.stopPropagation();
      this.close();
    }.bind(this);
  }
  Class(className){
    this.element.Class(className);
  }
  append(element){
    this.content.append(element);
  }
  drawButtonClose(){
    this.buttonClose = new S_Button(this.content, "close");
    this.buttonClose.bindIcon("close");
    this.buttonClose.button.Class("button_close");
    this.buttonClose.onclick = function(){
      this.close();
    }.bind(this);
  }
}

class S_SVGElement {
    static NS = "http://www.w3.org/2000/svg";
    constructor(parent, name){
        this.name = name;
        this.id = "S_SVGElement_" + name + "_";
        this.parent = parent;
        this.NS = S_SVGElement.NS;
        this.viewBox = [0, 0, 0, 0];
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
        this.mainElement.Class("S_SVGElement_BODY");
        this.contentElement = S_SVGHelper.createElement(this.NS, "svg", this.id + "content");
        this.mainElement.appendChild(this.contentElement);
        // this.contentElement.Class("S_SVGElement_CONTENT"); 
    }
    Class(className){
        this.mainElement.Class(className);
    }
    newPATH(name){
        let path = new S_SVG_path(name);
        this.addPart(path);
        return path;
    }
    addPart(SVGPart){
        SVGPart.element.id = this.id + SVGPart.element.id;
        this.contentElement.appendChild(SVGPart.element);
    }
    #setAttr(name, value){
        this.contentElement.setAttribute(name, value);
    }
    #getAttr(name){
        return this.contentElement.getAttribute(name);
    }
    set xmlns(link){
        this.#setAttr("xmlns", link);
    }
    setViewBox(x, y, dx, dy){
        this.viewBox = [x, y, dx, dy];
        this.#setAttr("viewBox", x + " " + y + " " + dx + " " + dy)
    }
    getViewBox(){
        return this.viewBox;
    }
    set width(v){
        this.#setAttr("width", v);
    }
    get width(){
        return this.#getAttr("width");
    }
    set height(v){
        this.#setAttr("height", v);
    }
    get height(){
        return this.#getAttr("height");
    }
    static get path(){
        return S_SVG_path;
    }

}

class S_SVGHelper {
    static createElement(NS, tag, id){

        if(document.getElementById(id) != null){
            return document.getElementById(id);
        } else {
            let element = document.createElementNS(NS, tag);
            element.setAttribute("id", id);
            return element;
        }
    }
}

class S_SVGParts {
    // static
}

class S_SVG_path {
    constructor(name) {
        this._name = name;
        this.id = "PART_path_" + name;
        this._path = "";
        this.element = S_SVGHelper.createElement(S_SVGElement.NS, "path", this.id);
        this.element.setAttributeNS(null, "d", "");
        this.element.classList.add(name);
    }
    set name(v){
        this.element.classList.remove(this._name)
        this.element.classList.add(v);
        this._name = v;
    }
    get name() { 
        return this._name;
    }
    Class(className){
        this.element.classList.add(className);
    }
    moveTo(x, y) {
        this.path += "M " + x + "," + y + " ";
    }
    lineTo(x, y) {
        this.path += "L " + x + "," + y + " ";
    }
    close(){
        this.path += "z";
        this.calc();
    }
    calc(){
        this.element.style.strokeDasharray = this.length + ' ' + this.length;
        this.element.style.strokeDashoffset = this.length;
    }
    get length(){
        return this.element.getTotalLength();
    }
    set fill(v){
        this.element.setAttributeNS(null, "fill", v);
    }
    set stroke(v){
        this.element.setAttributeNS(null, "stroke", v);
    }
    set strokeWidth(v){
        this.element.setAttributeNS(null, "stroke-width", v);
    }
    set path(v){
        this._path = v;
        this.element.setAttributeNS(null, "d", v);
    }
    get path(){
        return this.element.getAttributeNS(null, "d");
    }
}

class Table {
    constructor(parent, name, data) {
        this.data = data;
        this.parent = parent;
        this.name = name;
        this.id = "Table_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent)
        this.mainElement.Class("TableMain");
        this.func_drawListElement = function(data, index, listElement){};
        this.func_drawHoverDiv;
        this.func_drawFirstListElement;
    }
    Class(className){
        this.mainElement.Class(className);
    }
    draw(){
        this.listElementMain = new SPLINT.DOMElement(this.id + "listMain", "div", this.mainElement);
        this.listElementMain.Class("ListMain");

        if(typeof this.func_drawFirstListElement == "function"){
            let listElement = new SPLINT.DOMElement(this.id + "listElement_first", "div", this.listElementMain);
                listElement.Class("ListElement");
                listElement.Class("First");
            this.func_drawFirstListElement(listElement)
        }
        for(const index in this.data){
            let data = this.data[index];
            let listElement = new SPLINT.DOMElement(this.id + "listElement_" + index, "div", this.listElementMain);
                listElement.Class("ListElement");
                listElement.setAttribute("index", index);
                this.func_drawListElement(data, index, listElement);
            
            if(typeof this.func_drawHoverDiv == "function"){
                let hoverElement = new SPLINT.DOMElement(this.id + "listElement_hover_" + index, "div", listElement);
                    hoverElement.Class("ListElementHover");
                    this.func_drawHoverDiv(data, index, hoverElement);
            }
        }
    }
    static get List(){
        return Table;
    }
    static get TextTable(){
        return textTable;
    }
    static get Grid(){
        return Table2D;
    }
    static get Masonry(){
        return Table_Masonry;
    }
}

class Table2D {
    constructor(parent, name, rows, cols){
        this.name = name;
        this.id = "Table2D_" + name + "_";
        this.parent = parent;
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("Table2D");
        this.tableElement = new SPLINT.DOMElement(this.id + "TableMain", "table", this.mainElement);
        this.tableElement.Class("Table2DMain");
        this.rowElements = [];
        this.colElements = [];
        this.cols = cols;
        this.rows = rows;
        this.draw();
    }
    draw(){
        for(let iR = 0; iR < this.rows; iR++){
            let row = this.getRow();
                for(let iC = 0; iC < this.cols; iC++){
                    this.getData(iR, iC);
                }
        }
    }
    getHead(){
        let row = new SPLINT.DOMElement(this.id + "TableHead", "tr", this.tableElement);
            row.Class("Table2DHead");
            this.head = row;
            for(let iC = 0; iC < this.cols; iC++){
                this.getData2Head(iC);
            }
        this.tableElement.insertBefore(row, this.rowElements[0]);
        return row;
    }
    getData2Head(column){
        let dataEle = new SPLINT.DOMElement(this.id + "TableData_Head_" + column, "th", this.head);
            dataEle.Class("Table2DData");
        return dataEle;
    }
    getRow(index = null){
        if(index != null){
            return document.getElementById(this.id + "TableRow_" + index);
        } else {
            let row = new SPLINT.DOMElement(this.id + "TableRow_" + (this.rowElements.length-1), "tr", this.tableElement);
                row.Class("Table2DRow");
                row.setAttribute("row", (this.rowElements.length-1));
            this.rowElements.push(row);
            return row;
        }
    }
    getData(row, column){
        if(document.getElementById(this.id + "TableData_" + row + "_" + column) != null){
            return document.getElementById(this.id + "TableData_" + row + "_" + column);
        }
        let dataEle = new SPLINT.DOMElement(this.id + "TableData_" + row + "_" + column, "td", this.rowElements[row]);
            dataEle.Class("Table2DData");
            dataEle.setAttribute("row", row);
            dataEle.setAttribute("col", column);
        return dataEle;
    }
}

class Table_Masonry {
    constructor(parent, name = "", objectArray) {
        this.objectArray = objectArray;
        this.name   = name;
        this.parent = parent;
        this.id = "AdaptiveTable_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("AdaptiveTableMain");
        this.listMain = new SPLINT.DOMElement(this.id + "listMain", "div", this.mainElement);
        this.listMain.Class("ListMain");
        this.#initEvents();
        this.onDrawListElement = function(listElement, index, resolve){};
    }
    #initEvents(){
        window.addEventListener("resize", function(){
            this.update();
        }.bind(this));
    }
    update(){
        this.listMain.innerHTML = "";
        this.ColumnCount = 0;
        this.innerWidth = 0;
        this.index = 0;
        this.draw();
    }
    async expand(objectArray, offset){
          this.offset       = offset;
          this.objectArray  = objectArray;
          this.index++;
          await this.#fillColumns();
    }
    draw(){
        this.innerWidth     = 0;
        this.ColumnCount    = 0;
        this.offset         = 0;
        this.index          = 0;
        this.#generateColumns();
        this.#fillColumns();
    }
    #generateColumns(){
        this.mainWidth    = parseInt(this.listMain.getBoundingClientRect().width);
        this.mainLeft     = parseInt(this.listMain.getBoundingClientRect().left);
        while(this.mainWidth > this.innerWidth){
            let Column = new SPLINT.DOMElement(this.id + "Column_" + this.ColumnCount, "div", this.listMain);
                Column.Class("column");
                Column.setAttribute("index", this.ColumnCount);

            this.innerWidth = parseInt(Column.getBoundingClientRect().right - this.mainLeft);
            this.ColumnCount++;
        }
    }    
    async #fillColumns(){
        if(this.objectArray.length <= 0){
          return false;
        }
        while(await this.#drawListElement(this.index) == 'loaded'){
          if(this.index < this.objectArray.length - 1 + this.offset){
            this.index++;
          } else {
            break;
          }
        }
        return true;
    }
    #drawListElement(index){
        return new Promise(resolve => {
            let value = f1(this.ColumnCount);
            
            let columnElement = document.querySelector(`div[index="${CSS.escape(value)}"]`);
    
            let resolve_func = function(){
                resolve('loaded');
            };
            let listElement = new SPLINT.DOMElement(this.id + "ListElement_" + index, "div", columnElement);
                listElement.Class("ListElement");
            this.onDrawListElement(listElement, index, resolve_func);
        });
        function f1(ColumnCount){
          let value = 100000;
          let index = 0;
          for(let i = 0; i < ColumnCount; i++){
            let height = document.querySelector(`div[index="${CSS.escape(i)}"]`).getBoundingClientRect().height;
            if(height < value){
              value = height;
              index = i;
            }
          }
          return index;
        }
    }
}


class textTable {
    constructor(parent, name, data = {head:[], body:[[]]}) {
        this.parent = parent;
        this.name = name;
        this.setData(data);
    }
    Class(cssClass){
        this.draw();
        this.table2D.mainElement.Class(cssClass);
    }
    setData(obj){
        this.data = obj;
        if(this.data.head.length < 1){
            this.cols = this.data.body
            .map(a=>a.length)
            .indexOf(Math.max(...this.data.body.map(a=>a.length)));
        } else {
            this.cols = this.data.head.length;

        }
        this.rows = this.data.body.length;
        this.draw();
    }
    draw(){
        this.table2D = new Table2D(this.parent, this.name, this.rows, this.cols);
        if(this.data.head.length > 0){
            this.table2D.getHead();
            for(const indexC in this.data.head){
                new SPLINT.DOMElement.SpanDiv(this.table2D.getData2Head(indexC), "", this.data.head[indexC]);
            }
        }
        for(const indexR in this.data.body){
            for(const indexC in this.data.body[indexR]){
                new SPLINT.DOMElement.SpanDiv(this.table2D.getData(indexR, indexC), "", this.data.body[indexR][indexC]);
            }
        }
    }
    setHead(...names){
        this.data.head = names;
        this.setData(this.data);
        this.draw();
    }
    setRow(index = null, ...names){
        if(index != null && this.data.body.length >= index){
            this.data.body[index] = names;
        } else {
            this.data.body.push(names);
        }
        this.setData(this.data);
        this.draw();
    }
    addRow(...names){
        this.data.body.push(names);
        this.setData(this.data);
        this.draw();
    }
}

class S_TextView {
    constructor(parent, name = ""){
        this.parent = parent;
        this.name = name;
        this.id = "S_TextView_" + parent.id + "_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("s-TextView");
        this.paragraph = new SPLINT.DOMElement(this.id + "paragrapth", "p", this.mainElement);
    }
    #value = "";
    set value(v){
        this.#value = v;
        this.paragraph.innerHTML = v;
    }
    get value(){
        return this.#value;
    }
}

class Tooltip_S {
    constructor(value, direction, parent) {
        this.parent = parent;
        this.value = value;
        this.direction = direction;
        this.id = parent.id + "_tooltip";
        this.gen();
    }
    gen(){
        this.parent.classList.add("tooltip_S");
        this.parent.setAttribute("data-tooltip-direction", this.direction);
        this.parent.setAttribute("data-tooltip-value", this.value);
    }
}

const EMAIL_S = new Object();

class email_S {
    static PATH = SPLINT.PATHS.php.email;
    static #call(data){
        data.login = EMAIL_S.login;
        return CallPHP_S.call(this.PATH, data);
    }

    static save_by_index(start = 0, amount = 10){
        let data = CallPHP_S.getCallObject("SAVE_BY_INDEX");
            data.index = new Object();
            data.index.start  = start;
            data.index.amount = amount;
        return this.#call(data).toObject(true);
    }
    
    /**
     * set current login data
     *
     * @param {Object}  login             login Object
     * @param {string}  login.server      imap server
     * @param {int}     login.port        imap port
     * @param {string}  login.email       email address
     * @param {string}  login.password    password
     *
     * @return  {void}         
     */
    static setLogin(login){
        EMAIL_S.login = login;
    }

    /**
     * set login to null
     *
     * @return  {void}
     */
    static clearLogin(){
        EMAIL_S.login = null;
    }

    /**
     * check if login is set
     *
     * @return  {bool}
     */
    static isLoggedIn(){
        if(EMAIL_S.login != undefined && EMAIL_S.login != null){
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param {int} start       count from last email 
     * @param {int} [amount]    amount of emails
     * @returns {array}         array of emails 
     */
    static get_by_index(start, amount = 1){
      let data = CallPHP_S.getCallObject("GET_BY_INDEX");
          data.index = new Object();
          data.index.start  = start;
          data.index.amount = amount;
      return this.#call(data).toObject(true);
    }
    /**
     * @param {int} UID         unique ID of email
     * @returns {object}        email as object
     */
    static get_by_UID(UID){
      let data = CallPHP_S.getCallObject("GET_BY_UID");
          data.UID = UID;
      return this.#call(data).toObject(true);
    }

    /**
     * @param {int} start       count from last email 
     * @param {int} [amount]    amount of emails
     * @returns {array}         array of emails 
     */
    static getHeader(start, amount = 1){
      let data = CallPHP_S.getCallObject("GET_HEADER_BY_INDEX");
          data.index = new Object();
          data.index.start  = start;
          data.index.amount = amount;
      return this.#call(data).toObject(true);
    }

    static getHeaderByUID(UID){
      let data = CallPHP_S.getCallObject("GET_HEADER_BY_UID");
          data.UID = UID;
      return this.#call(data).toObject(true);
    }

    /** 
     * @param {emailFilterObj_S} filterObj   - filter information
     * @returns {object} array of emails 
     */
    static filter(filterObj){
        let data = CallPHP_S.getCallObject("FILTER");
            data.query = filterObj.parse();
        return this.#call(data).toObject(true);
    }

    static remove(...numbers){
        let data = CallPHP_S.getCallObject("REMOVE_MAIL");
            data.mailNumbers = numbers;
        return this.#call(data).toObject(true);
    }
    static remove_by_UID(UID){
        let data = CallPHP_S.getCallObject("REMOVE_MAIL_UID");
            data.UID = UID;
        return this.#call(data).toObject(true);
    }
}

class emailFilterObj_S {
    constructor() {
        this.ALL        = false;
        this.ANSWERED   = false;
        this.BCC        = null;
        this.BEFORE     = null;
        this.BODY       = null;
        this.CC         = null;
        this.DELETED    = false;
        this.FLAGGED    = false;
        this.FROM       = null;
        this.KEYWORD    = null;
        this.NEW        = false;
        this.OLD        = false;
        this.ON         = null;
        this.RECENT     = false;
        this.SEEN       = false;
        this.SINCE      = null;
        this.SUBJECT    = null;
        this.TEXT       = null;
        this.TO         = null;
        this.UNANSWERED = false;
        this.UNDELETED  = false;
        this.UNFLAGGED  = false;
        this.UNKEYWORD  = null;
        this.UNSEEN     = false;
    }
    parse(){
        let res = "";
        for(const key in this){
            if(this[key] != null && this[key] != false){
                if(this[key] === true){
                    res += key + " ";
                } else {
                    res += key + " \"" + this[key] + "\" ";
                }
            }
        }
        console.log(res);
        return res;
    }
}

var SPLINT_EVENTS = new Object();

SPLINT_EVENTS.onStateChange       = new CustomEvent("S_onStateChange");
SPLINT_EVENTS.NonStateChange       = new CustomEvent("S_NonStateChange");
SPLINT_EVENTS.toModule            = new CustomEvent("S_toModule");
SPLINT_EVENTS.toCommonJS          = new CustomEvent("S_toCommonJS");
SPLINT_EVENTS.loadedCompletely    = new CustomEvent("S_loadedCompletely");

//Neuer prototype für DOM

Object.defineProperty(HTMLElement.prototype, 'S_onStateChange', {
  set: function(func){
    this.addEventListener("S_onStateChange", function(e){
      func(e, this.state().get());
    });
  }
});

Object.defineProperty(HTMLElement.prototype, 'S_NonStateChange', {
    set: function(func){
      this.addEventListener("S_NonStateChange", function(e){
        func(e, this.getAttribute("s-state"));
      });
    }
  });

Object.defineProperty(HTMLElement.prototype, 'S_toModule', {
  set: function(func){
    this.addEventListener("S_toModule", function(e){
      func(e, this.Storage, this.getAttribute("LighterData"));
    });
  }
});

Object.defineProperty(HTMLElement.prototype, 'S_toCommonJS', {
  set: function(func){
    this.addEventListener("S_toCommonJS", function(e){
      func(e, this.Storage, this.getAttribute("LighterData"));
    });
  }
});

Object.defineProperty(HTMLElement.prototype, 'onEnter', {
  set: function(func){
    this.addEventListener("keyup", function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.click();
        func(event);
      }
    }.bind(this));
  }
});

// Object.defineProperty(HTMLElement.prototype, 'SPLINT', {
//   get: function(){
//     return new S_DOMEvents(this);
//   }
// });

class S_Events {
    static #onLoadingComplete   = this.#new("S_onLoadingComplete");
    static #onInitComplete      = this.#new("S_onInitComplete");
    static {
        this.eventTarget = new EventTarget();
        this.#applyEvent(this.#onInitComplete, {once : true});
        this.#applyEvent(this.#onLoadingComplete, {once : true});
    }
    static set onInitComplete(func){
        this.#onInitComplete.STACK.push(func);
    }
    static get onInitComplete(){
        return this.#onInitComplete;
    }
    static set onLoadingComplete(func){
        this.#onLoadingComplete.STACK.push(func);
    }
    static get onLoadingComplete(){
        return this.#onLoadingComplete;
    }
    static #applyEvent(event, options = {}){
        this.eventTarget.addEventListener(event.type, function f(e){
            for(const ev of e.STACK){
                ev(e);
            }
        }.bind(this), options);
    }
    static #new(name){
        let a = new CustomEvent(name);
            a.STACK = [];
            a.dispatched = false;
            a.dispatch = function(){
                this.eventTarget.dispatchEvent(a);
                a.dispatched = true;
            }.bind(this);
        return a;
    }

}

// class S_Events3D {
//     static #on = this.#new("S_onReceiveData3D");
//     static #on
//     static {
//         this.eventTarget = new EventTarget();
//         this.#applyEvent(this.#onLoadingComplete, {once : true});
//     }
//     static set onLoadingComplete(func){
//         this.#onLoadingComplete.STACK.push(func);
//     }
//     static get onLoadingComplete(){
//         return this.#onLoadingComplete;
//     }
//     static #applyEvent(event, options = {}){
//         this.eventTarget.addEventListener(event.type, function f(e){
//             for(const ev of e.STACK){
//                 ev(e);
//             }
//         }.bind(this), options);
//     }
//     static #new(name){
//         let a = new CustomEvent(name);
//             a.STACK = [];
//             a.dispatch = function(){
//                 this.eventTarget.dispatchEvent(a);
//             }.bind(this);
//         return a;
//     }

// }

class S_exButton extends S_DOMElement {
    static { 
        this.TAG_NAME = "s-button";
    }
    // static get observedAttributes() { return ['name', 'value', 'type', 'step', 'min', 'max', 'pattern']; }
    constructor(parent, name, value = ""){
        super();
        this.parent     = parent;
        this.id         = "S_exButton_" + parent.id + "__" + name + "__";
        this.button = new SPLINT.DOMElement(this.id + "main", "button", this);
            this.span = new SPLINT.DOMElement(this.id + "span", "span", this.button);
            this.span.innerHTML = "value";
        // this.initEvents();
    }
    // onEnter           = function(e){};
    // set step(v){ this.setAttribute("step", v) }
    // get step(){ return this.getAttribute("step") }
    // set type(v){ this.setAttribute("type", v) }
    // get type(){ return this.getAttribute("type") }
    // set value(v){ this.setAttribute("value", v) }
    // get value(){ return this.getAttribute("value") }
    // set name(v){ this.setAttribute("name", v) }
    // get name(){ return this.getAttribute("name") }
    // set min(v){ this.setAttribute("min", v) }
    // get min(){ return this.getAttribute("min") }
    // set max(v){ this.setAttribute("max", v) }
    // get max(){ return this.getAttribute("max") }
    // set pattern(v){ this.setAttribute("pattern", v) }
    // get pattern(){ return this.getAttribute("pattern") }
    // draw(){
    //     for(const index in this.name){
    //         let val = this.name[index];
    //         let labelPart = new SPLINT.DOMElement(this.id + "labelPart_" + index, "span", this.label);
    //             labelPart.innerHTML = val;
    //             labelPart.setAttribute("index", index);
    //             if(this.transitionMultiplyer != 0){
    //                 labelPart.style.transitionDelay = index * this.transitionMultiplyer + "ms";
    //             }
    //         this.labelParts.push(labelPart);
    //     };
    // }
    // valid(value = ""){
    //     this.responseDiv.value = value;
    //     this.input.state().setActive();
    // }
    // invalid(value = ""){
    //     this.responseDiv.value = value;
    //     this.input.state().unsetActive();
    // }
    // initEvents(){ 
    //     this.input.addEventListener("keyup", function(event){
    //         if(event.key === "Enter"){
    //             event.preventDefault();
    //             this.onEnter();
    //         }
    //     }.bind(this));
    //     this.input.oninput = function(e){
    //         this.value = this.input.value;
    //         this.oninput(e);
    //         this.valid();
    //         if(this.input.value == ""){
    //         this.input.Class("filled").remove();
    //         } else {
    //         this.input.Class("filled");
    //         }
    //     }.bind(this);
    //     this.input.S_onStateChange = function(e, state){
    //     }.bind(this);
    // }
    // drawToggleButton(value){
    //     this.button = new S_switchButton(this.inputBody, "button", value);
    //     return this.button;
    // }
    // disableAnimation(){
    //     this.input.oninput = function(){};
    // }
    attributeChangedCallback(name, oldValue, newValue) {
        this.onAttributeChanged(name, oldValue, newValue);
        // if(name == "value"){
        //     this.input.value = newValue;
        // }
        // if(name == "type"){
        //     this.input.type = newValue;
        // }
        // if(name == "name"){
        //     this.draw();
        // }
        // if(name == "step"){
        //     this.input.setAttribute("step", newValue);
        // }
        // if(name == "min"){
        //     this.input.setAttribute("min", newValue);
        // }
        // if(name == "max"){
        //     this.input.setAttribute("max", newValue);
        // }
        // if(name == "pattern"){
        //     this.input.setAttribute("pattern", newValue);
        // }
    }
}


SPLINT.require_now("@SPLINT_ROOT/Experimental/ex_DOMElement.js");
class S_Input extends S_DOMElement {
    static { 
        this.TAG_NAME = "s-input";
    }
    static get observedAttributes() { return ['name', 'value', 'type', 'step', 'min', 'max', 'pattern', 'identifier']; }
    constructor(parent, name, value = "", transitionMultiplyer = 10){
        super();
        this.parent     = parent;
        this.transitionMultiplyer = transitionMultiplyer;
        this.id         = "S_Input_" + parent.id + "__" + name + "__";
        this.labelParts = [];
            this.inputBody = new SPLINT.DOMElement(this.id + "inputContainer", "div", this);
            this.inputBody.Class("inputBody");
                this.input = new SPLINT.DOMElement(this.id + "input", "input", this.inputBody);
                this.value      = value;
                this.name       = name;
                this.type       = "value";
                this.input.setAttribute("required", "");

                this.label = new SPLINT.DOMElement(this.id + "label", "label", this.inputBody);

            this.responseDiv = new SPLINT.DOMElement.SpanDiv(this, "response", "");
            this.responseDiv.div.Class("response");
        this.draw();
        this.oninput            = function(e){};
        this.initEvents();
    }
    onEnter           = function(e){};
    set step(v){ this.setAttribute("step", v) }
    get step(){ return this.getAttribute("step") }
    set type(v){ this.setAttribute("type", v) }
    get type(){ return this.getAttribute("type") }
    set value(v){ this.setAttribute("value", v) }
    get value(){ return this.getAttribute("value") }
    set name(v){ this.setAttribute("name", v) }
    get name(){ return this.getAttribute("name") }
    set min(v){ this.setAttribute("min", v) }
    get min(){ return this.getAttribute("min") }
    set max(v){ this.setAttribute("max", v) }
    get max(){ return this.getAttribute("max") }
    set pattern(v){ this.setAttribute("pattern", v) }
    get pattern(){ return this.getAttribute("pattern") }
    set identifier(v){ this.setAttribute("identifier", v) }
    get identifier(){ return this.getAttribute("identifier") }
    draw(){
        for(const index in this.name){
            let val = this.name[index];
            let labelPart = new SPLINT.DOMElement(this.id + "labelPart_" + index, "span", this.label);
                labelPart.innerHTML = val;
                labelPart.setAttribute("index", index);
                if(this.transitionMultiplyer != 0){
                    labelPart.style.transitionDelay = index * this.transitionMultiplyer + "ms";
                }
            this.labelParts.push(labelPart);
        };
    }
    valid(value = ""){
        this.responseDiv.value = value;
        this.input.state().setActive();
    }
    invalid(value = ""){
        this.responseDiv.value = value;
        this.input.state().unsetActive();
    }
    initEvents(){ 
        this.input.addEventListener("keyup", function(event){
            if(event.key === "Enter"){
                event.preventDefault();
                this.onEnter();
            }
        }.bind(this));
        this.input.oninput = function(e){
            this.value = this.input.value;
            this.oninput(e);
            this.valid();
            if(this.input.value == ""){
            this.input.Class("filled").remove();
            } else {
            this.input.Class("filled");
            }
        }.bind(this);
        this.input.S_onStateChange = function(e, state){
        }.bind(this);
    }
    drawToggleButton(value){
        this.button = new S_switchButton(this.inputBody, "button", value);
        return this.button;
    }
    disableAnimation(){
        this.input.oninput = function(){};
    }
    isEmpty(){
        if(this.value == "" || this.value == null){
            return true;
        }
        return false;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.onAttributeChanged(name, oldValue, newValue);
        if(name == "value"){
            this.input.value = newValue;
        }
        if(name == "type"){
            this.input.type = newValue;
        }
        if(name == "name"){
            this.draw();
        }
        if(name == "step"){
            this.input.setAttribute("step", newValue);
        }
        if(name == "min"){
            this.input.setAttribute("min", newValue);
        }
        if(name == "max"){
            this.input.setAttribute("max", newValue);
        }
        if(name == "pattern"){
            this.input.setAttribute("pattern", newValue);
        }
        if(name == "identifier"){
            this.input.setAttribute("identifier", newValue);
        }
    }
}

// class n_ex_input  extends HTMLElement {
//     static HTML_template;
//     static {
//         let xhr = new XMLHttpRequest(); 
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState === 4) {    
//                     ex_input.HTML_template = xhr.responseText;
//                     document.head.append(new DOMParser().parseFromString(xhr.responseText, 'text/html').querySelector('template'))
                      
//                     //do something with xhr.responseText
//                 }   
//             };      
//             xhr.open('GET', '/Splint/html/ex_inputTemplate.html');
//             xhr.send();  
//     }
//     static get observedAttributes() { return ['c', 'l']; }
//     constructor(parent, name, value = 10/*, transitionMultiplyer = 10*/){
//         super();

//         let s = new CSSStyleSheet();
//         s.replaceSync("a { color: red; }");
//         this.SHADOW = this.attachShadow({mode: 'open'});
//         let style = document.createElement("link");
//         style.setAttribute("rel", "styleshfdreet");
//         let b = document.querySelectorAll("link[rel='stylesheet']");
//         for(const style of b) {
//             console.log(style);
//             // this.SHADOW.appendChild(style.cloneNode(true));
//         }
//         // this.SHADOW.styleSheets = [s];
//         console.dir(this)
//         this.parent = parent;
//         this.value  = value;
//         this.name   = name;
//         this.setAttribute("ok", "ok")
//         // this.id = parent.id + "_n_InputDiv_" + name + "_";
//         // this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
//         // this.mainElement.Class("n_inputDiv");
//             this.SHADOW.appendChild(document.getElementById("SPLINT_template__exinput").content)
//             this.inputBody = new SPLINT.DOMElement(this.id + "input_Body", "div", this.SHADOW);
//             // this.inputBody.Class("inputBody");
//             // this.inputBody.setAttribute("part", "inputBody");

//             //     this.input = new SPLINT.DOMElement(this.id + "input", "input", this.inputBody);
//             //     this.input.setAttribute("type", "value");
//             //     this.input.setAttribute("required", "");
//             //     this.input.setAttribute("part", "input");

//             //     this.label = new SPLINT.DOMElement(this.id + "label", "label", this.inputBody);
//             //     this.transitionMultiplyer = 10;

//             // this.responseDiv = new spanDiv(this.SHADOW, "response", "");
//             // this.responseDiv.div.Class("response");
//         this.draw();
//         // this.oninput = function(e){};
//         // this._onEnter = function(e){};
//         // this.initEvents();
//         parent.appendChild(this);
//     }
//     attributeChangedCallback(name, oldValue, newValue) {
//         console.log('Custom square element attributes changed.');
//         // updateStyle(this);
//     }
//     connectedCallback() {
//         console.log('Custom square element added to page.');
//         // updateStyle(this);
//     }
//     disconnectedCallback() {
//         console.log('Custom square element removed from page.');
//     }
//     adoptedCallback() {
//         console.log('Custom square element moved to new page.');
//     }
//     // set onEnter(func){
//     //     this._onEnter = func;
//     //     this.initEvents();
//     // }
//     // get onEnter(){
//     //     return this._onEnter;
//     // }
//     draw(){
//         for(const index in this.value){
//             let val = this.value[index];
//             let valuePart = new SPLINT.DOMElement(this.id + "valuePart_" + index, "span", this.label);
//                 valuePart.innerHTML = val;
//                 valuePart.setAttribute("index", index);
//                 if(this.transitionMultiplyer != 0){
//                     valuePart.style.transitionDelay = index * this.transitionMultiplyer + "ms";
//                 }
//         };
//     }
//     valid(value = ""){
//         this.responseDiv.setValue(value);
//         this.input.state().setActive();
//     }
//     invalid(value = ""){
//       this.responseDiv.setValue(value);
//       this.input.state().unsetActive();
//     }
//     initEvents(){ 
//         this.input.oninput = function(e){
//             this.oninput(e);
//             this.valid();
//             if(this.input.value == ""){
//             this.input.Class("filled").remove();
//             } else {
//             this.input.Class("filled");
//             }
//         }.bind(this);
//         this.input.S_onStateChange = function(e, state){
//         }.bind(this);
//         this.input.onEnter = this._onEnter;
//     }
//     // drawToggleButton(value){
//     //     this.button = new S_switchButton(this.inputBody, "button", value);
//     //     return this.button;
//     // }
//     // disableAnimation(){
//     //     this.input.oninput = function(){};
//     // }
//     // get value(){
//     //   return this.input.value;
//     // }
//     // set value(value){
//     //   this.input.value = value;
//     //   this._value = value;
//     // }
//     // set type(type){
//     //   this.input.type = type;
//     // }
//     // remove(){
//     //     this.mainElement.remove();
//     // }
// }


class SPLINT_Experimental {
    static get DOMElement(){
        return S_DOMElement;
    }
}

class S_DOMElement extends HTMLElement {
    static set TAG_NAME(tagName){
        customElements.define(tagName, this);
    }
    constructor(){
        super();
    }
    set parent(parent){
        parent.appendChild(this);
    }
    onCreated           = function(){};
    onRemove            = function(){};
    onAttributeChanged  = function(){};
    
    attributeChangedCallback(name, oldValue, newValue) {
        this.onAttributeChanged(name, oldValue, newValue);
    }
    connectedCallback() {
        this.onCreated(this);
    }
    disconnectedCallback() {
        this.onRemove(this);
    }
    adoptedCallback() {}

    static get Input(){
        return S_Input;
    }
    static get Button(){
        return S_exButton;
    }
    static get Chart(){
        return S_Chart;
    }
}


// class S_Manager extends SPLINT.CallPHP.Manager {
//     static PATH = SPLINT.PATHS.Access;
//     static edit(path, content = ""){
//         let call = this.callPHP("EDIT");
//             call.data.path    = path;
//             call.data.content = content;
//         return call.send();
//     }
//     static get(path){
//         let call = this.callPHP("GET");
//             call.data.path = path;
//         return call.send();
//     }
// }
class S_Location {
    constructor(location){
      this.hashes     = "";
      this.location   = location;
    }
    static get Location(){
      return window.location.origin + window.location.pathname;
    }
    static back(steps = -1){
      window.history.go(steps);
    }
    static setHash(...hashes){
      let output = "";
      hashes.forEach(function (hash){
        output += "#" + hash;
      });
      window.location.hash = output;

    }
    setHash(...hashes){
      let output = "";
      hashes.forEach(function (hash){
        output += "#" + hash;
      });
      this.hashes = output;
      return this;
    }
    static getParams(){
      let string = window.location.search;
          string = string.replace("?", "").split('&');
      let response = new Object();
          for(const param of string){
            let array = param.split('=');
                response[array[0]] = array[1];
          }
      return response;
    }
    static getHashes(){
      let string = window.location.hash;
      let array = string.split("#");
          array.splice(0, 1);
          if(array.length == 1){
            return array[0];
          } else {
            return array;
          }
    }
    static goto(location = S_Location.Location){
      return new S_Location(location);
    }
    setLocation(location){
      this.location = location;
    }
    getURL(){
      if(this.hashes != ""){
        return this.location + "?" + this.hashes;
      } else {
        return this.location;
      }
    }
    call(){
      window.location.href = this.getURL();
    }
  }

class ShoppingCart_S {
    static addItem(variantID, amount, Itemprice, productID){
        let cart = this.get();
        
        for(const index in cart.items){
            if(cart.items[index].variantID == variantID){
                cart.items[index].amount += amount;
                Cookie.set("ds_cart", JSON.stringify(cart));
                return;
            }
        }
        let obj = new Object();
            obj.variantID   = variantID;
            obj.amount      = amount;
            obj.price       = Itemprice;
            obj.productID   = productID;
            cart.items.push(obj);
        Cookie.set("ds_cart", JSON.stringify(cart));
    }
    static changeAmount(variantID, amount){
        let cart = this.get();
        
        for(const index in cart.items){
            if(cart.items[index].variantID == variantID){
                cart.items[index].amount = amount;
                Cookie.set("ds_cart", JSON.stringify(cart));
                return;
            }
        }
    }
    static removeItem(variantID){
        let cart = this.get();
        for(const index in cart.items){
            if(cart.items[index].variantID == variantID){
                cart.items.splice(index)
                Cookie.set("ds_cart", JSON.stringify(cart));
                return;
            }
        }

    }
    static get(){
        let cookies = Cookie.get();
        console.log(cookies);
        if(cookies.ds_cart != undefined){
            return cookies.ds_cart;
        } else {
            let cart = new Object();
                cart.items = [];
            Cookie.set("ds_cart", JSON.stringify(cart));
            return cart;
        }
    }

}






function login_Google_callback(response){
    let loginData = (LoginGoogle_S.parseCredentials(response));
        console.log(loginData);
  }

class LoginGoogle_S {
    static loadConfig(){
        SPLINT.config.google =  JSON.parse($.ajax({
          url: '../' + SPLINT.PROJECT_NAME + '/Splint/splint.config/config.loginGoogle.json',
            async: false
        }).responseText);
        return SPLINT.config.google;
    }
    static init(){
        this.loadConfig();

        console.log(Cookie.get("g_state"));
        if(document.getElementById("g_id_onload") != null){
          document.getElementById("g_id_onload").remove();
        }
        let div = new SPLINT.DOMElement("g_id_onload", "div", document.body);
            div.setAttribute("data-auto_prompt", "true");
            div.setAttribute("data-client_id", SPLINT.config.google.clientID);
            // div.style = "z-index: 1000; position: absolute; left: 0; top: 0;";
        //if(!login.isLoggedIn()){
          LoginGoogle_S.drawPopUp(div);
        //}
    }
    static drawPopUp(div){
          div.setAttribute("data-auto_select" ,"true");
          div.setAttribute("data-auto_prompt", "true");
          div.setAttribute("data-client_id", SPLINT.config.google.clientID);
          div.setAttribute("data-context", "signin");
          div.setAttribute("data-ux_mode", "popup");
          div.setAttribute("data-callback", "login_Google_callback");
    }
    static parseCredentials(data){
      return JSON.parse(ASCII_2_base64(data.credential.split(".")[1]));
    }
    static drawLoginButton(parent){
      let div = new SPLINT.DOMElement("g_id_signin", "div", parent);
          div.Class("g_id_signin");
          div.setAttribute("data-type", "standard");
          div.setAttribute("data-shape", "rectangular");
          div.setAttribute("data-theme", "outline");
          div.setAttribute("data-text", "signin_with");
          div.setAttribute("data-size", "medium");
          div.setAttribute("data-logo_alignment", "left");
          div.setAttribute("data-callback", "login_Google_callback");
          // this.drawLogoutButton();
    }
}

class CSV_S {
    static save(filename, data) {
        const blob = new Blob([data], {type: 'text/csv'});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else{
            const elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob);
            elem.download = filename;        
            document.body.appendChild(elem);
            elem.click();        
            document.body.removeChild(elem);
        }
    }

}

class S_DateTime {
    static get Timer(){
        return S_Timer;
    }
    /**
     * @description get real UNIX-time in seconds
     */
    static getUnixTime(){
        return Math.round(Date.now()/1000);
    }
    /**
     * @param {DateTime} date  
     * @returns {string} dateTime string formatted for MySQL
     */
    static parseToMySqlDateTime(date){
        new Date();
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
    static timeDiffSec( tstart, tend ) {
        return Math.floor((tend - tstart) / 1000);
    }
    static timeDiff( tstart, tend ) {
        var diff = Math.floor((tend - tstart) / 1000), units = [
          { d: 60, l: "seconds" },
          { d: 60, l: "minutes" },
          { d: 24, l: "hours" },
          { d: 7, l: "days" }
        ];
      
        var s = '';
        for (var i = 0; i < units.length; ++i) {
          s = (diff % units[i].d) + " " + units[i].l + " " + s;
          diff = Math.floor(diff / units[i].d);
        }
        return s;
      }
}

class S_Timer {
    constructor(autoStart = true) {
        this.autoStart = autoStart;
        if(this.autoStart) {
            this.start();
        }
    }
    start(){
        this.TimeStart  = new Date();
    }
    end(){
        this.TimeEnd    = new Date();
        let res = this.#calc(this.TimeStart, this.TimeEnd);
        console.table(res);
    }
    take(){
        let t = new Date();
        let res = this.#calc(this.TimeStart, t);
        console.table(res);
    }
    #calc(timeFrom, timeTo){
        let date2 = new Date();
        console.log(timeFrom, date2)
        
        let obj = new Object();
        let diff = timeTo.getTime() - timeFrom.getTime();
        
        obj.days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -=  obj.days * (1000 * 60 * 60 * 24);
        
        obj.hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= obj.hours * (1000 * 60 * 60);
        
        obj.mins = Math.floor(diff / (1000 * 60));
        diff -= obj.mins * (1000 * 60);
        
        obj.seconds = Math.floor(diff / (1000));
        diff -= obj.seconds * (1000);
        // console.table(obj)
        return obj;
        // this.TimeLast   = date2;
    }
}

class download_S {
    static download(uri = PATH.images.logo, name = "test"){
        
        var link = document.createElement("a");
        // If you don't know the name or want to use
        // the webserver default set name = ''
        link.setAttribute('download', name);
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}


// function DownloadNC(orderID, blob) {
//     // let order = getOrderDataByID(orderID);
//     // let orderData = JSON.parse(order["OrderData"]);
//     // let projectData = getProjectData(order["UserID"], orderData[itemID]["projectID"]);
//     // let blob = projectData["FullNC0"];
//     var link = document.createElement("a");
//     link.href = "data:text/plain;base64," + blob;
//     link.setAttribute('download', orderID + "_GCode.nc");
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
// }

class S_encryption {
    static simple = class {
        static encrypt(key, text){
            const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
            const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
            const applySaltToChar = (code) => textToChars(key).reduce((a, b) => a ^ b, code);
          
            return text
              .split("")
              .map(textToChars)
              .map(applySaltToChar)
              .map(byteHex)
              .join("");
          };
          static decrypt(key, encoded){
            const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
            const applySaltToChar = (code) => textToChars(key).reduce((a, b) => a ^ b, code);
            return encoded
              .match(/.{1,2}/g)
              .map((hex) => parseInt(hex, 16))
              .map(applySaltToChar)
              .map((charCode) => String.fromCharCode(charCode))
              .join("");
          };
          
    }
    static async  generateKey() {
        const key = await crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true, ['encrypt', 'decrypt']
        );
        return key;
      }
      static async encryptData(key, data) {
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encodedData = encoder.encode(data);
        const encryptedData = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv },
          key, encodedData
        );
      
        return { iv, encryptedData: new Uint8Array(encryptedData) };
      }
      
      static async decryptData(key, iv, encryptedData) {
        const decryptedData = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          key, encryptedData
        );
      
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
      }
      
}

class S_Iterator {
    constructor(step = 1, min = 0, max = Infinity){
        this.max    = max;
        this.step   = step;
        this.min    = min;
        this.iterable = this.#func_iter();
    }
    #index;
    next(){
        let n = this.iterable.next();
        if(this.max == Infinity || this.min == -Infinity){
            return n.value;
        } else {
            return n;
        }
    }
    *#func_iter() {
        this.#index = this.min;
        while (this.#index < this.max && this.#index >= this.min) {
            yield this.#index;
            this.#index += this.step;
        }
    }
    reset(){
        this.iterable = this.#func_iter();
    }
    set(value = 0){
        this.#index = value;
    }
}
// // // 
//         let obj = new Object();
//         obj.a = "a";
//         obj.b = "g";
// //   const iterator = new S_Iterator(obj);

//   let iterator = new S_Iterator(2);
//     // iterator.
  
//   // Expected output: 0
  
//   console.log(iterator.next());
//   console.log(iterator.next());
//   console.log(iterator.next());
//   iterator.reset();
//   console.log(iterator.next());
//   console.log(iterator.next());
//   console.log(iterator.next());
//   // Expected output: 1
  

  class S_JSON {
    /**
     * @deprecated
     * @param {string} string 
     * @returns 
     */
    static parseIf(string){
      try {
        return JSON.parse(string);
      } catch(e){
        return string;
      }
    }
    static escapeHTML(str){
      let tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
      };
      return str.replace(/[&<>]/g, function(tag){
        return tagsToReplace[tag] || tag;
      });
    }
  }

class nS_Location {
    static {
        this.STORAGE = new Object();
        this.STORAGE.hashes = this.#queryHashes();
        this.STORAGE.params = this.getParams();
        this.href = location.href.split("?")[0].split("#")[0];
        window.addEventListener("hashchange", function(e){
            this.STORAGE.hashes = this.#queryHashes();
        }.bind(this))
    }
    static set URL(v){
        this.href = v.split("?")[0].split("#")[0];
    }
    static get URL(){
        return this.href;
    }
    static set hash(v){
        window.location.hash = v;
    }
    static get hashes() {
        return window.location.hash
    }
    static goBack(steps = -1){
        window.history.go(steps);
    }
    static #queryHashes(){
        
        let hashes = window.location.hash.split("#")
            hashes = SArray.removeValues(hashes, '');
        return hashes;
    }
    static addHash(...hashes){
        this.#queryHashes();
        this.STORAGE.hashes = SArray.combine(this.STORAGE.hashes, hashes);
        return this;
    }
    static getHashes(){
        this.STORAGE.hashes = this.#queryHashes();
        console.log(this.STORAGE.hashes);
        return this.STORAGE.hashes;
    }
    static removeHash(...hash){
        let res = SArray.removeValues(window.location.hash.split("#"), [hash, ''].flat());
        window.location.hash = "#" + (res.join('#'));
    }
    /**
     * @description
     * adds or edits the given parameters to the url
     * @param  {...object | Array } params 
     * @example can handle the folowing input formats
     * - {"key": "value"}, {"key1": "value1"}...
     * - {"key": "value"}, ["key1", "value1"]...
     * - ["key", "value"], ["key1", "value1"]...
     * - {"key": "value", "key1": "value1"...}...
     * @returns this
     */  
    static addParams(...params){
        if(params.length == 1){
            params = Object.entries(...params)
        }
        for(const e of params){
            if(Array.isArray(e)){
                this.STORAGE.params[e[0]] = e[1];
            } else if(typeof e == 'object'){
                let o = Object.entries(e)[0];
                this.STORAGE.params[o[0]] = o[1];
            }
        }
        return this;
    }
    /**
     * @description
     * removes the given parameters from the url
     * @param  {...string} params 
     * @returns this
     */  
    static removeParams(...params){
        for(const e of params){
            let index = this.STORAGE.params.indexOf(e);
            if(index !== -1){
                this.STORAGE.params.splice(index, 1);
            }
        }
        return this;
    }
    /**
     * @description
     * sets the given parameters to the url
     * @param  {...object | Array } params 
     * @example can handle the folowing input formats
     * - {"key": "value"}, {"key1": "value1"}...
     * - {"key": "value"}, ["key1", "value1"]...
     * - ["key", "value"], ["key1", "value1"]...
     * - {"key": "value", "key1": "value1"...}...
     * @returns this
     */  
    static setParams(...params){
        this.STORAGE.params = new Object();
        this.addParams(...params);
        return this;
    }
    /**
     * @description
     * - returns all paramters of the url as an Object.
     * - returns empty object if no parameter is set.
     * @returns {Object} Object of parameters
     * @example returns 
     * {"key":"value", "key1": "value1"...} 
     */
    static getParams(){
        let string = window.location.search;
            if(string == ""){
                return new Object();
            }
            string = string.replace("?", "").split('&');
            let response = new Object();
                for(const param of string){
                let array = param.split('=');
                    response[array[0]] = array[1];
                }
        return response;
    }
    static call(reload = true){
        for(const e of Object.entries(this.STORAGE.params)){
            if(!this.href.includes("?")){
                this.href = this.href + "?";
            } else {
                if(!this.href.endsWith("&")){
                    this.href = this.href + "&";
                }
            }
            this.href = this.href + e[0] + "=" + e[1];
        }
        this.href = this.href.split("#")[0];
        for(const e of this.STORAGE.hashes){
            this.href = this.href + "#" + e;
        }
        console.log(this.href);
        if(reload){
            window.location.href = this.href;
        } else {
            window.history.pushState(null, null, this.href);
        }
    }
    static load = class {
        static atProjectRoot(uri){
            if(uri.startsWith("/")){
                uri = uri.slice(1);
            }
            window.location.href = SPLINT.projectRootPath + uri;
        }
    }
    static URI = class {
        static fromProjectRoot(path){
            return SPLINT.projectRootPath + path;
        }
    }
}

class S_Math {
    static roundFX(number, digits = 2, up = true){
        let f = number * (Math.pow(10, digits));
        if(up){
            return Math.ceil(f) / (Math.pow(10, digits));
        } else {
            return Math.floor(f) / (Math.pow(10, digits));
        }
    }
    static multiply(v1, v2){
      return Math.round(v1 * v2 * 100) / 100;
    }
    static divide(v1, v2){
      return ((v1 * 100) / (v2 * 100));
    }
    static add(v1, v2){
      return Math.round(v1 * 100 + v2 * 100) / 100;
    }
    static pytagoras(x, y){
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
    static sin(deg){
      return Math.sin(this.toRadians(deg));
    }
    static cos(deg){
      return Math.cos(this.toRadians(deg));
    }
    static tan(deg){
      return Math.tan(this.toRadians(deg));
    }
    static getNewSize(offsetX, offsetY, heightBase, widthBase, align = 0){
      let f1 = widthBase + heightBase;
      let f2 = offsetX + offsetY;
      let f3 = f1 + f2;
      if(f1 == 0){
        f1 = 1;
      }
      let f4 = f3 / f1;
      return {width: widthBase * f4, height : heightBase * f4};
    }
    static positiveOrNUll(value){
      if(value < 0){
        return 0;
      }
      return value;
    }
    static getIndex(indexIn, step, size){
      let a = 0;
      if(step != 0){
        a = (size * step) -1;
      }
      let index = indexIn - (step * (size));
      return index;
    }
    static toDegrees(angle) {
      return this.multiply(angle, (180 / Math.PI));
    }  
    static toRadians(angle) {
      return this.multiply(angle, (Math.PI / 180));
    }

  }

  class MATH_convert {
    static pt2px(pt){
      return S_Math.multiply(pt, 1.333333);
    }
    static px2pt(px){
      return S_Math.divide(px, 1.333333);
    }
    static pt2mm(pt){
      return S_Math.multiply(pt, 0.352777);
    }
    static px2mm(px){
      return S_Math.multiply(px, 0.264583);
    }
    static mm2px(mm){
      return S_Math.multiply(mm, 3.779527);
    }
    static mm2pt(mm){
      return S_Math.multiply(mm, 2.834645);
    }

  }

class S_Navigator {
    
}

class S_ObjectTools {
    static toMap(obj){
        return SPLINT.Tools.parse.ObjectToMap(obj);
    }
    // static 
    // Object.defineProperty(this, 'color1', {
        // configurable : false,
        // enumerable: false,
    //   });
    /**
     * @description compares 2 objects
     * @param {object} obj1 
     * @param {object} obj2 
     * @returns true or false
     */
    static is_equal(obj1, obj2){
        return (JSON.stringify(obj1) == JSON.stringify(obj2));
    }
    static serialize(obj, prefix) {
        var str = [], p;
        for (p in obj) {
          if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
              v = obj[p];
              if(v == null || v == undefined){
                v = '';
              }
            str.push((v !== null && typeof v === "object") ?
                
                serialize(v, k) :
              encodeURIComponent(k) + "=" + encodeURIComponent(v));
          }
        }
        return str.join("&");
      }
}

class S_Tparser {
    static stringToBool(str){
        if(str == true || str == "true"){
            return true;
        } 
        return false;
    }
    /**
     * @description converts JSON safely
     * @param {string} string 
     * @returns Object or input
     */
    static toJSON(string){
        try {
            return JSON.parse(string);
        } catch(e){
            return string;
        }
      }
    static ObjectToMap(object){
        return new Map(Object.entries(object))
    };

    /**
     * @param {string} base64 Base64 formatted string
     * @returns {string} ASCII formatted string
     */
    static base64_to_ASCII(base64) {
      let c, d, e, f, g, h, i, j, o, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", k = 0, l = 0, m = "", n = [];
      if (!base64) return a;
      do c = base64.charCodeAt(k++), d = base64.charCodeAt(k++), e = base64.charCodeAt(k++), j = c << 16 | d << 8 | e, 
      f = 63 & j >> 18, g = 63 & j >> 12, h = 63 & j >> 6, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h) + b.charAt(i); while (k < base64.length);
      return m = n.join(""), o = base64.length % 3, (o ? m.slice(0, o - 3) :m) + "===".slice(o || 3);
    }

    /**
     * @param {string} ascii ASCII formatted string
     * @returns {string} base64 formatted string
     */
    static ASCII_to_base64(ascii) {
      let b, c, d, e = {}, f = 0, g = 0, h = "", i = String.fromCharCode, j = ascii.length;
      for (b = 0; 64 > b; b++) e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b;
      for (c = 0; j > c; c++) for (b = e[ascii.charAt(c)], f = (f << 6) + b, g += 6; g >= 8; ) ((d = 255 & f >>> (g -= 8)) || j - 2 > c) && (h += i(d));
      return h;
    }
}
class timeTools {
  static sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}

class formatUnix_S {
    constructor(UnixTime){
      this.UnixTime = UnixTime;
    }
    time(){
        let date    = new Date(parseInt(this.UnixTime));
        let hours   = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if(hours <= 9){
            hours = "0" + hours;
        }
        if(minutes <= 9){
            minutes = "0" + minutes;
        }
        if(seconds <= 9){
            seconds = "0" + seconds;
        }
        return hours + ":" + minutes + ":" + seconds; 
    }
    date(){
        let date  = new Date(parseInt(this.UnixTime));
        let month = date.getMonth() + 1;
        let day   = date.getDate();
        if(month <= 9){
            month = "0" + month;
        }
        if(day <= 9){
            day = "0" + day;
        }
        return "" + day + "." + month + "." + date.getFullYear();
    }
  }

  class S_Time {
    static getTimeFromURL(URL){
      return URL.split("?v=")[1];
    }
    static convertDayTimeToFormattedUnix(timeIn){
      let today = new Date();
      let time = new Date(today.getFullYear() + "." + (parseInt(today.getMonth())+1) + "." + today.getDate() + " "+timeIn+ ":00");
      return time.getTime();
    }
    static convertDateToFormatedUnix(dateIn){        
      let today = new Date(dateIn);
      let date = new Date(today.getFullYear() + "." + (parseInt(today.getMonth())+1) + "." + today.getDate());
      return date.getTime();
    }
    static getTime(){
      let date = new Date();
      let unixtime = date.getTime();
      return unixtime;
    }
    static convertToGMT(unixTime){
      date = new Date(unixTime);
      console.log(date);
      date.setTime(date.getTime() + date.getTimezoneOffset()*60*1000);
      date = new Date(date).getTime();
      return date;
    }
    static convertFromGMT(unixTime){
      date = new Date(unixTime);
      console.log(date);
      date.setTime(date.getTime() - date.getTimezoneOffset()*60*1000);
      date = new Date(date).getTime();
      return date;
    }
    static formatSingleNumber(number, offset = 1){
      if(number < 10 * offset){
        number = "0" + number;
      }
      return number;
    }
  }




  

  



  




class S_Tools {
  static getUniqueID(digits = 10){
    return Math.floor(Math.random() * Date.now()).toString().slice(0, digits - 1);
  }
  static mergeToArray(array, value){
    if(array.includes(value)){
      return array;
    } else {
      array.push(value);
      return array;
    }
  }
  static srcBase64(src){
    return "Data:image/png;base64," + src;
  }
  
  static base64ToSrc(base64){
    let src = base64.replace("data:image/png;base64,", "");
    return src;
  }  
  static removeFromArray(array, key){
    const index = array.indexOf(key);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }
//   static rgb2hsv (r, g, b) {
//     let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
//     rabs = r / 255;
//     gabs = g / 255;
//     babs = b / 255;
//     v = Math.max(rabs, gabs, babs),
//     diff = v - Math.min(rabs, gabs, babs);
//     diffc = c => (v - c) / 6 / diff + 1 / 2;
//     percentRoundFn = num => Math.round(num * 100) / 100;
//     if (diff == 0) {
//         h = s = 0;
//     } else {
//         s = diff / v;
//         rr = diffc(rabs);
//         gg = diffc(gabs);
//         bb = diffc(babs);

//         if (rabs === v) {
//             h = bb - gg;
//         } else if (gabs === v) {
//             h = (1 / 3) + rr - bb;
//         } else if (babs === v) {
//             h = (2 / 3) + gg - rr;
//         }
//         if (h < 0) {
//             h += 1;
//         }else if (h > 1) {
//             h -= 1;
//         }
//     }
//     return {
//         h: Math.round(h * 360),
//         s: percentRoundFn(s * 100),
//         v: percentRoundFn(v * 100)
//     };
//     }
}

class S_URI {
    constructor(){}
    static getOrigin(uri){
        return uri.split('/').slice(0, 3).join('/');
    }
}

/**
 * @class
 * @example 
 * let s = new S_ANSI();
 * let str = s.bold + "John" + s.reset + s.cFG.red + "Doe";
 * 
 * console.log(str);
 * @example 
 * let s = S_ANSI.use;
 * let str = s.bold + "John" + s.reset + s.cFG.red + "Doe";
 * 
 * console.log(str);
 * @see
 * 📗❌❗✔✅🆚💥❓❔🟥🟩🟦🔹💡⚠📔⚡✅ℹ☑🔄📝
 */
class S_ANSI {
    constructor(){}
    static {
        /**
         * @example
         * let str = "text1 \\i\>text2\\r\>\\cFG.lightRed\>text3";
         *     str = str.parseANSI();
         * 
         * console.log(str);
         * 
         * @returns {string} parsed ANSI string
         */
        String.prototype.parseANSI = function(...otherFormatting){
            return S_ANSI.parse(this, ...otherFormatting);
        }
        Object.defineProperty(String.prototype, "parseANSI", {
            value: function(...otherFormatting){
                return S_ANSI.parse(this, ...otherFormatting);
            },
            enumerable: false,
            configurable: false
        })
    }
    static get use(){
        return new S_ANSI();
    }
    /**
     * @example
     * 
     * let str = "text1 \\i\>text2\\r\>\\cFG.lightRed\>text3";
     * let parsed_str = S_ANSI.parse(str);
     * 
     * console.log(parsed_str);
     * 
     * @example
     * let str = "text1 \\i\>text2\\r\>\\cFG.lightRed\>text3";
     *     str = str.parseANSI();
     * 
     * console.log(str);
     * 
     * @param {string} str 
     * @returns {string} parsed string
     */
    static parse(str, ...otherFormatting){
        let s = S_ANSI.use;
        for(const e of otherFormatting){
            if(Object.hasOwn(s, e[1]) || s.cFG[e[1].replace("cFG^", "")] != undefined || s.cBG[e[1].replace("cBG^", "")] != undefined){
                let f = "\\r\>\\" + e[1] + "\>";
                let position = str.indexOf(e[0]);
                // for(let i = 0; i < str.length; i++){
                //     if(str[i] == e[0] && str[i-1] != '.'){
                //         position = i;
                //         break;
                //     }
                // }
                while (position !== -1) {
                    let pos1 = str.substring(0, position).lastIndexOf("\\reset\>")
                    let pos2 = str.substring(0, position).lastIndexOf("\\r\>")
                    let last = pos2;    
                    if(pos1 >= pos2){
                        last = pos1;
                    }
                    let res = str.substring(last, position).match(/\\.*?.(\>)/g)//.join("");
                    if(res != null){
                        res = res.join("");
                    }
                    // console.log(res)
                    str = str.substring(0, position) + str.substring(position).replace(e[0], f+e[0]+res);
                    position = str.indexOf(e[0], position+ ((f+e[0]+res).length) );   
                    // console.log("a")             
                    // for(let i = 0; i < str.length; i++){
                    //     if(i >= str.length-1){
                    //         position = -1;
                    //         break;
                    //     }
                    //     if(i >= position + ((f+e[0]+res).length) && str[i] == e[0] && str[i-1] != '.'){
                    //         position = i;
                    //         break;
                    //     }
                    // }
                  }
            }
        }
        for(const e of Object.entries(s)){
            str = str.replaceAll("\\" + e[0]+ "\>", e[1]);
        }
        for(const e of Object.entries(s.cBG)){
            str = str.replaceAll("\\cBG^" + e[0]+ "\>", e[1]);
        }
        for(const e of Object.entries(s.cFG)){
            str = str.replaceAll("\\cFG^" + e[0]+ "\>", e[1]);
        }
        return str;
    }
    /** reset */
    r = "\x1b[" + 0 + "m";
    /** reset */
    reset = "\x1b[" + 0 + "m";

    /** bold */
    b = "\x1b[" + 1 + "m";
    /** bold */
    bold = "\x1b[" + 1 + "m";

    /** italic */
    i = "\x1b[" + 3 + "m";
    /** italic */
    italic = "\x1b[" + 3 + "m";

    /** underline */
    u = "\x1b[" + 4 + "m";
    /** underline */
    underline = "\x1b[" + 4 + "m";

    /** reset underline */
    ru = "\x1b[" + 24 + "m";
    /** reset underline */
    resetUndlerine = "\x1b[" + 24 + "m";

    /** foreground color */
    cFG = class ANSI_colorForeGround {
        /** black */
        static black        = "\x1b[" + 30 + "m";
        /** red */
        static red          = "\x1b[" + 31 + "m";
        /** green */
        static green        = "\x1b[" + 32 + "m";
        /** yellow */
        static yellow       = "\x1b[" + 33 + "m";
        /** blue */
        static blue         = "\x1b[" + 34 + "m";
        /** magenta */
        static magenta      = "\x1b[" + 35 + "m";
        /** cyan */
        static cyan         = "\x1b[" + 36 + "m";
        /** lightGray */
        static lightGray    = "\x1b[" + 37 + "m";
        /** gray */
        static gray         = "\x1b[" + 90 + "m";
        /** lightRed */
        static lightRed     = "\x1b[" + 91 + "m";
        /** lightGreen */
        static lightGreen   = "\x1b[" + 92 + "m";
        /** lightYellow */
        static lightYellow  = "\x1b[" + 93 + "m";
        /** lightBlue */
        static lightBlue    = "\x1b[" + 94 + "m";
        /** lightMagenta */
        static lightMagenta = "\x1b[" + 95 + "m";
        /** lightCyan */
        static lightCyan    = "\x1b[" + 96 + "m";
        /** white */
        static white        = "\x1b[" + 97 + "m";
    }
    /** background color */
    cBG = class ANSI_colorBackGround {
        /** black */
        static black        = "\x1b[" + 40 + "m";
        /** red */
        static red          = "\x1b[" + 41 + "m";
        /** green */
        static green        = "\x1b[" + 42 + "m";
        /** yellow */
        static yellow       = "\x1b[" + 43 + "m";
        /** blue */
        static blue         = "\x1b[" + 44 + "m";
        /** magenta */
        static magenta      = "\x1b[" + 45 + "m";
        /** cyan */
        static cyan         = "\x1b[" + 46 + "m";
        /** lightGray */
        static lightGray    = "\x1b[" + 47 + "m";
        /** gray */
        static gray         = "\x1b[" + 100 + "m";
        /** lightRed */
        static lightRed     = "\x1b[" + 101 + "m";
        /** lightGreen */
        static lightGreen   = "\x1b[" + 102 + "m";
        /** lightYellow */
        static lightYellow  = "\x1b[" + 103 + "m";
        /** lightBlue */
        static lightBlue    = "\x1b[" + 104 + "m";
        /** lightMagenta */
        static lightMagenta = "\x1b[" + 105 + "m";
        /** lightCyan */
        static lightCyan    = "\x1b[" + 106 + "m";
        /** white */
        static white        = "\x1b[" + 107 + "m";
    }
}


// const f = S_ANSI.use;
//     console.log(f.i + "test" + f.cBG.green + f.cFG.red + "test2");

//     let str = "abs \\i\>test\\r\>\\cFG.lightRed\>abc";

//         str = str.parseANSI();

//         console.log(str);

class S_ColorsConverter extends Function {
      
    static rgbToHex(r, g, b) {
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    /**
     * 
     * @param {string} hex color as hex (ffffff)
     * @returns {array} r,g,b values
     */
    static hexToRgb(hex) {
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;
    
        return {r:r, g:g, b:b}//return [r, g, b];
    }
    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and l in the set [0, 1].
     *
     * @param   Number  r       The red color value
     * @param   Number  g       The green color value
     * @param   Number  b       The blue color value
     * @return  Array           The HSL representation
     */
    // static rgbToHsl(r, g, b) {
    //     r /= 255, g /= 255, b /= 255;
      
    //     var max = Math.max(r, g, b), min = Math.min(r, g, b);
    //     var h, s, l = (max + min) / 2;
      
    //     if (max == min) {
    //       h = s = 0; // achromatic
    //     } else {
    //       var d = max - min;
    //       s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
    //       switch (max) {
    //         case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    //         case g: h = (b - r) / d + 2; break;
    //         case b: h = (r - g) / d + 4; break;
    //       }
      
    //       h /= 6;
    //     }
      
    //     return {h:h, s:s, l:l}
    //     // return [ h, s, l ];
    //   }
      
    //   /**
    //    * Converts an HSL color value to RGB. Conversion formula
    //    * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
    //    * Assumes h, s, and l are contained in the set [0, 1] and
    //    * returns r, g, and b in the set [0, 255].
    //    *
    //    * @param   Number  h       The hue
    //    * @param   Number  s       The saturation
    //    * @param   Number  l       The lightness
    //    * @return  Array           The RGB representation
    //    */
    //   static hslToRgb(h, s, l) {
    //     var r, g, b;
      
    //     if (s == 0) {
    //       r = g = b = l; // achromatic
    //     } else {
    //       function hue2rgb(p, q, t) {
    //         if (t < 0) t += 1;
    //         if (t > 1) t -= 1;
    //         if (t < 1/6) return p + (q - p) * 6 * t;
    //         if (t < 1/2) return q;
    //         if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    //         return p;
    //       }
      
    //       var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    //       var p = 2 * l - q;
      
    //       r = hue2rgb(p, q, h + 1/3);
    //       g = hue2rgb(p, q, h);
    //       b = hue2rgb(p, q, h - 1/3);
    //     }
      
    //     return {r:r*255, g:g*255, b:b*255}//[ r * 255, g * 255, b * 255 ];
    //   }
      
      /**
       * Converts an RGB color value to HSV. Conversion formula
       * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
       * Assumes r, g, and b are contained in the set [0, 255] and
       * returns h, s, and v in the set [0, 1].
       *
       * @param   {Number}  r       The red color value
       * @param   {Number}  g       The green color value
       * @param   {Number}  b       The blue color value
       * @return  {Array}           The HSV representation
       */
      static rgbToHsv(r, g, b) {
        r /= 255, g /= 255, b /= 255;
      
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;
      
        var d = max - min;
        s = max == 0 ? 0 : d / max;
      
        if (max == min) {
          h = 0; // achromatic
        } else {
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
      
          h /= 6;
        }
        return {h:h, s:s, v:v}
        return [ h, s, v ];
      }
      
      /**
       * Converts an HSV color value to RGB. Conversion formula
       * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
       * Assumes h, s, and v are contained in the set [0, 1] and
       * returns r, g, and b in the set [0, 255].
       *
       * @param   {Number}  h       The hue
       * @param   {Number}  s       The saturation
       * @param   {Number}  v       The value
       * @return  {Array}           The RGB representation
       */
      static hsvToRgb(h, s, v) {
        var r, g, b;
      
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
      
        switch (i % 6) {
          case 0: r = v, g = t, b = p; break;
          case 1: r = q, g = v, b = p; break;
          case 2: r = p, g = v, b = t; break;
          case 3: r = p, g = q, b = v; break;
          case 4: r = t, g = p, b = v; break;
          case 5: r = v, g = p, b = q; break;
        }
        return {r:r*255, g:g*255, b:b*255}//return [ r * 255, g * 255, b * 255 ];
    }
}


SPLINT.require_now("@SPLINT_ROOT/Utils/color/AcolorConverter.js");
/**
 * @class Color API
 */
 class S_Colors extends S_ColorsConverter {
    static get colorHSVa(){
        return S_colorHSVa;
    }
    static get colorHSLa(){
        return S_colorHSLa;
    }
    static get colorRGBa(){ 
        return S_colorRGBa;
    }
    static get Gradient(){ 
        return Gradient;
    }
    
    static parse(colorIn, type){
        if(colorIn.type == type){
            return colorIn;
        }
        let colorOut;
        //Out
        switch(type){
            case 'rgba' : colorOut = new S_Colors.colorRGBa(); break;
            case 'hsva' : colorOut = new S_Colors.colorHSVa(); break;
            // case 'hsla' : colorOut = new S_TColors.colorHSLa(); break;
            default: SPLINT.debugger.error("S_Color", "parsing exception"); break;
        }
        //In
        switch(colorIn.type){
            case 'rgba' : return (colorOut.fromRGB(colorIn)); break;
            case 'hsva' : return (colorOut.fromHSV(colorIn)); break;
            // case 'hsla' : return colorOut.fromHSL(colorIn); break;
            default: SPLINT.debugger.error("S_Color", "parsing exception"); break;
        }
    }
    
    constructor(){
        super();
    }
    
}
class Gradient extends Array {
    static get [Symbol.species]() { return Array; }

    static {
        super.SPLINT.hideProperty('steps');
        super.SPLINT.hideProperty('_color1');
        super.SPLINT.hideProperty('_color2');
        super.SPLINT.hideProperty('color2');
        super.SPLINT.hideProperty('color1');
    }
    clone(){
        return new Gradient(this._color1, this._color2, this._steps);
    }
    constructor(color1, color2, steps = 2){
        super();
        this._color1 = color1;
        this._color2 = color2;
        this._steps  = steps;
        this.SPLINT.hideProperty('_color1');
        this.SPLINT.hideProperty('_color2');
        this.SPLINT.hideProperty('_steps');
        this.SPLINT.hideProperty('name');
        this.SPLINT.hideProperty('type');
        this.type = "hsva";
        this.name = "new gradient";
    }
    switchColors(){
        let r = S_Colors.parse(this.color2, 'rgba');
        this._color2 = S_Colors.parse(this.color1, 'rgba');
        this.color1 = r;
    }
    set steps(v){
        this._steps = v;
        this.#generate();
    }
    get steps(){
        return this._steps
    }
    set color1(v){
        this._color1 = v;
        this.#generate();
    }
    get color1(){
        return this._color1;
    }
    set color2(v){
        this._color2 = v;
        this.#generate();
    }
    get color2(){
        return this._color2;
    }
    #generate(){      
        while (this.length > 0) {
            this.pop();
        }      
        this._color1 = S_Colors.parse(this._color1, 'hsva');
        this._color2 = S_Colors.parse(this._color2, 'hsva');
        let Hstep = Math.abs(this._color1.h - this._color2.h) / (this._steps);
        let Sstep = Math.abs(this._color1.s - this._color2.s) / (this._steps);
        let Vstep = Math.abs(this._color1.v - this._color2.v) / (this._steps);
        let Astep = Math.abs(this._color1.a - this._color2.a) / (this._steps);
        for(let i = 0; i < this._steps; i++){
            let h = this._color1.h + (Hstep * i);
            let s = this._color1.s + (Sstep * i);
            let v = this._color1.v + (Vstep * i);
            let a = this._color1.a + (Astep * i);
            let cn = new S_Colors.colorHSVa(h, s, v, a);
            this.push(cn);
        }
    }
}
SPLINT.require_now("@SPLINT_ROOT/Utils/color/color.js");
class S_colorHSLa extends S_Colors {
    constructor(h = 0, s = 0, l = 0, a = 1) {
        super();
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
        this.type = "hsla";
        Object.defineProperty(this, 'type', {
            value: "hsla",
            writable: true,
            configurable : false,
            enumerable: false,
        });
    }
    fromRGB(S_color){
        let c = S_Colors.rgbToHsl(S_color.r, S_color.g, S_color.b);
        this.h = c.h;
        this.s = c.s;
        this.l = c.l;
        this.a = S_color.a;
        return this;
    }
}
SPLINT.require_now("@SPLINT_ROOT/Utils/color/color.js");
class S_colorHSVa extends S_Colors {
    constructor(h = 0, s = 0, v = 0, a = 1) {
        super();
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
        this.type = "hsva";
        Object.defineProperty(this, 'type', {
            value: "hsva",
            writable: true,
            configurable : false,
            enumerable: false,
        });
    }    
    fromHEX(hexIn){
        let hex = S_Colors.hexToRgb(hexIn);
        let c = S_Colors.rgbToHsv(hex.r, hex.g, hex.b);
        this.h = c.h;
        this.s = c.s;
        this.v = c.v;
        return this;
    } 
    fromRGB(S_color){
        let c = S_Colors.rgbToHsv(S_color.r, S_color.g, S_color.b);
        this.h = c.h;
        this.s = c.s;
        this.v = c.v;
        this.a = S_color.a;
        return this;
    }
}
SPLINT.require_now("@SPLINT_ROOT/Utils/color/color.js");
class S_colorRGBa extends S_Colors {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        super();
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.type = "rgba";
        Object.defineProperty(this, 'type', {
            value: "rgba",
            writable: true,
            configurable : false,
            enumerable: false,
        });
    }   
    fromHex(hexIn){
        let hex = S_Colors.hexToRgb(hexIn);
        this.r = hex.r;
        this.g = hex.g;
        this.b = hex.b;
        return this;
    } 
    fromHSL(color){
        let c = S_Colors.hslToRgb(color.h, color.s, color.l);
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = color.a;
        return this;
    }  
    fromHSV(color){
        let c = S_Colors.hsvToRgb(color.h, color.s, color.v);
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = color.a; 
        return this;
    }
}

console.dir(window['S_Colors']);
// import * as util from 'util';
class SPLINT_debugger {
    static #base = "%cSPLINT ";
    /**
     * @param {string} name name or identifier
     * @param {string} msg message 
     * @param {Array.<[Array<string>, <string> format]>} [formatting] formatting
     */
    static warn(name, msg, ...formatting){
        if(!SPLINT.CONFIG.settings.debugging.warn){
            return;
        }
        let obj = this.#format(msg ,formatting);
        let styles = obj.styles;
        msg = obj.msg;
        let log = SPLINT_debugger.#base + "%c[%c" + name + "%c] %c" + msg;
        console.warn(log, "color: green; font-weight: bold", "color: gray; font-weight: bold;", "color: red", "color: gray; font-weight: bold;", "color: black", ...styles)
    }
    /**
     * @param {string} name name or identifier
     * @param {string} msg message 
     * @param {Array.<[Array<string>, <string> format]>} [formatting] formatting
     */
    static log(name, msg, ...formatting){
        if(!SPLINT.CONFIG.settings.debugging.log){
            return;
        }
        let obj = this.#format(msg ,formatting);
        let styles = obj.styles;
        msg = obj.msg;
        let log = SPLINT_debugger.#base + "%c[%c" + name + "%c] %c" + msg;
        console.log(log, "color: green; font-weight: bold", "color: gray; font-weight: bold;", "color: red", "color: gray; font-weight: bold;", "color: black", ...styles)
    }
    /**
     * @param {string} name name or identifier
     * @param {string} msg message 
     * @param {Array.<[Array<string>, <string> format]>} [formatting] formatting
     */
    static error(name, msg, ...formatting){
        if(!SPLINT.CONFIG.settings.debugging.error){
            return;
        }
        let obj = this.#format(msg ,formatting);
        let styles = obj.styles;
        msg = obj.msg;
        let log = SPLINT_debugger.#base + "%c[%c" + name + "%c] %c" + msg;
        console.error(log, "color: green; font-weight: bold", "color: gray; font-weight: bold;", "color: red", "color: gray; font-weight: bold;", "color: black", ...styles)
    }
    /**
     * @param {string} name name or identifier
     * @param {string} msg message 
     * @param {Array.<[Array<string>, <string> format]>} [formatting] formatting
     */
    static logUser(name, msg = "", ...formatting){
        let styles = "";
        if(msg instanceof String){
            let obj = this.#format(msg ,formatting);
            styles = obj.styles;
            msg = "\n" + obj.msg;
            let log = SPLINT_debugger.#base + "%c[%c" + name + "%c] %c" + msg;
            console.log(log, "color: green; font-weight: bold", "color: gray; font-weight: bold;", "color: red", "color: gray; font-weight: bold;", "color: black", ...styles)
        } else {
            let log = SPLINT_debugger.#base + "%c[%c" + name + "%c] %c";
            console.group(log, "color: green; font-weight: bold", "color: gray; font-weight: bold;", "color: red", "color: gray; font-weight: bold;", "color: black");
            console.log(log, "color: green; font-weight: bold", "color: gray; font-weight: bold;", "color: red", "color: gray; font-weight: bold;", "color: black", ...styles)

            console.dir(msg);
            console.groupEnd();
        }
        
    }
    static #format(msg, formatting){
        let styles = [];
        for(const val of msg){
            for(const entry of formatting){
                if(typeof entry[0] == 'object'){
                    for(const str of entry[0]){
                        if(val == str){
                            styles.push(entry[1]);
                            styles.push("color: black;");
                            break;
                        }
                    }
                } else {
                    if(val == entry[0]){
                        styles.push(entry[1]);
                        styles.push("color: black;");
                        break;
                    }
                }
            }
        }
        for(const entry of formatting){
            if(typeof entry[0] == 'object'){
                for(const str of entry[0]){
                    msg = msg.replaceAll(str, "%c" + str + "%c");
                }
            } else {
                msg = msg.replaceAll(entry[0], "%c" + entry[0] + "%c");
            }
        }
        let obj = new Object();
            obj.styles = styles;
            obj.msg = msg;
        return obj;
    }
}

function labeledConsoleDirGroup(wrappedVar, obj) {
    const varName = Object.keys({obj})[0];
    console.group(varName);
    console.dir(wrappedVar[varName]);
    console.groupEnd(varName);
  }

class SplintError {
    static #base = "%cSPLINT ";
    /**
     * @param {string} name name or identifier
     * @param {string} msg message 
     * @param {Array.<[Array<string>, <string> format]>} [formatting] formatting
     */
    static throw(error){
        if(typeof error != 'object'){
            error = this.getErrorByID(error);
        }
        let name = error.name;
        let solve = error.solve;
        let description = error.desc;
        let log = this.#base + "%c[%cError%c] %c" + name + " %c" + error.code + " %c" + error.args;
        console.groupCollapsed(log, "color: green; font-weight: bold;", "color: gray; font-weight: bold;", "color: red", "color: gray; font-weight: bold;", "color: black", "font-weight: normal; font-style: italic;", "font-style: normal;font-weight: normal");
            console.groupCollapsed("%c❔ %cDescription", "font-size: 1em;", "font-weight: bold;font-size: 1.1em;")
                console.log("%c" + description, "");
            console.groupEnd();
            console.groupCollapsed("%c💡 %cSolution", "font-size: 1em;", "font-weight: bold;font-size: 1.1em;")
                for(const e of solve){
                    console.log("%c" + e, "font-size: 1em;");
                }
            console.groupEnd();
        console.groupEnd();
    }
    static FileNotFound(src = null){
        let s = S_ANSI.use;
        let obj = new Object();
            obj.ID = 1;
            obj.name = "FileNotFound";
            obj.code = 404;
            if(src != null){
                obj.args = "  tried to load " + src;
            } else {
                obj.args = "";
            }
            obj.desc = "Splint cant find the File";
            obj.solve = [];
            obj.solve.push("🔄 reload if you have changed anything in your file tree");
            let str = "📝 set \\i\>cacheResources\\r\> in \\cFG^lightBlue\>splint.config.main\\r\> to \\b\>\\cFG^lightRed\>false";
            obj.solve.push(str.parseANSI(['.', 'b']));
            this.throw(obj)
    }
    static get ErrorUndefined(){
        let obj = new Object();
            obj.ID = -1;
            obj.name = "ErrorUndefined";
            obj.desc = "the given error code is undefined";
            obj.solve = "please contact the author.";
        return obj;
    }
}
/**
 * @class
 * */
class S_FileUtils {
    // static loadFromRoot(uri){
    //     return new parseOutput(this.read(location.origin + "/" + uri));
    // }
    // static loadFromProject(uri){
    //     return new parseOutput(this.read(SPLINT.URIs.project + uri));
    // }
    /**
     * desc
     * @date 2023-06-12
     * @param { * } urlToFile
     * @param { * } parm2
     */
    static doesExist(urlToFile, sync = false) {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', urlToFile, !sync);
        xhr.send();
         
        if (xhr.status == "404") {
            return false;
        } else {
            return true;
        }
    }
    /**
     * desc
     * @date 2023-06-12
     * @param { * } uri
     * @param { * } parm2
     */
    static read(uri, sync = false){
        if(sync){
            // if(!this.doesExist(uri, true)){
            //     return false;
            // }
            let rawFile = new XMLHttpRequest();
            rawFile.open("GET", uri, false);
            rawFile.onreadystatechange = function() {
                if(rawFile.readyState === 4) {
                    if(rawFile.status === 200 || rawFile.status == 0){
                        return rawFile.responseText;
                    } else {
                        return false;
                    }
                }
            }
            rawFile.send(null);
            return rawFile.responseText;
        } else {
            return new Promise(async function(resolve){
                // if(!(await S_FileUtils.doesExist(uri, false))){
                //     resolve(false);
                //     return false;
                // }
                let rawFile = new XMLHttpRequest();
                rawFile.open("GET", uri, true);
                rawFile.onreadystatechange = function() {
                    if(rawFile.readyState === 4) {
                        if(rawFile.status === 200 || rawFile.status == 0){
                            resolve(rawFile.responseText);
                        } else {
                            resolve(false);
                        }
                    }
                }
                rawFile.send(null);
            });
        }
    }
    /**
     * desc
     * @date 2023-06-12
     * @param { * } data
     * @param { * } uri
     */
    static write(data, uri){
        return new Promise(async function(resolve){
            let rawFile = new XMLHttpRequest();
            rawFile.open("POST", uri, true);
            rawFile.setRequestHeader('Content-type', 'application/json');
            rawFile.onreadystatechange = function() {
                console.dir(rawFile)
                if(rawFile.readyState === 4) {
                    if(rawFile.status === 200 || rawFile.status == 0){
                        resolve(rawFile.responseText);
                    } else {
                        resolve(false);
                    }
                }
            }
            rawFile.send(JSON.stringify(data));
        });
    }
    /**
     * desc
     * @date 2023-06-12
     * @param { * } parm1
     */
    static #parseOutput(flag = false){            
        if(typeof this.value == "string"){
            try {
                if(flag){
                    return JSON.parse(this.value);
                } else {
                        return JSON.parse(this.value, function(k, v) { 
                    if(!isNaN(v) && typeof v != 'boolean'){
                        return parseInt(v, 10);
                    } 
                        return v;
                    });
                }
            } catch {
                return this.value;
            }
        }
    }
}


class S_Utils {
    /**
     * desc
     * @date 2023-06-12
     */
    static get Colors(){
        return S_Colors;
    }
    /**
     * desc
     * @date 2023-06-12
     */
    static get ANSI(){
        return S_ANSI;
    }
    /**
     * desc
     * @date 2023-06-12
     */
    static get Files(){
        return S_FileUtils;
    }
}
  
    class SPLINT_DOMextensions {
        constructor(instance){
            this.instance = instance;
        } 
        #state_c = null;
        get state(){
            let c = class {
                constructor(instance){
                    this.instance = instance;
                }
                #func_onActive = function(){};
                #func_onPassive = function(){};
                #func_onToggle = function(){};
                get(){
                    if(this.instance.getAttribute("s-state") == "active"){
                        return "active";
                    } else {
                        return "passive";
                    }
                }
                remove(){
                    if(this.instance.getAttribute("s-state") != null){
                        this.instance.removeAttribute("s-state");
                    }
                }
                toggle(){
                    if(this.instance.getAttribute("s-state") == "active"){
                        this.setPassive();
                    } else {
                        this.setActive();
                    }
                }
                setActive(){
                    this.instance.setAttribute("s-state", "active");
                    this.instance.state = "active";
                    this.#onToggle("e", "active")
                }
                setPassive(){
                    this.instance.setAttribute("s-state", "passive");
                    this.instance.state = "passive";
                    this.#onToggle("e", "passive")
                }
                #onToggle(e, state){
                    if(state == "active"){
                        this.#func_onActive(...arguments);
                    } else {
                        this.#func_onPassive(...arguments);
                    }
                    this.#func_onToggle(...arguments);
                }
                get onActive(){
                    return this.#func_onActive;
                }
                set onActive(func){
                    this.#func_onActive = func;
                }
                get onPassive(){
                    return this.#func_onPassive;
                }
                set onPassive(func){
                    this.#func_onPassive = func;
                }
                set onToggle(func){
                    this.#func_onToggle = func;
                    // this.instance.S_NonStateChange = this.#onToggle.bind(this);
                }
            }
            if(this.#state_c == null){
                this.#state_c = new c(this.instance);
            }
            return this.#state_c;
        }   
    }
    
    Object.defineProperty(HTMLElement.prototype, "SPLINT", {
        get: function(){
            if(this.SPLINT_STORAGE == undefined || this.SPLINT_STORAGE == null){
                this.SPLINT_STORAGE = new SPLINT_DOMextensions(this);
            }
            return this.SPLINT_STORAGE;
        },
        enumerable: false,
        configurable: true
    })
    Object.defineProperty(HTMLElement.prototype, "S", {
        get: function(){
            if(this.SPLINT_STORAGE == undefined || this.SPLINT_STORAGE == null){
                this.SPLINT_STORAGE = new SPLINT_DOMextensions(this);
            }
            return this.SPLINT_STORAGE;
        },
        enumerable: false,
        configurable: true
    })
  //----------------------------------------------------------------
  //Erweiterungen für alle DOMElemente
  //----------------------------------------------------------------

  HTMLElement.prototype.getAbsoluteWidth = function () {
      let styles = window.getComputedStyle(this);
      let margin = parseFloat(styles['marginLeft']) +
                  parseFloat(styles['marginRight']);

      return Math.ceil(this.offsetWidth + margin);
    }
    
  HTMLElement.prototype.getAbsoluteHeight = function () {
      let styles = window.getComputedStyle(this);
      let margin = parseFloat(styles['marginTop']) +
                   parseFloat(styles['marginBottom']);
  
      return Math.ceil(this.offsetHeight + margin);
    }

  HTMLElement.prototype.queryChildren = function(queryObject, FLAG_all = true){
    function func(element, queryArray, FLAG_all, callback = function(){}){
      if(element.children == undefined){
          return false;
      }
      
      for(const child of element.children){
        if(FLAG_all){
          for(const param of queryArray){
            if(child[param[0]] != param[1]){
              func(child, queryArray, FLAG_all, callback);
              return false;
            }
          }
          callback(child);
          return true;
        } else {
          for(const param of queryArray){
            if(child[param[0]] == param[1]){
              callback(child);
              return true;
            }
          }
        }
        func(child, queryArray, FLAG_all, callback);
        return false;
      }
      return false;
    }
    let element = null;
    let queryArray = Object.entries(queryObject);
    func(this, queryArray, FLAG_all, function(child){
      element = child;
    });
    return element;
  }
  // HTMLElement.prototype.getChildByClassName = function(className){
  //   function func(element, className, callback = function(){}){
  //     if(element.children == undefined){
  //         return false;
  //     }
  //     for(const child of element.children){
  //         if(child.className == className){
  //             callback(child);
  //             return true;
  //         } else {
  //             func(child, className, callback);
  //         }
  //     }
  //     return false;
  //   }
  //   let element = null;
  //   func(this, className, function(child){
  //     element = child;
  //   });
  //   return element;
  // }

  HTMLElement.prototype.getElementBefore = function(){
    return this.previousElementSibling;
  }
  HTMLElement.prototype.getElementAfter = function(){
    return this.nextElementSibling;
  }

    HTMLElement.prototype.startAnimation = function(name = "testA", duration = 1, timingFunction = "ease", delay = 0, iterationCount = 1, direction = "normal"){
        this.style.animation = name + " " + duration + "s " + timingFunction + " " + delay + "s " + iterationCount + " " +  direction;
        return new Promise(async function(resolve){
            if(typeof iterationCount == 'number'){
                setTimeout(function(){
                    this.style.animation = "";
                    resolve(this.style.animation);
                }.bind(this), (iterationCount * duration * 1000));
            } else {
                resolve(this.style.animation);
            }
        }.bind(this));
    } 
    HTMLElement.prototype.startAnimation_str = function(str, duration, delay = 0){
        this.style.animation = str;
        return new Promise(async function(resolve){
            setTimeout(function(){
                this.style.animation = "";
                resolve(this.style.animation);
            }.bind(this), (delay + duration) * 1000);
        }.bind(this));
    } 
  HTMLElement.prototype.setTooltip = function(value, direction){
    return new Tooltip_S(value, direction, this);
  }
//   HTMLElement.prototype.clear = function(element){
//     for(let i = 0; i < this.childNodes.length; i++){
//       if(this.childNodes[i] != element){
//         this.childNodes[i].remove();
//       }
//     }
//   }
  HTMLElement.prototype.disable = function(type){
    this.setAttribute(type, "");
  }
  HTMLElement.prototype.SPLINT = {
    get() {
      return new SPLINT_DOMextensions(this);
    }, 
    set(v){
      val = v;
    },
    enumerable: true,
    configurable: true,
  }
// Object.defineProperty(HTMLElement.prototype, "SPLINT",  {
//   /** @this {ObjThis}*/
//   get() {
//     return new SPLINT_DOMextensions(this);
//   }, 
//   /** @this {ObjThis}*/
//   set(v){
//     val = v;
//   },
//   enumerable: true,
//   configurable: true,
// });

HTMLElement.prototype.newChild = function(name, tag, oncreate = function(){}){
  return new SPLINT.DOMElement(this.id + name, tag, this, oncreate)
}
  /**
   * 
   * @param {string} id_or_name 
   * @param {string} Class 
   * @returns 
   * 
   * @example 
   * id_or_name = "/ID/<name>"
   * element.id -> "<parent.id>_<name>"
   * id_or_name = "<name>"
   * element.id -> "<name>"
   * id_or_name = null
   * element.id -> "<parent.id>_<uniqueID>"
   */
    HTMLElement.prototype.newDiv = function(id_or_name = null, Class = null){
        let f_id = "";
        if(id_or_name != null){
          if(id_or_name.includes("/ID/")){
            f_id = this.id + "_" + id_or_name.replace("/ID/", "");
          } else {
            f_id = id_or_name;
          }
        } else {
            f_id = this.id + "_/UID()/";
        }
        let ele = new SPLINT.DOMElement(f_id, "div", this);
            if(Class != null){
                ele.Class(Class);
            }
        return ele;
    }

  HTMLElement.prototype.hasParentWithID = function(ID){
    let ele = this;
    do {
      if(ele.id.includes(ID)){
        return true;
      }
      ele = ele.parentNode;
    } while(ele.parentNode != null){
    }
    return false;
  }

  HTMLElement.prototype.hasParentWithClass = function(CSS_class){
    let ele = this;
    do {
      if(ele.classList.contains(CSS_class)){
        return true;
      }
      ele = ele.parentNode;
    } while(ele.parentNode != null){
    }
    // if(!this.classList.contains("expander") && !this.parentNode.classList.contains("expander")){
    //     if(!this.id.includes("copy")){
    //       return true;
    //     }
    // }
    return false;
  }

  HTMLElement.prototype.Class = function(...names){
    function obj(instance, ...names){
      if(names.length > 0 && names[0] != undefined){
        instance.classList.add(names);
        this.set = function(){
          instance.className = "";
          instance.classList.add(names);
        }
        this.remove = function(){
          instance.classList.remove(names);
        }
      } else if(instance.classList.length == 0){
        instance.removeAttribute("class");
      }
    }
    return new obj(this, names);
  }
  HTMLElement.prototype.clear = function(element){
    if(element == true){
      this.innerHTML = "";
      return;
    } else {
      for(let i = 0; i < this.childNodes.length; i++){
        if(this.childNodes[i] != element){
          this.childNodes[i].remove();
        }
      }
      this.innerHTML = "";
    }
  } 
  HTMLElement.prototype.state = function(){
      this.get = function(){
        if(this.hasAttribute("state")){
          return this.getAttribute("state");
        } else {
          return false;
        }
      }
      this.has = function(){
        return this.hasAttribute("state")
      }
      this.isActive = function(){
        if(this.hasAttribute("state") && this.getAttribute("state") == "active"){
          return true;
        } else {
          return false;
        }
      }
      this.setActive = function(){
        this.dispatchEvent(SPLINT_EVENTS.onStateChange);
        this.setAttribute("state", "active");
      }
      this.unsetActive = function(){
        this.dispatchEvent(SPLINT_EVENTS.onStateChange);
        this.setAttribute("state", "passive");
      }
      this.toggle = function(){
        if(this.hasAttribute("state") && this.getAttribute("state") == "active"){
          this.state().unsetActive();
        } else {
          this.state().setActive();
        }
      }
      return this;
  }
  HTMLElement.prototype.disable = function(type){
    this.setAttribute(type, "");
  }
  // HTMLElement.prototype.onEnter = function(keyEvent = "keyup"){
  //   function obj(element){
  //     element.getTrigger   = function(triggerElement, keyEvent){
  //       triggerElement.addEventListener(keyEvent, function(event){
  //         if(event.key === 'Enter'){
  //           event.preventDefault();
  //           triggerElement.click();
  //           RemoveEnterListener(triggerElement);
  //         }
  //       });
  //     };
  //     this.getValue     = function(valueElement){
  //       valueElement.addEventListener(keyEvent, function(event){
  //         if(event.key === 'Enter'){
  //           event.preventDefault();
  //           element.click();
  //           RemoveEnterListener(element);
  //         }
  //       });
  //     }
  //   }
  //   return new obj(this, keyEvent);
  // }
  HTMLElement.prototype.path = function(){
    if(this.Path == undefined){
      element = this;
      this.Path = [];
      while(element.parentNode != null){
        this.Path.push(element.parentNode);
        element = element.parentNode;
      }
    }
    return this.Path;
  }
  HTMLElement.prototype.delete = function(){
    this.innerHTML = "";
    this.parentNode.removeChild(this);
  }
  HTMLElement.prototype.getScrollHeight = function(){
    let a = this.scrollTop;
    let b = this.scrollHeight - this.clientHeight;
    let c = a / b;
    return Math.round(c*100) / 100;
  }
  HTMLElement.prototype.before = function(elementAfter){
    elementAfter.parentNode.insertBefore(this, elementAfter);
  }
  HTMLElement.prototype.bindIcon = function(IconName, ...ClassName){
    if(this.tagName == "SPAN"){
      this.innerHTML = IconName;
      if(ClassName[0] != undefined){
        this.classList.add(ClassName);
      }
      this.classList.add("material-symbols-outlined");
    }
  }

  HTMLElement.prototype.removeIcon = function(IconName){
    if(this.tagName == "SPAN"){
      this.innerHTML = IconName;
      this.classList.forEach(Class => {
        if(Class.includes("material-symbols-outlined")){
          this.classList.remove(Class);
        }
      });
    }
  }


String.prototype.allIndexOf = function(toSearch) {
    var indices = [];
    for(var pos = this.indexOf(toSearch); pos !== -1; pos = this.indexOf(toSearch, pos + 1)) {
        indices.push(pos);
    }
    return indices;
}
Object.defineProperty(String.prototype, 'allIndexOf', {
    value: function(toSearch) {
        var indices = [];
        for(var pos = this.indexOf(toSearch); pos !== -1; pos = this.indexOf(toSearch, pos + 1)) {
            indices.push(pos);
        }
        return indices;
    },
    enumerable: false
  });

    Object.defineProperty(String.prototype, 'amountOf', {
        value: function(...toSearch) {
            var amount = 0;
            for(const val of toSearch){
                amount += this.split(val).length - 1;
            }
            return amount;
        }
    });
  
  
  class ViewPort {
    static eventStack = [];
    static lastSize = null;
    static #size    = null;
    static {
        window.addEventListener('resize', function(e){
            e.preventDefault();
            ViewPort.#calcSize();
        }, true)
    }
    static isMobile(){
        if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }
        return false;
        return window.navigator.userAgentData.mobile;
    }
    static set onViewPortChanged(func){
        ViewPort.eventStack.push(func);
    }
    static getSize(){
        if(ViewPort.#size == null){
            ViewPort.#calcSize();
        }
        return ViewPort.#size;
    }
    static #calcSize(){
        let width = document.body.getBoundingClientRect().width;
        let height = window.screen.height;
        if(width <= 980){
            ViewPort.#size = 'mobile-small';
        } else if(width > 980 && width < 1200){
            ViewPort.#size = 'mobile'
        } else if(width > 1200){
            ViewPort.#size = 'desktop';
        }
        if(ViewPort.lastSize == null){
            ViewPort.lastSize = ViewPort.#size;
        }
        if(ViewPort.#size != ViewPort.lastSize){
            for(const ev of ViewPort.eventStack){
                ev(ViewPort.#size, ViewPort.lastSize);
            }
            ViewPort.lastSize = ViewPort.#size;
        }
    }
  }
//   const spl_windowExtensionsOBJ = new Object();
//         spl_windowExtensionsOBJ.isMobile = function(){
//             console.log(navigator.userAgent);
//             if (navigator.userAgent.match(/Android/i)
//             || navigator.userAgent.match(/webOS/i)
//             || navigator.userAgent.match(/iPhone/i)
//             || navigator.userAgent.match(/iPad/i)
//             || navigator.userAgent.match(/iPod/i)
//             || navigator.userAgent.match(/BlackBerry/i)
//             || navigator.userAgent.match(/Windows Phone/i)) {
//                 return true;
//             }
//             return false;
//             return window.navigator.userAgentData.mobile;
//         };
//         spl_windowExtensionsOBJ.getDeviceTypeCSS = function(){
//             let width = document.body.getBoundingClientRect().width;
//             let height = window.screen.height;
//             if(width <= 980){
//                 return 'mobile-small';
//             } else if(width > 980 && width < 1200){
//                 return 'mobile'
//             } else if(width > 1200){
//                 return 'desktop';
//             }
//         };

//   Window.prototype.Splint = spl_windowExtensionsOBJ;
