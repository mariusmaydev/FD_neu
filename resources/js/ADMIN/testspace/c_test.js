
class c_test {
    static {
        this.URL = location.origin + "/fd/resources/php/testspace/testspaceAccess.php";
    }
    static async getUrlsForDir(path, ...extensions){
        return new Promise(async function(resolve){
            let res = (await this.#call(path, extensions));
            console.dir(res);
        }.bind(this));
    }
    static async #call(path, extensions){
        let c = new SPLINT.CallPHP(this.URL, "GET_PATH");
            c.data.PATH = path;
            c.data.EXT = extensions;
        return c.send();
    }
}