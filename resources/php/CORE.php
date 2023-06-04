<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/Splint/php/CORE.php';
    require_once 'Paths.php';
    require_once 'CORE_dataBase.php';
    require_once $rootpath.'/fd/resources/php/FolderSyS/FolderSySCore.php';
    require_once $rootpath.'/fd/resources/php/security/security.php';
    //PHP Core


    function mergeObject(&$dst, $obj) : object {
        $dst = (object) array_merge((array) $dst, (array) $obj);
        return $dst;
    }
    function debugg(mixed $value) : void {
        trigger_error(print_r($value, true), E_USER_ERROR);
    }

    function fromStorage(string $key){
        return $_POST["Storage"][$key];
    }

    function writeToFile(string $path, $content){
        $fp = fopen($path, 'w+');
        fwrite($fp, $content);
        fclose($fp);
    }



    function decodeJSON($string){
        if(FileTools::isJSON($string)){
            return json_decode($string);
        } else {
            return $string;
        }
    }
    
    function imgToBlob($imgMixed){
        $imgBlob = 0;
        if(gettype($imgMixed) == 'object'){
            ob_start(); 
                imagepng($imgMixed);
                $imgBlob = base64_encode(ob_get_contents()); 
            ob_end_clean(); 
        } else if(gettype($imgMixed) == 'string') {
            $imgBlob = $imgMixed;
        } else{
            $imgBlob = NULL;
        }
        return $imgBlob;
    }

    function debug_to_console($data) {
        $output = $data;
        if (is_array($output))
            $output = implode(',', $output);
    
        echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
    }

    class cycleArray{
        public $array;
        private $count;

        function __construct(array $array){
            $this -> array = $array;
            $this -> count = count($array)  - 1;
        }
        public function get(int $index) {
            if($index > $this -> count){
                return $this -> array[$index - $this -> count];
            } else if($index < 0){
                return $this -> array[$this -> count + $index];
            } else {
                return $this -> array[$index];
            }
        }
    }



    function getIfArray(mixed $array, string $key, mixed $returnFlag = null) : mixed{
        if(gettype($array) == 'array'){
            return $array[$key];
        } else {
            if($returnFlag != null){
                return $returnFlag;
            } else {
                return $array;
            }
        }
    }
    function isEqualTo($value, ...$checkValues) : bool {
        foreach($checkValues as $checkValue){
            if($value == $checkValue){
                return true;
            }
        }
        return false;
    }

    function checkNull($value, $else = null){
        if($value != null){
            return $value;
        }
        return $else;
    }

    function checkVal(&$value, $else = null){
        if(isset($value)){
            return $value;
        } else {
            return $else;
        }
    }

    function checkInInterval(int $sec_duration, int $sec_interval, $func, &$param = null){
        $time = time();
        while($time + $sec_duration > time()){
            sleep($sec_interval);
            $func($param);
        }
    }
    function IsValueInArray($array, $value, $length){
        for($i = 0; $i < $length; $i++){
            if(isset($array[$i][0]) && $array[$i][0] == $value){
                return $i;
            }
        }
        return -1;
    }
    function roundToAny($n, $max, $x = 5) {
        //$value = (round($n)%$x === 0) ? round($n) : round(($n+$x/2)/$x)*$x;
        $value = round($n / $x) * $x;
        if($value <= $max){
            return $value;
        } else{
            return $max;
        }
    }
    function roundToAny_exclude($n,$x=5) {
        $value =  round(($n+$x/2)/$x)*$x;
        if($value <= 255){
            return $value;
        } else{
            return 255;
        }
    }

    function array_multisum(array $arr): float {
        $sum = array_sum($arr);
        foreach($arr as $child) {
            $sum += is_array($child) ? array_multisum($child) : 0;
        }
        return $sum;
    }

    function array_max(array $array) : array{
        $output = [];
        $output ['max'] = 0;
        $output ['x']   = 0;
        $output ['y']   = 0;
        foreach($array as $x => $array2){
            foreach($array2 as $y => $data){
                if($data > $output['max']){
                    $output['max'] = $data;
                    $output['x'] = $x;
                    $output['y'] = $y;
                }
            }
        }
        return $output;
    }

    function outputArray($array, string $path){
        $fp = fopen($path, "w+");
        for($y = 0; $y < count($array[0]); $y++){
            for($x = 0; $x < count($array) ; $x++){  
                if($array[$x][$y] == 0){
                    fwrite($fp, str_pad("+0", 4, ' ', STR_PAD_RIGHT));
                } else {
                    fwrite($fp, str_pad($array[$x][$y], 4, ' ', STR_PAD_RIGHT));
                }
            }
            fwrite($fp, "\n");
        }
        fclose($fp);
    }

    // class DataSet {
    //     public $dataSet     = [];
    //     public $keySet      = [];
    //     public $PrimaryKey  = "";
    //     public $TBName      = "";
    //     public function newEntry($EntryName, $value = null){
    //         $array = [$EntryName, $value];
    //         array_push($this -> dataSet, $array);
    //     }
    //     public function removeEntry($EntryName){
    //         $i = 0;
    //         foreach ($this -> dataSet as $data) {
    //             if($data[0] == $EntryName){
    //                 array_splice($this -> dataSet, $i);
    //             }
    //             $i++;
    //         }
    //     }
    //     public function primaryKey($PrimaryKey = null){
    //         if ($PrimaryKey != null) {
    //             $this -> PrimaryKey = $PrimaryKey;
    //         }
    //         return $this -> PrimaryKey;
    //     }
    //     public function newKey($KeyName, $Key = null){
    //         if($Key == null){
    //             // $array = [$KeyName, $Key];
    //             array_push($this -> keySet, $KeyName);
    //         } else {
    //             $array = [$KeyName, $Key];
    //             array_push($this -> keySet, $array);
    //         }
    //     }
    //     public function getKeyNames_Keys(){
    //         return $this -> keySet;
    //     }
    //     public function TBName($TBName = null){
    //         if ($TBName != null) {
    //             $this -> TBName = $TBName;
    //         }
    //         return $this -> TBName;
    //     }
    //     public function getEntrys_Names(){
    //         return $this -> dataSet;
    //     }
    // }


?>