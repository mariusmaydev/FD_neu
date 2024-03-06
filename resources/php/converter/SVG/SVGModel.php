<?php

$rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $rootpath.'/fd/resources/php/converter/converterCore.php';
require_once $rootpath.'/fd/resources/php/converter/NC/NCEngravingCode.php';
require_once $rootpath.'/fd/resources/php/converter/NC/NCLaserCode.php';
require_once $rootpath.'/fd/resources/php/project/project.php';

trait genSVGCodeHelper {
    public function drawPath(PathElement2D $pathElement){
        $steps = $pathElement -> getSteps();
          
        $fill   = "fill=\"none\"" ;
        $stroke = "stroke=\"rgb(0,0,0)\"";
        $stroke_width = "stroke-width=\"1\"";
        $opacity = "opacity=\"0.996078431372549\"";
        // if($fill != ""){
        //     $fill = "fill=\"" . $fill . "\" ";
        // }
        $str = "<path " . $fill . " " . $stroke . " " . $stroke_width . " " . $opacity ." d=\"";
        foreach($steps as $key => $step){
            if($key == 0){
                $str .= " M" . round($step['x'], 2) . "," . round($step['y'], 2);
                continue;
            }
            $str .= " L" . round($step['x'], 2) . "," . round($step['y'], 2);
        }
        $str .= " \"/>";
        return $str;
    }
    public function drawStart(int $width, int $height){
        return "<svg width='" . $width . "' height='" . $height . "' xmlns='http://www.w3.org/2000/svg' version='1.1'>";
    }
    public function drawEnd(){
        return "</svg>";
    }
}
class SVGModel {
    public $CodeString = "";
    public $PathObject;

    public $digits      = 4;
    public $xNull       = 0;
    public $yNull       = 0;
    public $scale       = 1;
    public $XMultiply   = 1;
    public $YMultiply   = 1;
    public $length      = 0;

    use genSVGCodeHelper;

    public function __construct(PathObject2D $pathObject){
        $this -> PathObject = $pathObject;
    }        
    public static function getGCode(PathObject2D $pathObject) : string {
        return (new self($pathObject)) -> get();
    }
    public function save(string $path){
        writeToFile($path, $this -> get());
    }
    public function get(){
        $this -> getStart();
        $pathElements = $this -> PathObject -> getElements();
        foreach($pathElements as $pathElement){
            $this -> newElement($pathElement);
        }
        $this -> CodeString .= $this -> getEnd();
        return $this -> CodeString;
    }    
    private function newElement(PathElement2D &$pathElement){
        $cfg = ConverterConfig::get() -> laser;
        $steps = $pathElement -> getSteps();
        $pe = new PathElement2D();
        foreach($steps as $key => $step){
            $this -> scale($step);
            $pe -> addStep($step['x'], $step['y']);
        }
        $this -> CodeString .= $this -> drawPath($pe);
    }
        public function scale(array &$step){         
            $step['x'] = round($this -> xNull + ($step['x']) * $this -> scale, $this -> digits) * $this -> XMultiply;
            $step['y'] = -round(-$this -> yNull + (($step['y'])) * $this -> scale, $this -> digits) * $this -> YMultiply;
        }
    private function getStart(){
        $this -> CodeString .= $this -> drawStart(2000, 2000);
    }
    private function getEnd(){
        $str = $this -> drawEnd();
        return $str;
    }
}