
class drawCart extends Pages_template {
    constructor() {
        super("cart");
    }
    draw(){
        this.right = new drawCartRight(this.mainElement);
        this.list = new drawCartList(this.mainElement);
    }

}
