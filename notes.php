
<?php
include_once('include/init.php');

if(isset($_POST['saveComment'])){
    saveThisComment($_POST['name'], $_POST['comment']);
    header('Location:?');
    exit;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Notes</title>
</head>
<body>
    <h2>Leave a comment</h2>
    <form action="">
        <label for="name">Name</label>
        <input type='text' name = 'name-content' id='name' value=''>
        <br>
        <br>
        <label for="comment">Comment</label>
        <input type='text' name = 'comments' id='comments' value=''>
        <br>
        <br>
        <input type='submit' value='Save and Submit'>

    </form>

</body>
</html>

<?php

function saveThisComment($name, $comment){
    dbQuery("
        INSERT INTO test(name,comment)
        VALUES('$name', '$comment')
    ");
    }

