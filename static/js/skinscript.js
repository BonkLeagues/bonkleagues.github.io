//Initiate variables needed for the page
var step = 0;
var stuff, skinchoice, skntoUse, skni, data;
var skindata = [];
var speccred = false;
var pgnum = 1;
const prevgenurl = 'http://sebweb.co.uk/blbackend/prevgen.php';

//Set up AJAX to not cache the sample skins
$.ajaxSetup({ cache: false });

//Initiate various misc. functions used in the code, self-explainitory
function errout(txt){
    $('#errtxt').text(txt); //Show error text on login page when invalid information is provided
    $('#errtxt').css({'font-style':'normal','color':'red','font-size':'15px'});
    $('#instructions').slideDown();
    $('#button').text('Login!');
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

function escapeHtml(unsafe) { //Escape unsafe HTML in text
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
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

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

//Initiate manager-specific functions, refreshStuff() for refreshing avatar data
function refreshStuff(){
    $.ajax({ //Post to bonk servers with login details
        type: "POST",
        url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/account5.php",
        dataType: "text",
        data: {
            task: 1,
            username: $('#un').val(),
            password: $.md5($('#pw').val())
        }})
    .done(function(a){
        if(getQueryVariable('code',a) == "0"){ //If successful, set data to response data
            stuff = a;
            console.log(stuff);
        }
        //Change skin previews to retrieved avatar
        skinchoice = getQueryVariable('avatar1',stuff);
        $('#sknframe2').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
        $('#sknframe4').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
    });
}

//... and refreshSkins() for refreshing skin slots
function refreshSkins(){
    if (localStorage.getItem("skindata") === null) { //If the user has no saved skins, initiate localstorage
        localStorage.setItem("skindata", JSON.stringify(skindata));
    } else { //Otherwise get the localstorage value
        skindata = JSON.parse(localStorage.getItem("skindata"));
    }

    $('.skincont').html('');
    if (skindata.length > 0) { //If skindata is set, iterate over items, creating skin slots
        $('#txt-skin1').hide();
        $('.txt-skin2').show();
        $.each(skindata, function(index, item) {
            console.log(item);
            $('.skincont').append(`<div class="skinslot" id="${index}" data-skin="${index}" style="animation:none"><img class="sknframe" src="https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=${encodeURIComponent(item.avatar)}" type="image/svg+xml" style="width:48px;height:48px;display:inline-block;vertical-align:middle;box-shadow:none;margin:0px 15px;border: 3px #8e0241 solid;"><span>${item.name}</span></div>`);
        });
    } else { //Otherwise just show the no saved skins message.
        $('.txt-skin2').hide();
        $('#txt-skin1').show();
    }
}

//... and getSamples() for getting a certain page of sample skins
function getSamples(page){
    $('.pg').removeClass('disabled'); //Remove disabled class from the page buttons (allowing clicking again)
    $('#smpskincont').html('');
    $.getJSON("static/data/sample-skins.json", function(res) { //Get the sample skins json file
        if(data == null){ data = shuffle(res); } //If data from earlier is not already shuffled, shuffle it
        console.log(data);
        var totpages = Math.ceil(data.length / 8); //Calculate total pages

        if(page > totpages){page = totpages;} //If there above or below max and min pages, fix that.
        if(page < 1){page = 1;}

        pgnum = page; //Set the page number to the retrieved page value

        if(page == 1){$('#pgprev').addClass('disabled');} //If on first page, disable previous page button, same goes for last page
        if(page == totpages){$('#pgnext').addClass('disabled');}
        $('#pgid').text(page+'/'+totpages);

        $.each(data.slice(8 * (page - 1), 8 * page), function(i, smskin){ //Iterate over all sample skins in chosen page range, creating a sample skin div.
            $('#smpskincont').append(`<div class="sampleskin" data-smskin="${i + 8 * (page - 1)}"><img class="sknframe" src="https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=${encodeURIComponent(smskin.avatar)}"><div><b>${smskin.name}</b><br/><i>by <b>${smskin.by}</b></i></div></div>`);
        });
    });
}

//Detect if on a shared skin link (seperated with # and |)
var shareddata;
if(window.location.hash) { 
    shareddata = window.location.hash.substring(1);
    if(shareddata.split('|')[2]){ //If there is a valid shared skin hash in URL
        shareddata = shareddata.split('|');
        $('#button').hide();
        $('.sharedname').text(decodeURIComponent(shareddata[0])); //Show metadata of the skin 
        $('.sharedby').text(decodeURIComponent(shareddata[1]));
        $('#sharedimg').attr('src',`${prevgenurl}?t=${shareddata[0]}&b=${shareddata[1]}&skinCode=${shareddata[2]}`); //Render shared image of the skin
        $('#shared').slideDown();
    }
}

//Button and other clicking functions now!

//When yes on shared dialog is clicked
$('#sharedyes').click(function(){ //Make sure that when logged in, it will show the add skin page, with appropriate data.
    $('#button').attr('data-next', 'addskin2');
    speccred = shareddata[1];
    skinchoice = decodeURIComponent(shareddata[2]);
    $('#sknframe2').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+shareddata[2]);
    $('#sknframe4').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+shareddata[2]);
    $('#skn').val(decodeURIComponent(shareddata[0]));
    $('#shared').slideUp();
    $('#button').slideDown();
});

