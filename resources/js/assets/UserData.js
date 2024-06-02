class UserData {
    static GET              = "GET";
    static ADD              = "ADD";
    static EDIT             = "EDIT";
    static REMOVE_IMAGE     = "REMOVE_IMAGE";
    static REMOVE           = "REMOVE";
    static GET_IMAGE        = "GET_IMAGE";
    static GET_FROM_SESSION = "GET_FROM_SESSION";
    static GET_ALL_USERIDATA= "GET_ALL_USERIDATA";

    static PATH = PATH.php.userData;
    static data = new Object();
    
    static call(data){
        console.log("call");
        return SPLINT.Data.CallPHP_OLD.call(this.PATH, data);
    }
    static getFromSession(){
        this.data.METHOD    = this.GET_FROM_SESSION;
        return this.call(this.data).toObject();
    }
    static get(mode, ImageID){
        this.data.METHOD    = this.GET;
        this.data.mode       = mode;
        this.data.ImageID    = ImageID;
        return this.call(this.data).toObject(true);
    }
    static async getAllUserData(){
        let call = new SPLINT.CallPHP(this.PATH, this.GET_ALL_USERIDATA);
        return call.send();
        // this.data.METHOD    = this.GET_ALL_USERIDATA;
        // // this.data.mode       = mode;
        // // this.data.ImageID    = ImageID;
        // return this.call(this.data).toObject(true);
    }
    static parse(data){
        let dataOut = data;
            dataOut.ShoppingCart    = S_JSON.parseIf(data.ShoppingCart);
            dataOut.projects        = S_JSON.parseIf(data.projects);
            dataOut.userInformation = S_JSON.parseIf(data.userInformation);
        return dataOut;
    }
    static remove(UserID){
        this.data.METHOD    = this.REMOVE;
        this.data.UserID   = UserID;
        return this.call(this.data);
    }
    static removeImage(ImageID){
        this.data.METHOD    = this.REMOVE_IMAGE;
        this.data.ImageID   = ImageID;
        return this.call(this.data);
    }
    static async getImages(ImageID, mode, hashtags){
        let call = new SPLINT.CallPHP(this.PATH, this.GET_IMAGE)
            call.data.mode = mode;
            call.data.ImageID = ImageID;
            call.data.hashtags = hashtags;

            let res = await call.send();
            console.dir(res);
            return res;
        this.data.METHOD    = this.GET_IMAGE;
        this.data.mode      = mode;
        this.data.ImageID   = ImageID;
        this.data.hashtags  = hashtags;
        return this.call(this.data);
    }
    static add(){
        this.data.METHOD           = this.ADD;
        return this.call(this.data);
    }
    static edit(){
        this.data.METHOD   = this.EDIT;
        function obj(data){
            this.Sparks = function(Sparks){
                data.Sparks = Sparks;
                UserData.call(data);
            }
            this.ShoppingCart = function(ShoppingCart){
                data.ShoppingCart = ShoppingCart;
                UserData.call(data);
            }
            this.Images = function(Images){
                data.Images = Images;
                UserData.call(data);
            }
            this.UserInformation = function(UserInformation){
                data.userInformation = UserInformation;
                UserData.call(data);
            }
        }
        return new obj(this.data);
    }
    edit(){
        return UserData.edit();
    }
    add(Sparks, ShoppingCart){
        let UserInformation = new Object();
            UserInformation.phone = "";
            UserInformation.salutation = null;
        return UserData.add(UserInformation, Sparks, ShoppingCart);
    }
    get(mode, ImageID){
        return UserData.get(mode, ImageID);
    }
}