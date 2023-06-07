

class managerCallPHP {
    /**
     * @param {Date} timeStart 
     * @param {Date?} timeEnd 
     * @returns 
     */
    static async getTime(timeStart, timeEnd = null){
        let call = new SPLINT.CallPHP(PATH.php.manager, "PAGE.VIEWS.GET");
            call.data.TimeStart = timeStart;
            call.data.TimeEnd   = timeEnd;
            return call.send();
    }
    /**
     * @param {Date} timeStart 
     * @param {Date} timeEnd 
     * @param {string} UserID
     * @param {string} Page
     * @returns 
     */
    static async add(timeStart, timeEnd, Page, UserID = null){
        let call = new SPLINT.CallPHP(PATH.php.manager, "PAGE.VIEWS.ADD");
            call.data.TimeStart = timeStart;
            call.data.TimeEnd   = timeEnd;
            call.data.UserID    = UserID;
            call.data.Page      = Page;
            return call.send();
    }
    static async getUserData(UserID){
        return new Promise(async function(resolve){
        let call = new SPLINT.CallPHP(PATH.php.manager, "USER.GET");
            call.data.UserID = UserID;
            let res = (await call.send());
                // if(res != false){
                //     res.Path = SPLINT.Tools.parse.toJSON(res.Path);
                // }
                resolve(res);
                return res;
        });
    }
    static async editUser(UserID, IP = null, TimeStart, TimeEnd, path){
        let call = new SPLINT.CallPHP(PATH.php.manager, "USER.EDIT");
            call.data.UserID    = UserID;
            call.data.IP        = IP;
            call.data.TimeStart = TimeStart;
            call.data.TimeEnd   = TimeEnd;
            call.data.Path      = path;
        return call.send();
    }
    static async createUser(UserID, IP, TimeStart, TimeEnd, path){
        let call = new SPLINT.CallPHP(PATH.php.manager, "USER.CREATE");
            call.data.UserID    = UserID;
            call.data.IP        = IP;
            call.data.TimeStart = TimeStart;
            call.data.TimeEnd   = TimeEnd;
            call.data.Path      = path;
        return call.send();
    }
    static async editUserPATH(UserID, path){
        let call = new SPLINT.CallPHP(PATH.php.manager, "USER.EDIT.PATH");
            call.data.UserID = UserID;
            call.data.Path = JSON.stringify(path);
            // call.data.TimeStart = null;
            // call.data.TimeEnd = null;
        return call.send();
    }
    static async editIP(UserID, data){
        let call = new SPLINT.CallPHP(PATH.php.manager, "IP.WRITE");
            call.data = data;
            call.data.UserID = UserID;
        return call.send();
    }


}
// SPLINT.require('@PROJECT_ROOT/manager/manager.js');