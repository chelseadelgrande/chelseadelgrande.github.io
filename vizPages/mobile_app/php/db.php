<?php
$hostname= "129.2.24.226";
$username= "cdelgran";
$password= "user@db#1";
$dbname = "cdelgran";

$con= mysqli_connect($hostname,$username, $password, $dbname);

if(!$con)
    die("Database connection error".mysqli_error($con));
?>