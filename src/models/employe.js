const { Schema, model } = require('mongoose');

const EmployesSchema = Schema({
	role: {
		type: String,
		required: true,
		default: 'USER_ROLE',
		enum: ['ADMIN_ROLE', 'USER_ROLE'],
	},
	rfid: {
		type: String,
		default: '',
	},
	alternativeRfid: {
		type: String,
		default: '',
	},
	name: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	dni: {
		type: String,
		required: [true, 'El DNI es obligatorio'],
		unique: true,
	},
	password: {
		type: String,
	},
});

module.exports = model('Employe', EmployesSchema);
