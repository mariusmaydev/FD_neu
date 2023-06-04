

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
    static async editUser(UserID, IP = null){
        let call = new SPLINT.CallPHP(PATH.php.manager, "USER.NEW");
            call.data.UserID = UserID;
            call.data.IP = IP;
            call.data.TimeStart = null;
            call.data.TimeEnd = null;
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