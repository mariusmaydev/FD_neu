<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/converter/converterCore.php';
    require_once $rootpath.'/fd/resources/php/converter/NC/NCEngravingCode.php';
    require_once $rootpath.'/fd/resources/php/converter/NC/NCLaserCode.php';
    require_once $rootpath.'/fd/resources/php/project/project.php';


    // function combinePaths(PathObject2D $PathObject) : PathObject2D {
    //     $PathObjectOut = new PathObject2D();
    //     $PathElements = $PathObject -> getElements();
    //     foreach($PathElements as $key => $PathElement){
    //         $PathElementOut = new PathElement2D();
    //         $steps = $PathElement -> getSteps();
    //         $step0 = $steps[count($steps) -1];
    //         $step_0 = $steps[0];
    //         $PathElementOut -> combine($steps);
    //         array_splice($PathElements, 0, 1);
    //         foreach($PathElements as $key1 => $PathElement1){
    //             if($key1 == 0){
    //                 continue;
    //             }
    //             $steps1 = $PathElement1 -> getSteps();
    //             $step1 = $steps1[0];
    //             $dX = $step0['x'] - $step1['x'];
    //             $dY = $step0['y'] - $step1['y'];
    //             // $sq = sqrt(pow($dX, 2) + pow($dY, 2));
    //             if(abs($dX) <= 8 && abs($dY) <= 8){
    //                 $PathElementOut -> combine($steps1);
    //                 array_splice($PathElements, $key1, 1);
    //                 break;
    //             }
    //             $step_1 = $steps1[count($steps1) - 1];
    //             $dX = $step_0['x'] - $step_1['x'];
    //             $dY = $step_0['y'] - $step_1['y'];
    //             // $sq = sqrt(pow($dX, 2) + pow($dY, 2));
    //             if(abs($dX) <= 8 && abs($dY) <= 8){
    //                 $s = $PathElementOut -> getSteps();
    //                 $PathElementOut -> setSteps($steps1);
    //                 $PathElementOut -> combine($s);
    //                 array_splice($PathElements, $key1, 1);
    //                 break;
    //             }
    //         }
    //         if($PathElementOut -> stepCount() > 1){
    //             $PathObjectOut -> addElement($PathElementOut);
    //         }
    //     }
    //     return $PathObjectOut;
    // }

    // function closePaths(PathObject2D $pathObject) : PathObject2D {
    //     $PathObjectOutput = new PathObject2D();
    //     $pathElements = $pathObject -> getElements();
    //     while(count($pathElements) > 0){
    //         $pathElement = $pathElements[0];
    //         $steps = $pathElement -> getSteps();
    //         $step0 = $steps[0];
    //         $step1 = $steps[count($steps) -1];
    //         $dX = $step0['x'] - $step1['x'];
    //         $dY = $step0['y'] - $step1['y'];
    //         if(abs($dX) <= 8 && abs($dY) <= 8){
    //             $pathElement -> addStep($step0['x'], $step0['y']);
    //         }
    //         if($pathElement -> stepCount() >= 1){
    //             $PathObjectOutput -> addElement($pathElement);
    //         }
    //         array_splice($pathElements, 0, 1);
    //     }
    //     return $PathObjectOutput;
    // }



    // function isInRange($dd, $dd1, $deviation) : bool {
    //     if($dd <= $dd1 + $deviation && $dd >= $dd1 - $deviation){
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }




    // function SortPath($str_in){
    //     global $output;
    //     $strL = strlen($str_in);
    //     $MArray = array();
    //     $length = 0;
    //     for ($i = 0; $i <= $strL; $i++) {
    //          if (substr($str_in, $i, 1) == 'L') {
    //             $MArray[$length]['data'] = "";
    //             while(substr($str_in, $i, 1) != "M" && $i <= $strL){
    //                 $MArray[$length]['data'] .= substr($str_in, $i, 1);
    //                 $i++;
    //             }
    //             $i--;
    //         } else if (substr($str_in, $i, 1) == 'M') {
    //             if ($i != 0) {
    //                 $MArray[$length]['xEnd'] = 0;
    //                 $MArray[$length]['yEnd'] = 0;
    //                 $e = -1;
    //                 while ($i + $e >= 0 && substr($str_in, $e, 1) != "L") {
    //                     $e--;
    //                 }
    //                 $e += 3;
    //                 while (substr($str_in, $i + $e, 1) != " ") {
    //                     $MArray[$length]['xEnd'] .= substr($str_in, $i + $e, 1);
    //                     $e++;
    //                 }
    //                 $e++;
    //                 while (substr($str_in, $i + $e, 1) != ";") {
    //                     $MArray[$length]['yEnd'] .= substr($str_in, $i + $e, 1);
    //                     $e++;
    //                 }
    //             }
    //             $length++;
    //             $MArray[$length] = array();
    //             $MArray[$length]['x'] = "";
    //             $MArray[$length]['y'] = "";
    //             $MArray[$length]['data'] = "";
    //             $MArray[$length]['key'] = $length;
    //             $i++;
    //             while(substr($str_in, $i, 1) != " "){
    //                 $MArray[$length]['x'] .= substr($str_in, $i, 1);
    //                 $i++;
    //             }
    //             $i++;
    //             while(substr($str_in, $i, 1) != ";"){
    //                 $MArray[$length]['y'] .= substr($str_in, $i, 1);
    //                 $i++;
    //             }
    //         } 
    //     }
    //     $MArray[$length]['xEnd'] = 0;
    //     $MArray[$length]['yEnd'] = 0;
    //     doPath($MArray, 1);
    //     return $output;
    // }

    // function doPath($array_in, $index){
    //     global $output;
    //     do {
    //         if(count($array_in) <= 0){
    //             return;
    //         }
    //         $output .= "M" . $array_in[$index]['x'] . " " . $array_in[$index]['y'] . ";\r\n";
    //         $output .= $array_in[$index]['data'];
    //         if(!isset($array_in[$index]['xEnd'])){
    //             error_log("bug");
    //         }
    //         $xEnd = $array_in[$index]['xEnd'];
    //         $yEnd = $array_in[$index]['yEnd'];
    //         $array_in[$index] = 0;
    //         $index = findNextObject($array_in, $xEnd, $yEnd);
    //     } while($index);
    // }

    // function findNextObject(&$array_in, $xEnd_in, $yEnd_in){
    //     $diverence = array();
    //     $div = 9999999999;
    //     $key = false;
    //     if (count($array_in) != 0) {
    //         for($i = 1; $i <= count($array_in); $i++){
    //             if ($array_in[$i] != 0) {
    //                 $x      = $array_in[$i]['x'];
    //                 $y      = $array_in[$i]['y'];
    //                 $sqrt = sqrt(pow(intval($xEnd_in) - intval($x), 2) + pow(intval($yEnd_in) - intval($y), 2));
    //                 if($div > $sqrt){
    //                     $div = $sqrt;
    //                     $key = $i;
    //                 }
    //             }
    //         }
    //         return $key;
    //     } else {
    //         return false;
    //     }
    // }

    // function createSVG($ProjectData, $ImgData, $TextData, $DataString){
    //     // $imgWidth = $SendData['LighterWidth'] * 4 - 4;
    //     // $imgHeight = $SendData['LighterWidth'] * 4 - 4;
    //     $imgHeight  = ProjectDB::LIGHTER_HEIGHT * 4 * 10;
    //     $imgWidth   = ProjectDB::LIGHTER_WIDTH * 4 *10;
    //     $out_end = "<?xml version='1.0' standalone='no'><svg width='" . $imgWidth . "' height='" . $imgHeight . "' xmlns='http://www.w3.org/2000/svg' version='1.1'><path d='\r\n";
    //     $out_end2 = "";
    //     //$str1 = file_get_contents(PATH_SVG($UserID, $ProjectID, 'result'));
    //     $str = SortPath($DataString);
        
    //     // $str = $DataString;

    //     $strL = strlen($str);
    //     $out_X = array();
    //     $out_Y = array();
    //     $f = 0;
    //     for($i = 0; $i <= $strL; $i++){
    //         if(substr($str, $i, 1) == 'M'){
    //             $values = f1($out_X, $out_Y);
    //             $out_X = $values['x'];
    //             $out_Y = $values['y'];
    //             for($e = 0; $e < count($out_X); $e++){
    //                 if($out_X[$e] != 0 && $out_Y[$e] != 0){
    //                     $out_end .= "L " . $out_X[$e] . " " . $out_Y[$e] . " ";
    //                     $out_end2 .= "G1 X" . $out_X[$e] . " Y" . $out_Y[$e] . " \r\n";
    //                     $out_X[$e] = 0;
    //                     $out_Y[$e] = 0;
    //                 }
    //             }           
    //             $e = 1;
    //             $out_M = "M ";
    //             $out_M2 = "G0 X";
    //             while(substr($str, $i + $e, 1) != ' '){
    //                 $out_M .= substr($str, $i + $e, 1);
    //                 $out_M2 .= substr($str, $i + $e, 1);
    //                 $e++;
    //             }
    //             $out_M .= " ";
    //             $out_M2 .= " Y";
    //             $e++;
    //             while(substr($str, $i + $e, 1) != ';'){
    //                 $out_M .= substr($str, $i + $e, 1);
    //                 $out_M2 .= substr($str, $i + $e, 1);
    //                 $e++;
    //             }
    //             $out_end .= $out_M . " "; 
    //             $out_end2 .= "G0 Z1 \r\n" . $out_M2 . " P\r\nG0 Z0\r\n"; 
    //         } else if(substr($str, $i, 1) == 'L'){
    //             $e = 1;
    //             $out = "";
    //             while(substr($str, $i + $e, 1) != ' '){
    //                 $out .= substr($str, $i + $e, 1);
    //                 $e++;
    //             }
    //             $out_X[$f] = intval($out);
    //             $out = "";
    //             $e++;
    //             while(substr($str, $i + $e, 1) != ';'){
    //                 $out .= substr($str, $i + $e, 1);
    //                 $e++;
    //             }
    //             $out_Y[$f] = intval($out);
    //             $f++;
    //         }
    //     }
    //     $values = f1($out_X, $out_Y);
    //     $out_X = $values['x'];
    //     $out_Y = $values['y'];
    //     for($e = 0; $e < count($out_X); $e++){
    //         if($out_X[$e] != 0 && $out_Y[$e] != 0){
    //             $out_end .= "L " . $out_X[$e] . " " . $out_Y[$e] . " ";
    //             $out_end2 .= "G1 X" . $out_X[$e] . " Y" . $out_Y[$e] . " \r\n";
    //             $out_X[$e] = 0;
    //             $out_Y[$e] = 0;
    //         }
    //     }   
    //     $out_end .= "' fill='none' stroke='black' stroke-width='1'/></svg>";
    //     $fp2 = fopen("testSVG.svg", "w");
    //     fwrite($fp2, $out_end);
    //     fclose($fp2);
    //     return $out_end;
    // }

    // function shortOutput($out_X, $out_Y){
    //     global $Last;
    //     $output = array();
    //     $flag0 = false;
    //     $flag1 = false;
    //     $flag2 = false;
    //     $flag3 = false;
    //     $flag4 = false;
    //     $flag5 = false;
    //     for ($e = $Last; $e < count($out_X); $e++) {
    //         $Last = $e;
    //         if ($out_X[$e] != 0 && $out_Y[$e] != 0) {
    //             if ($out_X[$e] == $out_X[$e -1] - 1 && $out_Y[$e] == $out_Y[$e -1] + 1) {
    //                 if ($flag5) {
    //                     $out_X[$e - 1] = 0;
    //                 } else {
    //                     $flag5 = true;
    //                 }
    //             } else {
    //                 $flag5 = false;
    //             }
    //             if ($out_X[$e] == $out_X[$e -1] + 1 && $out_Y[$e] == $out_Y[$e -1] - 1) {
    //                 if ($flag4) {
    //                     $out_X[$e - 1] = 0;
    //                 } else {
    //                     $flag4 = true;
    //                 }
    //             } else {
    //                 $flag4 = false;
    //             }
    //             if ($out_X[$e] == $out_X[$e -1] + 1 && $out_Y[$e] == $out_Y[$e -1] + 1) {
    //                 if ($flag0) {
    //                     $out_X[$e - 1] = 0;
    //                 } else {
    //                     $flag0 = true;
    //                 }
    //             } else {
    //                 $flag0 = false;
    //             }
    //             if ($out_X[$e] == $out_X[$e -1] - 1 && $out_Y[$e] == $out_Y[$e -1] - 1) {
    //                 if ($flag1) {
    //                     $out_X[$e - 1] = 0;
    //                 } else {
    //                     $flag1 = true;
    //                 }
    //             } else {
    //                 $flag1 = false;
    //             }
    //             if ($out_X[$e] == $out_X[$e - 1]) {
    //                 if ($flag2) {
    //                    // $out_X[$e - 1] = 0;
    //                     $out_X[$e - 1] = 0;
    //                 } else {
    //                     $flag2 = true;
    //                 }
    //             } else {
    //                 $flag2 = false;
    //             }
    //             // // compareValues_before($out_X[$e], $out_X[$e - 1], $flag2);
    //             // // compareValues_before($out_Y[$e], $out_Y[$e - 1], $flag3);
    //             if ($out_Y[$e] == $out_Y[$e - 1]) {
    //                 if ($flag3) {
    //                     $out_Y[$e - 1] = 0;
    //                     //$out_Y[$e - 1] = $out_Y[$e - 1] . "(t)";
    //                 } else {
    //                     $flag3 = true;
    //                 }
    //             } else {
    //                 $flag3 = false;
    //             }
    //             // if ($out_Y[$e] == $out_Y[$e - 1] && $out_X[$e] == $out_X[$e - 1]) {
    //             //     if ($flag3) {
    //             //         error_log("ok");
    //             //         $out_Y[$e - 1] = 0;
    //             //         $out_X[$e - 1] = 0;
    //             //         //$out_Y[$e - 1] = $out_Y[$e - 1] . "(t)";
    //             //     } else {
    //             //         error_log("ok1");
    //             //         $flag3 = true;
    //             //     }
    //             // } else {
    //             //     $flag3 = false;
    //             // }
    //         }
    //     }
        
    //     $output['x'] = $out_X;
    //     $output['y'] = $out_Y;
    //     return $output;
    // }

    // function f1($out_X, $out_Y){
    //     global $Last;
    //     $alignX_Before = -10000;
    //     $alignY_Before = -10000;
    //     for ($e = $Last; $e < count($out_X); $e++) {
    //         $Last = $e;
    //         $x = $out_X[$e];
    //         $y = $out_Y[$e];
    //         $x1 = $out_X[$e - 1];
    //         $y1 = $out_Y[$e - 1];
    //         if ($x == $x1 && $y == $y1) {
    //             $x1 = 0;
    //             $y1 = 0;
    //         } else {
    //             $alignX = $x - $x1;
    //             $alignY = $y - $y1;
    //             if ($alignX == $alignX_Before && $alignY == $alignY_Before) {
    //                 $x1 = 0;
    //                 $y1 = 0;
    //             }
    //             $alignX_Before = $alignX;
    //             $alignY_Before = $alignY;
    //         }
    //         $out_X[$e - 1] = $x1;
    //         $out_Y[$e - 1] = $y1;
    //     }
    //     $output['x'] = $out_X;
    //     $output['y'] = $out_Y;
    //     return $output;
    // }

    // function compareValues_before($v1, &$v2, &$flag){
    //     if ($v1 == $v2) {
    //         if ($flag) {
    //            // $out_X[$e - 1] = 0;
    //             $v2 = $v2 . "(t)";
    //         } else {
    //             $flag = true;
    //         }
    //     } else {
    //         $flag = false;
    //     }

    // }
?>