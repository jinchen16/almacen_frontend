var http = require('http');
var port = process.env.PORT || 80;

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("public_html");
var server = http.createServer( function(req,res) {
	var done = finalhandler(req,res);
	serve(req,res,done);
});

server.listen(port, function() {
	console.log('Servidor Web por el puerto: ' + server.address().port);
});
