var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
	if(req.url == '/') {
		fs.readFile('terminal.html', function(err, data) {
			if(err) {
				res.writeHead(500);
				res.write('500: An error occured.');
				res.end();
			} else {
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(data);
				res.end();
			}
		});
	} else if(req.url == '/update') {
		var data = {console_text: 'foo\n'};

		res.writeHead(200, {'Content-Type': 'text/json'});
		res.write(JSON.stringify(data));
		res.end();
	} else {
		res.writeHead(404);
		res.write('404: Unable to locate requested page.');
		res.end();
	}
}).listen(8080);
