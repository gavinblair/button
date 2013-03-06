var gameManager = function(game){

	var games = [];
	gameManager.prototype.game = game;
	gameManager.prototype.gameCenter = null;
	var gameCenter;

	
	cordova.addConstructor(function() {
	    gameCenter = new GameCenter();
	});

	document.addEventListener( "DOMContentLoaded", function(){
		//dom ready

		//fastclick
		new FastClick(document.getElementById('container'));

		document.getElementById('container').innerHTML = ich.lobby({ /**///lobby

		});
		

	}, false );



	gameManager.prototype.newGame = function(){
		if(game.canStart) {
			if(gameCenter){
				gameCenter.getMatch();
				gameCenter.startListening();
			} else {
				document.getElementById('container').innerHTML = ich.game();
				game.start();
			}
		}
	}
	gameManager.prototype.showSettings = function(){
		document.getElementById('container').innerHTML = ich.settings();
	}
	gameManager.prototype.backToLobby = function(){
		document.getElementById('container').innerHTML = ich.lobby();
	}

};

var app = new gameManager(new buttonGame());