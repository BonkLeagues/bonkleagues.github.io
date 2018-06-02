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