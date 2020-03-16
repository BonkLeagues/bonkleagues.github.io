if(window.location.search.substr(1)){
    $('#framebox').html('<iframe src="editorframe.html?'+window.location.search.substr(1)+'"></iframe>');
} else {
    $('#framebox').html('<iframe src="editorframe.html"></iframe>');
}

window.onbeforeunload = function(e) {
    var dialogText = 'Warning: leaving the page may discard unsaved changes!';
    e.returnValue = dialogText;
    return dialogText;
};

function showVid() {
    cpmstarAPI({ kind:"game.displayInterstitial" });
    /*
    var s = document.querySelector('script[data-playerPro="current"]');
    (playerPro = window.playerPro || []).push({
        id: "zalxl3oVclN9gMM1gqck7injlzJWjMw5zJRJkRTW621US4bVqCmZ", after: s, init: function (api) {
            if (api) {
                api.on('AdError', function(m, e) {
                    cpmstarAPI({ kind:"game.displayInterstitial" });
                });
            }
        }
    });*/
}

setInterval(showVid, 90000);