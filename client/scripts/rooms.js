// YOUR CODE HERE:

// This gets an array of the last 100 messages as objects.
//$.get('https://api.parse.com/1/classes/chatterbox', function(a,b){console.log(a,b);});

// $.get('https://api.parse.com/1/classes/chatterbox?where=' + encodeURIComponent(JSON.stringify({
//   updatedAt : {$gt : new Date("2013-10-08T00:30:38.133Z")}
// })), function(a,b){console.log(a,b);});

var Room = function(roomname) {
  this.roomname = roomname;
  this.lastUpdated = 0;
  this.messages = [];
  this.messageIDs = {};
  this.newMessageNotifier = function(messageObj) {
    return true;
  };
};

Room.prototype.addMessage = function(messageObj) {
  if(this.messageIDs[messageObj.objectId] === undefined) {
    this.messageIDs[messageObj.objectId] = true;
    this.messages.push(messageObj);
    if(this.messages.length > 200){
      this.messages.shift();
    }
    this.newMessageNotifier(messageObj);
  }
};

var rooms = {
  lobby: new Room("lobby")
};
