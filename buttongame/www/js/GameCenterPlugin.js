
var GameCenter = function() {

    this.login = function() {
        cordova.exec(null, null, "GCTurnBasedMatchHelper", "login", []);
    };
    
    this.showLobby = function() {
        cordova.exec(function(data){
            //shows the gamecenter's list of matches (and the option to start a match)
            //will open the gamecenter app's login if not logged in
            //returns immediately so there's nothing really to do here...
        }, null, "GCTurnBasedMatchHelper", "getMatch", []);
    };
    
    this.sendTurn = function(board){
        cordova.exec(function(data){
            //successfully sent
        }, null, "GCTurnBasedMatchHelper", "sendTurn", [board]);
    };
    
    GameCenter.prototype.lastMessage = '';
    GameCenter.prototype.listenerCallback = null;
    this.startListening = function(callback) {
        GameCenter.prototype.listenerCallback = callback;
        setInterval(function(){
            cordova.exec(function(data){
                // var1=value&var2=value2&etc=era
                data = data.split('&');
                for(var i in data){
                    var parts = data[i].split('=');
                    data[parts[0]] = parts[1];
                }
                if(data != null){
                    if(data != GameCenter.prototype.lastMessage){
                        GameCenter.prototype.listenerCallback(data);
                    }
                    GameCenter.prototype.lastMessage = data;
                }
            }, null, "GCTurnBasedMatchHelper", "getMessage", []);
        },1);
    };

    this.sendMessage = function(msg){
        var timeStamp = Math.round(new Date().getTime());
        cordova.exec(function(data){
            //successfully sent
        }, null, "GCTurnBasedMatchHelper", "sendMessage", {msg: msg, timeStamp: timeStamp});
    };
};



    
    