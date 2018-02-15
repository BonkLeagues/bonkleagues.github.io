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
function getOrdinal(n) {
    var s=["th","st","nd","rd"],
    v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
}

var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var instatsview = false;
var c_gold = '#eab41a';
var c_silv = '#a7a7a7';
var c_bron = '#ad7126';
var copydata = {
    'Slingshots'       : { search: 'wwe|slingshot|hotel' },
    'Push-the-Balls'   : { search: 'push|ball|red vs blue' },
    'Slides'           : { search: 'slide' },
    'Runs/Chases'      : { search: 'run|chase' },
    'Low-effort Memes' : { search: 'uganda|knuckle|sanic|sonic|wae|way' },
    'Dragons'          : { search: 'dragon|dog' },
    'Swings'           : { search: 'swing' },
    'Don\'t Moves'     : { search: 'dont move|don\'t move|move|do not' },
    'Leap-of-Faiths'   : { search: 'leap|faith' },
    'Others'           : { search: 'donkey|kong|plane' },
};

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
    if(!instatsview){
        var stuff2 = stuff;
        $('#statstoggle').text('Show advanced stats');
        $('#ctrlftip').text('(TIP: you can use CTRL+F to search!)');
        $('#sorthold').slideDown();
        
        setTimeout(function(){
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
                $('#loadedcont').append(`
                    <b>"${thing.mapname}</b>" by <i>${thing.authorname}<br/>
                    (<span class="cgr">+${thing.thumbsup.toLocaleString()}</span>/<span class="cre">-${thing.thumbsdown.toLocaleString()}</span>)
                    <span class="cdg">- ${thing.ldratio.toFixed(2)} L/D</span></i><br/>
                    <span class="cdg" style="font-size:12px;vertical-align:top;">${pad(i+1,3)}. Created: ${thing.creationdate.getDate()} ${months[thing.creationdate.getMonth()]} ${thing.creationdate.getFullYear()} - ${pad(thing.creationdate.getHours(),2)}:${pad(thing.creationdate.getMinutes(),2)}:${pad(thing.creationdate.getSeconds(),2)} | ID: #${thing.id}</span><br/>
                `);
                $('#mapnum').text(i+1);
            });
        }, 300);
    } else {
        $('#statstoggle').text('Show map list');
        $('#sorthold').slideUp();
        $('#ctrlftip').text('(TIP: hover over a QP leaderboard list for a longer version of it!)');
        $('#mapnum').text('stats for '+stuff.length);
        $('#loadedcont').append(`<div class="flex-grid"><div class="col" id="col0" style="border-right:1px solid #222"></div><div class="col" id="col1" style="border-right:1px solid #222"></div><div class="col" id="col2"></div></div>`);
        addStatModule('qpleaderboards',0);
        addStatModule('averages',1);
        addStatModule('totals',1);
        addStatModule('copies',2);
        //addStatModule('soontm',2);
    }
    $('#loading').slideUp();
    $('#loaded').slideDown();
    $('#loadedcont').fadeIn();
}

function addStatModule(statName, colID){
    var tmpstuff = {};

    switch(statName){
        case 'qpleaderboards':
            tmpstuff.parthead = `QP Leaderboards`;

            tmpstuff.cont = '<b style="color:#fb016e;">Users with most maps in Quick Play:</b>';
            tmpstuff.cont += statSort(0,'authorname');

            tmpstuff.cont += '<b style="color:#fb016e;">Most common words in QP map titles:</b>';
            tmpstuff.cont += statSort(1);
            break;
        case 'averages':
            tmpstuff.parthead = `Average...`;

            tmpstuff.cont = '<b style="color:#fb016e;">Likes/dislikes per QP map: </b>';
            tmpstuff.cont += `<span class="cgr">${Math.round(calcavg('thumbsup')).toLocaleString()}</span>/<span class="cre">${Math.round(calcavg('thumbsdown')).toLocaleString()}</span><br/>`

            tmpstuff.cont += '<b style="color:#fb016e;">L/D ratio per QP map: </b>';
            tmpstuff.cont += calcavg('ldratio').toFixed(2) + '<br/><br/><br/>';
            break;
        case 'totals':
            tmpstuff.parthead = `Total...`;

            tmpstuff.cont = '<b style="color:#fb016e;">Likes/dislikes on QP maps: </b>';
            tmpstuff.cont += `<span class="cgr">${calctot('thumbsup').toLocaleString()}</span>/<span class="cre">${calctot('thumbsdown').toLocaleString()}</span><br/>`;

            tmpstuff.cont += '<b style="color:#fb016e;">Maps currently in QP rotation: </b>';
            tmpstuff.cont += stuff.length + '<br/>';

            tmpstuff.cont += '<b style="color:#fb016e;">Players with maps in QP rotation: </b>';
            tmpstuff.cont += statSort(0,'authorname',false) + '<br/><br/>';
            break;
        case 'copies':
            tmpstuff.parthead = `Common copies`;

            tmpstuff.cont = `<b style="color:#fb016e;">There are ${calccopies('all')} commonly copied maps in QP.</b><br/><br/>`;

            $.each(copydata, function(i, data){
                tmpstuff.cont += `<b>${calccopies(i)}</b> - <i>${i}</i> [${Math.ceil(calccopies(i,false))}%]<br/>`;
            });

            tmpstuff.cont += `<span style="color:#fb016e;"><b>${calccopies('all')}</b> - <i>TOTAL</i> [${Math.ceil(calccopies('all',false))}%]</span><br/>`;

            tmpstuff.cont += '<br/><i style="font-size:12px;">Note: this section only calculates rough estimates,<br/>there may be more more/less maps like these in QP.</i>';
            break;
        case 'soontm':
            tmpstuff.parthead = `More stuff coming soonTM`;

            tmpstuff.cont = 'If you have any more suggestions<br/>for stats here, make sure to tell<br/>us in <a href="https://discord.gg/RadQ7xx" target="_blank"">our Discord server.</a>';

    }

    tmpstuff.html = `<span class="parthead">${tmpstuff.parthead}</span><br/><br/>${tmpstuff.cont}`;
    $('#col'+colID).append(tmpstuff.html);
}

