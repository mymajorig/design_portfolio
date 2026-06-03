<?php
    include('include/init.php');
    $postsArray = getPosts();
    echo"
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Personal Website</title>
        <link rel='stylesheet' href='personal.css'>
    </head>
    <body>
        <header>
            <div class='container'>
                <div class='blob'></div>
            </div>

            <div class='text'>
                <h1>Phoebe Taylor</h1>
                <div class='links'>
    ";
        foreach($postsArray as $individualPost){
            $title = $individualPost['title'];
            $postID = $individualPost['postID'];
            echo"
            <a href='view_post.php?postId=$postID'>$title</a> 
            ";
        }

    echo"
                </div>
                </div>
            </header>
        </body>
        </html>
    "
?>