exports.toConsole = function(out, print) {
	out.console_text += print;
}

exports.toScreen = function(out, print, x, y) {
	const width = 30;
	const height = 20;

	if(out.screen.length < width * height) {
		out.screen += Array(width * height - out.screen.length + 1).join(' ');
	}

	var index = x + (y * width);

	out.screen = out.screen.substring(0, index) +
		print + out.screen.substring(index + print.length);
}
