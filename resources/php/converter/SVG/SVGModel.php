<?php

$rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $rootpath.'/fd/resources/php/converter/converterCore.php';
require_once $rootpath.'/fd/resources/php/converter/NC/NCCode.php';
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

    public $digits      = 2;
    public $xNull       = 0;
    public $yNull       = 0;
    public $scale       = 1;
    public $XMultiply   = 1;
    public $YMultiply   = 1;
    public $length      = 0;

    use genSVGCodeHelper;

    public function __construct(PathObject $pathObject){
        $this -> PathObject = $pathObject;
    }        
    public static function getGCode(PathObject $pathObject) : string {
        return (new self($pathObject)) -> get();
    }
    public function save(string $path){
        // file_put_contents($path, $this -> get());
        // file_put_contents("test.nc", base_convert(unpack('H*',$this -> get())[1], 16, 2));
        // $q = pack('H*', base_convert(file_get_contents("test.nc"), 2, 16));
        writeToFile($path, $this -> get());
        // $a = file_get_contents($path);
    }
    public function get(){
        $this -> getStart();
        $pathElements = $this -> PathObject -> getElements();

        // $this -> add_G(0, Coords::get(null, null, null));
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
        // $steps = $pathElement -> getSteps();
        // $lastStep = [];
        // foreach($steps as $key => $step){
        //     $this -> scale($step);
        //     if(count($lastStep) == 0){
        //         $lastStep = $step;
        //     }
        //     if($key == 0){
        //         // $this -> CodeString .= "\r\nM220 S200\r\n";
        //         $this -> CodeString .= "\r\n";
        //         // $this -> add_G(0, Coords::get(null, null, $cfg -> fastTravel -> height), $cfg -> fastTravel -> F, 0);
        //         // $this -> CodeString .= "M400\r\n";
        //         $this -> add_G(0, Coords::get($step['x'], $step['y']), $cfg -> fastTravel -> F, $cfg -> fastTravel -> S);
        //         // $this -> CodeString .= "M400\r\n";
        //         // $this -> CodeString .= "M220 S100\r\n";
        //         $this -> add_G(1, Coords::get($step['x'], $step['y']), $cfg -> workTravel -> F, $cfg -> workTravel -> S);
        //         // $this -> CodeString .= "M400\r\n";
        //         // $this -> add_G(1, null, 1500);
        //         // $this -> CodeString .= "M400\r\n";
        //         // $this -> CodeString .= "M220 S100\r\n";
        //     } else {
        //         $this -> add_G(1, Coords::get($step['x'], $step['y']));
        //     }
        //     $this -> length += sqrt(pow($step['x'] - $lastStep['x'], 2) + pow($step['y'] - $lastStep['y'], 2) + pow($step['z'] - $lastStep['z'], 2));
        //     $lastStep = $step;
        // }
        // // $this -> CodeString .= "\r\nM220 S100";
        // // $this -> CodeString .= "\r\nM400\r\n\r\n";
    }
        public function scale(array &$step){         
            $step['x'] = round($this -> xNull + ($step['x']) * $this -> scale, $this -> digits) * $this -> XMultiply;
            $step['y'] = -round(-$this -> yNull + (($step['y'])) * $this -> scale, $this -> digits) * $this -> YMultiply;
        }
    private function getStart(){
        $cfg = ConverterConfig::get() -> laser;
        $this -> CodeString .= $this -> drawStart(2000, 2000);
        // $this -> CodeString .= "G00 G17 G40 G21 G54\r\nG90\r\nM3\r\nM8\r\n";
        // $this -> add_G(0, Coords::get(round($cfg -> zero -> X, $this -> digits), round( $cfg -> zero -> Y, $this -> digits)), $cfg -> fastTravel -> F, $cfg -> fastTravel -> S);
        // $this -> CodeString .= "M220 S500\r\n";
        // $this -> CodeString .= "\r\nM400\r\n";
        // $this -> CodeString .= "M220 S100\r\n\r\n";
        // $this -> add_G(1, Coords::get(70, 120, 75), 3000);
    }
    private function getEnd(){
        $cfg = ConverterConfig::get() -> laser;
        $str = $this -> drawEnd();
        // $this -> add_G(0, Coords::get(null, null, 0.1), $cfg -> fastTravel -> F ,$cfg -> fastTravel -> S);
        // $this -> CodeString .= "\r\nM5\r\n";
        // // $this -> add_G(0, Coords::get(0.1, 0.1, 0.1), $cfg -> fastTravel -> F, $cfg -> fastTravel -> S);
        // $str = "M2\r\n";
        // $this -> CodeString = ";full engraving length: " . round($this -> length, 2) . "mm\r\n" . $this -> CodeString;
        // $this -> CodeString = ";full engraving duration: " . $this -> calcTime() . "\r\n" . $this -> CodeString;
        return $str;
    }
    private function calcTime(){
        $length = $this -> length;
        $cfg = ConverterConfig::get() -> laser;
        $speed = round($cfg -> workTravel -> F / 60, 0);
        $duration = round(($speed * $length) / 60, 2);
        return explode('.',$duration)[0] ."min " . explode('.', $duration)[1] . "s" ;
    }
    // public static function getFromPathObject(PathObject $pathObject){
    //     $pathElements = $pathObject -> getElements();
    //     $result = "G28 \r\n
    //                 G0 Z0\r\n\r\n";
    //     foreach($pathElements as $pathElement){
    //         $steps = $pathElement -> getSteps();
    //         foreach($steps as $key => $step){
    //             scale($step);
    //             if($key == 0){
    //                 // $result .= "SET_PIN PIN=TOOL VALUE=0\r\n";
    //                 $result .= "G0 Z1 F3000\r\n";
    //                 $result .= "G0 X" . $step['x'] . " Y" . -$step['y'] . "\r\n";
    //                 $result .= "G0 Z0.1\r\n";
    //                 // $result .= "SET_PIN PIN=TOOL VALUE=1\r\n";
    //                 $result .= "G0 F100\r\n";
    //             }
    //             $result .= "G1 X" . $step['x'] . " Y" . -$step['y'] . "\r\n";
    //         }
    //         $result .= "\r\n";
    //     }
    //     // $result .= "SET_PIN PIN=TOOL VALUE=0\r\n";
    //     // $path = PATH_Project::get(PATH_Project::NONE, )
    //     return $result;

    // }
}