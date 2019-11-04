var http = require('http');
var request = require('request');

const ecsMetadataURI = process.env.ECS_CONTAINER_METADATA_URI;
var ecsMetadata = null;
if (ecsMetadataURI != null) {
  request({url: ecsMetadataURI, json: true}, function(err, res, body) {
    if (!error && response.statusCode === 200) {
      ecsMetadata = body;
    } else {
      ecsMetadata = "error: " + error + ", statusCode: " + response.statusCode;
    }
  });
}

var handleRequest = function (request, response) {
  response.writeHead(200);
  
  response.end("Hello from Node Server App deployed on ECS Fargate with CodePipeline!\n" +
    "[" + request.headers.host + "]\n" +
    ecsMetadataURI + "\n" +
    ecsMetadata
  );
  
};
var www = http.createServer(handleRequest);
www.listen(8080);
