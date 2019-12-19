<?php
    require_once("./conn.php");

    $dataInput = $_POST['dataInput'];
    $id = $_POST['id'];

    $sql = "UPDATE todos SET todo = ? WHERE id =? "; 
    $stmt= $conn->prepare($sql);

    $stmt-> bind_param("ss", $dataInput, $id);

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