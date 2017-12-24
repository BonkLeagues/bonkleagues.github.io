var step = 0;
$('#button').click(function(){
    $('nav a').removeClass('sel');
    $('#plybut').addClass('sel');

    $('#info').slideUp();
    $('#instructions').slideDown();
    $('#button').text('I\'m ready');
    $('#instskip').fadeIn();
    instructions();
});
$('#plybut').click(function(){
    $('nav a').removeClass('sel');
    $('#plybut').addClass('sel');

    $('#info').slideUp();
    $('#instructions').slideDown();
    $('#button').text('I\'m ready');
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
            $('#button').text('Next Step');
            break;
        case 2:
            $('#insthead').text('Instructions - Step 2/4');
            $('#steptxt1').html('2. On the website that just opened, click \'Edit locations...\', and then \'Add location...\':');
            $('#steptxt2').html('<i>If you don\'t see the \'Edit locations...\' button, click the \'Get Adobe Flash Player\' button first, then try.</i><br/><br/><img src="https://i.imgur.com/Fmhhs1J.png">');
            $('#button').text('Next Step');
            break;
        case 3:
            $('#insthead').text('Instructions - Step 3/4');
            $('#steptxt1').html('3. In the text box below \'Trust this location:\', paste the following text:');
            $('#steptxt2').html('https://bonkleagues.github.io/swf/latest.swf<br/><br/><img src="https://i.imgur.com/ql8sdDI.png">');
            $('#button').text('Next Step');
            break;
        case 4:
            $('#insthead').text('Instructions - Step 4/4');
            $('#steptxt1').html('4. Now, simply just press the \'Confirm\' button on the other page!');
            $('#steptxt2').html('Once you have done that, you are now ready to play Bonk Leagues!<br/><br/><img src="https://i.imgur.com/UiwVKbR.png">');
            $('#button').text('⇒ Play! ⇐');
            break;
        case 5:
            $('#instructions').slideUp();
            $('#game').slideDown();
            $('#button').text('Fullscreen');
            $('#instskip').hide();
            break;
        case 6:
            $('header').css({position: 'absolute', top: '0px', left: '0px'});
            $('#instructions,#instskip,header br,header h1,header nav').hide();
            $('#button').slideUp();
            $('#gamecont').css({width:'100%', height:'100%', border: '0', position: 'absolute', top: '0px', left: '0px'});
            $('#gamecont').css('box-shadow','0');
            $('body').css('overflow','hidden')
            $('header img').css({margin:'0'});
            $('header').css({width:'130px', padding:'30px 0'});
            break;
    }
    step++;
}