<?php

header("Content-type: application/json; charset=utf-8");

require_once('./conn.php');

// echo('mppmpp');

// exit();

//怎麼接球
//$_POST['todo'];

$dataInput = $_POST['dataInput'];

//echo $dataInput;
// exit();

//$is_Check=$_POST['is_Check'];

$stmt = $conn->prepare("INSERT INTO todos(todo) VALUES (?)");
$stmt -> bind_param('s', $dataInput); //不確定這邊的值是不是不可以直接填0

//在原本的留言板的作法
// 當parent_id的值是0的時候代表是主留言
// 當parent_id = 主留言id時是子留言
// 但是這是透過form表單傳送

//所以在select主留言時,要記得要加上where = parent_id =0
//子留言時,要加上where = parent_id =$id

//現在問題是is_Completed這個值要怎麼處理? 之前是透過form表單來直接給值, 現在是??

if($stmt -> execute()){
    $last_id = $conn->insert_id;
    echo json_encode(array(
            "result" => 'success',
            "id" => $last_id,
            "dataInput" => $dataInput
        ));
    }else{
        echo json_encode(array(
                "result" => 'failed'
            ));
        }

?>