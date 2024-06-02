
class ADMIN_userAccounts extends ADMIN_DrawTemplate {
    #_allUsers = null;
    constructor(){
        super("userAccounts");
        console.log("ok")
        // this.draw();
        // this.mainElement.Class("ADMIN_orderMain");
    }
    async getAllUsers(reload = false){
        if(this.#_allUsers == null || reload){
            this.#_allUsers = await UserData.getAllUserData();
        }
        return this.#_allUsers;
    }
    draw(){
        this.drawHead();
        this.drawUserList();
    }
    drawHead(){
        let btClearCart = new SPLINT.DOMElement.Button(this.head, "clearCart", "Alle Einkaufswagen bereinigen");
            btClearCart.onclick = async function(){
                let data = await login.getAllData();
                console.dir(data);
                for(const e of data){
                    let uTime = parseInt(e.lastLogin) * 1000;
                    let b = SPLINT.Tools.DateTime.getUnixTime(false)-(1000) - uTime;
                    if(b > 0) {
                        let h = await ShoppingCart.clear(e.UserID);
                            // productHelper.
                        console.dir(h)
                    }
                }
            }.bind(this);
    }
    async drawUserList(){
        let allUsers = await UserData.getAllUserData();
        console.dir(allUsers);
        let list = new SPLINT.DOMElement.Table.List(this.mainElement, "listMain", allUsers);
        list.func_drawListElement = async function(data, index, listElement){
            let id = listElement.id;
            let headContainer = new SPLINT.DOMElement(id + "headContainer", "div", listElement)
                let spanUserID = new SPLINT.DOMElement.SpanDiv(headContainer, "UserID", data.UserID);

                let loginData = await login.getData(data.UserID);
                let uTime = parseInt(loginData.lastLogin)*1000;
                let a = SPLINT.Tools.Time.timeDiff(SPLINT.Tools.DateTime.getUnixTime(false)-(1000*60*60*24*7),uTime,  true);

                let expirationSpan = new SPLINT.DOMElement.SpanDiv(headContainer, "expirationSpan", a)
                let label = new SPLINT.DOMElement.Label(expirationSpan.div, expirationSpan.span, "Konto verfällt in: ");
                    label.before();

            let contentContainer = new SPLINT.DOMElement(id + "body", "div", listElement)
                let projects = await ProjectHelper.getAll(null, data.UserID);
                let b = SPLINT.Tools.DateTime.getUnixTime(false)-(1000*60*60*24*7) - uTime;
                if(b > 0){
                    if(projects != null){
                        for(const e of projects) {
                            if(e.State == "CART" || e.State == "NORMAL"){
                                await ProjectHelper.remove(e.ProjectID);
                            }
                        }
                    }
                    await login.remove(data.UserID);
                    await UserData.remove(data.UserID);
                    return;
                }
                if(projects == null || projects.length == 0) {
                    return;
                }
                this.drawProjectList(contentContainer, projects);

        }.bind(this)
        list.draw()
    }
    async drawProjectList(parent, projects){
        let id = parent.id;
        let tableElement = new SPLINT.DOMElement.Table.Grid(parent, id + "list", projects.length, Object.keys(projects[0]).length - 3);
            tableElement.mainElement.Class("projectTable");
            tableElement.getHead();
            let gen = SPLINT.DOMElement.SpanDiv.get;
            let counter = 0;
            for (const [key, val] of Object.entries(projects[0])) {
                let i = counter;
                if(key == "Square" || key == "FullNC" || key == "SVG" || key == "Thumbnail" || key == "Design"){
                    continue;
                } else if(key == "Last_Time"){
                    gen(tableElement.getData2Head(i), "", key);
                    gen(tableElement.getData2Head(parseInt(i)+1), "", "löschung in");
                    gen(tableElement.getData2Head(parseInt(i)+2), "", "Optionen");
                } else {
                    gen(tableElement.getData2Head(i), "", key);
                }
                for ( const i1 in projects) {
                let str;
                if(key == "Product") {
                    str = (await productHelper.getByName(projects[i1][key])).viewName;
                    gen(tableElement.getData(i1, i), "a", str);
                } else if(key == "Last_Time"){
                    str = projects[i1][key];
                    gen(tableElement.getData(i1, i), "a", str);
                    let uTime = SPLINT.Tools.DateTime.Helper.convertDateTimeToFormatedUnix(projects[i1][key], false)
                    let a = SPLINT.Tools.Time.timeDiff(SPLINT.Tools.DateTime.getUnixTime(false)-(1000*60*60*24*7),uTime, true);
                    gen(tableElement.getData(i1, parseInt(i)+1), "a", a);
                    let container = new SPLINT.DOMElement(id + "_containerOptions_" + i1, "div", tableElement.getData(i1, parseInt(i)+2))
                        let btRemove = new SPLINT.DOMElement.Button(container, id + "remove_" + i1);
                            btRemove.bindIcon("delete");
                            console.dir(projects)
                            btRemove.onclick = async function(){
                                if(projects[i1].State == "CART"){
                                    await ShoppingCart.removeItem(projects[i1].ProjectID);
                                }
                                await ProjectHelper.remove(projects[i1].ProjectID);
                            }.bind(this);
                } else {
                    str = SPLINT.Tools.parse.stringToBool(projects[i1][key], true);
                    gen(tableElement.getData(i1, i), "a", str);
                }
            
            }
            counter++;
        }
    }
}