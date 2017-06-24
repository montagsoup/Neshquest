var fs = require('fs');

exports.save = function(path) {
	fs.writeFile(path, JSON.stringify(exports), function(err) {
		if(err) {
			console.log("The database didn't save.");
		}
	});
}

exports.load = function(path) {
	fs.readFile(path, function(err, data) {
		if(!err) {
			var merge = JSON.parse(data);

			for(attr in merge) {
				exports[attr] = merge[attr];
			}
		} else {
			console.log("The database didn't load.");
		}
	});
}
