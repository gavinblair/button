var gameManager = function(game){

	var games = [];
	gameManager.prototype.game = game;

	document.addEventListener("deviceready", deviceready(), false);
	function deviceready(){
		//device ready, dom not ready

	}

	document.addEventListener( "DOMContentLoaded", function(){
		//dom ready

		//fastclick
		new FastClick(document.getElementById('container'));

		document.getElementById('container').innerHTML = ich.lobby({ /**///lobby

		});
		

	}, false );



	gameManager.prototype.newGame = function(){
		if(game.canStart) {
			document.getElementById('container').innerHTML = ich.game();
			game.start();
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