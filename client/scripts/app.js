var app = window.app = {};

app.init = function(){

  app.server = "http://chattery.azurewebsites.net/classes/chatterbox";
  app.wordRegEx = /^[a-zA-Z0-9\_]+$/;
  app.roomsRegEx = /^#\/room\/[\w]+\/?/;
  app.timeInterval = 1000;
  app.lastUpdated = new Date("March 10, 2014");

  //object for html escaping.
  app.entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  //caching jQuery selectors
  app.$nav = $('nav');
  app.$roomList = $(".roomlist");
  app.$messages = $('.messages');
  app.$submit = $('#submit');
  app.$form = $('form');
  app.$box = $('form input[type="text"]');
  app.$body = $(document.body);

  app.messageView.template = $('#message-template').html();
  app.username = (window.location.search.match(/^\?username=([\w]+)/))[1].slice() || "anonymous";

  //Start it up...
  app.activateRoom();
  app.setUpEventHandlers();
  app.fetch();

};

//    `.---              .    ,-_/,.           . .
//     |__  .  , ,-. ,-. |-   ' |_|/ ,-. ,-. ,-| |  . ,-. ,-.
//    ,|    | /  |-' | | |     /| |  ,-| | | | | |  | | | | |
//    `^--- `'   `-' ' ' `'    `' `' `-^ ' ' `-' `' ' ' ' `-|
//                                                         ,|
//                                                         `'

app.setUpEventHandlers = function(){

  //Set up router
  window.onhashchange = app.activateRoom;
  app.$form.on('submit', app.handleSubmit);
};

app.handleMessages = function(response) {

  // Adds each of the messages and calls fetch again in a second.
  _.each(response.results.reverse(), app.addMessage);
  setTimeout(app.fetch, app.timeInterval);

};

app.handleSubmit = function(event){
  event.preventDefault();
  if(app.$box.val() === ""){
    return false;
  }
  var messageObj = {
    text: app.$box.val(),
    username: app.username,
    roomname: app.messageView.source.roomname
  };
  app.$box.val("");
  app.send(messageObj);
};



//    .---.                        ,---.
//    \___  ,-. ,-. .  , ,-. ,-.   |  -' ,-. ,-,-. ,-,-. ,-.
//        \ |-' |   | /  |-' |     |  -. | | | | | | | | `-.
//    `---' `-' '   `'   `-' '     `---' `-' ' ' ' ' ' ' `-'

app.fetch = function(){

  //prepare query object
  var obj = {
      updatedAt: {
        "$gt": {
          "__type": "Date",
          "iso": app.lastUpdated
        }
      }
  };
  //prepares URL string. Since jQuery is erroring out.
  var string = app.server + '?order=-createdAt&where=' + encodeURIComponent( JSON.stringify(obj) );
  //console.log(string);
  $.ajax({
    url: string,
    success: app.handleMessages,
    type: 'GET',
    dataType: "json"
  });

};

app.send = function(messageObj){
  $.ajax({
    url: app.server,
    data : JSON.stringify(messageObj),
    success: function(e) { console.log(e); },
    type: 'POST',
    dataType: "json",
    contentType: "application/json",
    error: function(e) { console.log(e); }
  });
};





//    ,-.  .   .    \    .
//      |  |  -|- . |  . |- . ,-. ,-.
//      |  | . |  | |  | |  | |-' `-.
//      `--^-' `' ' `' ' `' ' `-' `-'

app.addMessage = function(messageObj) {

  //if roomname is not defined, it defaults to 'lobby'.
  if(messageObj.roomname === "" || !messageObj.roomname) {
    messageObj.roomname = "lobby";
  }

  //if the room doesn't already exist, it is created.
  if(app.rooms[messageObj.roomname] === undefined) {
    app.rooms[messageObj.roomname] = new app.Room(messageObj.roomname);
  }
  //The roomname is also added to the list of links. Which does it's own check.
  app.roomsView.addRoom(messageObj.roomname);

  //The new message is added to the room.
  app.rooms[messageObj.roomname].addMessage(messageObj);

  //The app.lastUpdated value is updated.
  if( (new Date(messageObj.updatedAt)).valueOf() > app.lastUpdated.valueOf() ) {
    app.lastUpdated = new Date(messageObj.updatedAt);
  }

};

app.clearMessages = function(){
  //just $('#chats').html("") I think
  $('#chats').html("");
};

app.addRoom = function(roomName){
  // Let user create a new room.
};

app.addFriend = function(username){
  //call when username is clicked.
};







//        ooo        ooooo                 .o8            oooo
//        `88.       .888'                "888            `888
//         888b     d'888   .ooooo.   .oooo888   .ooooo.   888   .oooo.o
//         8 Y88. .P  888  d88' `88b d88' `888  d88' `88b  888  d88(  "8
//         8  `888'   888  888   888 888   888  888ooo888  888  `"Y88b.
//         8    Y     888  888   888 888   888  888    .o  888  o.  )88b
//        o8o        o888o `Y8bod8P' `Y8bod88P" `Y8bod8P' o888o 8""888P'
//////////////////////////////////////////////////////////////////////////////////////
// Helper Function //
app.Room = function(roomname) {
  this.roomname = roomname;
  this.lastUpdated = 0;
  this.messages = [];
  this.messageIDs = {};
  this.newMessageNotifier = function(messageObj) {
    return true;
  };
};

