/* You'll need to
 * npm install sequelize
 * before running this example. Documentation is at http://sequelizejs.com/
 */

var Sequelize = require("sequelize");
var mysql = require('mysql');
var sequelize = new Sequelize("chatORM", "root");

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = sequelize.define('user', {
  username: Sequelize.STRING
});

var Room = sequelize.define('room', {
  roomname: Sequelize.STRING
});

var Message = sequelize.define('message', {
  text: Sequelize.TEXT,
  updatedAt: Sequelize.DATE
});

/* .sync() makes Sequelize create the database table for us if it doesn't
 *  exist already: */
User.sync().success(function() {
  /* This callback function is called once sync succeeds. */

  // now instantiate an object and save it:
  var newUser = User.build({user_name: "Jean Valjean"});
  newUser.save().success(function() {

    /* This callback function is called once saving succeeds. */

    // Retrieve objects from the database:
    User.findAll({ where: {user_name: "Jean Valjean"} }).success(function(usrs) {
      // This function is called back with an array of matches.
      for (var i = 0; i < usrs.length; i++) {
        console.log(usrs[i].user_name + " exists");
      }
    });
  });
});
