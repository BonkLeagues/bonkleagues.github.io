var step = 0;
var stuff, skinchoice, skntoUse, skni, data;
var skindata = [];
var speccred = false;
var pgnum = 1;

$.ajaxSetup({ cache: false });

function errout(txt){
    $('#errtxt').text(txt);
    $('#errtxt').css({'font-style':'normal','color':'red','font-size':'15px'});
    $('#instructions').slideDown();
    $('#button').text('Login!');
    step = 1;
}

function getQueryVariable(variable,og) {
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

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function shuffle(array) {
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

function refreshStuff(){
    $.ajax({
        type: "POST",
        url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/account5.php",
        dataType: "text",
        data: {
            task: 1,
            username: $('#un').val(),
            password: $.md5($('#pw').val())
        }})
    .done(function(a){
        if(getQueryVariable('code',a) == "0"){
            stuff = a;
            console.log(stuff);
        }
        skinchoice = getQueryVariable('avatar1',stuff);
        $('#sknframe2').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
        $('#sknframe4').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
    });
}

function refreshSkins(){
    if (localStorage.getItem("skindata") === null) {
        localStorage.setItem("skindata", JSON.stringify(skindata));
    } else {
        skindata = JSON.parse(localStorage.getItem("skindata"));
    }

    $('.skincont').html('');
    if (skindata.length > 0) {
        $('#txt-skin1').hide();
        $('.txt-skin2').show();
        $.each(skindata, function(index, item) {
            console.log(item);
            $('.skincont').append(`<div class="skinslot" data-skin="${index}" style="animation:none"><img class="sknframe" src="https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=${encodeURIComponent(item.avatar)}" type="image/svg+xml" style="width:48px;height:48px;display:inline-block;vertical-align:middle;box-shadow:none;margin:0px 15px;border: 3px #8e0241 solid;"><span>${item.name}</span></div>`);
        });
    } else {
        $('.txt-skin2').hide();
        $('#txt-skin1').show();
    }
}

function getSamples(page){
    $('.pg').removeClass('disabled')
    $('#smpskincont').html('');
    $.getJSON("static/data/sample-skins.json", function(res) {
        if(data == null){ data = shuffle(res); }
        console.log(data);
        var totpages = Math.ceil(data.length / 8);

        if(page > totpages){page = totpages;}
        if(page < 1){page = 1;}

        pgnum = page;

        if(page == 1){$('#pgprev').addClass('disabled');}
        if(page == totpages){$('#pgnext').addClass('disabled');}
        $('#pgid').text(page+'/'+totpages);

        $.each(data.slice(8 * (page - 1), 8 * page), function(i, smskin){
            $('#smpskincont').append(`<div class="sampleskin" data-smskin="${i + 8 * (page - 1)}"><img class="sknframe" src="https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=${encodeURIComponent(smskin.avatar)}"><div><b>${smskin.name}</b><br/><i>by <b>${smskin.by}</b></i></div></div>`);
        });
    });
}

var shareddata;
if(window.location.hash) {
    shareddata = window.location.hash.substring(1);
    if(shareddata.split('|')[2]){
        shareddata = shareddata.split('|');
        $('#button').hide();
        $('.sharedname').text(decodeURIComponent(shareddata[0]));
        $('.sharedby').text(decodeURIComponent(shareddata[1]));
        $('#sharedimg').attr('src',`http://finbae.co.uk/bl/prevgen.php?t=${shareddata[0]}&b=${shareddata[1]}&skinCode=${shareddata[2]}`);
        $('#shared').slideDown();
    }
}

$('#sharedyes').click(function(){
    $('#button').attr('data-next', 'addskin2');
    speccred = shareddata[1];
    skinchoice = decodeURIComponent(shareddata[2]);
    $('#sknframe2').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+shareddata[2]);
    $('#sknframe4').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+shareddata[2]);
    $('#skn').val(decodeURIComponent(shareddata[0]));
    $('#shared').slideUp();
    $('#button').slideDown();
});

$('#sharedno').click(function(){
    $('#shared').slideUp();
    $('#button').slideDown();
});

$('#pgnext').click(function(){
    if(!$(this).hasClass('disabled')){
        $('.pg').addClass('disabled');
        pgnum++;
        getSamples(pgnum);
    }
});