function calccopies(criteria,display = true){
    var tosearch = [];
    if(criteria == 'all'){
        $.each(copydata, function(i, data){
            $.each(data.search.split('|'), function(i2, data2){
                tosearch.push(data2);
            });
        });
    } else {
        $.each(copydata[criteria].search.split('|'), function(i2, data2){
            tosearch.push(data2);
        });
    }
    var tmptotal = 0;
    $.each(stuff, function(i, data){
        var found = false;
        $.each(tosearch, function(i2, searchstr){
            if(data.mapname.toLowerCase().includes(searchstr)){
                found = true;
            }
        });
        if(found){
            tmptotal++;
        }
    });
    if(display){
        return tmptotal;
    } else {
        return (tmptotal/stuff.length)*100;
    }
}
function calcavg(avg){
    return calctot(avg)/stuff.length;
}
function calctot(avg){
    var toadd = 0;
    $.each(stuff, function(i, num){
        toadd += num[avg];
    });
    return toadd;
}
function statSort(mode,statID,display = true){
    var stuff2 = [];
    switch(mode){
        case 0:
            stuff2 = stuff.reduce((b,c) => ((b[b.findIndex(d => d.res == c[statID])]||b[b.push({res:c[statID],count:0})-1]).count++,b),[]).sort(function(obj1, obj2) {
                return obj2.count - obj1.count;
            });
            break;
        case 1:
            $.each(stuff, function(i, thing){
                var tmpwordsold = thing.mapname.replace(/[.,\/#!$%\^&\*;:{}<>+=\-_'`"?~()]/g,'').replace(/[0-9]/g, '').split(' ');
                var tmpwords = [];
                $.each(tmpwordsold, function(i2, word){
                    if(!tmpwords.includes(word) && word){
                        tmpwords.push(word);
                    }
                });
                $.each(tmpwords, function(i2, word){
                    var found = false;
                    $.each(stuff2, function(i3, stuffword){
                        if(stuffword.res == `"${word.toLowerCase()}"`){
                            found = true;
                            stuff2[i3].count++;
                        }
                    });
                    if(!found){
                        stuff2.push({ res: `"${word.toLowerCase()}"`, count: 1 });
                    }
                });
            });
            stuff2 = stuff2.sort(function(obj1, obj2) {
                return obj2.count - obj1.count;
            });
            break;
    }
    var toReturn = `<p class="statstxtclip">`;
    var lnum = 0;
    var lastres = 0;
    var nextres = 1;
    $.each(stuff2, function(i, thing){
        if(i < 10){
            var ctouse = '#888';
            if(lastres != thing.count){
                lnum = nextres;
            }
            if(lnum == 1){
                ctouse = c_gold;
            } else if(lnum == 2){
                ctouse = c_silv;
            } else if(lnum == 3){
                ctouse = c_bron;
            }
            toReturn += `<span style="color:${ctouse}">${getOrdinal(lnum)}. <b>${thing.count}</b> - <i>${thing.res}</i></span><br/>`;
            lastres = thing.count;
            nextres++;
        }
    });
    toReturn += `</p>`;
    if(display){
        return toReturn;
    } else {
        return stuff2.length;
    }
}

$('select').change(function(){
    updateStuff($('#sel1').val(), $('#sel2').val());
});

$('#statstoggle').click(function(){
    instatsview ^= true;
    updateStuff($('#sel1').val(), $('#sel2').val());
});