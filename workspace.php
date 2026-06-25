<?php

    include('include/init.php');

    if(isset($_SESSION['userId'])){
        $thisUserArr = getUser($_SESSION['userId']);
        $firstName = $thisUserArr['userName'];
        echo "Hi".$firstName."welcome back to your account!";
        echo "<a href='start.php?reason=loggedOut' class='Button'>Log Out</a>";
    }else{
        header('Location: start.php');
    }
