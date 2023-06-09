
class ADMIN_loginFuncs {
    static PATH = PATH.php.login;

    static get UserID(){
        return new Promise(async function(resolve){
            let r = (await SPLINT.SessionsPHP.get("ADMIN_USER_ID", false));
            resolve(r);
        });
    }    
    static get UserName(){
        return new Promise(async function(resolve){
            let r = (await SPLINT.SessionsPHP.get("ADMIN_USER_NAME", false));
            resolve(r);
        });
    }
    static async check_redirect(){
        let r = (await this.isLoggedIn());
        if(r == false){
            SPLINT.Tools.Location.URL = PATH_A.location.login;//.goto(PATH_A.location.login).call();
            SPLINT.Tools.Location.addHash("login").call();
        }
    }
    static async create(userName, password){
        let call = new SPLINT.CallPHP(this.PATH, "ADMIN.LOGIN.CREATE");
            call.data.UserName = userName;
            call.data.Password = password;
        return call.send();
    }
    static async isLoggedIn(){
        let r = (await this.UserID);
        if(r != false){
            return true;
        } else {
            return false;
        }
    }
    static async check(userName, password){
        let call = new SPLINT.CallPHP(this.PATH, "ADMIN.LOGIN.CHECK");
            call.data.UserName = userName;
            call.data.Password = password;
        return call.send();
    }
    static async login(userName, password){
        let call = new SPLINT.CallPHP(this.PATH, "ADMIN.LOGIN.LOGIN");
            call.data.UserName = userName;
            call.data.Password = password;
        return call.send();
    }
    static logout(){
        return new Promise(async function(resolve){
            let call = new SPLINT.CallPHP(ADMIN_loginFuncs.PATH, "ADMIN.LOGIN.LOGOUT");
            let res = (await call.send());
            ADMIN_loginFuncs.check_redirect();
            resolve(true);
        });
    }
    static async getAll(){
        let call = new SPLINT.CallPHP(this.PATH, "ADMIN.LOGIN.GETALL");
        return call.send();
    }
    static async remove(UserID){
        let call = new SPLINT.CallPHP(this.PATH, "ADMIN.LOGIN.REMOVE");
            call.data.UserID = UserID;
        return call.send();
    }
}