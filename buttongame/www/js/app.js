var buttonGame = function(){

	buttonGame.prototype.gamecenter = new GameCenter();
	buttonGame.prototype.settings = {
		maxScore: 1000*60*2 //2 minutes
	};
	buttonGame.prototype.gameData = {};


	cordova.addConstructor(function() {
		//cordova is ready, dom might not be
		setTimeout(function(){
			var gamecenter = buttonGame.prototype.gamecenter;

			//if we are already logged into the game center, show the game center
			gamecenter.showLobby();

			gamecenter.startListening(function(data){
				if(data.photos){
					console.log(data);
				} else if(data.game){
					buttonGame.prototype.gameData = data;
					//we can show the game board and use data to modify it
					document.getElementById('container').innerHTML = ich.game();
					
					var myAvatar = buttonGame.prototype.counter('myAvatar');
					var theirAvatar = buttonGame.prototype.counter('theirAvatar');
					
					if(data.game == 'new'){
						data.myScore = buttonGame.prototype.settings.maxScore;
						data.theirScore = buttonGame.prototype.settings.maxScore;
					}
					
					buttonGame.prototype.updateVal(data.myScore, myAvatar);
					buttonGame.prototype.updateVal(data.theirScore, theirAvatar);
					
					data.myTempScore = data.myScore;
					data.theirTempScore = data.theirScore;
					
					
					if(data.turn == 'mine'){
						$('#thebutton').removeClass('off');
					}

					buttonGame.prototype.timer = setInterval(function(){
						var data = buttonGame.prototype.gameData;
						
						//depending on whose turn it is, update their avatar
						//we're updating their score, but this is just for show. 
						//we'll use actual time differences
						//when it comes to updating the game information
						var updateAvatar;
						var updateScore;
						if(data.turn == 'mine') {
							updateAvatar = myAvatar;
							if(data.myTempScore > 1000) {
								data.myTempScore-=1000;
							} else {
								data.myTempScore = 0;
							}
							updateScore = data.myTempScore;
						} else {
							updateAvatar = theirAvatar;
							if(data.theirTempScore > 1000){
								data.theirTempScore-=1000;
							} else {
								data.theirTempScore = 0;
							}
							updateScore = data.theirTempScore;
						}
						buttonGame.prototype.updateVal(updateScore, updateAvatar);

					}, 1000);


				} else if(data.punch){
					//punch!
					buttonGame.prototype.punch(document.getElementById('myAvatar'));
				}
			});
		},1000);
	});

	//dom ready. cordova probably is?
	document.addEventListener( "DOMContentLoaded", function(){

		var gamecenter = buttonGame.prototype.gamecenter;

		//fastclick
		new FastClick(document.getElementById('container'));

		//show the sign-in screen
		document.getElementById('container').innerHTML = ich.welcome();

	}, false );

	this.login = function(){
		var gamecenter = buttonGame.prototype.gamecenter;
		if(gamecenter){
			gamecenter.login();
		} else {
			document.getElementById('container').innerHTML = ich.game();
		}
	};

	this.backToLobby = function(){
		document.getElementById('container').innerHTML = ich.welcome();
	};

	buttonGame.prototype.counter = function (id){
		
		var r = Raphael(id, 76, 76);
		
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
		var total = buttonGame.prototype.settings.maxScore;
        var sec = r.path().attr(param).attr({arc: [total-1, total, R]});
		
  	    
        return {r: r, sec: sec}
	}

	buttonGame.prototype.updateVal = function(value, hand) {
			var total = buttonGame.prototype.settings.maxScore;
      if (!value || value == total) {
          value = total;
          hand.sec.animate({arc: [value, total, 33]}, 750, "bounce", function () {
              hand.sec.attr({arc: [0, total, 33]});
          });
      } else {
          hand.sec.animate({arc: [value, total, 33]}, 750, "elastic");
      }
  }

  this.sendTurn = function(){
  	var gamecenter = buttonGame.prototype.gamecenter;
  	/**/alert('send turn');
  };

  buttonGame.prototype.punch = function(el) {
		var gamecenter = buttonGame.prototype.gamecenter;

		if($(el).attr('id') == 'theirAvatar'){
			gamecenter.sendMessage('punch');
		}
		$(el).removeClass('punch');
		setTimeout(function(){
			$(el).addClass('punch');
		}, 0);
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

var game = new buttonGame();