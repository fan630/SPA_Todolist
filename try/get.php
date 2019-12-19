<?php

require_once("./conn.php");

$stmt=$conn->prepare("SELECT * FROM todos");
$stmt->execute();
$result = $stmt->get_result();
$result->num_rows;
$row = $result -> fetch_assoc();

?>