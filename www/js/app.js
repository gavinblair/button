document.addEventListener("deviceready", deviceready(), false);

function deviceready(){
	//device ready, dom not ready

}

document.addEventListener( "DOMContentLoaded", function(){
	//dom ready

	//fastclick
	//new FastClick(document.getElementById('container'));

	document.getElementById('container').innerHTML = ich.lobby({ /**///lobby

	});
	

}, false );

function newgame(){
	document.getElementById('container').innerHTML = ich.game();
}
function settings(){
	document.getElementById('container').innerHTML = ich.settings();
}
function buttonclick(){
	el = document.getElementById('thebutton');
	el.className = (new RegExp( "off" )).test( el.className ) ? el.className.replace( (new RegExp( "off" )), "" ) : el.className + " " + "off"; el.className = el.className.trim();
}