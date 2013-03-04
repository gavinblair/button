document.addEventListener("deviceready", deviceready(), false);

function deviceready(){
	//device ready, dom not ready

}

document.addEventListener( "DOMContentLoaded", function(){
	//dom ready

	//fastclick
	new FastClick(document.getElementById('container'));

	document.getElementById('container').innerHTML = ich.lobby({

	});
	

}, false );

function newgame(){
	document.getElementById('container').innerHTML = ich.game();
}
function settings(){
	document.getElementById('container').innerHTML = ich.settings();
}