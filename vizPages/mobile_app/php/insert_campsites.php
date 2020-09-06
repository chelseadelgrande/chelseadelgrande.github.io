<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 1000");
//make php script return JSON data
header("content-type: application/json; charset=utf-8");
//include db to connect to mysql
require_once("db.php");


$info = array();
$error_code = null;
$desc = "";


$tent = $_POST["tent"];
$chair = $_POST["chair"];
$hammock = $_POST["hammock"];
$warmsleeping = $_POST ["warmsleeping"];
$coldsleeping = $_POST ["coldsleeping"];
$sleepingpad = $_POST ["sleepingpad"];
$stove = $_POST ["stove"];
$stovekit = $_POST ["stovekit"];
$poles = $_POST ["poles"];
$largepack = $_POST ["largepack"];
$medpack = $_POST ["medpack"];
$smallpack = $_POST ["smallpack"];
$delivery = $_POST["delivery"]; 
$ship = $_POST["ship"];
$address = $_POST["address"];
$state = $_POST["state"];
$zip = $_POST["zip"];
$campsites = $_POST["campsites"];
$meetDate = $_POST["meetDate"];

echo ($tent);
echo ($chair);
echo ($hammock);
echo ($warmsleeping);
echo ($coldsleeping);
echo ($sleepingpad);
echo ($stove);
echo ($stovekit);
echo ($poles);
echo ($largepack);
echo ($medpack);
echo ($smallpack);
echo ($delivery);
echo ($address);
echo ($state);
echo ($zip);
echo ($campsites);
echo ($meetDate);
//if($delivery ==="ship")
  //  $delivery=$ship;

 //   if(!empty($delivery)&&is_string($delivery))&&!empty($address)&&is_string($address)
//isset($state)&&isset($zip){

   /* $result=mysqli_query($con, $sql);

    if($result){
        $error_code=0;
        $desc=$desc."<p>Error Description ".mysqli_error($con)."</p>";
    }
    else{
        $error_code=1;
        $desc=$desc."<p>You did something wrong :(</p>";
        $desc=$desc."<p>Error Description! ".mysqli_error($con)."</p>";
    }

//else{
  //  $error_code = 1;
   // $desc=$desc."<p>Sorry!</p>";
   // $desc=$desc."<p>You didn't fill out the form completely.<a href='report_collision.html'>Try again?</a></p>";
//}

$info["code"]=$error_code;
$info["desc"]=$desc;

echo json_encode($info);*/
?>