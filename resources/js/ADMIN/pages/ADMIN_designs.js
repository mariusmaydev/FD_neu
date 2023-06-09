class ADMIN_designs extends ADMIN_DrawTemplate {
    constructor(){
        super("designs");
        ADMIN_loginFuncs.check_redirect();
        // this.draw();
        this.mainElement.Class("ADMIN_designs_main");
        // this.navBar = new ADMIN_DesignNavBar(this.mainElement);
    }
    draw(){
        this.mainElement.innerHTML = "";
        window.onhashchange = this.choosePage.bind(this);
        this.choosePage();
        this.drawDesigns();
    }
    choosePage(){
        let hashtags = S_Location.getHashes();
            console.log(hashtags);
        let hashtag = hashtags;
        if(typeof hashtags == 'object'){
            hashtag = hashtags[0];
        }
        switch(hashtags){
          // case "designs"    : this.drawDesigns(); break;
          // case "images"     : this.drawImages(); break;
          // case "hashtags"   : this.drawHashtags(); break;
          // case "newDesign"  : this.drawNewDesign(); break;
          default: window.location.hash = "designs"; break;
        }
    }
    drawDesigns(){
      // let button_NewProject = new Button(this.mainElement, "NewProject", "Neues Design");
      //     button_NewProject.onclick = function(){
      //       PHP_sessions_S.set("USER_ID", "ADMIN", false);
      //       PHP_sessions_S.set("USER_NAME", "ADMIN", false);
      //       PHP_sessions_S.set("ADMIN", true, false);
      //       PHP_sessions_S.set("GUEST", false, false);
      //       Project.new('ADMIN', 'TEST', true, true);
      //       Location_S.goto(PATH.location.converter).setHash("ADMIN").call();
      //     }
          let projectList = new drawProjectList_ADMIN(this.mainElement);
    }
    // drawDesigns(){
    //   let hashtagMenu = new ADMIN_HashtagMenu(this.mainElement);
    //       hashtagMenu.drawInput(true);
    //       hashtagMenu.drawButtonRemove(true);
    //       hashtagMenu.onHashtagChange(function(flag, HashtagName, button){
    //         button.setState(false);
    //         hashtagMenu.draw();
    //       });
    //       hashtagMenu.onDraw(function(){
    //         designList.draw();
    //       });
    //   let designFilter = new DesignFilter(this.mainElement);
    //       designFilter.onChange(function(e, radio){
    //         designList.setFilter(radio.getValue());
    //       });
    
    //   let designList = new ADMIN_DesignList(this.mainElement);
  
    // }
    // drawImages(){
    //   let hashtagMenu = new ADMIN_HashtagMenu(this.mainElement);
    //       hashtagMenu.drawInput(true);
    //       hashtagMenu.drawButtonRemove(true);
    //       hashtagMenu.onHashtagChange(function(flag, HashtagName, button){
    //         button.setState(false);
    //         hashtagMenu.draw();
    //       });
    //       hashtagMenu.onDraw(function(){
    //         imageList.draw();
    //       });
          
    //   let imageFilter = new DesignFilter(this.mainElement);
    //       imageFilter.onChange(function(e, radio){
    //         imageList.setFilter(radio.getValue());
    //       });
    
    //   let imageList = new ADMIN_drawImageList(this.mainElement);
  
    // }
    drawHashtags(){
  
    }
    drawNewDesign(){
    }
  }