const { courier, receive } = require('./utils/send');
const { bgCyan, bgMagenta, white } = require('colorette');
class Reader {
	constructor(mainWindow, childWindow, channel, args) {
		this.window = mainWindow;
		this.childWindow = childWindow;
		this.channel = channel;
		this.args = args;
	}
	sendCurrier() {
		courier(this.window, this.childWindow, this.channel, this.args);
		this.logger();
	}
	responseToCurrier() {
		receive(this.window, this.childWindow, this.channel, this.args);
		this.logger();
	}
	logger() {
		console.log(bgMagenta(white(` Solitud a ${this.channel} `)));
		console.log('');
		console.log(bgCyan(white(` ${this.args.message} `)));
	}
}

module.exports = {
	Reader,
};
