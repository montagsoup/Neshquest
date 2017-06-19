var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var crypto = require('crypto');

var sessions = require('./sessions');
var database = require('./database');
var passwords = require('./passwords');

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
		if(req.method == 'POST') {
			var body = '';

			req.on('data', function(data) {
				body += data;

				if(body.length > 1e6) {
					request.connection.destroy;
				}
			});

			req.on('end', function() {
				try {
					var input = JSON.parse(body);
				} catch(e) {
					res.writeHead(405, {'Content-Type': 'text/json'});
					res.write(JSON.stringify({console_text: 'Something is wrong with the terminal.'}));
					res.end();
				}

				res.writeHead(200, {'Content-Type': 'text/json'});
				res.write(JSON.stringify(update(input)));
				res.end();
			});
		} else {
			res.writeHead(405, {'Content-Type': 'text/json'});
			res.write(JSON.stringify({console_text: 'Something is wrong with the terminal.'}));
			res.end();
		}
	} else {
		res.writeHead(404);
		res.write('404: Unable to locate requested page.');
		res.end();
	}
}).listen(8080);

function update(input)
{
	var out = {
		console_text: '',
		screen: ''
	};

	var token;

	if(input.token == null) {
		out.token = generateToken();
		token = out.token;
	} else {
		token = input.token;
	}

	sessions.update(token, input, out);

	return out;
}

function generateToken() {
	return crypto.randomBytes(32).toString('hex');
}
