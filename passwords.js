var crypto = require('crypto');

var database = require('./database');

exports.add = function(user, password) {
	var salt = crypto.randomBytes(32).toString('hex');

	var hash = crypto.createHash('sha256');

	hash.update(password + salt);

	user.password = hash.digest('hex');
	user.salt = salt;

	return true;
};

exports.check = function(user, password) {
	var hash = crypto.createHash('sha256');

	hash.update(password + user.salt);

	if(user.password == hash.digest('hex')) {
		return true;
	}

	return false;
};
