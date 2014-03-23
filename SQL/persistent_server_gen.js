var mysql = require('mysql');

var Sync = function(gen){
  var iterator, resume;
  resume = function(err, args){
      iterator.next(Array.prototype.slice.call(arguments));
  };

  iterator = gen(resume);
  iterator.next();
};

var connection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

// connection = Promise.promisifyAll(connection);

exports.addMessageToDb = function(message, cb){

  Sync(function* (resume){
    yield connection.beginTransaction(resume);
    yield connection.query("INSERT INTO user (username) SELECT * FROM (SELECT ?) AS tmp WHERE NOT EXISTS ( SELECT username FROM user WHERE username=?) LIMIT 1", [message.username, message.username], resume);
    yield connection.query("INSERT INTO room (roomname) SELECT * FROM (SELECT ?) AS tmp WHERE NOT EXISTS ( SELECT roomname FROM room WHERE roomname=?) LIMIT 1", [message.roomname, message.roomname]. resume);
    yield connection.query("INSERT INTO message (text, id_user, id_room) VALUES (?, (SELECT id FROM user WHERE username = ?), (SELECT id FROM room WHERE roomname = ?))", [message.text, message.username, message.roomname], resume);
    args = yield connection.commit(resume);
    if(!!args[0]){
      yield connection.rollback(resume);
      cb(args[0]);
    } else {
      cb(null, args[1]);
    }
  });

};


exports.getMessages = function(orderby, updatedAfter, cb){

  var timestring = JSON.stringify(new Date(new Date(updatedAfter).valueOf() - 25200000));
  var orderPartOfString = " ORDER BY updatedAt DESC";

  if(Object.keys(orderby).length === 1){
    orderPartOfString = " ORDER BY " + Object.keys(orderby)[0];
    orderPartOfString += (orderby[Object.keys(orderby)[0]] === -1) ? " DESC" : " ASC";
  }

  Sync(function* (resume){
    var args = yield connection.query('SELECT message.text, message.updatedAt, message.id, user.username, room.roomname FROM message, user, room WHERE message.id_user = user.id AND message.id_room = room.id AND message.updatedAt > ' + timestring + orderPartOfString, resume);
    console.log(args);
    if(!!args[0] || args[1].length === 0){
      console.log("calling cb with", args[1][0]);
      cb(args[0]);
    }
    else {
      cb(null, args[1]);
    }
  });

};