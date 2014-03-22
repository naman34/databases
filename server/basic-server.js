var http = require("http");
var handleRequest = require('./request-handler.js').handler;

var port = process.env.VCAP_APP_PORT || process.env.PORT || 3000;
//var ip = "127.0.0.1";

exports.server = http.createServer(handleRequest).listen(port);

console.log("Listening on http://localhost:" + port);
