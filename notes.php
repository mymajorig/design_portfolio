
<?php
include_once('include/init.php');

if(isset($_POST['saveComment'])){
    saveThisComment($_POST['name'], $_POST['comment']);
    header('Location:?');
    exit;
}

?>

<form action='' method='post'>
    <h2>Leave a comment</h2>
    Name: <input type='text' name='name' />
    <br/><br/>

    Comment: <textarea name='comment' style='width:400px; height:100px;'></textarea>
    <br/><br/>
    <input type='submit' name='saveComment' />

</form>

<?php
function saveThisComment($name, $comment){
    dbQuery("
        INSERT INTO test(name,comment)
        VALUES('$name', '$comment')
    "); 
    }

