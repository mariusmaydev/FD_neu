class ADMIN_designs extends ADMIN_DrawTemplate {
    constructor(){
        super("designs");
        this.mainElement.Class("ADMIN_designs_main");
    }
    draw(){
        this.mainElement.innerHTML = "";
        window.onhashchange = this.choosePage.bind(this);
        this.choosePage();
        this.drawDesigns();
    }
    choosePage(){
        let hashtags = SPLINT.Tools.Location_old.getHashes();
            console.log(hashtags);
        let hashtag = hashtags;
        if(typeof hashtags == 'object'){
            hashtag = hashtags[0];
        }
        switch(hashtags){
          default: window.location.hash = "designs"; break;
        }
    }
    drawDesigns(){
          let projectList = new drawProjectList_ADMIN(this.mainElement);
    }
  }