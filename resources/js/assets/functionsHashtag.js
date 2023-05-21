
class HashtagHelper {
    static EXIST_TAG    = "EXIST_TAG";
    static REMOVE_TAG   = "REMOVE_TAG"
    static ADD_TAG      = "ADD_TAG"
    static GET_TAG      = "GET_TAG";
    static EDIT_TAG     = "EDIT_TAG";

    static PATH = PATH.php.hashtags;
    static MANAGER;
    static {
        this.MANAGER = new SPLINT.CallPHP.Manager(this.PATH);
    }
    static async existTag(tag){
        let call = this.MANAGER.call(this.EXIST_TAG);
            call.data.name = tag;
        return call.send();
    }
    static async removeTag(tag){
        let call = this.MANAGER.call(this.REMOVE_TAG);
            call.data.name = tag;
        return call.send();
    }
    static async editTag(tag){
        let call = this.MANAGER.call(this.EDIT_TAG);
            call.data.name = tag;
        return call.send();
    }
    static async getTag(tag = null){
        let call = this.MANAGER.call(this.GET_TAG);
            call.data.name = tag;
        return call.send();
    }
    static async addTag(tag){
        let call = this.MANAGER.call(this.ADD_TAG);
            call.data.names = [tag];
        return call.send();
    }
}