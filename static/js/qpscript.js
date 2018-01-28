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
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function reverseArr(input) {
    var ret = new Array;
    for(var i = input.length-1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}
var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

var stuff = [];
$.ajax({
    type: "POST",
    url: "https://bonkleaguebot.herokuapp.com/cors/physics/scripts/maps9.php",
    dataType: "text",
    data: {
        startingfrom: 0,
        noresults: 60,
        task: 2,
        getrule: 'quickmatchrotation'
    }})
.done(function(meme){
    var memeSplit = meme.split("&");
    for (var i=0;i<memeSplit.length;i++) {
        var regexStuff = memeSplit[i].match(/(.+?)(\d+)?=(.*)/);
        if (regexStuff[2]) {
            if (regexStuff[2] == stuff.length) {
                var obj = {};
                obj[regexStuff[1]] = regexStuff[3];
                stuff.push(obj);
            } else {
                stuff[regexStuff[2]][regexStuff[1]] = regexStuff[3];
            }
        }
    }
    for (var i=0;i<stuff.length;i++) {
        stuff[i].id = i;
        stuff[i].mapname = decodeURIComponent(stuff[i].mapname.replace(/\+/g, ' '));
        stuff[i].thumbsup = parseInt(stuff[i].thumbsup);
        stuff[i].thumbsdown = parseInt(stuff[i].thumbsdown);
        stuff[i].ldratio = stuff[i].thumbsup / stuff[i].thumbsdown;
        stuff[i].creationdate = new Date(stuff[i].creationdate.replace(/\s/, 'T'));
    }
    updateStuff('default', 'asc');
})
.fail(function(e){ alert('Error ['+e.status+']: '+e.statusText); });

function updateStuff(sort, ascdes){
    $('#loadedcont').html('');
    var stuff2 = stuff;
    if(sort == 'default'){
        stuff2.sort(function(obj1, obj2) {
            return obj1.id - obj2.id;
        });
    }
    if(sort == 'ldratio'){
        stuff2.sort(function(obj1, obj2) {
            return obj2.ldratio - obj1.ldratio;
        });
    }
    if(sort == 'date'){
        stuff2.sort(function(obj1, obj2) {
            return obj2.creationdate - obj1.creationdate;
        });
    }
    if(ascdes == 'asc'){
        stuff2 = reverseArr(stuff2);
    }
    console.log(stuff);
    $.each(stuff2, function(i, thing){
        $('#loadedcont').append(`<b>${pad(i+1,3)}. "${thing.mapname}</b>" by <i>${thing.authorname}<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span class="cgr">+${thing.thumbsup.toLocaleString()}</span>/<span class="cre">-${thing.thumbsdown.toLocaleString()}</span>) <span class="cdg">- ${thing.ldratio.toFixed(2)} L/D</span></i><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="cdg" style="font-size:12px;vertical-align:top;">Created: ${thing.creationdate.getDate()} ${months[thing.creationdate.getMonth()]} ${thing.creationdate.getFullYear()} - ${pad(thing.creationdate.getHours(),2)}:${pad(thing.creationdate.getMinutes(),2)}:${pad(thing.creationdate.getSeconds(),2)} | ID: #${thing.id}</span><br/>`);
        $('#mapnum').text(i+1);
    });
    $('#loading').slideUp();
    $('#loaded').slideDown();
    $('#loadedcont').fadeIn();
}

$('select').change(function(){
    updateStuff($('#sel1').val(), $('#sel2').val());
});