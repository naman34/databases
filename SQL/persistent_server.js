var mysql = require('mysql');
var Promise = require('bluebird');

var connection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

connection = Promise.promisifyAll(connection);

exports.addMessageToDb = function(message, cb){

  connection.beginTransactionAsync()
  .then(Promise.all([
      connection.queryAsync("INSERT INTO user (username) SELECT * FROM (SELECT ?) AS tmp WHERE NOT EXISTS ( SELECT username FROM user WHERE username=?) LIMIT 1", [message.username, message.username]),
      connection.queryAsync("INSERT INTO room (roomname) SELECT * FROM (SELECT ?) AS tmp WHERE NOT EXISTS ( SELECT roomname FROM room WHERE roomname=?) LIMIT 1", [message.roomname, message.roomname])
  ]))
  .then(function() {
    return connection.queryAsync("INSERT INTO message (text, id_user, id_room) VALUES (?, (SELECT id FROM user WHERE username = ?), (SELECT id FROM room WHERE roomname = ?))", [message.text, message.username, message.roomname]);
  })
  .then(function(){
    console.log("committing now!");
    return connection.commitAsync();
  })
  .then(function(result){
    cb(result);
  })
  .catch(function(err){
    connection.rollbackAsync()
    .then(function(){
      console.log(err);
      cb(err);
    });
  });

};


exports.getMessages = function(orderby, updatedAfter, cb){
  var timestring = JSON.stringify(new Date(new Date(updatedAfter).valueOf() - 25200000));
  var orderPartOfString = " ORDER BY updatedAt DESC";

  if(Object.keys(orderby).length === 1){
    orderPartOfString = " ORDER BY " + Object.keys(orderby)[0];
    orderPartOfString += (orderby[Object.keys(orderby)[0]] === -1) ? " DESC" : " ASC";
  }
  console.log(timestring);
  connection.queryAsync('SELECT message.text, message.updatedAt, message.id, user.username, room.roomname FROM message, user, room WHERE message.id_user = user.id AND message.id_room = room.id AND message.updatedAt > ' + timestring + orderPartOfString)
    .then(function(rows){
      if(rows.length > 0){
        cb(null, rows[0]);
      }
      else{
        cb(null, []);
      }
    })
    .catch(cb);
};