var database = require('./database');
var passwords = require('./passwords');

database.users = {};

exports.add = function(username, password) {
	if(database.users[username] == null) {
		database.users[username] = {
			characters: []
		};
	} else {
		return false;
	}

	passwords.add(database.users[username], password);

	return true;
};

exports.get = function(username) {
	return database.users[username];
}

exports.login = function(username, password) {
	if(database.users[username] == null) {
		return false;
	}

	return passwords.check(database.users[username], password);
};
