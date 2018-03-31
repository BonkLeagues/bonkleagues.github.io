//var lastoutage = timeSince(new Date(Date.UTC(2018, 2,  1, 21, 33, 0)));
                                           //year,m-1, da, ho, mi, s
var lastoutage = false;


var startReqTime = new Date();
$.ajax({
    type: "POST",
    url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/account6.php",
    dataType: "text",
    timeout: 15000,
    data: {
        friendtoadd: 'Finbae',
        ignorethis: 69696,
        basePasswordString: 77564898,
        task: 7,
        username: '5',
        password: 'e4da3b7fbbce2345d7772b0674a318d5'
    }})
.done(function(meme, useless, reqInfo){
    console.log(reqInfo);
    devOutput('Response body:\n' + meme, `${reqInfo.status} ${reqInfo.statusText}`);
    if(getQueryVariable('code',meme) == '0'){ //If response is valid, continue and get name
        setState('overallStatusBN','online');
        setState('statusBN-web','online');
        setState('statusBN-db','online');
        setState('overallStatusBL','online');
    } else {
        setState('overallStatusBN','online');
        setState('statusBN-web','online');
        setState('statusBN-db','online');
        setState('overallStatusBL','down');
        /*if(lastoutage){
            $('#downholder').show();
            $('#downtime').text(lastoutage);
        }*/
        $('#extrainfo').show();
    } //Show error when nessicary
})
.fail(function(e,txtStat){
    if(txtStat == 'timeout'){
        devOutput('Connection timed out (after 15000ms)\n\nThis is a preset message, no response body actually received.', '503 TIMEOUT');
        setState('overallStatusBN','unknown');
        setState('statusBN-web','unknown');
        setState('statusBN-db','unknown');
        setState('overallStatusBL','timedout');
    } else {
        devOutput('Could not connect to servers AT ALL.\n\nThis is a preset message, no response body actually received.', 'NONE');
        setState('overallStatusBN','down');
        setState('statusBN-web','down');
        setState('statusBN-db','unknown');
        setState('overallStatusBL','online');
    }
});

function setState(container, state){
    switch(state){
        case 'down':
            $('#'+container).text('DOWN'); 
            $('#'+container).addClass('cre');
            break;
        case 'online':
            $('#'+container).text('ONLINE'); 
            $('#'+container).addClass('cgr');
            break;
        case 'unknown':
            $('#'+container).text('UNKNOWN'); 
            $('#'+container).addClass('cdg');
            break;
        case 'timedout':
            $('#'+container).text('TIMED OUT (DOWN)'); 
            $('#'+container).addClass('cor');
            $('#extrainfo').show();
            break;
    }
    $('.toHide').hide();
    if(container == 'overallStatusBN'){
        document.title = state.toUpperCase() + ' | Bonk.io Server Status';
        changeFavicon('/static/img/icons/'+ state +'.ico');
    }
}

function devOutput(txt, rcode){
    txt = `[ Response code: ${rcode} | Took: ${new Date() - startReqTime}ms ]\n\n${txt}`;
    $('#devOutput').text(txt);
}

$('#devBtn').click(function(){
    $('#devDetails').toggle();
});

setInterval(function(){
    location.reload();
},40000);



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
function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = (seconds / 31536000).toFixed(1);
    if (interval > 1) {
    return interval + " years";
    }
    interval = (seconds / 2592000).toFixed(1);
    if (interval > 1) {
    return interval + " months";
    }
    interval = (seconds / 86400).toFixed(1);
    if (interval > 1) {
    return interval + " days";
    }
    interval = (seconds / 3600).toFixed(1);
    if (interval > 1) {
    return interval + " hours";
    }
    interval = (seconds / 60).toFixed(1);
    if (interval > 1) {
    return interval + " minutes";
    }
    return (seconds).toFixed(1) + " seconds";
}
function changeFavicon(src) {
    var link = document.createElement('link'),
    oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}