$('#pgprev').click(function(){
    if(!$(this).hasClass('disabled')){
        $('.pg').addClass('disabled');
        pgnum--;
        getSamples(pgnum);
    }
});

$(document).on("click",".sampleskin",function() {
    speccred = data[parseInt($(this).data('smskin'))].by;
    skinchoice = data[parseInt($(this).data('smskin'))].avatar;
    $('#smpskins').slideUp();
    $('#sknframe2').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
    $('#sknframe4').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
    $('#skn').val(data[parseInt($(this).data('smskin'))].name);
    $('#addskin2').slideDown();
});

$(document).on("click",".skinslot",function() {
    if($(this).data('skin') == 'addskin'){
        $('#loggedin').slideUp();
        $('#addskin').slideDown();
    } else {
        skni = parseInt($(this).data('skin'));
        skntoUse = skindata[skni];
        $('#skne').val(skntoUse.name);
        $('#sknframe').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skntoUse.avatar));
        $('#sknframe3').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skntoUse.avatar));

        $('#loggedin').slideUp();
        $('#editskin').slideDown();
    }
});

$('#skncode').click(function(){
    prompt("Press CTRL+C to copy the skin code!", skntoUse.avatar);
});

$('#sknshrlink').click(function(){
    if(!$(this).hasClass('disabled')){
        $('#sknshrlink').addClass('disabled');
        $('#sknshrlink').text('Please wait...');
        var tmpname = encodeURIComponent(getQueryVariable('retreivedusername',stuff));
        if(skntoUse.cred){
            tmpname = encodeURIComponent(skntoUse.cred);
        }
        $.ajax({
            type: "GET",
            url: "https://api-ssl.bitly.com/v3/shorten",
            dataType: "json",
            data: {
                longUrl: `https://bonkleagues.github.io/skins.html#${encodeURIComponent(skntoUse.name)}|${tmpname}|${encodeURIComponent(skntoUse.avatar)}`,
                login: 'finbae',
                apiKey: 'R_5373fb46400847f6887462e6cfb9585c'
            }})
        .done(function(meme){
            if(meme.status_code == 200){
                $('#sknshrlink').removeClass('disabled');
                $('#sknshrlink').text('Get Skin Sharing link (recommended)');
                prompt('Press CTRL+C to copy the skin sharing link! You can then send it to your friends so they can add your skin.',meme.data.url);
            } else {
                alert('There was an error getting the skin sharing link. Sorry :/');
            }
            console.log(meme);
        })
        .fail(function(e){ alert('Error ['+e.status+']: '+e.statusText); });
    }
});

$('#sknframe').click(function(){
    $('#sknframe3,#overlay').fadeIn(200);
});
$('#sknframe2').click(function(){
    $('#sknframe4,#overlay').fadeIn(200);
});

$('#sknframe3,#overlay').click(function(){
    $('#sknframe3,#overlay').fadeOut(200);
});
$('#sknframe4,#overlay').click(function(){
    $('#sknframe4,#overlay').fadeOut(200);
});

$('#shrskin').click(function(){
    $('#editskin').slideUp();
    var tmpname = encodeURIComponent(getQueryVariable('retreivedusername',stuff));
    if(skntoUse.cred){
        tmpname = encodeURIComponent(skntoUse.cred);
    }
    $('#genskni-l').show();
    $('#genskni').hide();
    $('#sknshrlink').removeClass('disabled');
    $('#sknshrlink').text('Get Skin Sharing link (recommended)');
    $('#genskni').attr('src',`http://finbae.co.uk/bl/prevgen.php?t=${encodeURIComponent(skntoUse.name)}&b=${tmpname}&skinCode=${encodeURIComponent(skntoUse.avatar)}`);
    $('#shareskin').slideDown();
});

$('#edskin').click(function(){
    skindata[skni].name = escapeHtml($('#skne').val());
    localStorage.setItem("skindata", JSON.stringify(skindata));
    $('#editskin').slideUp();
    refreshSkins();
    $('#loggedin').slideDown();
});

