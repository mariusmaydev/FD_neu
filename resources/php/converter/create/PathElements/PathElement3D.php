<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';


    class PathElement3D {
        private $steps = array();
        public function __construct(){
            
        }
        public function stepCount() : int{
            return count($this -> steps);
        }
        public function addStep(float $x, float $y, float $z){
            $step = [];
            $step['x'] = $x;
            $step['y'] = $y;
            $step['z'] = $z;
            array_push($this -> steps, $step);
        }
        public function combine(array $steps){
            foreach($steps as $step){
                $this -> addStep($step['x'], $step['y'], $step['z']);
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
        public function findStep(float $x, float $y, float $z){
            foreach($this -> steps as $key => $step){
                if($step['x'] == $x && $step['y'] == $y && $step['z'] == $z){
                    return $key;
                }
            }
            return false;
        }
        public function reverse(){
            $this -> steps = array_reverse($this -> steps);
        }
    }