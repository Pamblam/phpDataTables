<?php

//error_reporting(E_ALL);
//ini_set("display_errors", 1);

$config = parse_ini_file(realpath(dirname(__FILE__))."/config.ini");

// Create the PDO instance
if($config['DB_TYPE'] === "MySQL"){
	$pdo = new PDO(
		'mysql:host='.$config['PDO_CONFIG']['HOST'].';'.
		'dbname='.$config['PDO_CONFIG']['DB'].';'.
		'charset=utf8', 
		$config['PDO_CONFIG']['USER'], 
		$config['PDO_CONFIG']['PASS']
	);
}else{
	$pdo = new PDO(
		'oci:dbname=//'.$config['PDO_CONFIG']['HOST'].'/'.$config['PDO_CONFIG']['DB'], 
		$config['PDO_CONFIG']['USER'], 
		$config['PDO_CONFIG']['PASS']
	);
	$pdo->setAttribute(PDO::ATTR_CASE, PDO::CASE_LOWER);
}