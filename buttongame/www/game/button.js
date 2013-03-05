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
	buttonGame.prototype.state = '';
	buttonGame.prototype.canStart = false;

	/*document.addEventListener("deviceready", deviceready(), false);
	function deviceready(){
		//device ready, dom not ready

	}*/

	//init
	document.addEventListener( "DOMContentLoaded", function(){
		$.ajax({
			url: 'game/button.html',
			type: 'get',
			dataType: 'text',
			success: function(data){
				document.getElementById("gametemplates").innerHTML=data;
				ich.grabTemplates();
				buttonGame.prototype.canStart = true;
				buttonGame.prototype.state = 'Starting Game...';
			}
		});
		/*
		xmlhttp=new XMLHttpRequest();
		xmlhttp.open("POST","game/button.html",true);
		xmlhttp.send();
		xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				document.getElementById("gametemplates").innerHTML=xmlhttp.responseText;
				ich.grabTemplates();
				buttonGame.prototype.canStart = true;
				buttonGame.prototype.state = 'Starting Game...';
			}
		}*/
	}, false);

	buttonGame.prototype.start = function(){
		setState("Starting Game...");
		buttonGame.prototype.buttonClick();

		(function loop() {
		    var rand = Math.round(Math.random() * (5000 - 500)) + 500;
		    setTimeout(function() {
		    		if(!$('#thebutton').hasClass('off')){
		            	buttonGame.prototype.punch($('.avatar')[0]);
		            }
		            loop();  
		    }, rand);
		}());

		(function loop() {
		    var rand = Math.round(Math.random() * (10000 - 500)) + 500;
		    setTimeout(function() {
		            if($('#thebutton').hasClass('off')){
		            	buttonGame.prototype.buttonClick();
		            }
		            loop();  
		    }, rand);
		}());
	};

	function setState(state){
		document.getElementById('state').innerHTML = buttonGame.prototype.state = state;
	}

	buttonGame.prototype.punch = function(el) {
		$(el).removeClass('punch');
		setTimeout(function(){
			$(el).addClass('punch');
		}, 0);
	}

	buttonGame.prototype.buttonClick = function(){
		el = document.getElementById('thebutton');
		el.className = (new RegExp( "off" )).test( el.className ) ? el.className.replace( (new RegExp( "off" )), "" ) : el.className + " " + "off"; el.className = el.className.trim();

		//stop everything
		$('.avatar').children("div").each(function(){ this.style.webkitAnimationPlayState = "paused"; });

		if(buttonGame.prototype.state == "Your Turn"){
			i = 1;
			setState("Waiting...");
			//remove the click handler
			$('#thebutton').attr('ontouchstart', '');
		} else {
			i = 0;
			setState("Your Turn");
			//add the handler back in
			$('#thebutton').attr('ontouchstart', 'app.game.buttonClick()');
		}

		document.getElementById('sarcastic').innerHTML = getRandomSarcasticRemark();

		//don't hurt me
		$($('.avatar')[i]).children("div").each(function(){ this.style.webkitAnimationPlayState = "running"; });

	};

	function getRandomSarcasticRemark(){
		if(buttonGame.prototype.state == 'Waiting...') {
			//just made a move
			var items = [
				'Good show!',
				'Great job!',
				'They didn\'t see THAT coming!',
				'Excellent choice!',
				'Very good!',
				'Yeehaw!',
				'Giddy up!',
				'You are improving!',
				'Great strategy!',
			];
		} else {
			//about to move
			var items = [
				'What will you do?',
				'Decisions, decisions...',
				'What are you waiting for?',
				'Quick!',
				'We\'re waiting...',
				'Are you feeling lucky, punk?',
				'Mash that button!',
			];
		}
		return items[Math.floor(Math.random()*items.length)];		
	};
};