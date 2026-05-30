<!-- this is to put the process below into one place so I won't have to code it out seperately for each of my web pages -->

<?php
    include('include/init.php');
    include('include/helper_functions.php');
    $postID = $_REQUEST["postId"]; //'request' finds the key "post Id" for this specific page and returns the post id value "note: the name of this key is based on whats in my abt URL on index page"
    // then call "getPost" with the post id that i just got from request array
    $postArray = getPost($postID); //connects to the array we made using getPosts()
    // var_dump($postArray);
    // debugOutput($postArray);
    $postTitle = $postArray['title'];
    $postContent = $postArray['content'];
    echoHeader($postTitle);

     echo"
        <a href='index.php'>Back</a>
        <h1 class='title'>$postTitle</h1>
    "
?>
    
    </header>
    <section class="body-area">
        <section class="info">
            <?php
                echo"
                <p>$postContent<p>
                "
            ?>
        </section>

        <section class="images">
            <a href="https://www.goodreads.com/">
                <h2>Reading</h2>
                <img src="images/blue-book.png" alt="book" class="main-img">
                <img src="https://creativepaint.com/cdn/shop/products/2076-60-dogsear_3d0bc9a5-68b3-4396-96d6-570172381a37_1600x.png?v=1617304306" alt="" class="color-image">
            </a>
            <a href="https://youtu.be/-BR-B0kTmSI?si=aWdvVY6L3wD-3LyT">
                <h2>Dancing</h2>
                <img src="images/dance.jpeg" alt="dance" class="main-img">
                <img src="https://preview.colorkit.co/color/ffb6c1.png?size=vertical-wallpaper&static=true" alt="" class="color-image">
            </a>
            <a href="https://www.youtube.com/watch?v=KqMOKCRgvD8">
                <h2>Guitar</h2>
                <img src="images/guitar.png" alt="" class="main-img">
                <img src="https://www.colorpalettestore.com/cdn/shop/products/F8E3E8_1024x.png?v=1750858375" alt="" class="color-image">
            </a>
            <a href="https://grandbaby-cakes.com/sweet-potato-cinnamon-rolls/">
                <h2>Cooking/Baking</h2>
                <img src="images/cake.png" alt="" class="main-img">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5waZ67StVOOJdCE1p-orC9lc0HtTWUMo73Q&s" alt="" class="color-image">
            </a>
        </section>
    </section>
    
<?php
    include('include/init.php');
    echoFooter();
?>