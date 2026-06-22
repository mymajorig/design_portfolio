<?php
include('include/init.php');

try{
    $theCurrentDateTime = date('Y-m-d H:i:s');
    //echo JSON formatted data
    echo(json_encode(['date' => $theCurrentDateTime]));
    exit;
} catch (Throwable $e){
     echo(json_encode(['error' => 'unable to fetchdate or time']));
     exit;
}

