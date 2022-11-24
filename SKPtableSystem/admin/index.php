<?php
    include_once 'includes/header.php';
    
    /******************************/
    /**** Initial kontaktpunkt ****/
    /******************************/

    $page = '';
    
    $page = (isset($_GET['page']))
            ? "pages/" . $_GET['page'] . '.php'
            : 'pages/frontpage.php';


    
    
    if (file_exists($page )) {
        include_once( $page );

    } else {
        // not found page
        include_once 'pages/404.php';

    }
    
    

    include_once 'includes/footer.php';