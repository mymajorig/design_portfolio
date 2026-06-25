<?php
    include("include/init.php");
    debugOutput($_SESSION);

    if(isset($_REQUEST['reason']) && $_REQUEST['reason']=="loggedOut"){
        $_SESSION = [];
    }

    if(isset($_REQUEST['email']) && empty($_REQUEST['email'])){
        if(isset($_REQUEST['password']) && empty($_REQUEST['password'])){
            //checking if the inputed email and password combo actually exists
            $user = validateUser($_REQUEST['email'], $_REQUEST['password']);
            
            if(!empty($user)&& $user['userId']){ //if user is validtated and has a user id
                //log user in
                $_SESSION['userId'] = $user['userId'];

                 //be able to be logged in and go to the workspace, redirect to index page
                 header('Location: workspace.php');
            }
            else{
                echo "Incorrect email or password";
            }
        }
        else{
            echo "Please enter a valid password";
        }
    }
    else{
        echo "Please enter a valid email";
    }
?>

<form action="" style = "padding: 1rem; color: brown; display: flex; flex-direction: column; width: 25%;">
    <label for="email">Email:</label>
    <input type="text">

    <label for="password">Password:</label>
    <input type="text">
    <input type = "submit" class = "Button" value = "Login">
</form>