
// function DrawDesignMenu(){
//   let main = getElement("DesignMenuMain", "div", document.body.id);
//       main.Class("DesignMenuMain");
//       let headline = new SPLINT.DOMElement.SpanDiv(main, "headline", "DesignMenu");
//       let hashtagMenu = new HashtagMenu(main);
//           hashtagMenu.drawButtonRemove(false);
//           hashtagMenu.onHashtagChange(function(){
//             DesignMenu.DesignList(main);
//           })
//       DesignMenu.DesignList(main);
// }

// class DesignMenu {
//   static DesignList(parent){
//     let main = getElement(parent.id + "_DesignListMain", "div", parent.id);
//         main.Class("DesignListMain");
//         let designData = JSON.parse(DesignHelper.get(undefined, PHP_sessions.hashtags().get(), "OPEN"));
//         if(designData == null){
//           return;
//         }
//         for(let i = 0; i < designData.length; i++){
//           let design = designData[i];
//           let hashtags = design.DesignHashtags;
//           if(design.DesignHashtags != ""){
//               hashtags = JSON.parse(hashtags);
//           }

//           let listElement = getElement(parent.id + "_DesignListElement_" + i, "div", main.id);
//               listElement.Class("ListElement");
              
//               let thumbnailDiv = getElement(parent.id + "_DesignListThumbnailDiv_" + i, "div", listElement.id);
//                   let thumbnailElement = getElement(parent.id + "_DesignListThumbnail_" + i, "img", thumbnailDiv.id);
//                       thumbnailElement.src = design.PATH_thumbnail; 
//         }
//   }
// }




// function StartupDesignMenu(){
//   let MAIN = getElement("DesignMenuMain", "div", document.body.id);
//   DrawHashtagUI_Menu_USER(MAIN);

//   let hashtags = sessionStorage.getItem("DesignFilter");
//   if(hashtags == null){
//     hashtags = undefined;
//   }
//   DrawDesignList(MAIN, hashtags);
// }

// function DrawDesignList(parent, hashtags){
//   let DesignListMain = getElement("DesignListMain", "div", parent.id);
//   let designs = getDesignsFromDataBase(hashtags, "listed");
//   if(designs != ""){
//     designs = JSON.parse(designs);
//   }
//   for(let i = 0; i < designs.length; i++){
//     let DesignListElement = getElement("DesignListElement" + i, "div", DesignListMain.id);
//         DesignListElement.setAttribute("flag", "thumbnail");
//         let nameDiv = getElement("DesignListElementNameDiv" + i, "div", DesignListElement.id); 
//             let name = getElement("DesignListElementNameSpan" + i, "span", nameDiv.id);
//                 name.innerHTML = designs[i].DesignName;
        
//         let ThumbnailDiv = getElement("DesignListElementThumbnailDiv" + i, "div", DesignListElement.id);
//             let Thumbnail = getElement("DesignListElementThumbnail" + i, "img", ThumbnailDiv.id);
//                 Thumbnail.src = "data:image/png;base64,"+ designs[i].Thumbnail;
//             let ButtonsDiv = getElement("DesignListButtonsDiv" + i, "div", ThumbnailDiv.id);

//         let UserNameDiv = getElement("DesignListElementUserNameDiv" + i, "div", DesignListElement.id);
//             let UserName = getElement("DesignListElementUserNameSpan" + i, "span", UserNameDiv.id);
//                 UserName.innerHTML = designs[i].UserID;

//         let HashTagsDiv = getElement("DesignListElementHashTagsDiv" + i, "div", DesignListElement.id);
//             let HashTags = getElement("DesignListElementHasTags" + i, "span", HashTagsDiv.id);
//                 HashTags.innerHTML = designs[i].Hastags;

//         let ButtonChoose = getElement("DesignListElementButtonChoose" + i, "button", DesignListElement.id);
//             ButtonChoose.innerHTML = "auswählen";
//             ButtonChoose.onclick = function(){
//               let data = designs[i];

//               NewProject("leer", data);
//             }
//       }
// }

// function getDesignsFromDataBase(hashtags, status){
//   let data = hashtags;
//   let designs = $.ajax({
//     url         : PATH.php.designs.get, 
//     async       : false, 
//     type        : "POST", 
//     data        : {
//         'requestedHashtags'   : data,
//         'status'              : status
//     }
//   }).responseText;

//   //console.log(JSON.parse(designs));
//   return designs;
// }

// function newDesign(){
//   let data = new Object();
//       data.DesignData = JSON.stringify(DataStorage);

//       let Settings = new Object();
//           Settings.SQ.width   = SQ.width;
//           Settings.SQ.height  = SQ.height;
//           Settings.LighterMid    = (2 * 10 * LighterMid);
//           Settings.LighterWidth  = (2 * 10 * LighterWidth);
//           Settings.LighterHeight = (2 * 10 * LighterHeight);
//           Settings.EPtype        = Electropainting.color.actual;
      
