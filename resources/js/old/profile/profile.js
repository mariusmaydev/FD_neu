
class drawProfile extends Pages_template {
    constructor() {
        super("profile");
        if(!login.isLoggedIn()){
            S_Location.goto(PATH.location.login).call();
        }
    }
    draw(){
        this.subPages = new ProfileSubPages(this.mainElement);
        this.drawLeftBar();
        this.drawProfileWindow();
    }
    drawProfileWindow(){
        let id = this.id + "WindowMain_"
        this.profileWindowMain = new SPLINT.DOMElement(id + "main", "div", this.mainElement);
        this.profileWindowMain.Class("ProfileWindowMain");
        this.profileWindowMain.innerHTML = "";

        this.subPages = new ProfileSubPages(this.profileWindowMain, id);
        switch(S_Location.getHashes()){
            case ProfileHelper.ACCOUNT_INFORMATION  : new Profile_AccountInformation(this.profileWindowMain, id); break;
            case ProfileHelper.ORDERS               : this.subPages.drawOrders(); break;
            case ProfileHelper.DESIGNS              : this.subPages.drawDesigns(); break;
            case ProfileHelper.IMAGES               : this.subPages.drawImages(); break;
            case ProfileHelper.SPARKS               : DrawProfileSparks(main); break;
            case ProfileHelper.ADDRESSES            : this.subPages.drawAddresses(); break;
        }
    }
    drawLeftBar(){
        let id = this.id + "leftBar_";
        this.leftBarMain = new SPLINT.DOMElement(id + "main", "div", this.mainElement);
        this.leftBarMain.Class("ProfileBarMain"); 

            let button_accountInformation = new SPLINT.DOMElement.Button(this.leftBarMain, id + "button_AccountInformation", "Kontoinformationen");
                button_accountInformation.setStyleTemplate(S_Button.STYLE_DEFAULT);
                button_accountInformation.button.onclick = function(){
                    window.location.hash = ProfileHelper.ACCOUNT_INFORMATION;
                    this.drawProfileWindow();
                }.bind(this);

            let button_orders = new SPLINT.DOMElement.Button(this.leftBarMain, "button_Orders", "Bestellungen");
                button_orders.setStyleTemplate(S_Button.STYLE_DEFAULT);
                button_orders.button.onclick = function(){
                    window.location.hash = ProfileHelper.ORDERS;
                    this.drawProfileWindow();
                }.bind(this);

            let button_designs = new SPLINT.DOMElement.Button(this.leftBarMain, "button_Designs", "Designs");
                button_designs.setStyleTemplate(S_Button.STYLE_DEFAULT);
                button_designs.button.onclick = function(){
                    window.location.hash = ProfileHelper.DESIGNS;
                    this.drawProfileWindow();
                }.bind(this);

            let button_images = new SPLINT.DOMElement.Button(this.leftBarMain, "button_Images", "gespeicherte Bilder");
                button_images.setStyleTemplate(S_Button.STYLE_DEFAULT);
                button_images.button.onclick = function(){
                    window.location.hash = ProfileHelper.IMAGES;
                    this.drawProfileWindow();
                }.bind(this);

            let button_sparks = new SPLINT.DOMElement.Button(this.leftBarMain, "button_Sparks", "Sparks");
                button_sparks.setStyleTemplate(S_Button.STYLE_DEFAULT);
                button_sparks.button.onclick = function(){
                    window.location.hash = ProfileHelper.SPARKS;
                    this.drawProfileWindow();
                }.bind(this);

            let button_addresses = new SPLINT.DOMElement.Button(this.leftBarMain, "button_Addresses", "Adressen");
                button_addresses.setStyleTemplate(S_Button.STYLE_DEFAULT);
                button_addresses.button.onclick = function(){
                    window.location.hash = ProfileHelper.ADDRESSES;
                    this.drawProfileWindow();
                }.bind(this);
    }
}

class ProfileSubPages {
    constructor(parent, id){
        this.parent = parent;
        this.id     = id;
    }

    drawImages(){
        let headline = new SPLINT.DOMElement.SpanDiv(this.parent, "headline", "Bilder von Dir");
            headline.div.Class("headline");
            new SPLINT.DOMElement.HorizontalLine(this.parent, "divider1", "horizontalLine");
        let imageMenu = new ImageMenu(this.parent);
            imageMenu.draw();
    }
    drawOrders(){
        let headline = new SPLINT.DOMElement.SpanDiv(this.parent, "headline", "Bestellungen");
        let orderList = new SPLINT.DOMElement(this.id + "orderListMain", "div", this.parent);
            orderList.Class("OrderMenuMain");
            let UserID = SPLINT.SessionsPHP.get(SPLINT.SessionsPHP.USER_ID, false);
            console.log(SPLINT.SessionsPHP.get(SPLINT.SessionsPHP.USER_ID, false))
            let orderData = order.get(null, UserID);
            console.log(orderData);
            for(const index in orderData){
                let listElement = new SPLINT.DOMElement(this.id + "orderListElement_" + index, "div", orderList);
                    listElement.Class("listElement");
                    let data = orderData[index];
                    let Items = data.Items;

                    let orderListProjectElement = new SPLINT.DOMElement(this.id + "orderListProjectElement_" + index, "div", listElement);
                        orderListProjectElement.Class("orderListImgElement");
                        for(const e in Items){
                            let projectData = ProjectHelper.get(Items[e].ProjectID);
                                let img = new ImageElement(orderListProjectElement.id + "_" + e, orderListProjectElement);
                                    img.src = projectData.Thumbnail;
                        }
            }
    }
    drawDesigns(){
        let headline = new SPLINT.DOMElement.SpanDiv(this.parent, "headline", "Designs");
            headline.div.Class("headline");
        let drawProject = new drawProjectList(this.parent, "projectList", false);
    }
    drawAddresses(){
        let headline = new SPLINT.DOMElement.SpanDiv(this.parent, "headline", "Adressen");
            headline.div.Class("headline");

        let addressMenu = new AddressMenu(this.parent, "q");
    }
}

