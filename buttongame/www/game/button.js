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
	buttonGame.prototype.randomNumber = Math.random()*1000;
	buttonGame.prototype.theirNumber = null;
	buttonGame.prototype.theyHaveOurNumber = false;

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
				setState('Waiting for Opponent...');
			}
		});
	}, false);

	buttonGame.prototype.start = function(){
		setState("Ready for Game to Start");

		//create the avatars
		var myCanvas = document.createElement('canvas');
		var theirCanvas = document.createElement('canvas');
		myCanvas.height = theirCanvas.height = myCanvas.width = theirCanvas.width = 76;

		myAvatarCTX = myCanvas.getContext('2d');
		theirAvatarCTX = theirCanvas.getContext('2d');

		myAvatarCTX.strokeStyle = 'rgba(0,0,0,0)';
		myAvatarCTX.arc(20,20,20,0,Math.PI*2,true);
		myAvatarCTX.clip();

		$('.avatar img')[0].addEventListener('load', function(e){
			myAvatarCTX.drawImage($('.avatar img')[0],0,0,240,240,0,0,40,40);
			myAvatarCTX.stroke();
			myAvatarCTX.strokeStyle = 'rgba(0,0,0,1)';
			myAvatarCTX.lineWidth = 13;
			myAvatarCTX.arc(40,40,50,0,Math.PI*2,true);
			myAvatarCTX.stroke();
		}, true);

		$('.avatar img')[0].parentNode.insertBefore(myCanvas, $('.avatar img')[0].nextSibling);
		$('.avatar img').hide();

		if(buttonGame.prototype.randomNumber > buttonGame.prototype.theirNumber) {
			//our turn!
			setState("Your Turn");
		} else {
			//their turn!
			setState("Waiting...");
		}

		buttonGame.prototype.timer = setInterval(tick,1); //tick every millisecond

	};

	buttonGame.prototype.receivedMessage = function(data, gameCenter){
		buttonGame.prototype.gameCenter = gameCenter;
		var reply = "";
		switch(buttonGame.prototype.state){
			case 'Waiting for Opponent...':
				//is this a random number?

				if(data.substring(0, 6) == 'random' && buttonGame.prototype.theirNumber == null){
					var parts = data.split(":");
    				buttonGame.prototype.theirNumber = parseInt(parts[1]);
 					reply = "got ur number";
				}

				if(data == 'got ur number'){
					buttonGame.prototype.theyHaveOurNumber = true;
					
					//we have their number, they have ours.
					//it's time to take this relationship to the next step!
					setState('Found Opponent');
					start();
				}
				if(buttonGame.prototype.theirNumber != null){
					buttonGame.prototype.gameCenter.sendMessage('got ur number');
				}
				if(!(buttonGame.prototype.theyHaveOurNumber)){
					//send a ping to our opponent
					buttonGame.prototype.gameCenter.sendMessage('random:'+buttonGame.prototype.randomNumber);
				}
			break;
			case 'Your Turn':
				//our turn
				//were we punched?
				//buttonGame.prototype.punch($('.avatar')[0]);
			break;
			case 'Waiting...':
				//are they done yet?
				if(data == 'your turn'){
					setState('Your Turn');
				}
				//were we punched?
			break;
		}
		buttonGame.prototype.gameCenter.sendMessage(reply);
	}

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
		document.getElementById('sarcastic').innerHTML = getRandomSarcasticRemark();
		if(state == 'Your Turn'){
			$("#thebutton").removeClass('off');
			$('#thebutton').attr('ontouchstart', 'app.game.buttonClick()');
		} else if (state == 'Waiting...'){
			$("#thebutton").addClass('off');
			$('#thebutton').attr('ontouchstart', '');
		}
	}

	buttonGame.prototype.punch = function(el) {
		$(el).removeClass('punch');
		setTimeout(function(){
			$(el).addClass('punch');
		}, 0);
	}

	buttonGame.prototype.buttonClick = function(){
		buttonGame.prototype.gameCenter.sendMessage('your turn');
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