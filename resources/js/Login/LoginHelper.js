class login {
    static GET_USERID               = "GET_USERID";
    static EDIT_DATA                = "EDIT_DATA";
    static NEW_USER_GOOGLE          = "NEW_USER_GOOGLE";
    static NEW_USER_FD              = "NEW_USER_FD";
    static NEW_USER_ADMIN           = "NEW_USER_ADMIN";
    static LOGIN                    = "LOGIN";
    static LOGOUT                   = "LOGOUT";
    static CHECK_DATA               = "CHECK_DATA";
    static VERIFY_DATA              = "VERIFY_DATA";
    static LOGGEDIN                 = "LOGGEDIN"; 
    static CHECK_CODE               = "CHECK_CODE";
    static VERIFY_ACCOUNT           = "VERIFY_ACCOUNT";
    static GET_DATA                 = "GET_DATA";
    static LOGIN_GUEST              = "LOGIN_GUEST";
    static nLOGIN_GUEST              = "LOGIN";

    static NEW_GUEST                = "NEW_GUEST";

    static REMOVE_ACCOUNT           = "REMOVE_ACCOUNT";

    static COOKIE_GUEST             = "COOKIE_GUEST";
    
    static PATH         = PATH.php.login;

    static {
        SPLINT.CallPHP.Manager.bind2class(PATH.php.login, this);
    }
    static call(data){
        return CallPHP_S.call(login.PATH, data);
    }
    // static verifyData(UserID, password){
    //     let data = this.callPHP(login.VERIFY_DATA);
    //         data.UserID     = UserID;
    //         data.Password   = password;
    //     return login.call(data).toObject();
    // }
    // static checkData(email, userName){
    //     if(email == null && userName == null){
    //         function obj(){
    //             this.existEmail = function(Email){
    //                 let response = login.checkData(Email, "dsf");
    //                 return response.Email;
    //             }
    //             this.existUserName = function(Username){
    //                 let response = login.checkData("ddf", Username);
    //                 return response.UserName;
    //             }
    //         }
    //         return new obj();
    //     } else {
    //         let data = this.callPHP(login.CHECK_DATA);
    //             data.Email      = email;
    //             data.UserName   = userName;
    //         return login.call(data).toObject();
    //     }
    // }
    // static getUserID(email = null, userName = null){
    //     let call = this.callPHP(login.GET_USERID);
    //         call.data.Email = email;
    //         call.data.UserName = userName;
    //     return call.send();
    // }
    // static newAccount_Google(email, userName){
    //     let call = this.callPHP(login.NEW_USER_GOOGLE);
    //         call.data.Email = email;
    //         call.data.UserName = userName;
    //     return call.send();
    // }
    // static newAccount_FD(email, userName, password){
    //     let call = this.callPHP(login.NEW_USER_FD);
    //         call.data.Email = email;
    //         call.data.UserName = userName;
    //         call.data.Password = password;
    //     return call.send();
    // }
    static newAccount_ADMIN(email, userName, password){
        let call = this.callPHP(login.NEW_USER_ADMIN);
            call.data.Email      = email;
            call.data.UserName   = userName;
            call.data.Password   = password;
        return call.send();
    }
    // static login(UserID){
    //     let call = this.callPHP(login.LOGIN);
    //         call.data.UserID = UserID;
    //         return call.send();
    // }
    // // static logout(){
    // //     let call = this.callPHP(login.LOGOUT);
    // //     return call.send();
    // // }
    static async getData(UserID = null){
        let call = this.callPHP(login.GET_DATA);
            call.data.UserID = UserID;
        return call.send();
    }
    // static editData(UserName = null, Email = null, Password = null){
    //     let call = this.callPHP(login.EDIT_DATA);
    //         call.data.UserName   = UserName;
    //         call.data.Email      = Email;
    //         call.data.Password   = Password;
    //     return call.send();	
    // }
    // static isLoggedIn(){
    //     let call = this.callPHP(login.LOGGEDIN);
    //     return call.send();
    // }
    // static removeAccount(UserID){
    //     let call = this.callPHP(login.REMOVE_ACCOUNT);
    //         call.data.UserID = UserID;
    //     return call.send();
    // }
    // // static checkCode(){
    // //     let call = this.callPHP(login.CHECK_CODE);
    // //     return call.send();
    // // }
    // // static verifyAccount(UserID){
    // //     let call = this.callPHP(login.VERIFY_ACCOUNT);
    // //         call.data.UserID = UserID;
    // //     return call.send();
    // // }

    // static async isGuest(){
    //     if(await SPLINT.SessionsPHP.get(SPLINT.SessionsPHP.GUEST, false) == "true" || await SPLINT.SessionsPHP.get(SPLINT.SessionsPHP.GUEST, false) == true){
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    // static async loginGuest(){
    //     return new Promise(async function(resolve){
    //         let cookieGuest = Cookie.get(login.COOKIE_GUEST);
    //         if((await login.getData(cookieGuest)) != null){
    //             if(cookieGuest != undefined){
    //                 let call = new SPLINT.CallPHP(login.PATH, login.LOGIN_GUEST);
    //                     call.data.UserID = cookieGuest;
    //                 resolve((call.send()));
    //             }
    //         }
    //         resolve(false)
    //     }.bind(this))
    // }
    // static async newAccount_Guest(){
    //     return new Promise(async function(resolve){
    //         let call    = this.callPHP(login.NEW_GUEST);
    //         let UserID  = await call.send();
    //         Cookie.set(login.COOKIE_GUEST, UserID, 10);
    //         resolve(UserID);
    //     }.bind(this));
    // }
    static async Login(){
        return new Promise(async function(resolve){
            if(S_Location.getHashes().includes("ADMIN")){
                resolve("ADMIN");
                return "ADMIN";
            } else {
                let call = new SPLINT.CallPHP(login.PATH, login.nLOGIN_GUEST);
                    call.data.UserID = Cookie.get(login.COOKIE_GUEST);
                let res = SPLINT.Tools.parse.toJSON((await call.send()));
                resolve(res);
                return res;
            }
        }).then(function(data){
            console.log(data)
            if(data == "ADMIN"){
                return data;
            }
            Cookie.set(login.COOKIE_GUEST, data.UserID);
            return data;
        });
    }
    // static async init(){
    //     return new Promise(async function(resolve){
    //         if(S_Location.getHashes().includes("ADMIN") && BufferStorage.get("USER_ID") == "ADMIN"){
    //         } else {
    //             if((await login.loginGuest()) == false){
    //                 let UserID = await login.newAccount_Guest();
    //                 await login.loginGuest();
    //                     BufferStorage.set("GUEST", true);
    //                 SPLINT.SessionsPHP.set(SPLINT.SessionsPHP.GUEST, true, false);
    //             } else {
    //                 await login.loginGuest();
    //             }
    //         }
    //         resolve(true);
    //     }.bind(this));
    // }
} 

class passwordStrength {
    static strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
    static mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')
    static #output_element = null;
    static get(password){
        if(this.strongPassword.test(password)){
            return 2;
        } else if(this.mediumPassword.test(password)){
            return 1;
        } else {
            return 0;
        }
    }
}
