var http = require('http');
var handleRequest = function (request, response) {
  response.writeHead(200);
  
  response.end('Hello from Node Server App deployed on ECS Fargate with CodePipeline!!!!!!!!!!!!!!!!11111111');
  
};
var www = http.createServer(handleRequest);
www.listen(8080);
