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

// build the query
$sql = $_REQUEST['dataquery'];
$params = array();
$where = array();
$orderby = array();
$gwhere = array();
$quote = $config['DB_TYPE'] === "MySQL" ? '`' : '"';

$q = $pdo->prepare("select count(1) as cnt from ($sql) phpdtc");
$q->execute($params);
$res = $q->fetch(PDO::FETCH_ASSOC);
$count = intval($res['cnt']);

foreach($_REQUEST['columns'] as $req){
	if($req['searchable']){
		if(!empty($req['search']['value'])){
			$where[] = "UPPER($quote".$req['colname']."$quote) LIKE ?";
			$params[] = '%'.strtoupper($req['search']['value']).'%';
		}
		if(!empty($_REQUEST['search']['value'])){
			$gwhere[] = "UPPER($quote".$req['colname']."$quote) LIKE ?";
			$params[] = '%'.strtoupper($_REQUEST['search']['value']).'%';
		}
	}
}

$where = implode(" and ", $where);
$gwhere = implode(" or ", $gwhere);
$sql = "select * from ($sql) phpdta";
if(!empty($gwhere) || !empty($where)) $sql .= " where ";
if(!empty($where)) $sql .= "($where) ";
if(!empty($gwhere) && !empty($where)) $sql .= "and ";
if(!empty($gwhere)) $sql .= "($gwhere)";

$sql .= " Order by";
foreach($_REQUEST['order'] as $k=>$o){
	$sql .= " $quote".$_REQUEST['columns'][$o['column']]['colname']."$quote ".$o['dir'];
	if($k < (count($_REQUEST['order']) -1)) $sql .= ", ";
}

$q = $pdo->prepare("select count(1) as cnt from ($sql) phpdtc");
$q->execute($params);
$res = $q->fetch(PDO::FETCH_ASSOC);
$fcount = intval($res['cnt']);

if($config['DB_TYPE'] === "MySQL"){
	$sql .= " LIMIT ".$_REQUEST['start'].",".$_REQUEST['length'];
}else{
	$sql  = "select * from ( select rownum rnum, phpdtb.* from ( $sql ) phpdtb where rownum <= ".($_REQUEST['length']+$_REQUEST['start'])." ) where rnum > ".$_REQUEST['start'];
}

$q = $pdo->prepare($sql);
$q->execute($params);
$data = $q->fetchAll(PDO::FETCH_NUM);

// Remove rownum when using oracle
if($config['DB_TYPE'] !== "MySQL") foreach($data as $k=>$v) array_shift($data[$k]);

header("Content-Type: application/json");
echo json_encode(array(
	"draw" => intval($_REQUEST['draw']),
	"recordsTotal" => $count,
	"recordsFiltered" => $fcount,
	"data" => $data
));

