<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/create/PathElements/PathElement3D.php';

    class PathObject3D {
        private $storage = array();
        public function __construct(){
            
        }
        public function elementCount() : int{
            return count($this -> storage);
        }
        public function combinePathObject(PathObject3D $PathObject){
            $PathElements = $PathObject -> getElements();
            foreach($PathElements as $PathElement){
                $this -> addElement($PathElement);
            }
        }
        public function combineElement(int $index, PathElement3D $addPathElement){
            $newPathElement = new PathElement3D();
            $newPathElement -> setSteps($this -> storage[$index] -> getSteps());
            $newPathElement -> combine($addPathElement -> getSteps()); 
            $this -> storage[$index] = $newPathElement;
        }
        public function addElement(PathElement3D $pathElement){
            array_push($this -> storage, $pathElement);
        }
        public function getElements(int $index = -1){
            if($index != -1){
                return $this -> storage[$index];
            }
            return $this -> storage;
        }
        public function removeElement(int $index) : void {
            array_splice($this -> storage, $index, 1);
        }
    }