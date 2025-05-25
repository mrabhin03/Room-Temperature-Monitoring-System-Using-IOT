<?php
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "home");

if ($mysqli->connect_error) {
    echo json_encode(["error" => "DB Connection failed"]);
    exit();
}
if($_GET['Mode']==0){
    $result = $mysqli->query("SELECT * FROM `values` WHERE Entity_ID=1 ORDER BY DateTime DESC LIMIT 1");

    if ($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "No data found"]);
    }
}else if($_GET['Mode']==1){
    $result = $mysqli->query("SELECT * FROM `values` WHERE Entity_ID=1 ORDER BY DateTime");
    $temperatures = [];
    $time = [];
    $CalculateValues=[];
    $TotalTimes=[];

    while ($row = $result->fetch_assoc()) {
        $temperatures[] = $row['Value'];
        $time[] = $row['DateTime'];
        $originalDateTime = $row['DateTime'];
        $formatted = date("Y-m-d&H", strtotime($originalDateTime));
        if (!isset($CalculateValues[$formatted])) {
            $CalculateValues[$formatted] = 0;
        }
        if (!isset($TotalTimes[$formatted])) {
            $TotalTimes[$formatted] = 0;
        }
        $TotalTimes[$formatted]++;
        $CalculateValues[$formatted]+=$row['Value'];
    }
    // print_r($CalculateValues);
    // print_r($TotalTimes);
    $Avg=[];
    $TheTime=[];
    $Date=[];
    foreach( array_keys($CalculateValues) as $data){
        $Avg[]=floor($CalculateValues[$data]/$TotalTimes[$data]);
        $lettime=explode("&",$data)[1];
        $datevb=explode("&",$data)[0];
        $Date[]=$datevb;
        $TheTime[]=$lettime."(".explode("-",$datevb)[2].")";
    }
    // print_r($Date);
    // print_r($TheTime);

    echo json_encode([
        "temperature" => $Avg,
        "time" => $TheTime,
        "date" => $Date
    ]);
}
?>