class Profile_AccountInformation {
    constructor(parent, id){
        this.parent = parent;
        this.id     = id;
        this.draw();
    }
    draw(){
        let headline = new SPLINT.DOMElement.SpanDiv(this.parent, "headline", "Kontoinformationen");
            headline.div.Class("headline");
        let accountInformationMain = new SPLINT.DOMElement(this.id + "accountInformation_main", "div", this.parent);
            accountInformationMain.Class("AccountInformationMain");
            let loginData = login.getData();
            let userData = UserData.get();
            let joinTime = new formatUnix_S(loginData.JoinTime * 1000);
        
            let userDataTable = new table(accountInformationMain, "userData");
                userDataTable.div.Class("userDataDiv");
                userDataTable.addRow("Anrede", "");
                userDataTable.addRow("Nutzername", loginData.UserName);
                userDataTable.addRow("Emailadresse", loginData.Email);
                userDataTable.addRow("Telefonnummer", "234231423423");
                userDataTable.addRow("Konto erstellt", joinTime.date() + " " + joinTime.time());
                userDataTable.draw();
        
                let salutationDiv = new SPLINT.DOMElement(this.id + "salutationDiv", "div", userDataTable.getField(0, 1));
                    salutationDiv.Class("salutationDiv");
                    let salutationRadio = new S_radioButton(salutationDiv, "salutationRadio");
                        salutationRadio.onChange = function(e){
                            let userInformation = new Object();
                                userInformation.salutation = e.target.value;
                            UserData.edit().UserInformation(userInformation);
                        }
                        salutationRadio.dataObj.add("Mr", "Herr");
                        salutationRadio.dataObj.add("Mrs", "Frau");
                        salutationRadio.dataObj.add("Mx", "Divers");
                        salutationRadio.drawRadio();
                        if(userData.userInformation != false){
                            salutationRadio.setValue(userData.userInformation.salutation);
                        }
        
                        
            let button_changeUserName = new SPLINT.DOMElement.Button(userDataTable.getRow(1), "changeUserName", "ändern");
                button_changeUserName.onclick = function(){
                    console.log("ok");
                    // DrawChangeUserName(parent, userDataTable.getField(1, 1));
                }.bind(this);
            
            let button_changeEmail = new SPLINT.DOMElement.Button(userDataTable.getRow(2), "ChangeEmail", "ändern");
                button_changeEmail.onclick = function(){
                    DrawChangeEmail(parent, userDataTable.getField(2, 1));
                }.bind(this);
            let button_changePassword = new SPLINT.DOMElement.Button(accountInformationMain, "ChangePassword", "Passwort ändern");
                button_changePassword.onclick = function(){
                    this.drawChangePassword();
                }.bind(this);
        
            let mainButtonDiv = new SPLINT.DOMElement(this.id + "mainButtonDiv", "div", accountInformationMain);
                mainButtonDiv.Class("mainButtonDiv");
                

                let button_logout = new SPLINT.DOMElement.Button(mainButtonDiv, "logout");
                    button_logout.bindIcon("logout");
                    button_logout.button.setTooltip("abmelden", 'bottom');
                    button_logout.onclick = function(){
                        google.accounts.id.disableAutoSelect();
                        login.logout();
                        S_Location.goto(PATH.location.index).call();
                    }

    }
    drawChangePassword(){
        let subwindow = new SPLINT.DOMElement.popupWindow("testWindow");
            subwindow.Class("SPLINT.DOMElement.popupWindowChangePassword");

            let input_old_pw = new InputDiv_S(subwindow.element, "old_pw");
                input_old_pw.type = "password";
            let button = input_old_pw.drawSwitchButton();
                button.bindIcon("visibility")
                button.onactive = function(e){
                    input_old_pw.type = "text";
                    this.bindIcon("visibility_off");
                }
                button.onpassive = function(){
                    input_old_pw.type = "password";
                    this.bindIcon("visibility");
                }
            
            let button_submit = new SPLINT.DOMElement.Button(subwindow, "old_pw_submit", "ändern");
                button_submit.onclick = function(){
                    if(login.verifyData(SPLINT.SessionsPHP.get(SPLINT.SessionsPHP.USER_ID, false), input_old_pw.value)){
                        
                    } else {
                        input_old_pw.invalid("Passwort nicht korrekt")
                    }
                }
            subwindow.append(input_old_pw.div);
            subwindow.append(button_submit.button);
    }
    drawChangeEmail(){

    }
    drawChangeUserName(){

    }
}
