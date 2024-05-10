<?php
    class Autoloader {
        // Basisverzeichnis in dem wiederum die nach Namespaces benannten Verzeichnisse liegen
        // Hier wird angenommen, dass sie im selben Verzeichnis wie der Autoloader liegen
        // Der Wert soll nicht auf einem "/" enden
        const BASE_DIR = __DIR__;
        // Hier wird die Dateierweiterung bestimmt, die jede Datei mit einer PHP-Klasse haben muss.
        // (Üblich ist zumeist eher nur ".php".)
        const FILE_EXTENSION = '.class.php';
         
        public static function autoload($className) {
            // $className enthält die Namespaces (hier zum Beispiel "Autoloadertest\Test")
            // Nur unter Windows ist "\" ein erlaubtes Trennzeichen für Verzeichnisse, daher muss
            // es an den Systemstandard angeglichen werden (unter Linux etwa zu "Autoloadertest/Test")
            $className = str_replace('\\', DIRECTORY_SEPARATOR, $className);
            $filePath = Autoloader::BASE_DIR . DIRECTORY_SEPARATOR . $className . Autoloader::FILE_EXTENSION;
            Debugg::log($filePath);
            if (file_exists($filePath)) {
                // Datei zur Klasse includen, falls sie denn existiert
                include_once($filePath);
            }
        }
    }