const { Schema, model } = require('mongoose');

const CompanySchema = Schema({
	company: {
		type: String,
	},
	weekdays: {
		type: Array,
		default: ['1', '2', '3', '4', '5', '6'],
	},
	from: {
		type: String,
		default: '06:00',
	},
	to: {
		type: String,
		default: '20:30',
	},
});

module.exports = model('Company', CompanySchema);
