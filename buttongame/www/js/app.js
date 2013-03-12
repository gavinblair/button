var buttonGame = function(){

	buttonGame.prototype.gamecenter = false;

	
	cordova.addConstructor(function() {
		//cordova is ready, dom might not be
	});
	
	//dom ready. cordova probably is?
	document.addEventListener( "DOMContentLoaded", function(){
	
		
		buttonGame.prototype.gamecenter = new GameCenter();
		

		var gamecenter = buttonGame.prototype.gamecenter;

		//fastclick
		new FastClick(document.getElementById('container'));

		//show the sign-in screen
		document.getElementById('container').innerHTML = ich.welcome();

		//if we are already logged into the game center, show the game center
		if(gamecenter){
			gamecenter.showLobby();

			buttonGame.prototype.startListening(function(data){
				//we can show the game board and use data to modify it
				/**/console.log(data);

				document.getElementById('container').innerHTML = ich.game();

				myAvatar = counter('myAvatar');
				theirAvatar = counter('theirAvatar');







				
			});
		}

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

	function counter(id){
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
        var sec = r.path().attr(param).attr({arc: [maxscore, maxscore, R]});
        sec.animate({arc: [maxscore, maxscore, R]}, 900, ">");

        return {r: r, sec: sec}
	}

	function updateVal(value, total, hand) {
      if (!value || value == total) {
          value = total;
          hand.sec.animate({arc: [value, total, 33]}, 750, "bounce", function () {
              hand.sec.attr({arc: [0, total, 33]});
          });
      } else {
          hand.sec.animate({arc: [value, total, 33]}, 750, "elastic");
      }
  };

  this.punch = function(el) {
		gamecenter.sendMessage('punch');
		$(el).removeClass('punch');
		setTimeout(function(){
			$(el).addClass('punch');
		}, 0);
	}

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