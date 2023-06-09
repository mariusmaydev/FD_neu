// SPLINT.require('@PROJECT_ROOT/ADMIN/testspace/test_m.js');
class ADMIN_testSpace {
    constructor(parent = document.body){
        this.parent = parent;
        this.id = "ADMIN_testSpace_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("ADMIN_testSpace_Main");
        this.draw();
        // this.chart = new test_chartJS(this.mainElement);
    }
    async draw(){
        let g = new S_SideBarMobile(this.mainElement, "test");
            
        // let c_serverContainer = new SPLINT.DOMElement(this.id + "c_serverContainer", "div", this.rightContent);
        let data = await CategoryHelper.get_Originals()
        let pg = new drawProjectChoiceMenu(g.contentElement);
        // console.dir(data)
        // let obje = new SPLINT.DOMElement.ObjectEditor(g.contentElement, "test", data, false);
        //     obje.patterns = ["attr", "data"];
        //     obje.onPattern = function(Obj, pObj, pObjName){
        //         console.log(obje.getPart(pObjName));
        //         console.dir(arguments)
        //     }
        //     obje.onedit = function(obj, val){
        //         // SP_inspectProjects.saveConfig(obj, this.data.uri);
        //     }.bind(this);
        //     obje.draw();
        let bt = new SPLINT.DOMElement.Button(this.mainElement, "test", "open");
            bt.onclick = function(){
                g.open();
            }
        // let g = new S_ChoiceButton(this.mainElement, "test");
        //     g.add(1, "value")
        //     g.add(2, "value2")
        //     g.add(3, "value3")
        //     g.add(4, "value4")
        // let bt = new SPLINT.DOMElement.Button(this.mainElement, "upload", "upload File");
        //     bt.onclick = async function(){
        //         let code = (await SPLINT.API.Moonraker.loadGCode("http://localhost/fd/data/test.nc"));
        //         moonraker.uploadGCode(code, "test");
        //     }
        //     let bt1 = new SPLINT.DOMElement.Button(this.mainElement, "test", "test");
        //         bt1.onclick = async function(){
        //             let f = (await SPLINT.API.Moonraker.startPrint("test"));

        //             // let f = moonraker.startPrint("name");
        //             console.dir(f);
        //         }

    }
    draw1(){
        console.dir(navigator)
        // new ADMIN_test_Nesting(this.mainElement);
        let button = new SPLINT.DOMElement.Button(this.mainElement, "user", "user");
            button.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
            button.onclick = async function(){
                // let a  = await managerCallPHP.editUser("ADMIN", 123);
                let a = await SPLINT.API.IPinfo.get();
                let b = await SPLINT.API.IPapi.get();
                console.log(a);
                console.log(b);
                // ManagerHelper.take();
            }.bind(this);

        let button1 = new SPLINT.DOMElement.Button(this.mainElement, "stop", "stop");
            button1.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);   
            button1.onclick = function(){
                this.S_time.end();
                // ManagerHelper.take();
            }.bind(this);

        let button2 = new SPLINT.DOMElement.Button(this.mainElement, "send", "send");
            button2.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
            button2.onclick = async function(){
                // let b = S_DateTime.parseToMySqlDateTime(new Date());
                // console.log(b)
                let a = S_DateTime.parseToMySqlDateTime((new Date()));
                let b = S_DateTime.parseToMySqlDateTime((new Date()));
                let call = await ManagerHelper.add('2023-05-08 04:28:02', a, "USER19", "ADMIN");
                console.log(call);
                console.log(await ManagerHelper.get('2023-05-09 01:28:02'));
                // ManagerHelper.take();
            }.bind(this);
    }

}