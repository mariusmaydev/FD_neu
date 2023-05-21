<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath . '/fd/resources/php/converter/converterCore.php';

    
    class imgArray {
        public $imgArray = array();
        public $x = 0;
        public $y = 0;
        private $alphaFlag = false;

        public function __construct(bool $alphaFlag = false){
            $this -> alphaFlag = $alphaFlag;
        }
        public function fromGD(GdImage &$img){
            $this -> x = imagesx($img);
            $this -> y = imagesy($img);
            for($y = 0; $y < $this -> y; $y++){
                for($x = 0; $x < $this -> x; $x++){
                    $this -> imgArray[$x][$y] = ImagePixel::fromGD($img, $x, $y, $this -> alphaFlag);
                }
            }
        }
        public function get(int $x, int $y) : ImagePixel {
            return $this -> imgArray[$x][$y];
        }
        public function getIndexForCoords(int $x, int $y) : int {
            $index = $y * $this -> x + $x;
            if($x < $this -> x && $y < $this -> y && $index >= 0 && $index < ($this -> x * $this -> y)){
                return $index;
            } else {
                return -1;
            }
        }
    }

    class ImagePixel {
        public $colorIndex  = -1;
        public $alpha       = -1;
        public $x           = -1;
        public $y           = -1;
        public $flag        = true;

        public function __construct(int $colorIndex, int $alpha, int $x = -1, int $y = -1, bool $flag = true){
            $this -> colorIndex = $colorIndex;
            $this -> alpha      = $alpha;
            $this -> x          = $x;
            $this -> y          = $y;
            $this -> flag       = $flag; 
        }
        public static function fromGD(GdImage &$img, int $x, int $y, bool $alphaFlag = true, bool $flag = true) : ImagePixel{
            $colorIndex = imagecolorat($img, $x, $y);
            $alpha = -1;
            if($alphaFlag){
                $alpha = imagecolorsforindex($img, $colorIndex)["alpha"];
            }
            return new ImagePixel($colorIndex, $alpha, $x, $y, $flag);
        }
        public function setCoords(int $x, int $y) : void {
            $this -> x          = $x;
            $this -> y          = $y;
        }
        public function getRGB() : stdClass {
            $obj = new stdClass();
            $obj -> red     = ($this -> colorIndex >> 16) & 0xFF;
            $obj -> green   = ($this -> colorIndex >> 8) & 0xFF;
            $obj -> blue    = $this -> colorIndex & 0xFF;
            $obj -> alpha   = $this -> alpha;
            return $obj;
        }
        public function getHex() : string {
            return Dez2Hex($this -> colorIndex);
        }
        public function getLightness(bool $invert = false) : float{
            $rgb = $this -> getRGB();
            if($invert){
                return 1 - (max($rgb -> red, $rgb -> green, $rgb -> blue) / 255);
            }
            return (max($rgb -> red, $rgb -> green, $rgb -> blue) / 255);
        }
        public function getHSL(){
            $rgb = $this -> getRGB();
            $hsl = rgb2hsl($rgb -> red, $rgb -> green, $rgb -> blue);
            $obj = new stdClass();
            $obj -> hue = $hsl[0];
            $obj -> saturation = $hsl[1];
            $obj -> lightness = $hsl[2];
            return $obj;
        }
    }