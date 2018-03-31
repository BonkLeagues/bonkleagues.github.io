$('#un').focus();
$('#check').click(function(){
    if(!$(this).hasClass('disabled')){ //Make sure that the button is not disabled
        if($('#un').val()){ //If username box is not empty
            $('#un').addClass('disabled');
            $('#un').prop('disabled', true);
            $('#check').addClass('disabled');
            $('#check').text('Please wait...');
            
            $.ajax({ //Post to bonk servers with username information to get case-insensitive value
                type: "POST",
                url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/account6.php",
                dataType: "text",
                data: {
                    friendtoadd: $('#un').val().split(',')[0],
                    ignorethis: 69696,
                    basePasswordString: 77564898,
                    task: 7,
                    username: '5',
                    password: 'e4da3b7fbbce2345d7772b0674a318d5'
                }})
            .done(function(meme){
                if(getQueryVariable('code',meme) == '0'){ //If response is valid, continue and get name
                    $.ajax({ //Post to bonk servers with case-insentive name to get information
                        type: "POST",
                        url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/verifyxp.php",
                        dataType: "text",
                        data: {
                            usernamelist:getQueryVariable('friendname',meme),
                            ignorethis: 69696,
                            basePasswordString: 77564898
                        }})
                    .done(function(stuff){
                        if(getQueryVariable('xp0',stuff) != -1){ //If response is valid, show next screen and get info
                            var xp = parseInt(getQueryVariable('xp0',stuff)); //Calculations for the XP self-explanitory mainly
                            var lvl = Math.ceil(Math.sqrt(xp)/10);
                            var nextlvl = Math.pow(lvl*10, 2);
                            var lastlvl = Math.pow((lvl - 1)*10, 2);
                            var curthislvl = xp - lastlvl;
                            var maxthislvl = nextlvl - lastlvl;
                            var percent = ((curthislvl / maxthislvl) * 100).toFixed(1) + '%';
        
                            $('.s-username').text(getQueryVariable('username0',stuff)); //Input values
                            $('.s-xp').text(xp.toLocaleString());
                            $('.s-lvl').text(lvl.toLocaleString());
                            $('.s-clvlxp').text(curthislvl.toLocaleString());
                            $('.s-clvlnxp').text(maxthislvl.toLocaleString());
                            $('.s-percent').text(percent);
                            $('#innerprogress').css('width',percent);
        
                            $('#startpage').slideUp(); //Show and hide screen
                            $('#nextpage').slideDown();
                        } else { errout('Could not find this user (stage 2).'); } //Show error when nessicary
                    })
                    .fail(function(e){ errout('Login error at stage 2 ['+e.status+']: '+e.statusText); }); //Error fallback
                } else { errout('Could not find this user (stage 1).'); } //Show error when nessicary
            })
            .fail(function(e){ errout('Login error at stage 1 ['+e.status+']: '+e.statusText); }); //Error fallback
        } else { errout('The username box is blank.'); } //Show error when nessicary
    }
});

function errout(txt){
    $('#errtxt').text(txt); //Show error text on login page when invalid information is provided
    $('#errtxt').css({'font-style':'normal','color':'red','font-size':'15px'});
    $('#un').show();
    $('#un').removeClass('disabled');
    $('#check').removeClass('disabled');
    $('#un').prop('disabled', false);
    $('#check').text('Check XP');
    step = 1;
}

function getQueryVariable(variable,og) { //Used to extract variables from returned bonk.io info
    var query = og;
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

//Enter to submit thingies
$("#un").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#check").click();
    }
});