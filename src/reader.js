const { courier, receive } = require('./utils/send');
const { bgCyan, bgMagenta, white } = require('colorette');
class Reader {
	constructor(activeMainWindow, channel, args) {
		this.window = activeMainWindow;
		this.channel = channel;
		this.args = args;
	}
	sendCurrier() {
		courier(this.window, this.channel, this.args);
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
