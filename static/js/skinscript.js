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
  
        Bonk Leagues Skin Manager

            made by Finbae
       (and the Bonk Leagues team)

-----------------------------------------*/

/*--------------------------------------------------------------
    Stage 1:
    Initiating variabled and setting default settings
--------------------------------------------------------------*/

//Initiate variables needed for the page
var step = 0;
var stuff, skinchoice, skntoUse, skni, data, storeUn, storePw;
var skindata = [];
var smpfiletouse;
var speccred = false;
var pgnum = 1;
var curTab = 'all';
var drawnTabs = [];
const prevgenurl = 'http://sebweb.co.uk/blbackend/prevgen.php';

var devOfflineTestingMode = false;

//Set up AJAX to not cache the sample skins
$.ajaxSetup({ cache: false });

/*--------------------------------------------------------------
    Stage 2:
    Defining non-specific functions used later in the code
--------------------------------------------------------------*/

//Initiate various misc. functions used in the code, self-explainitory
function errout(txt) {
    $('#errtxt').text(txt); //Show error text on login page when invalid information is provided
    $('#errtxt').css({ 'font-style': 'normal', 'color': 'red', 'font-size': '15px' });
    $('#instructions').slideDown();
    $('#button').text('Login!');
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

function escapeHtml(unsafe) { //Escape unsafe HTML in text
    return unsafe
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function shuffle(array) { //Shuffle an array (used for sample skins)
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function download(content, fileName, contentType) { //BLOB download function
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function outputCorruptSkins() { //Output corrupt skin data error message
    $('#loggedin').html('Oops, it seems like your saved skin data has been corrupted.<br/><br/>Try reloading the page or contacting us in our support server, and we\'ll try lend a hand.<br/><br/>Or, if the issue still isn\'t fixed, <br/><a class="deleteallbtn" style="text-decoration:underline;cursor:pointer">reset your skin data here</a> to fix it entirely.');
}

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

function isJsonStrValid(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//Define various functions used for colour algorithms

function hTR(a) { a = "0x" + a.substr(1); return [+a >> 16, +a >> 8 & 255, +a & 255] }
function shadeColor(color, percent) {
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

function blendColors(c0, c1, p) {
    var f = parseInt(c0.slice(1), 16), t = parseInt(c1.slice(1), 16), R1 = f >> 16, G1 = f >> 8 & 0x00FF, B1 = f & 0x0000FF, R2 = t >> 16, G2 = t >> 8 & 0x00FF, B2 = t & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1);
}

function darkLightHex(c) {
    var c = c.substring(1);
    var rgb = parseInt(c, 16);
    var r = (rgb >> 16) & 0xff;
    var g = (rgb >> 8) & 0xff;
    var b = (rgb >> 0) & 0xff;
    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (luma < 60) {
        return '#eeeeee';
    } else {
        return '#111111';
    }
}

//Define various functions used for cookies

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

/*--------------------------------------------------------------
    Stage 3:
    Defining Skin Manager-specific functions used later in the code
--------------------------------------------------------------*/
//Initiate manager-specific functions, refreshStuff() for refreshing avatar data
function refreshStuff(_callback) {
    $.ajax({ //Post to bonk servers with login details
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
            if (getQueryVariable('code', a) == "0") { //If successful, set data to response data
                stuff = a;
                console.log(stuff);
            }
            $('#bonkslotcont').html('');
            var tmpActiveCode = getQueryVariable('activeavatar', a);
            if(tmpActiveCode == 0){ tmpActiveCode = 1; }
            if(typeof(_callback) != 'function'){
                for(avI = 1; avI <= 5; avI++){
                    var tmpCodeThing = encodeURIComponent(getQueryVariable('avatar'+avI, a));
                    if(tmpCodeThing){
                        var baseAvatarGen = 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + tmpCodeThing;
                        var otherStuff = '';
                        if(tmpActiveCode == avI){
                            otherStuff = '<br/><i>(Currently active)</i>';
                        }
                        $('#bonkslotcont').append(`<div class="choice bonkslotchoice" data-choice="avatar${avI}"><img src="${baseAvatarGen}" style="margin-right:15px" width="42"><div><b>Skin slot ${avI}</b>${otherStuff}</div></div>`);
                    }
                }
            } else {
                _callback(tmpActiveCode);
            }
        });
}

//... and refreshSkins() for refreshing skin slots
function refreshSkins(tabToUse) {
    if(!tabToUse){
        tabToUse = 'all';
    }
    curTab = tabToUse;

    if (localStorage.getItem("skindata") === null) { //If the user has no saved skins, initiate localstorage
        localStorage.setItem("skindata", JSON.stringify(skindata));
    } else { //Otherwise get the localstorage value
        skindata = JSON.parse(localStorage.getItem("skindata"));
    }

    $('.skincont').html('');
    if (skindata.length > 0) { //If skindata is set, iterate over items, creating skin slots
        $('#txt-skin1').hide();
        //('.txt-skin2').show();
        $('#tabCont').html('');
        drawnTabs = [];
        try{
            $.each(skindata, function (index, item) {
                var toAddSkin = false;

                if(tabToUse == 'all'){
                    $('.tabBtn').removeClass('tabSel');
                    $('#tabAll').addClass('tabSel');
                    toAddSkin = true;
                }
                if(item.tag){
                    $.each(item.tag, function(index2, tag) { //Loop through tag array
                        if(tag == tabToUse){ toAddSkin = true; }
                        if($.inArray(tag,drawnTabs) == -1){
                            if(tag == tabToUse){
                                $('#tabCont').append(`<span class="parthead tabBtn tabSel" id="tab${index2}">${tag}</span>`);
                            } else {
                                $('#tabCont').append(`<span class="parthead tabBtn" id="tab${index2}">${tag}</span>`);
                            }
                            drawnTabs.push(tag);
                        }
                    });
                }

                if(toAddSkin){
                    console.log(item);
                    $('.skincont').append(`<div class="skin" id="${index}">
                        <div class="container">
                            <div class="img">
                                <div class="avatar" data-open="${index}" style="background:url(https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=${encodeURIComponent(item.avatar)}), #111;background-size:100%;"></div>
                            </div>
                            <h1>${item.name}</h1>
                        </div>
                        <div class="buttons"><button class="upload-btn" data-skin="${index}">APPLY</button><button class="edit-btn" data-skin="${index}">EDIT</button><button class="share-btn" data-skin="${index}">SHARE</button></div>
                        <img class="sknframe sknframecus sknframebig" data-open="${index}" type="image/svg+xml" src="https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=${encodeURIComponent(item.avatar)}">
                    </div>`);
                    if (item.col) {
                        var colToUse = item.col;
                        $('.skin#' + index).css({
                            'background': blendColors(colToUse, '#000000', 0),
                            'box-shadow': '5px 5px 0px 0px ' + blendColors(colToUse, '#000000', 0.3),
                            'color': darkLightHex(colToUse)
                        });
                        $('.skin#' + index + ' .container .img').css({
                            'border': '3px solid ' + blendColors(colToUse, '#000000', 0.3)
                        });
                        $('.skin#' + index + ' .icon').css({
                            'border': '3px solid ' + blendColors(colToUse, '#000000', 0.3)
                        });
                        $('.skin#' + index + ' .buttons button').css({
                            'background': blendColors(colToUse, '#000000', 0.3),
                            'color': darkLightHex(colToUse)
                        });
                    }
                } else { console.log('skipped this skin'); }
            });
        } catch (e) {
            console.error(e);
            outputCorruptSkins();
        }
    } else { //Otherwise just show the no saved skins message.
        //$('.txt-skin2').hide();
        $('#txt-skin1').show();
    }
}

//... and getSamples() for getting a certain page of sample skins
function getSamples(page) {
    $('.pg').removeClass('disabled'); //Remove disabled class from the page buttons (allowing clicking again)
    $('#smpskincont').html('');
    $.getJSON("static/data/sample-skins/" + smpfiletouse, function (res) { //Get the sample skins json file
        if (data == null) { data = shuffle(res); } //If data from earlier is not already shuffled, shuffle it
        console.log(data);
        var totpages = Math.ceil(data.length / 8); //Calculate total pages

        if (page > totpages) { page = totpages; } //If there above or below max and min pages, fix that.
        if (page < 1) { page = 1; }

        pgnum = page; //Set the page number to the retrieved page value

        if (page == 1) { $('#pgprev').addClass('disabled'); } //If on first page, disable previous page button, same goes for last page
        if (page == totpages) { $('#pgnext').addClass('disabled'); }
        $('#pgid').text(page + '/' + totpages);

        $.each(data.slice(8 * (page - 1), 8 * page), function (i, smskin) { //Iterate over all sample skins in chosen page range, creating a sample skin div.
            $('#smpskincont').append(`<div class="sampleskin" data-smskin="${i + 8 * (page - 1)}"><img class="sknframe" src="https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=${encodeURIComponent(smskin.avatar)}"><div><b>${smskin.name}</b><br/><i>by <b>${smskin.by}</b></i></div></div>`);
        });
    });
}

function getSampleCats() {
    $('#smpskincatcont').html('');
    $.getJSON("static/data/categories.json", function (res) { //Get the sample skins json categories file
        console.log(res);
        $.each(res, function (i, smskin) { //Iterate over all sample skin categories in the file.
            $('#smpskincatcont').append(`<div class="choice smpskincatchoice" data-choice="${smskin.id}" data-nicename="${smskin.name}"><img src="static/img/icons/sample/${smskin.icon}" style="margin-right:15px" width="42"><div><b>${smskin.name}</b> Skins<br/><i>${smskin.count} skins in this category</i></div></div>`);
        });
    });
}

function doRmLogin(nextLoc){
    storeUn = getCookie('rmUn');
    storePw = getCookie('rmPw');
    statusout('Logging in with \'Remember Me\' data...');
    $('#info').slideUp();
    $('#button').hide();
    $('#instructions').slideUp();

    if(devOfflineTestingMode){
        stuff = 'code=0&retreivedusername=DEV OFFLINE MODE&dbid=1';
        statusout('Logged in using development offline mode!');
        $('.s-name').text('DEV OFFLINE MODE');
        refreshSkins(); //Refresh skinslot data
        $('#button').slideUp();
        $('#' + nextLoc).slideDown();
        return;
    }

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
        stuff = a;
        if (getQueryVariable('code', stuff) == "0") { //If response is valid, show next screen and get info
            statusout('Logged in!');
            $('.s-name').text(getQueryVariable('retreivedusername', stuff));
            refreshSkins(); //Refresh skinslot data
            $('#button').slideUp();
            $('#' + nextLoc).slideDown();
        } else { errout('Failed to login with \'Remember Me\' data, please login manually.'); } //Show error when nessicary
    })
    .fail(function (e) { errout('Failed to login with \'Remember Me\' data, please login manually.'); }); //Error fallback
}

/*--------------------------------------------------------------
    Stage 4:
    Create jQuery and pageload events
--------------------------------------------------------------*/

//Detect if on a shared skin link (seperated with # and |)
var shareddata;
if (window.location.hash) {
    shareddata = window.location.hash.substring(1);
    if (shareddata.split('|')[2]) { //If there is a valid shared skin hash in URL
        shareddata = shareddata.split('|');
        $('#button').hide();
        $('.sharedname').text(decodeURIComponent(shareddata[0])); //Show metadata of the skin 
        $('.sharedby').text(decodeURIComponent(shareddata[1]));
        $('#sharedimg').attr('src', `${prevgenurl}?t=${shareddata[0]}&b=${shareddata[1]}&skinCode=${shareddata[2]}`); //Render shared image of the skin
        $('#shared').slideDown();
    }
} else if(getCookie('rmPw') != null){ //else if, check for remember me data
    doRmLogin('loggedin');
}

//Button and other clicking functions now!

//When yes on shared dialog is clicked
$('#sharedyes').click(function () { //Make sure that when logged in, it will show the add skin page, with appropriate data.
    $('#button').attr('data-next', 'addskin2');
    speccred = decodeURIComponent(shareddata[1]);
    skinchoice = decodeURIComponent(shareddata[2]);
    $('#sknframe2').attr('src', 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + shareddata[2]);
    $('#sknframe4').attr('src', 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + shareddata[2]);
    $('#skn').val(decodeURIComponent(shareddata[0]));
    $('#shared').slideUp();
    $('#button').slideDown();

    if(getCookie('rmPw') != null){
        doRmLogin('addskin2');
    }
});

//When no on shared dialog is clicked
$('#sharedno').click(function () {
    $('#shared').slideUp();
    $('#button').slideDown();

    if(getCookie('rmPw') != null){
        doRmLogin('loggedin');
    }
});

//When next page on sample skins is clicked
$('#pgnext').click(function () {
    if (!$(this).hasClass('disabled')) {
        $('.pg').addClass('disabled');
        pgnum++;
        getSamples(pgnum); //Load saved skins for page number
    }
});

//When previous page on sample skins is clicked
$('#pgprev').click(function () {
    if (!$(this).hasClass('disabled')) {
        $('.pg').addClass('disabled');
        pgnum--;
        getSamples(pgnum); //Load saved skins for page number
    }
});

//When logout button clicked
$('#logout').click(function(){
    if(getCookie('rmPw') != null){ eraseCookie('rmUn'); eraseCookie('rmPw'); }
    window.location = "skins.html";
});

//When a sample skin on sample skins page is clicked
$(document).on("click", ".sampleskin", function () {
    speccred = data[parseInt($(this).data('smskin'))].by; //Make sure OG skin creator's credit is credited
    skinchoice = data[parseInt($(this).data('smskin'))].avatar;
    $('#smpskins').slideUp(); //Set the data required for adding skin
    $('#sknframe2').attr('src', 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + encodeURIComponent(skinchoice));
    $('#sknframe4').attr('src', 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + encodeURIComponent(skinchoice));
    $('#skn').val(data[parseInt($(this).data('smskin'))].name);
    $('#addskin2').slideDown();
    $('#skn')[0].selectionStart = 0;
    $('#skn')[0].selectionEnd = $('#skn').val().length;
    $('#skn').focus();
});

//When the edit button on a skin slot on logged in page is clicked
$(document).on("click", ".edit-btn", function () {
    skni = parseInt($(this).data('skin'));
    skntoUse = skindata[skni];
    var sknTagsTmp = [];
    $('#skne').val(skntoUse.name);
    if(skntoUse.col){
        $('#sslotcol')[0].jscolor.fromString(skntoUse.col);
    } else {
        $('#sslotcol')[0].jscolor.fromString('#FB016E');
    }
    if(skntoUse.tag){
        sknTagsTmp = skntoUse.tag;
    }
    $('#sknframe').attr('src', 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + encodeURIComponent(skntoUse.avatar));
    $('#sknframe3').attr('src', 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + encodeURIComponent(skntoUse.avatar));
    
    $("#skntags").tagit({
        autocomplete: {delay: 0},
        showAutocompleteOnFocus: true,
        allowSpaces: true,
        availableTags: drawnTabs
    });
    $("#skntags").tagit("removeAll");
    sknTagsTmp.forEach(function(element) {
        $("#skntags").tagit("createTag",element);
    });

    $('#loggedin').slideUp();
    $('#editskin').slideDown();
});


//When the share skin button on the skin slot is clicked
$(document).on("click", ".share-btn", function () {
    skni = parseInt($(this).data('skin'));
    skntoUse = skindata[skni];
    $('#loggedin').slideUp();
    var tmpname = encodeURIComponent(getQueryVariable('retreivedusername', stuff));
    if (skntoUse.cred) {
        tmpname = encodeURIComponent(skntoUse.cred);
    }
    $('#genskni-l').show();
    $('#genskni').hide();
    $('#sknshrlink').removeClass('disabled');
    $('#sknshrlink').text('Get Skin Sharing link (recommended)');
    //Generate a skin preview image for the data.
    $('#genskni').attr('src', `${prevgenurl}?t=${encodeURIComponent(skntoUse.name)}&b=${tmpname}&skinCode=${encodeURIComponent(skntoUse.avatar)}`);
    $('#shareskin').slideDown();
});

//When the upload button on a skin slot on logged in page is clicked
$(document).on("click", ".upload-btn", function () {
    skni = parseInt($(this).data('skin'));
    skntoUse = skindata[skni];
    if (!$(this).is(":disabled")) {
        if ($(this).text() == 'APPLY') {
            $(this).text('SURE?');
        } else if ($(this).text() == 'SURE?') {
            $('.skin .icon').remove();
            $(this).attr('disabled', true);
            $(this).text('APPLY');
            $(`.skin#${skni} .img`).append('<img class="icon spin" src="static/img/icons/loading.svg">');
            var toDisable = $(this);

            refreshStuff(function(returnValue){
                $.ajax({ //Post to Bonk servers with user data and avatar code to upload
                    type: "POST",
                    url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/account6.php",
                    dataType: "text",
                    data: {
                        task: 4,
                        ignorethis: 69696,
                        basePasswordString: '77564898',
                        password: storePw,
                        avatarslot: returnValue,
                        userid: getQueryVariable('dbid', stuff),
                        avatar: encodeURIComponent(skntoUse.avatar),
                        hash: $.md5(getQueryVariable('dbid', stuff) + encodeURIComponent(skntoUse.avatar) + "AK724HHH")
                        //^ Hash used to save the avatar
                    }
                })
                    .done(function (meme) {
                        $('.skin .icon').remove();
                        if (meme.includes("code=0")) { //If sucessful, show alert(), else show an error
                            toDisable.text('DONE!');
                            $(`.skin#${skni} .img`).append('<svg class="icon tick" version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle r="50" cx="50" cy="50" fill="#111"></circle><g transform="translate(-8.13172798366)"><rect id="check1" x="35.8578643763" y="50" width="10" height="0" transform="rotate(-45, 35.8578643763, 50) translate(-5, -2)" fill="#71d458"></rect><rect id="check2" x="64.1421356237" y="50" width="10" height="0" transform="rotate(225, 64.1421356237, 50) translate(-5, -25)" fill="#71d458"></rect></g></svg>');
                            statusout('Skin uploaded to Bonk.io slot '+returnValue+' successfully! Please log-out and log back into Bonk again.');
                            setTimeout(function () {
                                //$(`.skn .icon g`).append(`<rect id="check1" x="35.8578643763" y="50" width="10" height="0" transform="rotate(-45, 35.8578643763, 50) translate(-5, -2)" fill="#71d458"></rect>`);
                            }, 300);
                        } else { statusout('Error: Could not apply skin to bonk.io! This probably is a network error, or something similar.'); toDisable.text('ERROR'); }
                    })
                    .fail(function (e) { statusout('Error: Could not apply skin to bonk.io! This probably is a network error, or something similar.'); toDisable.text('ERROR'); });
            });
        }
    }
});

//When a skin slot is hovered over
$(document).on({
    mouseenter: function () {
        $('.upload-btn').each(function (i, obj) {
            if ($(obj).text() == 'SURE?' || $(obj).text() == 'DONE!' || $(obj).text() == 'ERROR') {
                $(obj).text('APPLY');
                $(obj).removeAttr('disabled');
            }
        });
    }
}, ".skin");

//When the add button on a skin slot on logged in page is clicked
$(document).on("click", ".skinslot", function () {
    $('#loggedin').slideUp();
    $('#addskin').slideDown();
});

//When a category on sample skins category page is clicked
$(document).on("click", ".smpskincatchoice", function () {
    smpfiletouse = $(this).data('choice');
    data = null;
    console.log(smpfiletouse);
    $('#smpskinscat').slideUp();
    $('#smpcatid').text($(this).data('nicename'));
    $('#smpskins').slideDown();
    setTimeout(function () { getSamples(1) }, 500); //Delay getting samples straight away to stop animation lag
});

//When a slot on add skin from slot page is clicked
$(document).on("click", ".bonkslotchoice", function () {
    skinchoice = getQueryVariable($(this).data('choice'), stuff);
    $('#sknframe2').attr('src', 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + encodeURIComponent(skinchoice));
    $('#sknframe4').attr('src', 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + encodeURIComponent(skinchoice));

    $('#addskinslot').slideUp();
    $('#addskin2').slideDown();
    $('#skn')[0].selectionStart = 0;
    $('#skn')[0].selectionEnd = $('#skn').val().length;
    $('#skn').focus();
});

//When a skin slot image preview is clicked
$(document).on("click", ".skin .container .avatar", function () {
    $('#overlay').data('open', $(this).data('open'));
    $(`.skin#${$(this).data('open')} .sknframe,#overlay`).fadeIn(200);
});

//When an enlarged skin image preview or the overlay behind it is clicked
$(document).on("click", ".sknframecus,#overlay", function () {
    $(`.skin#${$(this).data('open')} .sknframe,#overlay`).fadeOut(200);
});

//When a tab button is clicked
$(document).on("click", ".tabBtn", function (e) {
    $('.tabBtn').removeClass('tabSel');
    if($(this).text() != 'ALL SKINS'){
        refreshSkins($(this).text());
    } else {
        refreshSkins('all');
    }
});

//When the share skin code button on share page is clicked
$('#skncode').click(function () {
    prompt("Press CTRL+C to copy the skin code!", skntoUse.avatar);
});

//When the backup skin button on logged in page is clicked
$('#backupall').click(function () {
    $('#loggedin').slideUp();
    $('#backupPage').slideDown();
});

//When the export skin button on backup page is clicked
$('#exportbtn').click(function () {
    var d = new Date();
    download(JSON.stringify(skindata), d.toDateString()+' Backup.blsm', 'text/plain');
    statusout('Backed-up successfully! Downloading file...');
});

//When the import skin button on backup page is clicked
$('#importbtn').click(function () {
    if (!$(this).hasClass('disabled')) {
        $('#importbtn').text('File picker opened...');
        $('#importbtn').addClass('disabled');
        $("#importpicker").click();
    }
});

//When the delete all skins button on backup page or corrupt is clicked
$(document).on("click", ".deleteallbtn", function () {
    if (confirm("Are you sure you want to delete ALL of your currently saved skins? (this will reload the page)")) {
        skindata = [];
        localStorage.setItem("skindata", JSON.stringify(skindata)); //Remove from localstorage and current array
        window.location = "skins.html";
    }
});

//When file attached to import section on backup page
$("#importpicker").change(function(e){
    var file = e.target.files[0];
    if(file.name.endsWith('.blsm')){
        var reader = new FileReader();
        reader.onload = function() {
            if(isJsonStrValid(reader.result)){
                var uploadDataToAdd = JSON.parse(reader.result);
                $.each(uploadDataToAdd, function(index, item) { //Loop through sorted array
                    skindata.push(item);
                });
                localStorage.setItem("skindata", JSON.stringify(skindata));
                refreshSkins();
                $('#importbtn').text('Import skins from a file');
                $('#importbtn').removeClass('disabled');
                statusout(uploadDataToAdd.length+' skins imported successfully!');
            } else { fileUploadFail(); }
        };
        reader.onerror = function() {
            fileUploadFail();
        }
        reader.onloadstart = function() {
            $('#importbtn').text('Reading skin file...');
        };
        reader.readAsText(file);
    } else { fileUploadFail(); }
});

//The file upload failed, cancel it.
function fileUploadFail(){
    $('#importbtn').text('Import skins from a file');
    $('#importbtn').removeClass('disabled');
    statusout('Skin import failed, make sure your skin backup file is valid and the correct format.');
}

//When the share skin link button on share page is clicked
$('#sknshrlink').click(function () {
    if (!$(this).hasClass('disabled')) {
        $('#sknshrlink').addClass('disabled');
        $('#sknshrlink').text('Please wait...');
        var tmpname = encodeURIComponent(getQueryVariable('retreivedusername', stuff));
        if (skntoUse.cred) {
            tmpname = encodeURIComponent(skntoUse.cred);
        }
        $.ajax({ //Use Bit.ly API to shorten the URL used to add skins
            type: "GET",
            url: "https://api-ssl.bitly.com/v3/shorten",
            dataType: "json",
            data: {
                longUrl: `https://bonkleagues.github.io/skins.html#${encodeURIComponent(skntoUse.name)}|${tmpname}|${encodeURIComponent(skntoUse.avatar)}`,
                login: 'finbae',
                apiKey: 'R_5373fb46400847f6887462e6cfb9585c'
            }
        })
            .done(function (meme) {
                if (meme.status_code == 200) { //If successful, prompt() with the link in box
                    $('#sknshrlink').removeClass('disabled');
                    $('#sknshrlink').text('Get Skin Sharing link (recommended)');
                    prompt('Press CTRL+C to copy the skin sharing link! You can then send it to your friends so they can add your skin.', meme.data.url);
                } else { //Otherwise show error
                    statusout('There was an error getting the skin sharing link. Sorry :/');
                    $('#sknshrlink').removeClass('disabled');
                    $('#sknshrlink').text('Get Skin Sharing link (recommended)');
                }
                console.log(meme);
            })
            .fail(function (e) {
                statusout('There was an error getting the skin sharing link. Sorry :/');
                $('#sknshrlink').removeClass('disabled');
                $('#sknshrlink').text('Get Skin Sharing link (recommended)');
            }); //Error fallback
    }
});

//When a skin image preview is clicked
$('#sknframe').click(function () {
    $('#sknframe3,#overlay').fadeIn(200);
});
$('#sknframe2').click(function () {
    $('#sknframe4,#overlay').fadeIn(200);
});

//When an enlarged skin image preview or the overlay behind it is clicked
$('#sknframe3,#overlay').click(function () {
    $('#sknframe3,#overlay').fadeOut(200);
});
$('#sknframe4,#overlay').click(function () {
    $('#sknframe4,#overlay').fadeOut(200);
});

//When the save button on the edit skin page is clicked
$('#edskin').click(function () {
    skindata[skni].name = escapeHtml($('#skne').val());
    skindata[skni].tag = $('#skntags').tagit("assignedTags");
    skindata[skni].col = $('#sslotcol')[0].jscolor.toHEXString();
    localStorage.setItem("skindata", JSON.stringify(skindata)); //Update in localstorage
    $('#editskin').slideUp();
    refreshSkins(); //Reload skin slot data
    $('#loggedin').slideDown();
});

//When the delete button on the edit skin page is clicked
$('#delskin').click(function () {
    if (confirm("Are you sure you want to delete this skin from your saved skins?")) {
        skindata.splice($.inArray(skindata[skni], skindata), 1);
        localStorage.setItem("skindata", JSON.stringify(skindata)); //Remove from localstorage and current array
        $('#editskin').slideUp();
        refreshSkins(); //Reload skin slot data
        $('#loggedin').slideDown();
    }
});

//When the reset skin colour button on the edit skin page is clicked
$('#resetcol').click(function () {
    $('#sslotcol')[0].jscolor.fromString('#FB016E');
});

//When the open in blse button on the edit skin page is clicked
$('#openblse').click(function () {
    var win = window.open('https://bonkleagues.github.io/editor.html?'+encodeURIComponent(skntoUse.avatar), '_blank');
    win.focus();
});

//When a choice is selected on the add skin page
$('.skinchoice').click(function () {
    if ($(this).data('choice') == '1') { //Current skin
        speccred = false; //No special credit is currently nessicary
        refreshStuff(); //Refresh avatar data from Bonk.io
        $('#addskin').slideUp();
        $('#addskinslot').slideDown();
    } else if ($(this).data('choice') == '2') { //Skin code
        speccred = false; //No special credit is currently nessicary
        var tmpv = prompt('Paste skin code here:');
        if (tmpv != null) {
            skinchoice = tmpv;
            $('#addskin').slideUp();
            //Set the data required for adding skin
            $('#sknframe2').attr('src', 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + encodeURIComponent(skinchoice));
            $('#sknframe4').attr('src', 'https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=' + encodeURIComponent(skinchoice));
            $('#addskin2').slideDown();
            $('#skn')[0].selectionStart = 0;
            $('#skn')[0].selectionEnd = $('#skn').val().length;
            $('#skn').focus();
        }
    } else if ($(this).data('choice') == '3') { //Sample skins
        $('#addskin').slideUp();
        $('#smpskinscat').slideDown();
        getSampleCats();
    } else if ($(this).data('choice') == '4') { //Skin editor
        $('#addskin').slideUp();
        setTimeout(function(){ window.location = 'editor.html'; }, 1000);
    }
});

//When the save button is clicked on the add skin part 2 page
$('#svskin').click(function () {
    var cred = escapeHtml(getQueryVariable('retreivedusername', stuff)); //Make sure that credit is set in current user's name.
    if (speccred != false) {
        cred = speccred; //If the skin already has a credited origin, use that instead
    }
    $('#svskin').hide();
    skindata.push({ //Add to skindata array
        name: escapeHtml($('#skn').val()),
        avatar: skinchoice,
        cred: cred
    });
    localStorage.setItem("skindata", JSON.stringify(skindata)); //Save skindata to localstorage
    $('#addskin2').slideUp();
    refreshSkins(); //Refresh skin slot data
    $('#loggedin').slideDown();
    setTimeout(function () { $('#svskin').show() }, 1000); //Make sure animation completes before enabling save button again
});

//When the cancel button is clicked on any page with a cancel button
$('.cancel').click(function () {
    $('#' + $(this).data('cancel')).slideUp(); //Close appropriate page
    $('#loggedin').slideDown();
});

//Drag-and-drop skin slot functionality for the logged in page
$('.skincont').sortable({
    items: ".skin",
    handle: ".container",
    tolerance: "pointer",
    opacity: 0.6,
    update: function(event, ui) {
        if(curTab == 'all'){
            var sortArray = $('.skincont').sortable('toArray');
            var tmpSorted = [];
            $.each(sortArray, function(index, item) { //Loop through sorted array
                tmpSorted.push(skindata[item]);
            });
            console.log(tmpSorted);
            localStorage.setItem("skindata", JSON.stringify(tmpSorted)); //Update in localstorage
            refreshSkins();
        }
    }
});
$('.skincont').disableSelection();

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
        if ($('#un').val() && $('#pw').val()) { //If both boxes are not empty
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
            })
                .done(function (a) {
                    stuff = a;
                    if (getQueryVariable('code', stuff) == "0") { //If response is valid, show next screen and get info
                        if($('#rm').is(':checked')){
                            setCookie('rmUn', storeUn, 30);
                            setCookie('rmPw', storePw, 30);
                        }
                        $('.s-name').text(getQueryVariable('retreivedusername', stuff));
                        refreshSkins(); //Refresh skinslot data
                        $('#button').slideUp();
                        $('#' + $('#button').data('next')).slideDown();
                    } else { errout('Invalid login details/a network error occured.'); } //Show error when nessicary
                })
                .fail(function (e) { errout('Network error while connecting to bonk.io.'); }); //Error fallback

        } else { errout('The username/password box is blank.'); } //Show error when nessicary
    }
});

//enter to submit thingies
$("#un,#pw").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#button").click();
    }
});
$("#skn").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#svskin").click();
    }
});
$("#skne,#sslotcol").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#edskin").click();
    }
});