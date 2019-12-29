
<?php
    //資料庫連線
    $servername = 'localhost';
    $username = 'pmauser';
    $password = 'norriswu266';
    $dbname = 'todo';

    //php提供的語法,成功連線的話是不會輸出錯誤訊息
    $conn = new mysqli($servername, $username, $password, $dbname);

    $conn->query("SET NAMES UTF8");
    $conn->query("SET time_zone = '+08:00'");

    if($conn->connect_error){
        die("connection fail: " .$conn->connect_error);
    }
?>

