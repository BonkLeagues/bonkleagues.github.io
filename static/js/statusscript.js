var lastoutage = timeSince(new Date(Date.UTC(2018, 2,  2, 00, 21, 0)));
                                           //year,m-1, da, ho, mi, s
//var lastoutage = false;

$.ajax({
    type: "POST",
    url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/account5.php",
    dataType: "text",
    data: {
        friendtoadd: 'Finbae',
        ignorethis: 69696,
        basePasswordString: 77564898,
        task: 7,
        username: '5',
        password: 'e4da3b7fbbce2345d7772b0674a318d5'
    }})
.done(function(meme){
    if(getQueryVariable('code',meme) == '0'){ //If response is valid, continue and get name
        $('#status').addClass('cgr');
        $('#status').text('ONLINE');
        
        $('#status-web').text('ONLINE'); 
        $('#status-web').addClass('cgr');
    
        $('#status-db').text('ONLINE'); 
        $('#status-db').addClass('cgr');

        document.title = 'ONLINE | Bonk.io Server Status';
        changeFavicon('/static/img/icons/green.ico');
    } else {
        $('#status').text('DOWN');
        $('#status').addClass('cre');

        $('#status-web').text('ONLINE'); 
        $('#status-web').addClass('cgr');
    
        $('#status-db').text('DOWN'); 
        $('#status-db').addClass('cre');
    
        if(lastoutage){
            console.log(1);
            $('#downholder').show();
            $('#downtime').text(lastoutage);
        }
        
        document.title = 'DOWN | Bonk.io Server Status';
        changeFavicon('/static/img/icons/red.ico');
    } //Show error when nessicary
})
.fail(function(e){
    $('#status').text('DOWN'); 
    $('#status').addClass('cre');

    $('#status-web').text('DOWN'); 
    $('#status-web').addClass('cre');

    $('#status-db').text('UNKNOWN (PROBABLY DOWN)'); 
    $('#status-db').addClass('cre');

    document.title = 'DOWN | Bonk.io Server Status';
    changeFavicon('/static/img/icons/red.ico');
});

setInterval(function(){
    location.reload();
},20000);

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
