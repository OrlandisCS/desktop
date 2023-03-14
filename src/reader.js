const { courier } = require('./utils/send');
const useLogger = require('./helpers/logger');
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
		useLogger('info', ` Solitud a ${this.channel} `);
		useLogger('info', `${this.args.message} `);
	}
}

module.exports = {
	Reader,
};
