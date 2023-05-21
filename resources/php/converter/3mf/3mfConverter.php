<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    trait gen3DElementsHelper {
        public function addSquare(vertex $vertex1, vertex $vertex2, vertex $vertex3, vertex $vertex4){
            array_push($this -> triangles, new triangle($vertex1, $vertex2, $vertex3));
            array_push($this -> triangles, new triangle($vertex1, $vertex2, $vertex4));
        }
        public function addTriangle(vertex $vertex1, vertex $vertex2, vertex $vertex3){
            array_push($this -> triangles, new triangle($vertex1, $vertex2, $vertex3));
        }
    }
    class vertex {
        public $coords;
        public $color;
        public function __construct(Coords $coords, int $color = 16777215){
            $this -> coords = $coords;
            $this -> color = $color;
        }
    }
    class vertexField {
        public $field = [];
        public $sort = [];
        public $count = -1;
        public $digits = 0;
        public function __construct(int $digits){
            $this -> digits = $digits;
        }
        public function addVertex(vertex $vertex){
            return $this -> getIndexForVertex($vertex);
        } 
        private function getIndexForVertex(vertex $vertex) : int {
            $x = $vertex -> coords -> x;
            $y = $vertex -> coords -> y;
            $z = $vertex -> coords -> z * (100);
            if(isset($this -> field[$x][$y][$z])){
                return $this -> field[$x][$y][$z];
            } else {
                $this -> count++;
                $this -> field[$x][$y][$z] = $this -> count;
                return $this -> count;
            }
        }
        public function getArray() : array{
            $array = [];
            foreach($this -> field as $x => $fieldX){
                foreach($fieldX as $y => $fieldY){ 
                    foreach($fieldY as $z => $fieldZ){
                        $array[$fieldZ] = new Coords($x, $y, $z/(100));
                    }
                }
            }
            return $array;
        }
    }
    class triangle {
        public $vertices = [];
        public function __construct(vertex $vertex1, vertex $vertex2, vertex $vertex3){
            $this -> vertices[0] = $vertex1;
            $this -> vertices[1] = $vertex2;
            $this -> vertices[2] = $vertex3;
        }
    }
    class object3D {
        use gen3DElementsHelper;
        public $triangles = [];
        public function __construct(){

        }
        public function addTriangles(triangle ...$triangles){
            foreach($triangles as $triangle){
                array_push($this -> triangles, $triangle);
            }
        }
    }
    class object3mf {
        public $colors      = [];
        public $triangles   = [];
        public $vertices    = [];
        public $vertexField;
        public $fastMode = false;
        public function __construct(object3D $object3D = null, bool $fastMode = false){
            $this -> fastMode = $fastMode;
            $this -> vertexField = new vertexField(5);
            foreach($object3D -> triangles as $triangle){
                $this -> addTriangle($triangle);
            }
        }
        public function addTriangle(triangle $triangle){
            $v1 = $triangle -> vertices[0];
            $v2 = $triangle -> vertices[1];
            $v3 = $triangle -> vertices[2];
            
            if($v1 != $v2 && $v2 != $v3 && $v1 != $v3){
                // $this -> vertexField -> addVertex($v1);
                // $this -> vertexField -> addVertex($v2);
                // $this -> vertexField -> addVertex($v3);
                $v1_f = new stdClass();
                $v2_f = new stdClass();
                $v3_f = new stdClass();

                if($this -> fastMode){
                    $v1_f -> color = $this -> insertColorFast($v1 -> color);
                    $v1_f -> index = $this -> insertVertexFast($v1);

                    $v2_f -> color = $this -> insertColorFast($v2 -> color);
                    $v2_f -> index = $this -> insertVertexFast($v2);

                    $v3_f -> color = $this -> insertColorFast($v3 -> color);
                    $v3_f -> index = $this -> insertVertexFast($v3);
                } else {
                    $v1_f -> color = $this -> getIndexForColor($v1 -> color);
                    $v1_f -> index = $this -> vertexField -> addVertex($v1);

                    $v2_f -> color = $this -> getIndexForColor($v2 -> color);
                    $v2_f -> index = $this -> vertexField -> addVertex($v2);

                    $v3_f -> color = $this -> getIndexForColor($v3 -> color);
                    $v3_f -> index = $this -> vertexField -> addVertex($v3);
                }
    
                array_push($this -> triangles, [$v1_f, $v2_f, $v3_f]);
            }
        }
        public function insertVertexFast(vertex $vertex) : int {
            array_push($this -> vertices, $vertex -> coords);
            return count($this -> vertices) -1;
        }
        public function insertColorFast(string $color) : int {
            array_push($this -> colors, $color);
            return count($this -> colors) -1;
        }
        public function getIndexForVertex(vertex $vertex, bool $insert = true) : int {
            $index = array_search($vertex -> coords, $this -> vertices);
            if($index !== false){
                return $index;
            } else {
                if($insert){
                    array_push($this -> vertices, $vertex -> coords);
                }
                return count($this -> vertices) -1;
            }
        }
        public function getIndexForColor(string $color, bool $insert = true) : int {
            $index = array_search($color, $this -> colors);
            if($index !== false){
                return $index;
            } else {
                if($insert){
                    array_push($this -> colors, $color);
                }
                return count($this -> colors) -1;
            }
        }
        public function get() : string {
            $response = "<mesh>\r\n";
            $response .= "<vertices>\r\n";
            if($this -> fastMode){
                foreach($this -> vertices as $vertexCoords){
                    $response .= comp_3mf::vertex($vertexCoords);
                }
            } else {
                $vertexArray = $this -> vertexField -> getArray();
                for($i = 0; $i < count($vertexArray); $i++) {
                    $response .= comp_3mf::vertex($vertexArray[$i]);
                }
            }
            $response .= "</vertices>\r\n";
            $response .= "<triangles>\r\n";
            foreach($this -> triangles as $triangle){
                $response .= "<triangle v1='" . $triangle[0] -> index . "' v2='" . $triangle[1] -> index . "' v3='" . $triangle[2] -> index . "' p1='" . $triangle[0] -> color  . "' p2='" . $triangle[1] -> color . "' p3='" . $triangle[2] -> color . "' pid='2'/>\r\n";
            }
            $response .= "</triangles>\r\n";
            $response .= "</mesh>\r\n";
            return $response;
        }
    }
    class model3mf {
        public $objects = [];
        public function __construct(object3mf $object3mf){
            array_push($this -> objects, $object3mf);
        }
        public function get() : string {
            $objects = "";
            $basematerials = "";
            foreach($this -> objects as $key => $object){
                $basematerials .= comp_3mf::basematerials($object -> colors);
                $objects .= comp_3mf::object($key + 3, $object -> get(), "");
            }
            $response = "";
            $response .= "<?xml version='1.0' encodeing='UTF-8'?>\r\n";
            $response .= comp_3mf::model("millimeter", "en-US", "", "");
            $response .= "<resources>\r\n";
            $response .= "<basematerials id='2'>\r\n";
            $response .= $basematerials;
            $response .= "</basematerials>\r\n";
            $response .= $objects;
            $response .= "</resources>\r\n";
            $response .= "<build>\r\n";
            foreach($this -> objects as $i => $object){
                $response .= comp_3mf::item($i + 3, "1 0 0 0 1 0 0 0 1 125 105 15", 1);
            }
            $response .= "</build>\r\n";
            $response .= "</model>";
            return $response;
        }
        public function save(string $path){
            $path = new Path('3Dmodels', '3mf', 'cube', '3D', '3dmodel.model');
            $path -> editData($this -> get());
            $path = new Path('3Dmodels', '3mf', 'cube');
            zipHelper::save($path -> getPathAsString(), $path -> getPathAsString() . '/test');
        }
    }
    // function start_3mf(){

    //     $model = new gen_3mf();
    //     // $triangle = new triangle();
    //     // $triangle -> setCoords(0, 0, 0);
    //     // $triangle -> setCoords(0, 0, 1);
    //     // $triangle -> setCoords(0, 1, 1);
    //     // $model -> addTriangle($triangle);

    //     $c1 = new Coords(0, 0, 0);
    //     $c2 = new Coords(1, 1, 1);
    //     $model -> addCube($c1, $c2);
    //     $res = $model-> get();
    //     $path = new Path('3Dmodels', '3mf', 'cube', '3D', '3dmodel.model');
    //     $path -> editData($res);

    //     $path = new Path('3Dmodels', '3mf', 'cube');
    //     zipHelper::save($path -> getPathAsString(), $path -> getPathAsString() . '/test');
    // }
    class comp_3mf {
        public static function model($unit, $xml_lang, $xmlns, $xmlns_slice3rpe) : string {
            $string = "<model unit='" . $unit . "' xml:lang='" . $xml_lang . "' xmlns:m='http://schemas.microsoft.com/3dmanufacturing/material/2015/02' xmlns='http://schemas.microsoft.com/3dmanufacturing/core/2015/02'>\r\n";
            return $string;
        }
        public static function vertex(Coords $coords) : string {
            $string = "<vertex x='" . $coords -> x . "' y='" . $coords -> y . "' z='" . $coords -> z . "' />\r\n";
            return $string;
        }
        public static function verticles(string $vertex) : string {
            $response = "<vertices>\r\n";
            $response .= $vertex;
            $response .= "</vertices>\r\n";
            return $response;
        }
        public static function triangles(string $triangle) : string {
            $response = "<triangles>\r\n";
            $response .= $triangle;
            $response .= "</triangles>\r\n";
            return $response;
        }
        public static function triangle(stdClass $v1, stdClass $v2, stdClass $v3) : string {
            $string = "<triangle v1='" . $v1 -> index . "' v2='" . $v2 -> index . "' v3='" . $v3 -> index . "' p1='" . $v1 -> color . "' p2='" . $v2 -> color . "' p3='" . $v3 -> color . "' pid='2'/>\r\n";
            return $string;
        }
        public static function object(int $index, string $inner, string|int $colorIndex = "", string $type = "model") : string {
            if($colorIndex != "") {
                $colorIndex = "pid='2' ";
            }
            // $colorIndex = "";
            $response = "<object id='" . $index . "' type='" . $type . "' " . $colorIndex . " >\r\n";
            $response .= $inner;
            $response .= "</object>\r\n";
            return $response;
        }
        public static function item(int $id, string $transform, int $printable) : string {
            return "<item objectid='" . $id . "' transform='" . $transform . "' printable='" . $printable . "' />\r\n";
        }
        public static function basematerials(array $colors) : string {
            $response = "";
            foreach($colors as $key => $color) {
                $response .= "<base name='Default' displaycolor='" . Dez2Hex($color) . "' />\r\n";
            }
            return $response;
        }
    }

    // class object_3mf {
    //     public $vertex      = [];
    //     public $triangle    = [];
    //     public $color       = "#FFFFAA";
    //     public $colors      = [];
    //     public function __construct(){}
    //     public function addVertex(Coords $coords, int $colorIndex = 16777215){
    //         // $color = "#FFFFAA";
    //         $vertex = new stdClass();
    //         $vertex -> coords   = $coords;
    //         $vertex -> colorIndex    = $this -> addColorToVertex($colorIndex);
    //         array_push($this -> vertex, $vertex);
    //     }
    //     private function addColorToVertex(int $colorIndex) : int{
    //         if(!in_array($colorIndex, $this -> colors)){
    //             array_push($this -> colors, $colorIndex);
    //             return count($this -> colors) - 1;
    //         } else {
    //             return array_search($colorIndex, $this -> colors);
    //         }
    //     }
    //     public function addTriangle(int $vertex1, int $vertex2, int $vertex3){
    //         if($vertex1 < 0 || $vertex2 < 0 || $vertex3 < 0){
    //             return;
    //         }
    //         array_push($this -> triangle, [$vertex1, $vertex2, $vertex3]);
    //     }
    //     public function addSquare(int $vertex1, int $vertex2, int $vertex3, int $vertex4){
    //         if($vertex1 < 0 || $vertex2 < 0 || $vertex3 < 0|| $vertex4 < 0){
    //             return;
    //         }
    //         $this -> addTriangle($vertex1, $vertex2, $vertex3);
    //         $this -> addTriangle($vertex1, $vertex2, $vertex4);
    //     }
    //     public function get(){
    //         $response = "<mesh>\r\n";
    //         $response .= "<vertices>\r\n";
    //         foreach($this -> vertex as $vertex){
    //             $response .= comp_3mf::vertex($vertex -> coords);
    //         }
    //         $response .= "</vertices>\r\n";
    //         $response .= "<triangles>\r\n";
    //         foreach($this -> triangle as $triangle){
    //             $i = $triangle;
    //             $response .= comp_3mf::triangle($this -> v2std($i[0]), $this -> v2std($i[1]), $this -> v2std($i[2]));
    //         }
    //         $response .= "</triangles>\r\n";
    //         $response .= "</mesh>\r\n";
    //         return $response;
    //     }
    //     public function v2std(int $vertex) : stdClass {
    //         $v = new stdClass();
    //         $v -> index         = $vertex;
    //         $v -> color    = $this -> vertex[$vertex] -> colorIndex;
    //         return $v;

    //     }
    //     public function setColor(string $color){
    //         $this -> color = $color;
    //     }
    //     public function getColor() : string {
    //         return $this -> color;
    //     }
    //     public function getVertexCount() : int {
    //         return count($this -> vertex);
    //     }
    //     public function getColorCount() : int {
    //         return count($this -> colors);
    //     }
    //     public function getTriangleCount() : int {
    //         return count($this -> triangle);
    //     }
    // }

    // class gen_3mf {
    //     public $objects      = [];
    //     public function __construct(){}
    //     public function addCube(Coords $coord1, Coords $coord2, $side = null){
    //         $x1 = $coord1 -> x;
    //         $y1 = $coord1 -> y;
    //         $z1 = $coord1 -> z;

    //         $x2 = $coord2 -> x;
    //         $y2 = $coord2 -> y;
    //         $z2 = $coord2 -> z;

    //         $object = new object_3mf();
    //         $object -> addVertex(Coords::get($x1, $y1, $z1)); // 0| 0 0 0
    //         $object -> addVertex(Coords::get($x1, $y2, $z1)); // 1| 0 1 0
    //         $object -> addVertex(Coords::get($x2, $y1, $z1)); // 2| 1 0 0
    //         $object -> addVertex(Coords::get($x2, $y2, $z1)); // 3| 1 1 0

    //         $object -> addVertex(Coords::get($x2, $y2, $z2)); // 4| 1 1 1
    //         $object -> addVertex(Coords::get($x2, $y1, $z2)); // 5| 1 0 1
    //         $object -> addVertex(Coords::get($x1, $y2, $z2)); // 6| 0 1 1
    //         $object -> addVertex(Coords::get($x1, $y1, $z2)); // 7| 0 0 1
            
    //         $object -> addTriangle(0, 1, 2);
    //         $object -> addTriangle(1, 2, 3);

    //         $object -> addTriangle(4, 5, 6);
    //         $object -> addTriangle(5, 6, 7);
            
    //         $object -> addTriangle(3, 4, 5);
    //         $object -> addTriangle(3, 2, 5);

    //         $object -> addTriangle(1, 0, 7);
    //         $object -> addTriangle(1, 6, 7);

    //         $object -> addTriangle(0, 5, 7);
    //         $object -> addTriangle(0, 5, 2);

    //         $object -> addTriangle(1, 4, 6);
    //         $object -> addTriangle(1, 4, 3);
            
    //         array_push($this -> objects, $object);
    //     }
    //     public static function getSquare(Coords $c1, Coords $c2, object_3mf &$object = new object_3mf()) : object_3mf {
    //         $object -> addVertex($c1); // 0 0 0
    //         $object -> addVertex($c2); // 1 1 1
    //         if(Coords::get($c1 -> x, $c2 -> y, $c2 -> z) == $c2){
    //             $object -> addVertex(Coords::get($c1 -> x, $c2 -> y, $c1 -> z)); // 0 1 1
    //             $object -> addVertex(Coords::get($c2 -> x, $c1 -> y, $c2 -> z)); // 1 0 0
    //         } else {
    //             $object -> addVertex(Coords::get($c1 -> x, $c2 -> y, $c2 -> z)); // 0 1 1
    //             $object -> addVertex(Coords::get($c2 -> x, $c1 -> y, $c1 -> z)); // 1 0 0
    //         }

    //         $o = count($object -> vertex) -4;

    //         $object -> addTriangle(0 + $o, 1 + $o, 2 + $o); // 000 111 011
    //         $object -> addTriangle(0 + $o, 1 + $o, 3 + $o);
    //         return $object;
    //     }
    //     public function addObject(object_3mf $object){
    //         array_push($this -> objects, $object);
    //     }
    //     public function combineObjects() : object_3mf {
    //         $vertexCount = 0;
    //         $colorCount = 0;

    //         $responseObject = new object_3mf();
    //         foreach($this -> objects as $object){
    //             foreach($object -> triangle as $triangle){
    //                 $responseObject -> addTriangle($triangle[0] + $vertexCount, $triangle[1] + $vertexCount, $triangle[2] + $vertexCount);
    //                 // $triangle[0] += $vertexCount;
    //                 // $triangle[1] += $vertexCount;
    //                 // $triangle[2] += $vertexCount;
    //             }
    //             foreach($object -> vertex as $vertex){
    //                 $vertex -> colorIndex += $colorCount;
    //                 array_push($responseObject -> vertex, $vertex);
    //             }
    //             // $responseObject -> vertex += $object -> vertex;
    //             // $responseObject -> triangle += $object -> triangle;
    //             $responseObject -> colors += $object -> colors;
    //             $vertexCount += $object -> getVertexCount();
    //             $colorCount += $object -> getColorCount() - 1;
    //         }
    //         $this -> objects = [$responseObject];
    //         return $responseObject;
    //     }
    //     public function get(){
    //         $objects = "";
    //         $basematerials = "";
            
    //         foreach($this -> objects as $i => $object){
    //             $basematerials .= comp_3mf::basematerials($object -> colors);
    //             $objects .= comp_3mf::object($i + 3, $object -> get(), $i);
    //         }
    //         $response = "";
    //         $response .= "<?xml version='1.0' encodeing='UTF-8'>\r\n";
    //         $response .= comp_3mf::model("millimeter", "en-US", "", "");
    //         $response .= "<resources>\r\n";
    //         $response .= "<basematerials id='2'>\r\n";
    //         $response .= $basematerials;
    //         $response .= "</basematerials>\r\n";
    //         $response .= $objects;
    //         $response .= "</resources>\r\n";
    //         $response .= "<build>\r\n";
    //         foreach($this -> objects as $i => $object){
    //             $response .= comp_3mf::item($i + 3, "1 0 0 0 1 0 0 0 1 125 105 15", 1);
    //         }
    //         $response .= "</build>\r\n";
    //         $response .= "</model>";
    //         return $response;
    //     }
    //     public function save(string $path){
    //         // $this -> combineObjects();
    //         $path = new Path('3Dmodels', '3mf', 'cube', '3D', '3dmodel.model');
    //         $path -> editData($this -> get());
    //         $path = new Path('3Dmodels', '3mf', 'cube');
    //         zipHelper::save($path -> getPathAsString(), $path -> getPathAsString() . '/test');

    //     }
    // }