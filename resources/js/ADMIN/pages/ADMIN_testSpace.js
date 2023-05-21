
class n_ADMIN_testSpace extends ADMIN_DrawTemplate {
    constructor(name){
      super(name);
  
    }
    draw(){
      let button = new SPLINT.DOMElement.Button(this.mainElement, "lithophane");
          button.button.onclick = function(){
            console.log("ok");
            console.log(TestSpace_connect.createLithophane());
          }
  
      this.testShoppingCart();
      this.testImap();
    }
    testShoppingCart(){
      let button_test = new SPLINT.DOMElement.Button(this.mainElement, "test", "test");
          button_test.onclick = function(){
            let data = ShoppingCart.get();
                console.log(data);
          }
    }
    testImap(){
        new Chart()
      let button_test = new SPLINT.DOMElement.Button(this.mainElement, "test1", "imap");
          button_test.onclick = function(){
            // let obj = new emailFilterObj_S();
            //     obj.SUBJECT = "1";
            //     obj.ALL     = true;
            //     obj.SEEN    = true;
            let data1 = email_S.get(0);
                console.log(data1);

            let data = email_S.remove(0);
                console.log(data);

            let data2 = email_S.get(0);
                console.log(data2);

          }
    }
  }
  
  class TestSpace_connect {
    static CREATE_LITHOPHANE = "CREATE_LITHOPHANE";
    static TEST = "TEST";
    static PATH = PATH.php.converter;
  
    static call(data, path = TestSpace_connect.PATH){
      return CallPHP_S.call(path, data);
    }
    static createLithophane(){
      let data = CallPHP_S.getCallObject(TestSpace_connect.CREATE_LITHOPHANE);
      return TestSpace_connect.call(data).text;
    }
  }