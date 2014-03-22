var mysql = require('mysql');
var async = require('async');
var Promise = require('bluebird');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
// If you don't use connection pooling, and instead create a new connection every time
// a thread needs one, your application's resource usage can be quite wasteful and lead
// to unpredictable behavior under load.

var connection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

connection = Promise.promisifyAll(connection);
// var beginTransaction = Promise.promisify(connection.beginTransaction);
// var commit = Promise.promisify(connection.commit.bind(connection));


exports.addMessageToDb = function(message, cb){

  connection.beginTransactionAsync()
  .then(Promise.all([
      //"INSERT INTO user (username) VALUES ?" // If it doesn't already exist
      connection.queryAsync("INSERT INTO user (username) SELECT * FROM (SELECT ?) AS tmp WHERE NOT EXISTS ( SELECT username FROM user WHERE username=?) LIMIT 1", [message.username, message.username]),
      connection.queryAsync("INSERT INTO room (roomname) SELECT * FROM (SELECT ?) AS tmp WHERE NOT EXISTS ( SELECT roomname FROM room WHERE roomname=?) LIMIT 1", [message.roomname, message.roomname])
  ]))
  .then(function() {
    return connection.queryAsync("INSERT INTO message (text, id_user, id_room) VALUES (?, (SELECT id FROM user WHERE username = ?), (SELECT id FROM room WHERE roomname = ?))", [message.text, message.username, message.roomname]);
  })
  //.bind(connection) //did not work
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
      cb(err);
    });
  })
  .finally(function(){
    return connection.endAsync();
  })
  .catch(function(err){
    console.log(err);
    connection.destroy();
  });

};


var getMessages = function(orderby, updatedAfter, cb){

  // connection.query("SELECT * FROM message", function(err, rows){
  //   cb(err, rows);
  // });

  var timestring = (typeof updatedAfter === 'string') ? updatedAfter: JSON.stringify(updatedAfter);
  var orderPartOfString = " ORDER BY updatedAt DESC";

  if(Object.keys(orderby).length === 1){
    orderPartOfString = " ORDER BY " + Object.keys(orderby)[0];
    orderPartOfString += (orderby[Object.keys(orderby)[0]] === -1) ? " DESC" : " ASC";
  }
  //AND message.id_room = room.id AND updatedAt > CONVERT_TZ( ?, '+00:00', '-07:00')
  connection.queryAsync("SELECT message.text, message.updatedAt, message.id, user.username, room.roomname FROM message, user, room WHERE message.id_user = user.id" + orderPartOfString, [timestring])
    .then(function(rows){
      if(rows.length > 0){
        cb(null, rows[0]);
      }
      else{
        cb(null, []);
      }
    })
    .catch(cb)
    .finally(function(){
      return connection.endAsync();
    })
    .catch(function(){
      connection.destroy();
    });

};

getMessages({username: 1}, new Date("March 22, 2014 11:20:00 AM"),function(err, rows){
  console.log(err, rows);
});
// var a = function(a,b){

//   var defferred = Promise.defferred;

//   connection.query(a,b, function(err, result){
//     if(!!err){
//       defferred.reject(err);
//     } else {
//       defferred.resolve(result);
//     }
//   });

//   return defferred;

// };

// var b = function(a,b){

//   return new Promise(function(resolve, reject){

//     connection.query(a, b, function(err, result){
//       if(!!err){
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     });

//   });

// };