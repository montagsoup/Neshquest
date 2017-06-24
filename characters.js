var database = require('./database');

database.characters = [];

exports.add = function(name) {
	database.characters.push(new Character(name));

	return database.characters.length - 1;
}

exports.get = function(index) {
	return database.characters[index];
}

function Character(name) {
	this.name = name;
}
