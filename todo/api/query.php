<?php

require_once('../conn.php');
$connection = $conn;

function addTodo(){
    global $connection;
    
    $content = $_POST['content'];

    $stmt = $connection->prepare("INSERT INTO todos(todo) VALUES (?)");
    $stmt -> bind_param('s', $content); 

    if($stmt -> execute()){
    $last_id = $connection->insert_id;
    echo json_encode(array(
            "result" => 'success',
            "id" => $last_id,
            "content" => $content,
        ));
    }else{
        echo json_encode(array(
                "result" => 'failed'
            ));
        }
}   

function deleteTodo($id){
    global $connection;

    $stmt=$connection->prepare("DELETE FROM todos WHERE id =?");
    $stmt->bind_param("i",$id);
    $stmt->execute();

    if($stmt->execute()){
        echo json_encode(array(
            'result' => 'success',
            'message' => 'successfully'
        ));
    }else{
        echo json_encode(array(
            'result' => 'failed',
            'message' => 'delete failed'
        ));
    }

}


function getAlltodo(){
    global $connection;
    $stmt=$connection->prepare("SELECT * FROM todos");
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
         while ($row = $result->fetch_assoc()) {
                  $response[] = $row; //這不知道是什麼語法＠＠
      }
        echo json_encode($response);
    }else{
        echo "0";
    }
}


 function getOnetodo($id){
     global $connection;
     $stmt=$connection->prepare("SELECT * FROM todos WHERE id = ?");
     $stmt -> bind_param('i', $id);
     $stmt->execute();

     $result = $stmt->get_result();

     if ($result->num_rows > 0) {
       while ($row = $result->fetch_assoc()) {
                $response[] = $row;
       }
       echo json_encode($response);
     }else{
         echo "0";
     }
 }

function finishTodo($id){
    global $connection;

    //$id = $_GET['id'];

    parse_str(file_get_contents("php://input"), $_PATCH);
    $state = $_PATCH['state'];
    $revise = $_PATCH['revise'];

    if (isset($revise)) {
      $sql = "UPDATE todos SET todo = ? WHERE id = ? ";
      $stmt = $connection->prepare($sql);
      $stmt->bind_param("si", $revise , $id);
    } else if (isset($state)) {
      $sql = "UPDATE todos SET `state` = ? WHERE id = ? ";
      $stmt = $connection->prepare($sql);
      $stmt->bind_param("si", $state, $id);
    }
    
    if ($stmt->execute()) {
      echo json_encode(array(
        'result' => 'success',
        'message' => '更新成功'
      ), JSON_UNESCAPED_UNICODE);
    } else {
      echo json_encode(array(
        'result' => 'failure',
        'message' => '更新失敗'
      ), JSON_UNESCAPED_UNICODE);
    }
  }


?>