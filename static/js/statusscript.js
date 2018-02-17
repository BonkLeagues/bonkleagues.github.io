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
    } else { $('#status').text('DOWN'); $('#status').addClass('cre'); } //Show error when nessicary
})
.fail(function(e){ $('#status').text('DOWN'); $('#status').addClass('cre'); });

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