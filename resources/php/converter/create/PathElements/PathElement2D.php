<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/create/PathElements/PathElement3D.php';


    class PathElement2D{
        private $steps = array();
        public function __construct(){
            
        }
        public function stepCount() : int{
            return count($this -> steps);
        }
        public function parse3D(float $z) : PathElement3D {
            $pathElement3D = new PathElement3D();

            foreach($this -> steps as $step){
                $pathElement3D -> addStep($step['x'], $step['y'], $z);
            }
            return $pathElement3D;
        }
        public function addStep(float $x, float $y){
            $step = [];
            $step['x'] = $x;
            $step['y'] = $y;
            array_push($this -> steps, $step);
        }
        public function combine(array $steps){
            foreach($steps as $step){
                $this -> addStep($step['x'], $step['y']);
            }
        }
        public function setSteps(array $steps){
            $this -> steps = $steps;
        }
        public function getSteps(int $index = -1){
            if($index != -1){
                return $this -> steps[$index];
            }
            return $this -> steps;
        }
        public function removeStep(int $index){
            array_splice($this -> steps, $index, 1);
        }
        public function findStep(float $x, float $y){
            foreach($this -> steps as $key => $step){
                if($step['x'] == $x && $step['y'] == $y){
                    return $key;
                }
            }
            return false;
        }
        public function reverse(){
            $this -> steps = array_reverse($this -> steps);
        }
    }