//When no on shared dialog is clicked
$('#sharedno').click(function(){
    $('#shared').slideUp();
    $('#button').slideDown();
});

//When next page on sample skins is clicked
$('#pgnext').click(function(){
    if(!$(this).hasClass('disabled')){
        $('.pg').addClass('disabled');
        pgnum++;
        getSamples(pgnum); //Load saved skins for page number
    }
});

//When previous page on sample skins is clicked
$('#pgprev').click(function(){
    if(!$(this).hasClass('disabled')){
        $('.pg').addClass('disabled');
        pgnum--;
        getSamples(pgnum); //Load saved skins for page number
    }
});

//When a sample skin on sample skins page is clicked
$(document).on("click",".sampleskin",function() {
    speccred = data[parseInt($(this).data('smskin'))].by; //Make sure OG skin creator's credit is credited
    skinchoice = data[parseInt($(this).data('smskin'))].avatar;
    $('#smpskins').slideUp(); //Set the data required for adding skin
    $('#sknframe2').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
    $('#sknframe4').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
    $('#skn').val(data[parseInt($(this).data('smskin'))].name);
    $('#addskin2').slideDown();
});

//When a skin slot on logged in page is clicked
$(document).on("click",".skinslot",function() {
    if($(this).data('skin') == 'addskin'){ //If it is the + button
        $('#loggedin').slideUp();
        $('#addskin').slideDown();
    } else { //Otherwise, show edit skin page with appropriate data filled in
        skni = parseInt($(this).data('skin'));
        skntoUse = skindata[skni];
        $('#skne').val(skntoUse.name);
        $('#sknframe').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skntoUse.avatar));
        $('#sknframe3').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skntoUse.avatar));

        $('#loggedin').slideUp();
        $('#editskin').slideDown();
    }
});

//When the share skin code button on share page is clicked
$('#skncode').click(function(){
    prompt("Press CTRL+C to copy the skin code!", skntoUse.avatar);
});

//When the share skin link button on share page is clicked
$('#sknshrlink').click(function(){
    if(!$(this).hasClass('disabled')){
        $('#sknshrlink').addClass('disabled');
        $('#sknshrlink').text('Please wait...');
        var tmpname = encodeURIComponent(getQueryVariable('retreivedusername',stuff));
        if(skntoUse.cred){
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
            }})
        .done(function(meme){
            if(meme.status_code == 200){ //If successful, prompt() with the link in box
                $('#sknshrlink').removeClass('disabled');
                $('#sknshrlink').text('Get Skin Sharing link (recommended)');
                prompt('Press CTRL+C to copy the skin sharing link! You can then send it to your friends so they can add your skin.',meme.data.url);
            } else { //Otherwise show error
                alert('There was an error getting the skin sharing link. Sorry :/');
            }
            console.log(meme);
        })
        .fail(function(e){ alert('Error ['+e.status+']: '+e.statusText); }); //Error fallback
    }
});

//When a skin image preview is clicked
$('#sknframe').click(function(){
    $('#sknframe3,#overlay').fadeIn(200);
});
$('#sknframe2').click(function(){
    $('#sknframe4,#overlay').fadeIn(200);
});

//When an enlarged skin image preview or the overlay behind it is clicked
$('#sknframe3,#overlay').click(function(){
    $('#sknframe3,#overlay').fadeOut(200);
});
$('#sknframe4,#overlay').click(function(){
    $('#sknframe4,#overlay').fadeOut(200);
});

//When the share skin button on the edit skin page is clicked
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
    //Generate a skin preview image for the data.
    $('#genskni').attr('src',`${prevgenurl}?t=${encodeURIComponent(skntoUse.name)}&b=${tmpname}&skinCode=${encodeURIComponent(skntoUse.avatar)}`);
    $('#shareskin').slideDown();
});

//When the save button on the edit skin page is clicked
$('#edskin').click(function(){
    skindata[skni].name = escapeHtml($('#skne').val());
    localStorage.setItem("skindata", JSON.stringify(skindata)); //Update in localstorage
    $('#editskin').slideUp();
    refreshSkins(); //Reload skin slot data
    $('#loggedin').slideDown();
});

