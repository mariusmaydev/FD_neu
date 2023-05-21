class EMail {
  static ACCOUNT_VERIFICATION = "ACCOUNT_VERIFICATION";
  static RESET_PASSWORD       = "RESET_PASSWORD";
  static PATH = PATH.php.email;

  static sendMail(data){
    CallPHP_S.call(this.PATH, data);
  }
  static AccountVerification(){
    let data = new Object();
        data.METHOD = this.ACCOUNT_VERIFICATION;
    CallPHP_S.call(this.PATH, data).text;
  }
  static isReal(email){
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}