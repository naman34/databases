var express = require('express'); //Express FTW :)
var path = require('path');
var app = express();
var routes = require('./routes');
//var get = require('./routes/chats.js').get;
//var post = require('./routes/chats.js').post;
//var returnFile = require('./routes/static.js').returnFile;

//CORS headers, defined up top for clarity
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


module.exports.handler = function(req, res) {
  app(req, res);
};


//All the code I was writing for express
//handles the case when there might be files uploaded to the server
app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: __dirname + '/../client/uploads'
}));

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client/')));
app.all("*", function(req, res, next){
  res.set(defaultCorsHeaders);
  next();
});

app.get('/', express.static(path.join(__dirname, '../client/index.html')));

app.get('/classes/:roomname', routes.get);

app.post('/classes/:roomname', routes.post);

//if the req falls through all the other handlers, a 404 is sent.
app.use(function(req, res, next) {
    res.status(404).send("404. File not found!");
});

