//   const droparea = document.querySelector(".droparea");

//   droparea.addEventListener("dragover", (e) => {
//     e.preventDefault();
//     droparea.classList.add("test");
//   })

//   droparea.addEventListener("dragleave", () => {
//     //droparea.classList.remove("hover");
//   })

//   droparea.addEventListener("drop", (e) => {
//     e.preventDefault();
//     let file_data = e.dataTransfer.files[0];;
//     let form_data = new FormData();                     
//     form_data.append('file', file_data);  
//     const type = file_data.type;

//     if(type == "image/png" || type == "image/jpg" || type == "image/jpeg"){
//       return Upload(form_data);
//     } else {
//       //droparea.setAttribute("class", "droparea invalid");
//       //droparea.innerText="Invalid";
//       return false;
//     }
//   });

//   const upload = (image) => {
//     //droparea.setAttribute("class", "droparea valid");
//     //droparea.innerText = "Added "+image.name;
//     console.log(image);

//     uploadFile(image);
//   }

//   async function uploadFile(fileupload) {
//     let formData = new FormData();           
//     formData.append("file", fileupload);
//     formData.append('UserID', globalUserID);
//     formData.append('ProjectID', globalProjectID);
//     await fetch('/fd/php/Upload.php', {
//       method: "POST", 
//       body: formData
//     });    
//   }