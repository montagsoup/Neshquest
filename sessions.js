var database = require('./database');
var users = require('./users');
var characters = require('./characters');
var print = require('./print');

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
	this.character = null;

	this.login = null;
	this.select = null;

	this.update = function(input, out) {
		if(this.user == null && this.login == null) {
			this.login = {
				stage: 0,
				new: false,
				buffer: '',
				username: '',
				password: ''
			}
		}

		if(this.user != null && this.character == null && this.select == null) {
			this.select = {
				selection: 0
			}
		}

		if(this.login != null) {
			this.updateLogin(input, out);
		} else if(this.select != null) {
			this.updateSelect(input, out);
		}
	};

	this.updateLogin = function(input, out) {
		if(input.key == 'Tab') {
			this.login.new = !this.login.new;
		}

		switch(this.login.stage) {
			case 0:
				print.toConsole(out, "Welcome to Neshquest\n");
				print.toConsole(out, "\nPress tab to make a new user\n");

				this.login.stage++;
				break;

			case 1:
			case 2:
				if(this.login.new) {
					print.toScreen(out, 'New User', 4, 8);
				}

				print.toScreen(out, 'Username:', 4, 9);
				print.toScreen(out,
					(this.login.stage == 1) ? this.login.buffer : this.login.username, 14, 9);

				print.toScreen(out, 'Password:', 4, 10);
				if(this.login.stage == 2) {
					print.toScreen(out, Array(this.login.buffer.length + 1).join('*'), 14, 10);
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
				if(this.login.new) {
					if(users.add(this.login.username, this.login.password)) {
						print.toConsole(out, "New user successfully added.\n");

						this.user = this.login.username;

						this.login = null;
					} else {
						print.toConsole(out, "That name is already taken.\n");

						this.login.username = '';
						this.login.password = '';

						this.login.stage = 1;
					}
				} else {
					if(users.login(this.login.username, this.login.password)) {
						this.user = this.login.username;

						this.login = null;
					} else {
						print.toConsole(out, "Wrong password.\n");

						this.login.username = '';
						this.login.password = '';

						this.login.stage = 1;
					}
				}
				break;
		}
	};

	this.updateSelect = function(input, out) {
		var list = [];

		if(this.select.new != null) {
			this.updateNewCharacter(input, out);
		}

		if(users.get(this.user).characters != null) {
			for(var i = 0; i < users.get(this.user).characters.length; i++) {
				list.push(characters.get(users.get(this.user).characters[i]).name);
			}
		}

		list.push('New Character');

		if(input.key == 'ArrowUp' && this.select.selection > 0) {
			this.select.selection--;
		}

		if(input.key == 'ArrowDown' && this.select.selection < list.length - 1) {
			this.select.selection++;
		}

		if(input.key == 'Enter' && this.select.selection == list.length - 1) {
			this.select.new = {
				stage: 0
			};
		}

		for(var i = 0; i < list.length; i++) {
			print.toScreen(out, list[i], 2, i);
		}

		print.toScreen(out, '>', 0, this.select.selection);
	};

	this.updateNewCharacter = function(input, out) {
	};
}

users.add('foo', 'foo');
