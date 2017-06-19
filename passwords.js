var crypto = require('crypto');

var database = require('./database');

database.passwords = [];

exports.add = function(username, password) {
	var salt = crypto.randomBytes(32).toString('hex');

	var hash = crypto.createHash('sha256');

	hash.update(password + salt);

	database.passwords.push({
		username: username,
		password: hash.digest('hex'),
		salt: salt
	});
};

exports.check = function(username, password) {
	for(var i = 0; i < database.passwords.length; i++) {
		if(database.passwords[i].username == username) {
			var hash = crypto.createHash('sha256');

			hash.update(password + database.passwords[i].salt);

			if(database.passwords[i].password == hash.digest('hex')) {
				return true;
			}
		}
	}

	return false;
};

exports.add('foo', 'foo');