//       data.Settings   = JSON.stringify(Settings);
//       data.UserID     = globalUserID;
//       data.ProjectID  = globalProjectID;
//       data.DesignName = "testName";
//       data.Thumbnail  = getProjectData(globalUserID, globalProjectID).Thumbnail0;
//       data.Hashtags   = "";
//       data.Status     = "unlisted";

//   let DesignID = $.ajax({
//     url         : PATH.php.designs.new, 
//     async       : false, 
//     type        : "POST", 
//     data        : {
//         'data'    : data
//     }
//   }).responseText;
//   return DesignID;
// }

// /**
//  * 
//  * @param {object} data DesignID, Status, Name, Hashtags
//  */
// function editDesign(data){
//   let output = $.ajax({
//     url         : PATH.php.designs.edit, 
//     async       : false, 
//     type        : "POST", 
//     data        : {
//       'data'      : data
//     }
//   }).responseText;
//   console.log(output);
// }

// function removeDesign(DesignID){
//   let output = $.ajax({
//     url         : PATH.php.designs.remove, 
//     async       : false, 
//     type        : "POST", 
//     data        : {
//       'DesignID'  : DesignID
//     }
//   }).responseText;
//   console.log(output);
// }

// function DrawHashtagUI_Menu(parent, designsObject, index){
//   let HashtagUI_Menu = getElement("HashtagUI_Menu" + index, "div", parent.id);
//   HashtagUI_Menu.className= "HashtagUI_Menu";
//   let hashtags = getHashtags();
//   let DesignHashtags = [];
//   if(designsObject[index].Hashtags != ""){
//     DesignHashtags = JSON.parse(designsObject[index].Hashtags);
//   }
//   //console.log(isInJSON(DesignHashtags, "test"));
//   for(let i = 0; i < hashtags.length; i++){
//     let MenulistElement = getElement("HashtagUI_MenuList_element" + i + "_" + index, "div", HashtagUI_Menu.id);
//         if(DesignHashtags.includes(hashtags[i].name)){
//           MenulistElement.className = "activeHashtag";
//         } else {
//           MenulistElement.className = "";
//         }
//         let name = getElement("HashtagUI_MenuList_element_name" + i + "_" + index, "span", MenulistElement.id);
//             name.innerHTML = hashtags[i].name;

//         MenulistElement.onclick = function(){
//           if(DesignHashtags.includes(hashtags[i].name)){
//             //Remove
//             SPLINT.Tools.removeFromArray(DesignHashtags, hashtags[i].name);
//             let data = new Object();
//                 data.DesignID = designsObject[index].DesignID;
//                 data.Hashtags = JSON.stringify(DesignHashtags);
//             editDesign(data);

//             let newDesignsObject = getDesignsFromDataBase();
//             if(newDesignsObject != ""){
//               newDesignsObject = JSON.parse(newDesignsObject);
//             }
//             DrawHashtagUI_Menu(parent, newDesignsObject, index);
//           } else {
//             //Add
//             DesignHashtags.push(hashtags[i].name);
//             let data = new Object();
//                 data.DesignID = designsObject[index].DesignID;
//                 data.Hashtags = JSON.stringify(DesignHashtags);
//             editDesign(data);
//             let newDesignsObject = getDesignsFromDataBase();
//             if(newDesignsObject != ""){
//               newDesignsObject = JSON.parse(newDesignsObject);
//             }
//             DrawHashtagUI_Menu(parent, newDesignsObject, index);
//           }
//         }
//   }
// }



// function getMenuSessions(type){
//   let sessionName = "DesignMenu";
//   if(type == "image"){
//     sessionName = "ImageMenu";
//   }
//   let session = sessionStorage.getItem(sessionName);

//   if(session != null){
//     return JSON.parse(session);
//   } else {
//     let output = new Object();
//         output.mode     = "";
//         output.filter   = "";
//         output.category = "";
    
//     return output;
//   }
// }

// function setMenuSession(type, filter, mode, category){
//   let sessionName = "DesignMenu";
//   if(type == "image"){
//     sessionName = "ImageMenu";
//   }
//   let session = sessionStorage.getItem(sessionName);
//   let newSession = "";
//   if(session != null){
//     newSession = JSON.parse(session);
//     if(mode != undefined){
//       newSession.mode     = mode;
//     }
//     if(filter != undefined){
//       newSession.filter   = filter;
//     }
//     if(category != undefined){
//       newSession.category = category;
//     }
//   } else {
//     newSession = new Object();
//     if(mode != undefined){
//       newSession.mode     = mode;
//     }
//     if(filter != undefined){
//       newSession.filter   = filter;
//     }
//     if(category != undefined){
//       newSession.category = category;
//     }
//   }
//   sessionStorage.setItem(sessionName, JSON.stringify(newSession));
// }

