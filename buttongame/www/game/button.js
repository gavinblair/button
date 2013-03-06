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

	var maxscore = 1000*60*2, // 1000*60*number of minutes
		myscore = maxscore,
		theirscore = maxscore,
		myAvatarCTX,
		theirAvatarCTX;

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
	}, false);

	buttonGame.prototype.start = function(){
		setState("Starting Game...");

		//create the avatars
		var myCanvas = document.createElement('canvas');
		var theirCanvas = document.createElement('canvas');
		myCanvas.height = theirCanvas.height = myCanvas.width = theirCanvas.width = 76;

		myAvatarCTX = myCanvas.getContext('2d');
		theirAvatarCTX = theirCanvas.getContext('2d');

		myAvatarCTX.strokeStyle = 'rgba(0,0,0,0)';
		myAvatarCTX.arc(38,38,28,0,Math.PI*2,true);
		myAvatarCTX.clip();

		$('.avatar img')[0].addEventListener('load', function(e){
			myAvatarCTX.drawImage(this,0,0,210,210,0,0,56,56);
			myAvatarCTX.stroke();
		}, true);

		$('.avatar img')[0].parentNode.insertBefore(myCanvas, $('.avatar img')[0].nextSibling);
		$('.avatar img').hide();

		buttonGame.prototype.buttonClick();

		buttonGame.prototype.timer = setInterval(tick,1); //tick every millisecond


		/* remove this, it's just the AI *//*(function loop() {
		    var rand = Math.round(Math.random() * (5000 - 500)) + 500;
		    setTimeout(function() {
		    		if(!$('#thebutton').hasClass('off')){
		            	buttonGame.prototype.punch($('.avatar')[0]);
		            }
		            loop();  
		    }, rand);
		}());*/
		/* remove this, it's more AI *//*(function loop() {
		    var rand = Math.round(Math.random() * (10000 - 500)) + 500;
		    setTimeout(function() {
		            if($('#thebutton').hasClass('off')){
		            	buttonGame.prototype.buttonClick();
		            }
		            loop();  
		    }, rand);
		}());*/
	};

	function tick(){
		if(buttonGame.prototype.state == "Your Turn"){
			//update my score
			myscore--;
			//redraw

		} else if(buttonGame.prototype.state == "Waiting..."){
			//update their score
			theirscore--;
			//redraw

		}

	}

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