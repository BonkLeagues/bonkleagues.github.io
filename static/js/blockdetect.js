//Adblock detection
function adBlockDetected() {
	$('#adbnote').show();
}
if(typeof blockAdBlock === 'undefined') {
	adBlockDetected();
} else {
	blockAdBlock.onDetected(adBlockDetected);
}