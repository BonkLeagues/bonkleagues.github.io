var step = 0;
var stuff, skinchoice, skntoUse, skni;
var skindata = [];

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

function refreshStuff(){
    $.ajax({
        type: "POST",
        url: "http://sebweb.co.uk/blbackend/cors/physics/scripts/account5.php",
        dataType: "text",
        data: {
            task: 1,
            username: encodeURIComponent($('#un').val()),
            password: $.md5($('#pw').val())
        }})
    .done(function(a){
        if(getQueryVariable('code',a) == "0"){
            stuff = a;
            console.log(stuff);
        }
        skinchoice = getQueryVariable('avatar1',stuff);
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
            $('.skincont').append(`<div class="skinslot" data-skin="${index}"><span>${item.name}</span></div>`);
        });
    } else {
        $('.txt-skin2').hide();
        $('#txt-skin1').show();
    }
}

$(document).on("click",".skinslot",function() {
    if($(this).data('skin') == 'addskin'){
        $('#loggedin').slideUp();
        $('#addskin').slideDown();
    } else {
        skni = parseInt($(this).data('skin'));
        skntoUse = skindata[skni];
        $('#skne').val(skntoUse.name);

        $('#loggedin').slideUp();
        $('#editskin').slideDown();
    }
});

$('#skncode').click(function(){
    prompt("Press CTRL+C to copy the skin code!", skntoUse.avatar);
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
        refreshStuff();
        $('#addskin').slideUp();
        $('#addskin2').slideDown();
    } else if($(this).data('choice') == '2'){
        var tmpv = prompt('Paste skin code here:');
        if(tmpv != null){
            skinchoice = tmpv;
            $('#addskin').slideUp();
            $('#addskin2').slideDown();
        }
    } else {
        alert('This feature is coming soon™. If you are a good skin maker, message @Finbae#2180 on the M4K Bonk.io Discord Server for a chance to have one of your skins here (with credit)');
    }
});

$('#svskin').click(function(){
    $('#svskin').hide();
    skindata.push({
        name: escapeHtml($('#skn').val()),
        avatar: skinchoice
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
                    username: encodeURIComponent($('#un').val()),
                    password: $.md5($('#pw').val())
                }})
            .done(function(a){
                stuff = a;
                if(getQueryVariable('code',stuff) == "0"){
                    $('.s-name').text(getQueryVariable('retreivedusername',stuff));
                    refreshSkins();
                    $('#button').slideUp();
                    $('#loggedin').slideDown();
                } else { errout('Invalid login details/Network error!'); }
            })
            .fail(function(e){ errout('Login error ['+e.status+']: '+e.statusText); });

        } else { errout('The username/password box is blank.'); }
    }
});