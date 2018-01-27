<?php 
//Send a generated image to the browser 
create_image(); 
exit(); 

function create_image() 
{ 
    $font = 'VT323.ttf';
    $txttop = $_GET['t'];
    $txttop_s = 24;
    $txtbot = 'by '.$_GET['b'];
    $txtbot_s = 18;

    $txttop_b = imagettfbbox($txttop_s, 0, $font, $txttop);
    $txtbot_b = imagettfbbox($txtbot_s, 0, $font, $txtbot);
    $use_b = $txttop_b;
    if(abs($txttop_b[4] - $txttop_b[0]) < abs($txtbot_b[4] - $txtbot_b[0])){
        $use_b = $txtbot_b;
    }

    $width = abs($use_b[4] - $use_b[0]) + 155;
    $height = 120;  

    $image = imagecreatetruecolor($width, $height);

    $blgrey = imagecolorallocate($image, 17, 17, 17);  
    $blpink = imagecolorallocate($image, 251, 1, 110);
    $bldpink = imagecolorallocate($image, 179, 0, 80); 
    $blblue = imagecolorallocate($image, 1, 62, 121);
    $blwhite = imagecolorallocate($image, 204, 204, 204);

    imagefilledellipse($image, 64, 62, 105, 105, $bldpink);
    imagefilledellipse($image, 60, 58, 105, 105, $blpink);

    $skinimg = imagecreatefrompng('https://bonkleaguebot.herokuapp.com/avatar.png?skinCode='.urlencode($_GET['skinCode']));
    imagecopymerge_alpha($image, $skinimg, 10, 8, 0, 0, imagesx($skinimg), imagesy($skinimg), 100);

    imagefilledrectangle($image, 127, 26, 142+abs($txttop_b[4] - $txttop_b[0]), 55, $blblue);
    imagettftext($image, $txttop_s, 0, 132, 50, $blpink, $font, $txttop);
    imagettftext($image, $txtbot_s, 0, 132, 76, $blwhite, $font, $txtbot);

    imagerectangle($image, 0, 0, $width-1, $height-1, $blpink);

    header("Content-Type: image/png"); 
    imagepng($image); 
    imagedestroy($image); 
}

function imagecopymerge_alpha($dst_im, $src_im, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h, $pct){ 
    // creating a cut resource 
    $cut = imagecreatetruecolor($src_w, $src_h); 

    // copying relevant section from background to the cut resource 
    imagecopy($cut, $dst_im, 0, 0, $dst_x, $dst_y, $src_w, $src_h); 
    
    // copying relevant section from watermark to the cut resource 
    imagecopy($cut, $src_im, 0, 0, $src_x, $src_y, $src_w, $src_h); 
    
    // insert cut resource to destination image 
    imagecopymerge($dst_im, $cut, $dst_x, $dst_y, 0, 0, $src_w, $src_h, $pct); 
} 