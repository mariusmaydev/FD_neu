
class login_facebook {
    static init(parent){
        window.fbAsyncInit = function() {
            FB.init({
              appId      : '826923231775414',
              xfbml      : true,
              version    : 'v15.0'
            });
            FB.AppEvents.logPageView();
          };
        
          (function(d, s, id){
             var js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement(s); js.id = id;
             js.src = "https://connect.facebook.net/de_DE/sdk.js";
             fjs.parentNode.insertBefore(js, fjs);
           }(document, 'script', 'facebook-jssdk'));
        //    let t = getElement("t", "div", parent.id);
        //         t.innerHTML = "<div class='fb-like' data-share='true' data-width='450' data-show-faces='true'></div>";
    }
    static isLoggedIn(){
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
        return response;
    }
    static logout(){
        FB.logout(function(response) {
            console.log("loggedOutFacebook");
         });
    }
    static drawButton(parent){
        let loginDiv = getElement("login_facebook", "div", parent.id);

            loginDiv.innerHTML = "<fb:login-button scope='public_profile,email' onlogin='login_facebook.checkLoginState();'></fb:login-button>";
    }
    static checkLoginState(){
        FB.getLoginStatus(function(response) {
            if(response.status == "connected"){
                console.log("success", response);
                login_facebook.newUser();
            } else {
                console.log("error", response);
            }
          });
    }
    static async newUser(){
        let userData = await login_facebook.getUserLoginData();
        NewUser(userData.name, userData.email, "facebook", false);
        Login("facebook", userData.name, userData.email);
    }
    static async getUserLoginData(){
        let response = await test();
        return response;
        function test(){
            return new Promise(resolve => {
                FB.api('/me', {fields: 'name, email'}, function(response) {
                    resolve(response);
                });
            });
        }
    }
}