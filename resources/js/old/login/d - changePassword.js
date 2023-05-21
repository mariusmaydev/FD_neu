function DrawChangePassword(parent){
    if(parent == undefined){
        parent = document.body;
    }
  let main = getElement("ChangePasswordMain", "div", parent.id);
      main.Class("main");
      let inputPassword1 = new InputDiv(main, "password1", "Passwort");
            inputPassword1.PasswordCheck().define();
          inputPassword1.input.type = "password";
          let buttonObj = new snapButton(inputPassword1.div, ICON.eye.close);
              buttonObj.OnClick(function(flag){
                  if(flag){
                      inputPassword1.input.type = "text";
                      buttonObj.setValue(ICON.eye.open);
                  } else {
                      inputPassword1.input.type = "password";
                      buttonObj.setValue(ICON.eye.close);
                  }
              });
              buttonObj.OnMouseEnter(function(flag){
                  if(flag){
                      inputPassword1.input.type = "text";
                      buttonObj.setValue(ICON.eye.open);
                  }
              });
              buttonObj.OnMouseLeave(function(flag){
                  if(flag){
                      inputPassword1.input.type = "password";
                      buttonObj.setValue(ICON.eye.close);
                  }
              });
              inputPassword1.button(buttonObj);

          let inputPassword2 = new InputDiv(main, "password2", "Passwort wiederholen");
              inputPassword2.input.type = "password";
              let buttonObj2 = new snapButton(inputPassword2.div, ICON.eye.close);
                  buttonObj2.OnClick(function(flag){
                      if(flag){
                          inputPassword2.input.type = "text";
                          buttonObj2.setValue(ICON.eye.open);
                      } else {
                          inputPassword2.input.type = "password";
                          buttonObj2.setValue(ICON.eye.close);
                      }
                  });
                  buttonObj2.OnMouseEnter(function(flag){
                      if(flag){
                          inputPassword2.input.type = "text";
                          buttonObj2.setValue(ICON.eye.open);
                      }
                  });
                  buttonObj2.OnMouseLeave(function(flag){
                      if(flag){
                          inputPassword2.input.type = "password";
                          buttonObj2.setValue(ICON.eye.close);
                      }
                  });
                  inputPassword2.button(buttonObj2);

          inputPassword2.connectElements(inputPassword1.input);
          inputPassword1.connectElements(inputPassword2.input);

          let buttonSubmit = getElement("ChangePassword_ButtonSubmit", "button", main.id);
              buttonSubmit.innerHTML = "Passwort ändern";
              buttonSubmit.onclick = function(){
                let passwordStrength = inputPassword1.PasswordCheck().getValue();
                let flag = true;
                if(passwordStrength < 60){
                    flag = false;
                }
                if(inputPassword1.input.value == ""){
                  inputPassword1.invalid();
                  flag = false;
                }
                if(inputPassword2.input.value == ""){
                  inputPassword2.invalid();
                  flag = false;
                }
                if(inputPassword1.input.value != inputPassword2.input.value){
                  inputPassword1.invalid();
                  inputPassword2.invalid("Passwörter stimmen nicht überein");
                } else if(flag){
                  changePassword(location.hash.replace("#", ""), inputPassword1.input.value);
                  if(parent == document.body){
                    DrawPasswordChangedFinished(main);
                  } else {
                    main.clear();
                    return true;
                  }
                } else if(passwordStrength < 60){
                    inputPassword1.invalid();
                    inputPassword2.invalid("Passwort zu schwach");
                }
              }
}

function DrawPasswordChangedFinished(parent){
  parent.clear();
  let main = getElement("passwordChangedMain", "div", parent.id);
      main.Class("passwordChanged");
      let headline = new SPLINT.DOMElement.SpanDiv(main, "headline", "Passwort wurde erfolgreich geändert");
          headline.Class("Text-primary").set();
      let description = new SPLINT.DOMElement.SpanDiv(main, "description", "dieser Tab schliest automatisch");
          description.Class("Text-secondary").set();
      asyncSleep(5, function(){close()});
}