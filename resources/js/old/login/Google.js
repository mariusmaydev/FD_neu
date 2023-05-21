
function login_Google_callback(response){
  let loginData = (login_Google.parseCredentials(response));
    console.log(loginData);
  // let valid = login.checkData(loginData.email, loginData.name);
  //     PHP_sessions_S.remove("ADMIN", false);
  //     if(!valid.Email){
  //       login.newAccount_Google(loginData.email, loginData.name);
  //     }
  //     login.login(login.getUserID(loginData.email));
  //     UserData.add();
  //     NavigationBar.update();
  //     if(Location_S.Location == PATH.location.login){
  //       Location_S.back();
  //     }
}

class login_Google {
  static LOGIN = "LOGIN_GOOGLE";
  static CLIENT_ID = '926468304364-5gta4d1gu177lpqbn4lok5ngph0ja494.apps.googleusercontent.com';
  static PATH = PATH.php.login;

  constructor(parent){
    this.parent = parent;
    this.id = "login_Google_";
    this.mainElement = new SPLINT.DOMElement(this.id + "_main", "div", this.parent);
  }
  static init(){
    console.log(Cookie.get("g_state"));
    if(document.getElementById("g_id_onload") != null){
      document.getElementById("g_id_onload").remove();
    }
    let div = new SPLINT.DOMElement("g_id_onload", "div", document.body);
        div.setAttribute("data-auto_prompt", "false");
        div.setAttribute("data-client_id", login_Google.CLIENT_ID);
    async function func(){
      if(!await login.isLoggedIn()){
        login_Google.drawPopUp(div);
      }
    }
  }
  static parseCredentials(data){
    return JSON.parse(SPLINT.Tools.parse.ASCII_to_base64(data.credential.split(".")[1]));
  }
  static drawPopUp(div){
        div.setAttribute("data-auto_select" ,"false");
        div.setAttribute("data-auto_prompt", "true");
        div.setAttribute("data-client_id", login_Google.CLIENT_ID);
        div.setAttribute("data-context", "signin");
        div.setAttribute("data-ux_mode", "popup");
        div.setAttribute("data-callback", "login_Google_callback");
  }
  drawLoginButton(){
    let div = new SPLINT.DOMElement("g_id_signin", "div", this.mainElement);
        div.Class("g_id_signin");
        div.setAttribute("data-type", "standard");
        div.setAttribute("data-shape", "rectangular");
        div.setAttribute("data-theme", "outline");
        div.setAttribute("data-text", "signin_with");
        div.setAttribute("data-size", "medium");
        div.setAttribute("data-logo_alignment", "left");
        div.setAttribute("data-callback", "login_Google_callback");
        // this.drawLogoutButton();
  }
  drawLogoutButton(){
    let div = new SPLINT.DOMElement("g_id_signout", "div", this.mainElement);
        div.Class("g_id_signout");
        div.style = "background-color: red; width: 100px; height: 100px;";
        div.onclick = function(){
        }
  }
}

