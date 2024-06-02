
class ADMIN_login extends ADMIN_DrawTemplate {
    constructor(){
        super("login");
        // this.draw();
        // this.mainElement.Class("ADMIN_orderMain");
    }
    chooseHash(){
        this.mainElement.clear();
        let hashes = SPLINT.Tools.Location.getHashes();
        console.log(hashes)
        if(hashes.includes("login")){
            this.drawLoginMenu();
        } else {
            this.drawLoginList();
        }
    }
    async draw(){
        window.onhashchange = this.chooseHash.bind(this);
        this.chooseHash();
    }
    async drawLoginMenu(){
        this.container = new SPLINT.DOMElement(this.id + "container", "div", this.mainElement);
        this.container.Class("containerNew");
            let headline = new SPLINT.DOMElement.SpanDiv(this.container, "headline", "Anmeldung")
                headline.Class("headline");

                let inputContainer = new SPLINT.DOMElement(this.id + "inputContainer", "div", this.container)
                    inputContainer.Class("inputContainer");
                    let input_name = new SPLINT.DOMElement.InputDiv(inputContainer, "userName", "Nutzername");
                        input_name.onEnter = function(){bt.click()};
                    let input_pw = new SPLINT.DOMElement.InputDiv(inputContainer, "password", "Passwort");
                        input_pw.onEnter = function(){bt.click()};

            let bt = new SPLINT.DOMElement.Button(this.container, "submit", "anmelden");
                bt.Class("submit");
                bt.basicStyling = SPLINT.CONSTANTS.BUTTON_STYLES.DEFAULT;
                bt.onclick = async function(){
                    let name    = input_name.value;
                    let pw      = input_pw.value;
                    let flag    = false;
                    if(name == ""){
                        input_name.invalid();
                        flag = true;
                    }
                    if(pw == ""){
                        input_pw.invalid();
                        flag = true;
                    }
                    if(flag){
                        return;
                    }
                    let res = (await ADMIN_loginFuncs.login(name, pw));
                    if(res == null){
                        input_name.invalid("Nutzername falsch");
                    } else if(res == false){
                        input_pw.invalid("Passwort falsch");
                    } else if(res instanceof Object){
                        SPLINT.Tools.Location.goBack();
                    }
                }
    }
    async drawLoginList(){
        this.container = new SPLINT.DOMElement(this.id + "container", "div", this.mainElement);
        this.container.Class("container");

            this.drawNewLogin(this.container);
            let label = new SPLINT.DOMElement.SpanDiv(this.container, "loginListHeadLine", "Admin-login-daten");
                label.Class("labelLoginList");
            let data = (await ADMIN_loginFuncs.getAll());

            let gen = SPLINT.DOMElement.SpanDiv.get;
            let table1 = new SPLINT.DOMElement.Table.Grid(this.container, "loginList", data.length, 3);
                table1.getHead();
                gen(table1.getData2Head(0), "", "Benutzername");
                gen(table1.getData2Head(1), "", "Nutzer-ID");
                gen(table1.getData2Head(2), "", "");
                table1.draw();
                for(const index in data){
                    let e = data[index];
                    if((await ADMIN_loginFuncs.UserID) == e.UserID){
                        table1.getRow((index -1 )).SPLINT.state.setActive();
                    }
                    gen(table1.getData(index, 0), "userName", e.UserName);
                    gen(table1.getData(index, 1), "userID", e.UserID);
                    let div = new SPLINT.DOMElement(table1.getData(index, 2).id + "_buttons", "div", table1.getData(index, 2));
                        let bt_remove = new SPLINT.DOMElement.Button(div, "remove");
                            bt_remove.bindIcon("delete");
                            bt_remove.onclick = async function(){
                                if((await ADMIN_loginFuncs.UserID) == e.UserID){
                                    await ADMIN_loginFuncs.remove(e.UserID);
                                    await ADMIN_loginFuncs.logout();
                                } else {
                                    await ADMIN_loginFuncs.remove(e.UserID);
                                }
                                this.draw();
                            }.bind(this);
                        let bt_edit = new SPLINT.DOMElement.Button(div, "edit");
                            bt_edit.bindIcon("edit");
                }    
    }
    drawNewLogin(parent){
        let container = new SPLINT.DOMElement(this.id + "container_new", "div", parent);
            container.Class("container_new");
            let headline = new SPLINT.DOMElement.SpanDiv(container, "headline", "Login-Daten erstellen")
                headline.Class("headline");

                let inputContainer = new SPLINT.DOMElement(this.id + "inputContainer", "div", container)
                    inputContainer.Class("inputContainer");
                    let input_name = new SPLINT.DOMElement.InputDiv(inputContainer, "userName", "Nutzername");
                        input_name.onEnter = function(){bt.click()};
                    let input_pw = new SPLINT.DOMElement.InputDiv(inputContainer, "password", "Passwort");
                        input_pw.onEnter = function(){bt.click()};

            let bt = new SPLINT.DOMElement.Button(container, "submit", "speichern");
                bt.Class("submit");
                bt.basicStyling = SPLINT.CONSTANTS.BUTTON_STYLES.DEFAULT;

                bt.onclick = async function(){
                    let name    = input_name.value;
                    let pw      = input_pw.value;
                    let flag    = false;
                    if(name == ""){
                        input_name.invalid();
                        flag = true;
                    }
                    if(pw == ""){
                        input_pw.invalid();
                        flag = true;
                    }
                    if(flag){
                        return;
                    }
                    let check = (await ADMIN_loginFuncs.check(name, pw));
                    if(check == null){
                        await ADMIN_loginFuncs.create(name, pw);
                        this.draw();
                    } else {
                        input_name.invalid("Nutzername bereits vergeben");
                    }
                }.bind(this);
    }
}