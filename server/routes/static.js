var fs = require('fs');

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10
};

exports.returnFile = function(req, res, filePath, contentType, ifBinary){
  var headers = defaultCorsHeaders;
  var encodingObj = {};
  if(!ifBinary){
    encodingObj = {encoding: 'utf-8'};
  }
  fs.readFile(filePath, encodingObj, function(err, fileContents){
    if(!!err){
      console.error("ERROR: ", err);
      headers['Content-Type'] = 'text/plain';
      res.writeHead(500, headers);
      res.end("An ERROR occured. Maybe the file you want doesn't exist");
    } else {
      headers['Content-Type'] = contentType;
      res.writeHead(200, headers);
      res.end(fileContents);
    }
  });
};