<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include_once 'connection.php';
date_default_timezone_set('Asia/Kolkata'); 

if (!isset($_GET['humidity']) || !isset($_GET['temperature'])) {
    echo "Connection Failed";
    die();
}

$humidity = $_GET['humidity'];
$temperature = $_GET['temperature'];
$current_time_ist = date('Y-m-d H:i:s');
$SQL = "INSERT INTO `values` (`Value`, `Entity_ID`, `DateTime`) VALUES (?, ?, ?), (?, ?, ?);";

if ($stmt = $conn->prepare($SQL)) {
    $entity_id_temp = 1;
    $entity_id_humid = 2;

    $stmt->bind_param("disdis",
                      $temperature, $entity_id_temp, $current_time_ist,
                      $humidity, $entity_id_humid, $current_time_ist);

    if ($stmt->execute()) {
        echo "Done";
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
} else {
    echo "Error preparing statement: " . $conn->error;
}

$conn->close();
?>