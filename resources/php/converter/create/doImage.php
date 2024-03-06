<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    // require_once $rootpath.'/fd/resources/php/converter/SVG/createSVG.php';
    // require_once $rootpath.'/fd/resources/php/converter/image/imageCore.php';
    require_once $rootpath.'/fd/resources/php/converter/create/creatorHelper.php';
    require_once $rootpath.'/fd/resources/php/converter/create/creatorKernel.php';
    require_once $rootpath.'/fd/resources/php/converter/converterConfig.php';
    require_once $rootpath.'/fd/resources/php/converter/SVG/SVGModel.php';

    class ConverterCreator_doImage {
        private $LastIndex;
        private $fArray;
        private $x_C = 0;
        private $y_C = 0;
        private $pathObject;

        public function __construct(PathObject2D &$pathObject, fixedArray $fArray){
            $this -> LastIndex = array();
            $this -> LastIndex['xM'] = -1;
            $this -> LastIndex['yM'] = -1;
            $this -> fArray = $fArray;
            $this -> pathObject = $pathObject;
            $this -> itteratefArray();
        }
        public static function work(PathObject2D &$pathObject, fixedArray $fArray){
            return new ConverterCreator_doImage($pathObject, $fArray);
        }
        public function itteratefArray(){
            $flag = true;
            for($y = 1; $y < $this -> fArray -> y; $y++){
                for($x = 1; $x < $this -> fArray -> x; $x++){
                    if($this -> fArray -> get($x, $y) == 1){
                        $this -> x_C = $x;
                        $this -> y_C = $y;
                        $matrix = ConverterCreatorKernel::createMatrix($this -> fArray, $x, $y);
                        if($matrix != false){
                            $pathElement = new PathElement2D();
                            if($flag){                       
                                $pathElement -> addStep($x, $y);
                                $this -> LastIndex['xM'] = $x;
                                $this -> LastIndex['yM'] = $y; 
                                $flag = false;
                            }
                            $this -> handleMatrix($matrix, $x, $y, $pathElement);
                            // $pathElement -> removeStep($pathElement -> stepCount()  -1);
                            $lastStep = $pathElement -> getSteps($pathElement -> stepCount() -1);
                            if($pathElement ->  stepCount() > 2){
                                if($this -> LastIndex['xM'] <= $lastStep['x'] + 1 && $this -> LastIndex['xM'] >= $lastStep['x'] - 1){
                                    if($this -> LastIndex['yM'] <= $lastStep['y'] + 1 && $this -> LastIndex['yM'] >= $lastStep['y'] - 1){
                                        $pathElement -> addStep($this -> LastIndex['xM'], $this -> LastIndex['yM']);
                                    }
                                }
                            }
                            $this -> pathObject -> addElement($pathElement);
                        }
                    } else {
                        $flag = true;
                    }
                }
            }
        }
        public function handleMatrix(fixedArray $matrix, int $x, int $y, PathElement2D &$pathElement){
    
            $this -> x_C = $x;
            $this -> y_C = $y;
            while(true){
                $MatrixFlag = false;
                for($x1 = 0; $x1 <= 4; $x1++){
                    for($y1 = 0; $y1 <= 4; $y1++){
                        if(($x1 == 0 || $x1 == 4 || $y1 == 0 || $y1 == 4) && $matrix -> get($x1, $y1) == 1){
                            $MatrixFlag = true;
                        }
                    }
                }
                while(true){
                    if($MatrixFlag){
                        $matrix1 = ConverterCreatorKernel::analyseEdgesBig($matrix, $pathElement, $this -> x_C, $this -> y_C, $this -> fArray);
                        if($matrix1 != false){
                            $matrix = $matrix1;
                            continue 2;
                        }
                        $matrix1 = ConverterCreatorKernel::analyseStraightsBig($matrix, $pathElement, $this -> x_C, $this -> y_C, $this -> fArray);
                        if($matrix1 != false){
                            $matrix = $matrix1;
                            continue 2;
                        } else {
                            $MatrixFlag = false;
                            continue;
                        }
                    } else {
                        $matrix1 = ConverterCreatorKernel::analyseEdgesSmall($matrix, $pathElement, $this -> x_C, $this -> y_C, $this -> fArray);
                        if($matrix1 != false){
                            $matrix = $matrix1;
                            continue 2;
                        }
                        $matrix1 = ConverterCreatorKernel::analyseStraightsSmall($matrix, $pathElement, $this -> x_C, $this -> y_C, $this -> fArray);
                        if($matrix1 != false){
                            $matrix = $matrix1;
                            continue 2;
                        } else {
                            return;
                        }
                    }
                }
            }
        }
    }

