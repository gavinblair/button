
var GameCenter = function() {
    
    GameCenter.prototype.lastMessage = "";

    GameCenter.prototype.getMatch = function() {
        cordova.exec(function(data){
            alert(data)
        }, null, "GCHelper", "getMatch", []);
    };
    
    GameCenter.prototype.startListening = function() {
        setInterval(function(){
            cordova.exec(function(data){
                if(data != GameCenter.prototype.lastMessage){
                    GameCenter.prototype.lastMessage = data;
                    alert(data);
                }
            }, null, "GCHelper", "getMessage", []);      
        },10);
    };
    
};
