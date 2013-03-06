
var GameCenter = function() {
    
    GameCenter.prototype.lastMessage = "";
    var matchStarted = false;

    GameCenter.prototype.getMatch = function() {
        cordova.exec(function(data){

        }, null, "GCHelper", "getMatch", []);
    };
    GameCenter.prototype.listenerCallback = null;
    
    GameCenter.prototype.startListening = function(callback) {
        GameCenter.prototype.listenerCallback = callback;
        setInterval(function(){
            cordova.exec(function(data){
                if(data != null){
                    GameCenter.prototype.lastMessage = data;
                    if(data == "Match started"){
                        matchStarted = true;
                    }
                    if(matchStarted){
                        GameCenter.prototype.listenerCallback(data);
                    }
                }
            }, null, "GCHelper", "getMessage", []);
        },1);
    };

    GameCenter.prototype.sendMessage = function(message){
        cordova.exec(function(data){
            //successfully sent
        }, null, "GCHelper", "sendMessage", [message]);
    }
    
};
