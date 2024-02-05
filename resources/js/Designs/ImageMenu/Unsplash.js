class unsplash {
  static clientID = "mW5_smybRtwEzjFVNM2SegjYzoJ24Lj9vV_tw_scXtk";
  constructor(callback){
    this.callback   = callback;
    this.client_id  = unsplash.clientID;
    this.urlBaseSearch  = "https://api.unsplash.com/search/photos";
    this.urlBaseStart   = "https://api.unsplash.com/photos";
    this.count      = 30;
    this.page       = 1;
    this.progress   = false;
    this.next = function(){
      if(!this.progress){
        this.progress = true;
        this.page++;
        this.search(this.value);
      }
    }.bind(this);
  }
  #call(flag = false){
    return fetch(this.url)
    .then(response => {
      if (!response.ok) throw Error(response.statusText);
        return response.json();
     })
     .then(data => {
      if(data.total == 0){
        this.callback(data, this);
        return data;
      }
      console.log(data)
      this.response = data;
      data = this.getImageData(flag);
      this.callback(data, this);
      return data;
     })
     .catch(error => console.log(error));
  }
  static test1(){

    let instance = new unsplash(function(response){});
    instance.test();
    return instance;
  }
  test(){
    this.url = "https://api.unsplash.com/photos/mpwF3Mv2UaU" + 
    '?per_page=' + 10 + 
    '&page=' + 1 + 
    '&client_id=' + this.client_id;   
    this.response = this.#call(true);
    return this;
  }
  getStartImages(){
    this.url = this.urlBaseStart + 
    '?per_page=' + this.count + 
    '&page=' + this.page + 
    '&client_id=' + this.client_id;   
    this.response = this.#call(true);
    return this;
  }//mpwF3Mv2UaU
  async search(value){
    this.value = value;
    if(value == "" || value == undefined){
      this.getStartImages();
      return this;
    }
    this.url = this.urlBaseSearch + 
    '?query=' + value + 
    '&per_page=' + this.count + 
    '&page=' + this.page + 
    '&orientation=' + "portrait" +
    '&client_id=' + this.client_id; 
    this.response = await this.#call();
    console.log(this.response);
    return this;
  }
  getImageData(flag = false){
    let output = [];
    if(!flag){
      for(let i = 0; i < this.response.results.length; i++){
        let data = this.response.results[i];
        let response = new Object();
            response.tags = [];
            for(const tag of data.tags){
              response.tags.push(tag.title);
            }
            response.alt = data.alt_description;
            response.likes = data.likes;
            response.urls = data.urls;
            response.id = data.id;
            response.type = "unsplash";
            response.links = data.links;
        output.push(response);
      }
    } else {
      for(let i = 0; i < this.response.length; i++){
        let data = this.response[i];
        let response = new Object();
            // response.tags = [];
            // for(const tag of data.tags){
            //   response.tags.push(tag.title);
            // }
            response.alt = data.alt_description;
            response.likes = data.likes;
            response.urls = data.urls;
            response.id = data.id;
            response.type = "unsplash";
            response.links = data.links;
        output.push(response);
      }
    }

    return output;
  }
  static search(value){
    let instance = new unsplash(function(response){});
    instance.search(value);
    return instance;
  }
  static async like(id){
    
    let url = "https://api.unsplash.com/photos/" + id + "/like/?client_id=" + unsplash.clientID;
        //get    
        fetch(url, {
          method: 'POST',
        })
        .then(response => {
            console.log(response)
        });
    // let url = "https://api.unsplash.com/photos/"+ id + "/like";
    //     let call = new SPLINT.CallPHP(url);
    //     call.headers["Authorization"] = unsplash.clientID;
    //     call.headers["Accept-Version"] = "v1";
    //     // call.headers["Accept"] = 'application/json';
    //     // call.headers["Content-Type"] = 'multipart/form-data';
    //     // call.credentials = "include";
    // return call.send(true);

  }
  static download(data){
    let url = data.urls.regular + '&client_id=' + unsplash.clientID;
        //get    
        fetch(url, {
          method: 'GET',
        })
        .then(async function(response) {
            
            let call = new SPLINT.CallPHP(PATH.php.upload, "UNSPLASH_IMG");
                call.data.link = response.url;
            let res = (await call.send());
                res = JSON.stringify(res);
            DSImage.add(JSON.parse(res));
            CONVERTER_STORAGE.canvasNEW.refreshData();
            CONVERTER_STORAGE.toolBar.update();
        });

        //endpoint
        url = data.links.download_location + '&client_id=' + unsplash.clientID;
        fetch(url, {
          method: 'GET',
        })
        .then(response => response.blob())
  }
}