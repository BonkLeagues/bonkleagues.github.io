if(window.location.search.substr(1)){
    $('#framebox').html('<iframe src="editorframe.html?'+window.location.search.substr(1)+'"></iframe>');
} else {
    $('#framebox').html('<iframe src="editorframe.html"></iframe>');
}