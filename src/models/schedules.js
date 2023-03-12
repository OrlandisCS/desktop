const { Schema, model } = require('mongoose');

const SchedulesSchema = Schema({
	employe: {
		type: Schema.Types.ObjectId,
		ref: 'Employe',
		required: true,
	},
	date: {
		type: String,
		default: '',
		required: true,
	},
	firstTime: {
		type: String,
		default: '',
	},
	secondTime: {
		type: String,
	},
	firstExit: {
		type: String,
	},
	lastExit: {
		type: String,
	},
});

module.exports = model('Schedule', SchedulesSchema);