app.Room.prototype.addMessage = function(messageObj) {
  //debugger;
  if(this.messageIDs[messageObj.objectId] === undefined) {
    this.messageIDs[messageObj.objectId] = true;
    this.messages.push(messageObj);

    //messages older than 200 are purged
    if(this.messages.length > 200){
      this.messages.shift();
    }

    //trigger for any listener;
    this.newMessageNotifier(messageObj);
  }
};
//////////////////////////////////////////////////////////////////////////////////////

//Message data for various rooms.
app.rooms = {
  lobby: new app.Room("lobby")
};









//      oooooo     oooo  o8o
//       `888.     .8'   `"'
//        `888.   .8'   oooo   .ooooo.  oooo oooo    ooo  .oooo.o
//         `888. .8'    `888  d88' `88b  `88. `88.  .8'  d88(  "8
//          `888.8'      888  888ooo888   `88..]88..8'   `"Y88b.
//           `888'       888  888    .o    `888'`888'    o.  )88b
//            `8'       o888o `Y8bod8P'     `8'  `8'     8""888P'


app.messageView = {
  source: undefined,
  nodes: [],
  template: null,
  render: function(obj){
    var html = app.templater(app.messageView.template, obj);
    app.$messages.append(html);
    app.$body.scrollTop(999999);
  },
  changeSource: function(roomname){
    //debugger;
    if(!!app.messageView.source){
      app.messageView.source.newMessageNotifier = function(){return null;};
    }
    if(app.rooms[roomname] === undefined){
      app.rooms[roomname] = new app.Room(roomname);
    }
    app.messageView.source = app.rooms[roomname];
    app.$messages.html("");
    app.messageView.renderAll();
    app.messageView.source.newMessageNotifier = function(obj){
      app.messageView.render(obj);
    };
  },
  renderAll : function(){
    _.each(app.messageView.source.messages, function(obj){
      app.messageView.render(obj);
    });
  }
};

app.roomsView = {
  rooms: {},
  addRoom: function(roomname) {
    if(!app.roomsView.rooms[roomname] && app.wordRegEx.test(roomname)) {
      app.roomsView.rooms[roomname] = true;

      //Have to re-do this to use the template.
      var html = "<a href='#/room/" + roomname + "'>"+ roomname +"</a>";
      app.$roomList.append(html);
    }
  }
};






// ooooooooooooo                                        oooo                .
// 8'   888   `8                                        `888              .o8
//      888       .ooooo.  ooo. .oo.  .oo.   oo.ooooo.   888   .oooo.   .o888oo  .ooooo.  oooo d8b
//      888      d88' `88b `888P"Y88bP"Y88b   888' `88b  888  `P  )88b    888   d88' `88b `888""8P
//      888      888ooo888  888   888   888   888   888  888   .oP"888    888   888ooo888  888
//      888      888    .o  888   888   888   888   888  888  d8(  888    888 . 888    .o  888
//     o888o     `Y8bod8P' o888o o888o o888o  888bod8P' o888o `Y888""8o   "888" `Y8bod8P' d888b
//                                            888
//                                           o888o

app.escapeHtml = function(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return app.entityMap[s];
  });
};

app.templater = function(string, object) {
  string = string || "";
  var copy = string.slice();
  var escapedVar;

  for(var key in object) {
    escapedVar = new RegExp("{{" + key + "}}",'gm');
    //var nonEscapedVar = new RegExp("{{{" + key + "}}}",'gm');

    var escapedValue = app.escapeHtml(object[key]);
    copy = copy.replace(escapedVar, escapedValue);
  }

  //remove any other variables not found on the object.
  copy = copy.replace(/\{\{[\s]*[\w]+[\s]*\}\}/g, "");
  return copy;
};






//    ooooooooo.                             .
//    `888   `Y88.                         .o8
//     888   .d88'  .ooooo.  oooo  oooo  .o888oo  .ooooo.  oooo d8b
//     888ooo88P'  d88' `88b `888  `888    888   d88' `88b `888""8P
//     888`88b.    888   888  888   888    888   888ooo888  888
//     888  `88b.  888   888  888   888    888 . 888    .o  888
//    o888o  o888o `Y8bod8P'  `V88V"V8P'   "888" `Y8bod8P' d888b


app.activateRoom = function(){
  var roomname;

  if(app.roomsRegEx.test(window.location.hash)) {
    console.log("detected URL");
    roomname = window.location.hash.replace("#/room/", "").replace(/\//g,"");
    // debugger;
  } else {
    roomname = "lobby";
  }
  app.messageView.changeSource(roomname);
};

