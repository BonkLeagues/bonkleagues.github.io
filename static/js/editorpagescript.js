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
    var s = document.querySelector('script[data-playerPro="current"]');
    (playerPro = window.playerPro || []).push({
        id: "zalxl3oVclN9gMM1gqck7injlzJWjMw5zJRJkRTW621US4bVqCmZ", after: s, init: function (api) {
            if (api) {
                /*
                api.on('AdVideoFirstQuartile', function () {
                    if (api.getAdSkippableState()) {
                        $("#skipButton").unbind();
                        $("#skipButton").show();
                        $("#skipButton").click(function() {
                            console.log(api.getAdSkippableState());
                            api.skipAd();
                        });
                    }
                });

                api.on('AdStopped', function () {
                    $("#skipButton").unbind();
                    $("#skipButton").hide();
                });*/
            }
        }
    });
}

setInterval(showVid, 150000); //2.5 mins