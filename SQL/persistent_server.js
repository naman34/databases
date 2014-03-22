var mysql = require('mysql');
var async = require('async');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
// If you don't use connection pooling, and instead create a new connection every time
// a thread needs one, your application's resource usage can be quite wasteful and lead
// to unpredictable behavior under load.

var pool = mysql.createPool({
  user: "root",
  password: "",
  database: "chat"
});

exports.addMessageToDb = function(message, cb){

  async.parallel([
    function(callback){
      pool.query("", [], function(err, result){
        callback(err, result);
      });
    },
    function(callback){
      pool.query("", [], function(err, result){
        callback(err, result);
      });
    }
  ], function(arrayOfArgs){
    pool.query("", [], function(err, result){
      cb(err, result);
    });
  });

};

// dbConnection.query('something', function(err, rows){
//   console.log("boom");
// });
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */


