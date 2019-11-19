<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PATCH,DELETE,PUT");
// header("Content-type: application/json; charset=utf-8");

require("../conn.php");
require("./query.php");

$requestMethod = $_SERVER["REQUEST_METHOD"];

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode( '/', $uri );//字串切割
$id = '';

if (isset($uri[4])) {
    $id = (int) $uri[4];
};

//echo($id);

switch($requestMethod){
    case "POST":
        addTodo();
        break;

    case "DELETE":
        deleteTodo($id);
        break;

    case "GET":	
        if($id){
          getOnetodo($id);
        }else{
          getAlltodo();
        }
        break;

    case "PATCH":	
        finishTodo($id);
        break;

    default:
        break;
}
?>