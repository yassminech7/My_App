<?php
if (isset($_FILES['file'])){
    $file = $_FILES['file'];
    print_r($file);
    $fileName = $_FILES['file']['name'];
    $fileTmpName = $_FILES['file']['tmp_name'];
    $fileSize = $_FILES['file']['size'];
    $fileError = $_FILES['file']['error'];
    $fileType = $_FILES['file']['type'];

    $fileExt = explode('.', $fileName);
    $fileActualExt = strtolower(end($fileExt));
    $allowed = array ('jpg' , 'jpeg' , 'png' , 'pdf');

    if(in_array($fileActualExt, $allowed)){
        if($fileError===0){
            if($fileSize<10000000000){
                $fileNameNew = uniqid('',true);
                $fileDestination = 'files/'.$fileNameNew;
                move_uploaded_file($fileTmpName, $fileDestination);
                header("Location: index.php?uploadsuccess");
            }else{
                echo "File is too big";
            }

        }else{
            echo "There was an error uploading your file";
        }

    }else{
        echo "You cannot upload this file";
    }

}
  ?> 
