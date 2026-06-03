
<?php
    include('include/init.php');
    echoHeader("Projects Page");

    $projectsPostID = $_REQUEST['postId'];
    $projectsPostArray = getPost($projectsPostID);
    $title = $projectsPostArray['title'];
    $content = $projectsPostArray['content'];

    echo "
        <h1> $title <h1>
        <p> $content <p>
    "

?>
    <header>
        <a href="index.php">Back</a>
        <h1>Projects</h1>
    </header>
    <section class="body-area">
        <section class="info">
            <p>Hi everyone! My name is Phoebe Taylor. I am a sophomore at Washington University in St.Louis (WashU) where I am majoring in Computer Science with a double minor
                in Chinese and Human Computer Interation. I love to read, write, draw, and basically learn about all things art related. My favorite coding languages to work with are HTML, CSS, and a bit of react.
                I'm really excited to work with everyone this summer!
            </p>
        </section>
       

        <section class="images">
            <a href="https://www.figma.com/design/WJk7UqjA4CsqSYUiYH2Iiz/website-drafts?node-id=0-1&t=bX4LsBxww5fVQFrq-1">
                <h2>Book to Website</h2>
                <img src="images/invisible-cities.webp" alt="invisible-cities-pic" class="main-img">  <!-- invisibile cities pic -->
                <img src="https://creativepaint.com/cdn/shop/products/2076-60-dogsear_3d0bc9a5-68b3-4396-96d6-570172381a37_1600x.png?v=1617304306" alt="" class="color-image">
            </a>
            <a href="https://www.figma.com/design/LUoZRdjPnadZx1E9P01Pcy/WashUX-Project-Tracker---Querri?node-id=6001-162&t=Jk6PS7banmmf5qmn-1">
                <h2>Website Redesign: Querri</h2>
                <img src="images/querri-logo.jpeg" alt="querri-logo" class="main-img">
                <img src="https://preview.colorkit.co/color/ffb6c1.png?size=vertical-wallpaper&static=true" alt="" class="color-image">
            </a>
            <a href="https://www.figma.com/design/JdjXOVaz4084wDcf0MnAas/Pretus-WashUX-Project-Tracker?node-id=2021-2&t=LKJI27F4rKepKsXt-1">
                <h2>Website Redesign: Pretus</h2>
                <img src="images/pretus-logo.jpeg" alt="pretus-logo" class="main-img">
                <img src="https://www.colorpalettestore.com/cdn/shop/products/F8E3E8_1024x.png?v=1750858375" alt="" class="color-image">
            </a>
            <a href="http://localhost:5173/final-project-mymajorig/#/">
                <h2>SelfShuffle Project</h2>
                <img src="images/black-book.png" alt="black-book" class="main-img">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5waZ67StVOOJdCE1p-orC9lc0HtTWUMo73Q&s" alt="" class="color-image">
            </a>
        </section>
    </section>

<?php
    echoFooter();
?>