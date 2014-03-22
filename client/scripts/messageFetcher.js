var lastUpdated = new Date("March 10, 2014");

$(document).ready(function() {

  // Receives array of messages, puts them in appropriate room, updates 'lastUpdated', and sets 'fetch' to run again after delay.
  var updateMessages = function(response) {
    //console.log(response.results);
    _.each(response.results, function(messageObj) {
      if(messageObj.roomname === "" || !messageObj.roomname) {
        messageObj.roomname = "lobby";
      }
      if(rooms[messageObj.roomname] === undefined) {
        rooms[messageObj.roomname] = new Room(messageObj.roomname);
      }
      roomsView.addRoom(messageObj.roomname);
      //debugger;
      rooms[messageObj.roomname].addMessage(messageObj);
      if( (new Date(messageObj.updatedAt)).valueOf() > lastUpdated.valueOf() ) {
        lastUpdated = new Date(messageObj.updatedAt);
        //console.log("date updated to: ", lastUpdated);
      }
    });
    setTimeout(fetch, 1000);
  };

  // Fetches new messages and passes them to updateMessages method.
  var fetch = function() {
    var obj = {
      updatedAt: {
        "$gt": {
          "__type": "Date",
          "iso": lastUpdated
        }
      }
    };
    $.get('https://api.parse.com/1/classes/chatterbox?where=' + encodeURIComponent(
      JSON.stringify(obj)
    ), updateMessages);
  };

  messageView.template = $('#message-template').html();

  var activateRoom = function(){
    var roomname;
    var roomsRegEx = /^#\/room\/[\w]+\/?/;
    if(roomsRegEx.test(window.location.hash)) {
      console.log("detected URL");
      roomname = window.location.hash.replace("#/room/", "").replace(/\//g,"");
      // debugger;
    } else {
      roomname = "lobby";
    }
    messageView.changeSource(roomname);
  };
  activateRoom();
  window.onhashchange = activateRoom;
  fetch();

  $('nav').click(function(){return true;});
});


