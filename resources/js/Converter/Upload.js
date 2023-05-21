// function UploadDirect(srcElement) {
//   //holt sich das File von HTML
//   let element = $('#' + srcElement.id);
//   if (typeof element.prop('files')[0] != 'undefined') {
//     let file_data = element.prop('files')[0];
//     let form_data = new FormData();
//     form_data.append('file', file_data);
//     Upload(form_data);
//   }
// }

// function Upload(form_data) {
//   form_data.append('UserID', globalUserID);
//   form_data.append('ProjectID', globalProjectID);
//   form_data.append('LighterWidth', LighterWidth * CanvasElement_C.SCALE);
//   form_data.append('LighterHeight', LighterHeight * CanvasElement_C.SCALE);
//   $.ajax({
//     url: PATH.php.upload.converterImage,
//     type: 'POST',
//     contentType: false,
//     processData: false,
//     data: form_data,
//     async: true,
//     success: function (data) {
//       DSImage.add(JSON.parse(data));
//       CONVERTER_STORAGE.canvasNEW.refreshData();
//       CONVERTER_STORAGE.toolBar.update();
//       addImageToDataBase(DSImage.get(DSImage.length() - 1).ImageID);
//     }
//   });
// }