//When the delete button on the edit skin page is clicked
$('#delskin').click(function(){
    if(confirm("Are you sure you want to delete this skin from your saved skins?")){
        skindata.splice($.inArray(skindata[skni], skindata), 1);
        localStorage.setItem("skindata", JSON.stringify(skindata)); //Remove from localstorage and current array
        $('#editskin').slideUp();
        refreshSkins(); //Reload skin slot data
        $('#loggedin').slideDown();
    }
});

//When the upload to bonk button on the edit skin page is clicked
$('#aplskin').click(function(){
    if(confirm("Are you sure you want to apply and upload this skin to bonk.io? (This will replace your active bonk.io skin, so make sure you've saved it first!)")){
        $.ajax({ //Post to Bonk servers with user data and avatar code to upload
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
                //^ Hash used to save the avatar
            }})
        .done(function(meme){
            if(meme.includes("code=0")){ //If sucessful, show alert(), else show an error
                alert("Skin applied to bonk.io successfully! You may need to logout and back in to see your skin.")
            } else { alert('Error: Could not apply skin to bonk.io! This probably is a network error, or something similar.'); }
        })
        .fail(function(e){ alert('Error ['+e.status+']: '+e.statusText); }); //Error fallback

    }
});

//When a choice is selected on the add skin page
$('.skinchoice').click(function(){
    if($(this).data('choice') == '1'){ //Current skin
        speccred = false; //No special credit is currently nessicary
        refreshStuff(); //Refresh avatar data from Bonk.io
        $('#addskin').slideUp();
        $('#addskin2').slideDown();
    } else if($(this).data('choice') == '2'){ //Skin code
        speccred = false; //No special credit is currently nessicary
        var tmpv = prompt('Paste skin code here:');
        if(tmpv != null){
            skinchoice = tmpv;
            $('#addskin').slideUp();
             //Set the data required for adding skin
            $('#sknframe2').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
            $('#sknframe4').attr('src','https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode='+encodeURIComponent(skinchoice));
            $('#addskin2').slideDown();
        }
    } else if($(this).data('choice') == '3'){ //Sample skins
        $('#addskin').slideUp();
        $('#smpskins').slideDown();
        setTimeout(function(){getSamples(1)}, 500); //Delay getting samples straight away to stop animation lag
    } else if($(this).data('choice') == '4'){ //Skin editor
        speccred = false; //No special credit is currently nessicary
        return alert('This feature is coming soon™'); //SoonTM
        $('#addskin').slideUp();
        $('#bleditor').slideDown();
    }
});

//When the save button is clicked on the add skin part 2 page
$('#svskin').click(function(){
    var cred = escapeHtml(getQueryVariable('retreivedusername',stuff)); //Make sure that credit is set in current user's name.
    if(speccred != false){
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
    setTimeout(function(){$('#svskin').show()},1000); //Make sure animation completes before enabling save button again
});

//When the cancel button is clicked on any page with a cancel button
$('.cancel').click(function(){
    $('#'+$(this).data('cancel')).slideUp(); //Close appropriate page
    $('#loggedin').slideDown();
});

/*Drag-and-drop skin slot functionality for the logged in page
$('.skincont').sortable({
    items: ".skinslot",
    tolerance: "pointer",
    placeholder: "sort-placeholder",
    opacity: 0.6,
    forcePlaceholderSize: true,
    start: function (event, ui) {
        $(ui.helper).css({
            'width': $(ui.helper).width() + 1
        });
    },
    update: function(event, ui) {
        var sortarray = $('.skincont').sortable('toArray');
        $.each(skindata, function(index, item) {
            skindata = skindata.move(index, sortarray[index]);
        });
        console.log(skindata);
        //localStorage.setItem("skindata", JSON.stringify(skindata)); //Update in localstorage
    }
});
$('.skincont').disableSelection();*/

//When the login button is clicked on the homepage
$('#button').click(function(){
    if(step == 0){ //On first click - show login inputs and change button appropriately
        $('#info').slideUp();
        $('#instructions').slideDown();
        $('#button').text('Login!');
        $('#button').css('font-size', '32px');
        step = 1;
    } else if(step == 1){ //On second click - verify login detail is correct and respond
        step = 2;
        if($('#un').val() && $('#pw').val()){ //If both boxes are not empty
            $('#instructions').slideUp();
            $('#button').text('Please wait...');
            $.ajax({ //Post to bonk servers with login information
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
                if(getQueryVariable('code',stuff) == "0"){ //If response is valid, show next screen and get info
                    $('.s-name').text(getQueryVariable('retreivedusername',stuff));
                    refreshSkins(); //Refresh skinslot data
                    $('#button').slideUp();
                    $('#'+$('#button').data('next')).slideDown();
                } else { errout('Invalid login details/Network error!'); } //Show error when nessicary
            })
            .fail(function(e){ errout('Login error ['+e.status+']: '+e.statusText); }); //Error fallback

        } else { errout('The username/password box is blank.'); } //Show error when nessicary
    }
});