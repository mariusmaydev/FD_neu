// class S_Events {
//     static #onLoadingComplete = this.#new("S_onLoadingComplete");
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