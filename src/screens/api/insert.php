<?php
$CN=mysqli_connect("localhost","root","");
$BD=mysqli_select_db($CN,"reactnativeapp");

$first_name=$_POST['first_name'];
$last_name=$_POST['last_name'];
$number=$_POST['number'];
$email=$_POST['email'];
$password=$_POST['password'];
$repeatPassword=$_POST['repeatPassword'];

$IQ="insert into authentification(first_name,last_name,number,email,password,repeatPassword) values('$first_name','$last_name','$number','$email','$password','$repeatPassword')";

$R=mysqli_query($CN,$IQ);

if($R){
    $Message="You are successfully signed up.";
}else{
    $Message="Error,Please try latter.";
}
echo ($Message);
?>