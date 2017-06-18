var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var crypto = require('crypto');

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

var sessions = [];

function Session(token) {
	this.token = token;
	this.user = '';
	this.login = null;

	this.update = function(input, out) {
		if(this.user == '' && this.login == null) {
			this.login = {
				stage: 0,
				buffer: '',
				username: '',
				password: ''
			}
		}

		if(this.login != null) {
			switch(this.login.stage) {
				case 0:
					printToConsole(out, "Welcome to Neshquest\n");
					this.login.stage++;
					break;

				case 1:
				case 2:
					printToScreen(out, 'Username:', 4, 9);
					printToScreen(out,
						(this.login.stage == 1) ? this.login.buffer : this.login.username, 14, 9);

					printToScreen(out, 'Password:', 4, 10);
					if(this.login.stage == 2) {
						printToScreen(out, this.login.buffer, 14, 10);
					}

					if(input.key == null) {
						break;
					} else if(input.key.length == 1) {
						this.login.buffer += input.key;
					} else if(input.key == "Backspace") {
						this.login.buffer = this.login.buffer.slice(0, -1);
					} else if(input.key == "Enter") {
						if(this.login.stage == 1) {
							this.login.username = this.login.buffer;
						} else {
							this.login.password = this.login.buffer;
						}

						this.login.buffer = '';

						this.login.stage++;
					}
					break;

				case 3:
					if(checkPassword(this.login.username, this.login.password)) {
						this.login.stage++;
					} else {
						printToConsole("Wrong password.\n");
					}
					break;
			}
		}
	}

	function printToConsole(out, print) {
		out.console_text += print;
	}

	function printToScreen(out, print, x, y) {
		const width = 30;
		const height = 20;

		if(out.screen.length < width * height) {
			out.screen += Array(width * height - out.screen.length + 1).join(' ');
		}

		var index = x + (y * width);

		out.screen = out.screen.substring(0, index) +
			print + out.screen.substring(index + print.length);
	}
}

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

	var session;

	for(var i = 0; i < sessions.length; i++) {
		if(sessions[i].token == token) {
			session = sessions[i];
			break;
		}
	}

	if(session == null) {
		session = new Session(token);
		sessions.push(session);
	}

	session.update(input, out);

	return out;
}

function generateToken() {
	return crypto.randomBytes(256).toString('hex');
}

function checkPassword(username, password) {
	return false;
}
