

// class managerListener {
//     static {
//         SPLINT.Events.onInitComplete = function(){
//             setTimeout(async function(){
//                 this.start();
//             }.bind(this), 1000)
//         }.bind(this);
//     }
//     static async start(){
//         await Promise.all([
//             SPLINT.require('@PROJECT_ROOT/manager/managerCallPHP.js'),
//             SPLINT.require('@PROJECT_ROOT/manager/manager.js')]);
//         this.getPage();
//         manager.STORAGE.TimeStart = new Date();
//         document.addEventListener("visibilitychange", function(e){
//             if (document.visibilityState === 'hidden') {
//                 // this.STORAGE.Page.TimeEnd = new Date();
//                 // this.save();
//             }
//             // console.dir(window.location)
//             // console.dir(e.target.referrer)
//             // console.dir(e);

//             // // let newOrigin = S_URI.getOrigin(e.target.referrer);
//             // // if(location.href == e.target.referrer){

//             // // }
//         }.bind(this));
//         this.saveIP();
//         manager.dir();
//         manager.STORAGE.dir();
//     }
//     static async saveIP(){
//         let res = await SPLINT.API.IPinfo.get();
//         let res2 = await managerCallPHP.editIP(null, res);
//         console.log(res2)

//     }
//     static getPage(){
//         let url = location.pathname;
//         if(url.endsWith("/")){
//             this.PAGE = "index";
//         } else {
//             let fileName = url.split("/");
//             this.PAGE = fileName.at(-1).split(".")[0];
//         }
//         return this.PAGE;
//     }
//     static async save(){
//         let tStart  = S_DateTime.parseToMySqlDateTime(this.STORAGE.TimeStart);
//         let tEnd    = S_DateTime.parseToMySqlDateTime(this.STORAGE.TimeEnd);
//         managerCallPHP.add(tStart, tEnd, this.PAGE);
//     }
// }