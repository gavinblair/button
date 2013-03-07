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
			//show the game board, wait for the Game Center popup to come up first
			if(gameCenter){
				setTimeout(function(){
					game.domGameBoard = ich.game();
					document.getElementById('container').innerHTML = game.domGameBoard;
				}, 1000);
				gameCenter.getMatch();
				gameCenter.startListening(function(data){
					game.receivedMessage(data, gameCenter);
				});
			} else {
				//browser mode
				game.domGameBoard = ich.game();
				document.getElementById('container').innerHTML = game.domGameBoard;
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