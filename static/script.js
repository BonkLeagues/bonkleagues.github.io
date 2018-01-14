var step = 0;
$('#buttonspec').click(function(){
    $('nav a').removeClass('sel');
    $('#plybut').addClass('sel');

    $('#info').slideUp();
    $('#instructions').slideDown();
    $('#buttonspec').text('I\'m ready');
    $('#instskip').fadeIn();
    instructions();
});
$('#plybut').click(function(){
    $('nav a').removeClass('sel');
    $('#plybut').addClass('sel');

    $('#info').slideUp();
    $('#instructions').slideDown();
    $('#buttonspec').text('I\'m ready');
    $('#instskip').fadeIn();
});
$('#instskip').click(function(){
    step = 5;
    instructions();
});
function instructions(){
    switch(step){
        case 1:
            $('#insthead').text('Instructions - Step 1/4');
            $('#steptxt1').html('1. Click to visit the following website, then come back here and press \'Next Step\':');
            $('#steptxt2').html('<a href="https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html" target="_blank">https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html</a>');
            $('#buttonspec').text('Next Step');
            break;
        case 2:
            $('#insthead').text('Instructions - Step 2/4');
            $('#steptxt1').html('2. On the website that just opened, click \'Edit locations...\', and then \'Add location...\':');
            $('#steptxt2').html('<i>If you don\'t see the \'Edit locations...\' button, click the \'Get Adobe Flash Player\' button first, then try.</i><br/><br/><img src="https://i.imgur.com/Fmhhs1J.png">');
            $('#buttonspec').text('Next Step');
            break;
        case 3:
            $('#insthead').text('Instructions - Step 3/4');
            $('#steptxt1').html('3. In the text box below \'Trust this location:\', you need to write the following text (depending on your computer type):');
            $('#steptxt2').html('For Windows, put this in the box: C:\\<br/>For Chromebooks, put this in the box: file:///home/<br/><br/><img src="https://i.imgur.com/0tZUfvQ.png">');
            $('#buttonspec').text('Next Step');
            break;
        case 4:
            $('#insthead').text('Instructions - Step 4/4');
            $('#steptxt1').html('4. Now, simply just press the \'Confirm\' button on the other page!');
            $('#steptxt2').html('Once you have done that, you are now ready to download Bonk Leagues!<br/><br/><img src="https://i.imgur.com/UiwVKbR.png">');
            $('#buttonspec').text('Download!');
            break;
        case 5:
            window.open('release/Bonk_Leagues.zip');
            $('#insthead').text('Thank you for downloading Bonk Leagues');
            $('#steptxt1').html('To play it, you need to unzip the downloaded ZIP file, and run \'Bonk Leagues Client.html\'');
            $('#steptxt2').html('Make sure that \'Bonk Leagues Client.html\' is in the same folder as the \'Bonk Client.swf\' file!');
            $('#buttonspec').hide();
            break;
    }
    step++;
}