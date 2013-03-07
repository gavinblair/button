var gameManager = function(){

	gameManager.prototype.games = [];
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
		gameManager.prototype.games.push(new buttonGame());
		var game = gameManager.prototype.games[gameManager.prototype.games.length-1];
		game.init(function(){
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
			//add the game to the lobby

		});
	}
	gameManager.prototype.showSettings = function(){
		document.getElementById('container').innerHTML = ich.settings();
	}
	gameManager.prototype.backToLobby = function(){
		document.getElementById('container').innerHTML = ich.lobby({
			games: gameManager.prototype.games
		});
	}

};

var app = new gameManager();