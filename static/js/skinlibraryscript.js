/*--------------------------------------
  
         `:+osssso/-
      `/ssssssssssss:
     .ssssssssssssssso
     ossssssssssssssss:         `/:
     sssssssssssssssss/       `/ss`
     /ssssssssssssssss-     .+sss:
      +ssssssssssssss:    -osssss`
       -+ssssssssss/`   -ossssss:
         `-:////:.   `:soossssss`
                   `/ss.   .sss:
                 `/ssso     oss
                .+ssssso/:/oss:
                   `-:+sssssss
                        `.:+o:
  
        Bonk Leagues Skin Library

            made by Finbae
       (and the Bonk Leagues team)

-----------------------------------------*/

//Initiate variables needed for the page
var step = 0;
var storeUn, storePw, userData;

//Initiate various misc. functions used in the code, self-explainitory
function errout(txt) {
    $('#errtxt').text(txt); //Show error text on login page when invalid information is provided
    $('#errtxt').css({ 'font-style': 'normal', 'color': 'red', 'font-size': '15px' });
    $('#instructions').slideDown();
    $('#button').text('Login!');
    $('#button').slideDown();
    step = 1;
}

function statusout(txt) {
    $('#statusbar').text(txt); //Show error text on status bar
    $('#statusbar').slideDown('fast');
    setTimeout(function () {
        $('#statusbar').slideUp('fast');
    }, 5000);
}

function getQueryVariable(variable, og) { //Used to extract variables from returned bonk.io info
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

//Define various functions used for cookies

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

//When the login button is clicked on the homepage
$('#button').click(function () {
    if (step == 0) { //On first click - show login inputs and change button appropriately
        $('#info').slideUp();
        $('#instructions').slideDown();
        $('#button').text('Login!');
        $('#button').css('font-size', '32px');
        $('#un').focus();
        step = 1;
    } else if (step == 1) { //On second click - verify login detail is correct and respond
        step = 2;
        //if ($('#un').val() && $('#pw').val()) { //If both boxes are not empty
        $('#instructions').slideUp();
        $('#button').text('Please wait...');
        storeUn = $('#un').val();
        storePw = $.md5($('#pw').val());
        $.ajax({ //Post to bonk servers with login information
            type: "POST",
            url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/account6.php",
            dataType: "text",
            data: {
                task: 1,
                username: storeUn,
                password: storePw
            }
        }).done(function (a) {
            userData = a;
            if (getQueryVariable('code', userData) == "0") { //If response is valid, show next screen and get info
                if ($('#rm').is(':checked')) {
                    setCookie('rmUn', storeUn, 30);
                    setCookie('rmPw', storePw, 30);
                }

                statusout('Logged in!');

                $('#button').slideUp();
                $('#x').slideDown();

                gtag('event', 'login', { method: 'Login button - Skin Library' });
            } else { errout('Invalid login details/a network error occured.'); } //Show error when nessicary
        }).fail(function (e) { errout('Network error while connecting to bonk.io.'); }); //Error fallback
    }
});

function doRmLogin() {
    storeUn = getCookie('rmUn');
    storePw = getCookie('rmPw');
    statusout('Logging in with \'Remember Me\' data...');
    $('#info').slideUp();
    $('#button').hide();
    $('#instructions').slideUp();

    $.ajax({ //Post to bonk servers with login information
        type: "POST",
        url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/account6.php",
        dataType: "text",
        data: {
            task: 1,
            username: storeUn,
            password: storePw
        }
    })
        .done(function (a) {
            userData = a;
            if (getQueryVariable('code', userData) == "0") { //If response is valid, show next screen and get info
                statusout('Logged in!');
                $('#button').slideUp();
                $('#x').slideDown();

                gtag('event', 'login', { method : 'Remember me - Skin Library' });
            } else { errout('Failed to login with \'Remember Me\' data, please login manually.'); } //Show error when nessicary
        })
        .fail(function (e) { errout('Failed to login with \'Remember Me\' data, please login manually.'); }); //Error fallback
}

if (getCookie('rmPw') != null) { //else if, check for remember me data
    doRmLogin();
}

//enter to submit thingies
$("#un,#pw").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#button").click();
    }
});