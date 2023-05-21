<?php
  require_once 'converterCore.php';
  require_once 'image/imageCore.php';
  require_once 'image/imageWriteSingleData.php';

  $imgID        = $_POST["imgID"];
  $ProjectID    = $_POST["ProjectID"];
  $UserID       = $_POST["UserID"];
  $newImgID     = searchFreeIndex($UserID, $ProjectID);

  editImage(getSingleProjectImage($UserID, $ProjectID, $imgID, PATH_Project::IMG_SCALE), $newImgID, PATH_Project::IMG_SCALE, $UserID, $ProjectID);
  editImage(getSingleProjectImage($UserID, $ProjectID, $imgID, PATH_Project::IMG_VIEW), $newImgID, PATH_Project::IMG_VIEW, $UserID, $ProjectID);
  editImage(getSingleProjectImage($UserID, $ProjectID, $imgID, PATH_Project::IMG_VIEW_COLOR), $newImgID, PATH_Project::IMG_VIEW_COLOR, $UserID, $ProjectID);
  editImage(getSingleProjectImage($UserID, $ProjectID, $imgID, PATH_Project::IMG_VIEW_NT), $newImgID, PATH_Project::IMG_VIEW_NT, $UserID, $ProjectID);

  print_r($newImgID);
?>