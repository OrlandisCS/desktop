const { Schema, model } = require('mongoose');

const CompanySchema = Schema({
	company: {
		type: String,
	},
	deviceAvailability: {
		type: Array,
		default: [],
	},
});

module.exports = model('Company', CompanySchema);
