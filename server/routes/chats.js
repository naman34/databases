var _ = require('underscore');

var rooms = [
  {
    username: 'naman34',
    text: "test data",
    updatedAt: new Date(),
    createdAt: new Date(),
    roomname: "lobby",
    objectId: ((new Date()).valueOf()).toString(36)
  },
  {
    username: 'naman34',
    text: "test data",
    updatedAt: new Date(),
    createdAt: new Date(),
    roomname: "lobby",
    objectId: ((new Date()).valueOf()).toString(36)
  }
];

exports.get = function(req, res){
  res.end(JSON.stringify({
    success: true,
    results: rooms
  }));
};

exports.post = function(req, res){
  var body = "";
  req.on('data', function (data) {
      body += data;
  });
  req.on('end', function () {
      console.log(body);
      var messages = JSON.parse(body);
      if(!Array.isArray(messages)){
        messages = [messages];
        console.log("MESSAGES: ", messages);
      }
      messages = _.map(messages, function(message){
        message.text = message.text || "nothing";
        message.username = message.username || "nothing";
        message.roomname = message.roomname || 'lobby';
        message.createdAt = new Date();
        message.updatedAt = message.createdAt;
        message.objectId = ((new Date()).valueOf())
        return message;
      });

      rooms = messages.concat(rooms);
      res.end(JSON.stringify({
        success: true,
        updatedAt: new Date(),
        createdAt: new Date(),
        results: messages
      }));

  });

};

