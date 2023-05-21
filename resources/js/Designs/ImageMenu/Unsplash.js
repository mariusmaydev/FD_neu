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
  getStartImages(){
    this.url = this.urlBaseStart + 
    '?per_page=' + this.count + 
    '&page=' + this.page + 
    '&client_id=' + this.client_id;   
    this.response = this.#call(true);
    return this;
  }
  search(value){
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
    this.response = this.#call();
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
  static download(data){
    let url = data.urls.regular + '&client_id=' + unsplash.clientID;
        //get    
        fetch(url, {
          method: 'GET',
        })
        .then(response => {
          FileUpload.fromUnsplash(response.url, function(data){
            DSImage.add(JSON.parse(data));
            CONVERTER_STORAGE.canvasNEW.refreshData();
            CONVERTER_STORAGE.toolBar.update();
            // addImageToDataBase(DSImage.get(DSImage.length() - 1).ImageID);
          })
        });

        //endpoint
        url = data.links.download_location + '&client_id=' + unsplash.clientID;
        fetch(url, {
          method: 'GET',
        })
        .then(response => response.blob())
  }
}