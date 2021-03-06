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
		myRandomNumber = Math.random()*1000,
		theirRandomNumber = null,
		domGameBoard = '',
		myAvatar, theirAvatar;

	buttonGame.prototype.myScore = maxscore;
	buttonGame.prototype.theirScore = maxscore;
	/*document.addEventListener("deviceready", deviceready(), false);
	function deviceready(){
		//device ready, dom not ready

	}*/

	//init
	buttonGame.prototype.init = function(callback){
		$.ajax({
			url: 'game/button.html',
			type: 'get',
			dataType: 'text',
			success: function(data){
				document.getElementById("gametemplates").innerHTML=data;
				ich.grabTemplates();
				buttonGame.prototype.canStart = true;
				setState('Waiting for Opponent...');
				callback();
			}
		});
	};

	buttonGame.prototype.start = function(){

		//this function runs a gajillion times the first time. not sure why.
		setState("Ready for Game to Start");

		//create the avatars
		if(myAvatar == null) {
			myAvatar = counter('myAvatar');
		}
		if(theirAvatar == null) {
			theirAvatar = counter('theirAvatar');
		}
		

		if(buttonGame.prototype.state == 'Ready for Game to Start' && buttonGame.prototype.gameCenter){
			//decide who goes first
			setState("Waiting...");
			if(myRandomNumber > theirRandomNumber) {
				setState("Your Turn");
			}
		}

		if(buttonGame.prototype.bigtimer) {
			clearInterval(buttonGame.prototype.bigtimer);
		}
		buttonGame.prototype.bigtimer = setInterval(bigtick,1000); //bigtick every second

	};

	function counter(id){
		var r = Raphael(id, 76, 76);
		/*r.canvas.style.position = 'absolute';
		r.canvas.style.top = 0;
		r.canvas.style.left = 0;*/

        var R = 33;
        var param = {stroke: "#000", "stroke-width": 10};
        r.customAttributes.arc = function (value, total, R) {
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = 38 + R * Math.cos(a),
                y = 38 - R * Math.sin(a),
                color = "rgb(78,204,78)",
                path;
            if (total == value) {
                path = [["M", 38, 38 - R], ["A", R, R, 0, 1, 1, 37.99, 38 - R]];
            } else {
                path = [["M", 38, 38 - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
            }
            return {path: path, stroke: color};
        };
        var sec = r.path().attr(param).attr({arc: [maxscore, maxscore, R]});
        sec.animate({arc: [maxscore, maxscore, R]}, 900, ">");
        //updateVal(maxscore, maxscore, 33, sec);

        return {r: r, sec: sec}
	}

	buttonGame.prototype.receivedMessage = function(data, gameCenter){
		buttonGame.prototype.gameCenter = gameCenter;
		try{
			data = $.parseJSON(data);
		} catch(e){}
		var reply = {};
		switch(buttonGame.prototype.state){
			case 'Waiting for Opponent...':
				setTimeout(function(){ // i don't know why this helps
					var reply = {};
					if(theirRandomNumber != null){
						buttonGame.prototype.start();
					} else {
						reply.myNumber = myRandomNumber;
						if(data.myNumber){
							theirRandomNumber = data.myNumber;
						}
					}
					reply = JSON.stringify(reply);
					if(reply != "" && reply != "{}") {
						buttonGame.prototype.gameCenter.sendMessage(reply);
					}
				}, 500);
			break;
			case 'Your Turn':
				//our turn
				//were we punched?
				if(data.message == 'punch' && data.timeStamp != JSON.parse(buttonGame.prototype.gameCenter.lastMessage).timeStamp){
					$('#myAvatar').removeClass('punch');
					setTimeout(function(){
						$('#myAvatar').addClass('punch');
					}, 0);
				}
			break;
			case 'Waiting...':
				//are they done yet?
				if(data.message == 'your turn' && data.timeStamp != JSON.parse(buttonGame.prototype.gameCenter.lastMessage).timeStamp){
					setState('Your Turn');
				}
				//were we punched?
				if(data.message == 'punch' && data.timeStamp != JSON.parse(buttonGame.prototype.gameCenter.lastMessage).timeStamp){
					$('#myAvatar').removeClass('punch');
					setTimeout(function(){
						$('#myAvatar').addClass('punch');
					}, 0);
				}
			break;
		}

		reply = JSON.stringify(reply);
		if(reply != "" && reply != "{}") {
			buttonGame.prototype.gameCenter.sendMessage(reply);
		}
	}

	function bigtick(){
		if(buttonGame.prototype.state == "Your Turn" || !buttonGame.prototype.gameCenter){
			//update my score
			if(buttonGame.prototype.myScore > 0) {
				buttonGame.prototype.myScore = buttonGame.prototype.myScore - 1000;
				updateVal(buttonGame.prototype.myScore, maxscore, 33, myAvatar);
			} else {
				alert("You Lose!");
			}
		} else if(buttonGame.prototype.state == "Waiting..."){
			if(buttonGame.prototype.theirScore > 0) {
				buttonGame.prototype.theirScore = buttonGame.prototype.theirScore - 1000;
				updateVal(buttonGame.prototype.theirScore, maxscore, 33, theirAvatar);
			} else {
				alert("You Win!");
			}
		}
	}

	function setState(state){
		if(buttonGame.prototype.state != state){
			if($("#state").length) {
				document.getElementById('state').innerHTML = buttonGame.prototype.state = state;
				document.getElementById('sarcastic').innerHTML = getRandomSarcasticRemark();
			}
			if(state == 'Your Turn'){
				$("#thebutton").removeClass('off');
				$('#thebutton').attr('ontouchstart', 'app.game.buttonClick()');
			} else if (state == 'Waiting...'){
				$("#thebutton").addClass('off');
				$('#thebutton').attr('ontouchstart', '');
			}
		}
	}

	buttonGame.prototype.punch = function(el) {
		buttonGame.prototype.gameCenter.sendMessage(JSON.stringify({message:'punch', timeStamp: (Math.round(new Date().getTime()))}));
		$(el).removeClass('punch');
		setTimeout(function(){
			$(el).addClass('punch');
		}, 0);
	}

	buttonGame.prototype.buttonClick = function(){
		if(buttonGame.prototype.state != 'Waiting...'){
			buttonGame.prototype.gameCenter.sendMessage(JSON.stringify({message:'your turn', timeStamp: (Math.round(new Date().getTime()))}));
			setState('Waiting...');
		}
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
	function updateVal(value, total, R, hand) {
        if (!value || value == total) {
            value = total;
            hand.sec.animate({arc: [value, total, R]}, 750, "bounce", function () {
                hand.sec.attr({arc: [0, total, R]});
            });
        } else {
            hand.sec.animate({arc: [value, total, R]}, 750, "elastic");
        }
    };
};