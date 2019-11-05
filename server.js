var http = require('http');
var request = require('request');
const readline = require('readline');

console.log("Starting node-server...");

try {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    }
  });
} catch (error) {
  console.log("Couldn't set Ctrl+C listener: %s", error);
}

const ecsMetadataURI = process.env.ECS_CONTAINER_METADATA_URI;
console.log("ECS_CONTAINER_METADATA_URI: %s", ecsMetadataURI);
var ecsMetadata = null;
if (ecsMetadataURI != null) {
  console.log("Fetching ECS metadata...");
  request({url: ecsMetadataURI, json: true}, function(error, response, body) {
    console.log("Handling ECS metadata response\n" +
      "\terror: %s\n\tresponse: %s\n\tbody: %s:", error, response, body);
    if (!error && response.statusCode === 200) {
      ecsMetadata = JSON.stringify(body);
    } else {
      ecsMetadata = "error: " + error + ", statusCode: " + response.statusCode;
    }
    console.log("ecsMetadata: %s", ecsMetadata);
  });
}

var handleRequest = function (request, response) {
  console.log("--");
  console.log("Got a request: %s", request.url);
  console.log("Headers:");
  for (var headerName in request.headers) {
    console.log("- %s: %s", headerName, request.headers[headerName]);
  }

  response.writeHead(200);

  response.end("Hello from Node Server App deployed on ECS Fargate with CodePipeline!\n" + ecsMetadata);

};
var www = http.createServer(handleRequest);
www.listen(8080);

console.log("Server has been started at 8080");
