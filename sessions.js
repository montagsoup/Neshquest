var passwords = require('./passwords');

exports.update = function(token, input, out) {
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
};

var sessions = [];

function Session(token) {
	this.token = token;
	this.user = null;

	this.login = null;

	this.game = null;

	this.update = function(input, out) {
		if(this.user == null && this.login == null) {
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
						printToScreen(out, Array(this.login.buffer.length + 1).join('*'), 14, 10);
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
					if(passwords.check(this.login.username, this.login.password)) {
						this.user = this.login.username;

						this.login = null;
					} else {
						printToConsole(out, "Wrong password.\n");

						this.login.username = '';
						this.login.password = '';

						this.login.stage = 1;
					}
					break;
			}
		}

		if(this.user != null) {
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
