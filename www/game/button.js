/*
*
* buttonGame
* by Gavin Blair
* http://github.com/gavinblair
* 
* requires:
* 	jquery or jqmobi or similar (uses .load() )
* 	icanhaz.js
*
* usage:
* 
* 
 */

var buttonGame = function(){
	buttonGame.prototype.state = 'off';

	buttonGame.prototype.canStart = false;

	//init
	document.addEventListener( "DOMContentLoaded", function(){
		xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET","game/button.html",true);
		xmlhttp.send();
		xmlhttp.onreadystatechange=function() {
  			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				document.getElementById("gametemplates").innerHTML=xmlhttp.responseText;
				ich.grabTemplates();
				buttonGame.prototype.canStart = true;
			}
		}
	}, false);

	buttonGame.prototype.buttonClick = function(){
		el = document.getElementById('thebutton');
		el.className = (new RegExp( "off" )).test( el.className ) ? el.className.replace( (new RegExp( "off" )), "" ) : el.className + " " + "off"; el.className = el.className.trim();
	}
};