$('#delskin').click(function(){
    if(confirm("Are you sure you want to delete this skin from your saved skins?")){
        skindata.splice($.inArray(skindata[skni], skindata), 1);
        localStorage.setItem("skindata", JSON.stringify(skindata));
        $('#editskin').slideUp();
        refreshSkins();
        $('#loggedin').slideDown();
    }
});

$('#aplskin').click(function(){
    if(confirm("Are you sure you want to apply and upload this skin to bonk.io? (This will replace your active bonk.io skin, so make sure you've saved it first!)")){
        $.ajax({
            type: "POST",
            url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/account5.php",
            dataType: "text",
            data: {
                task: 4,
                ignorethis: 69696,
                basePasswordString: '77564898',
                password: $.md5($('#pw').val()),
                userid: getQueryVariable('dbid',stuff),
                avatar: encodeURIComponent(skntoUse.avatar),
                hash: $.md5(getQueryVariable('dbid',stuff) + encodeURIComponent(skntoUse.avatar) + "AK724HHH")
            }})
        .done(function(meme){
            if(meme.includes("code=0")){
                alert("Skin applied to bonk.io successfully! You may need to logout and back in to see your skin.")
            } else { alert('Error: Could not apply skin to bonk.io! This probably is a network error, or something similar.'); }
        })
        .fail(function(e){ alert('Error ['+e.status+']: '+e.statusText); });

    }
});

$('.skinchoice').click(function(){
    if($(this).data('choice') == '1'){
        speccred = false;
        refreshStuff();
        $('#addskin').slideUp();
        $('#addskin2').slideDown();
    } else if($(this).data('choice') == '2'){
        speccred = false;
        var tmpv = prompt('Paste skin code here:');
        if(tmpv != null){
            skinchoice = tmpv;
            $('#addskin').slideUp();
            $('#sknframe2').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
            $('#sknframe4').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
            $('#addskin2').slideDown();
        }
    } else if($(this).data('choice') == '3'){
        $('#addskin').slideUp();
        $('#smpskins').slideDown();
        setTimeout(function(){getSamples(1)}, 500);
    } else if($(this).data('choice') == '4'){
        speccred = false;
        return alert('This feature is coming soon™');
        $('#addskin').slideUp();
        $('#bleditor').slideDown();
    }
});

$('#svskin').click(function(){
    var cred = escapeHtml(getQueryVariable('retreivedusername',stuff));
    if(speccred != false){
        cred = speccred;
    }
    $('#svskin').hide();
    skindata.push({
        name: escapeHtml($('#skn').val()),
        avatar: skinchoice,
        cred: cred
    });
    localStorage.setItem("skindata", JSON.stringify(skindata));
    $('#addskin2').slideUp();
    refreshSkins();
    $('#loggedin').slideDown();
    setTimeout(function(){$('#svskin').show()},1000);
});

$('.cancel').click(function(){
    $('#'+$(this).data('cancel')).slideUp();
    $('#loggedin').slideDown();
});

$('#button').click(function(){
    if(step == 0){
        $('#info').slideUp();
        $('#instructions').slideDown();
        $('#button').text('Login!');
        $('#button').css('font-size', '32px');
        step = 1;
    } else if(step == 1){
        step = 2;
        if($('#un').val() && $('#pw').val()){
            $('#instructions').slideUp();
            $('#button').text('Please wait...');
            $.ajax({
                type: "POST",
                url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/account5.php",
                dataType: "text",
                data: {
                    task: 1,
                    username: $('#un').val(),
                    password: $.md5($('#pw').val())
                }})
            .done(function(a){
                stuff = a;
                if(getQueryVariable('code',stuff) == "0"){
                    $('.s-name').text(getQueryVariable('retreivedusername',stuff));
                    refreshSkins();
                    $('#button').slideUp();
                    $('#'+$('#button').data('next')).slideDown();
                } else { errout('Invalid login details/Network error!'); }
            })
            .fail(function(e){ errout('Login error ['+e.status+']: '+e.statusText); });

        } else { errout('The username/password box is blank.'); }
    }
});

function adBlockDetected() {
	$('#adbnote').show();
}
if(typeof blockAdBlock === 'undefined') {
	adBlockDetected();
} else {
	blockAdBlock.onDetected(adBlockDetected);
}