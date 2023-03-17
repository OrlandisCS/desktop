const Employe = require('../models/employe');
const { getDate, getTime } = require('../utils/useDate');
const { saveUserSchedules } = require('./schedules');
const path = require('path');
const { Types } = require('mongoose');
const Schedules = require('../models/schedules');
/**
 * It creates a new user in the database if the user doesn't exist,
 * otherwise it returns a message saying that the user already exists.
 * @param user - {
 * @returns an object with the following properties:
 * message: string
 * success: boolean
 * deleteForm: boolean
 * clearForm: boolean
 */

const createUser = async (user) => {
	const userExist = await Employe.findOne({ dni: user.dni });
	const { user: name, dni } = user;
	if (name.length <= 0 || dni.length <= 0) {
		return {
			message: `Por favor rellene todos los datos`,
			success: false,
			deleteForm: false,
			clearForm: false,
		};
	}
	if (!userExist) {
		const employe = new Employe({
			name,
			dni,
		});
		const saved = await employe.save();
		if (saved)
			return {
				message: `${saved.name} Creado correctamente`,
				success: true,
				deleteForm: true,
				clearForm: true,
			};
	}

	return {
		message: `${userExist.name} Ya existe en la base de datos`,
		success: false,
		deleteForm: false,
		clearForm: false,
	};
	/*
    hashear pwd FUTURO
    const salt = bcryptjs.genSaltSync();
	employe.password = bcryptjs.hashSync(password, salt); */
};
const getAllEmployes = async () => {
	const employes = await Employe.aggregate([
		{
			$lookup: {
				from: 'schedules',
				localField: '_id',
				foreignField: 'employe',
				as: 'schedules',
			},
		},
	])
		.sort({ date: 1 })
		.collation({ locale: 'es', caseLevel: true });

	const data = employes.map((user) => {
		const schedule = user.schedules.filter(
			(schedule) => schedule.date === getDate()
		)[0];
		return {
			_id: user._id,
			role: user.role,
			rfid: user.rfid,
			alternativeRfid: user.alternativeRfid,
			name: user.name,
			dni: user.dni,
			schedule: schedule ? schedule : [],
			excel: `<button
			type="button"
			class="px-1 py-1 btn btn-outline-primary user__download__excel"
			id="downloaduserExcel-${user._id}"
			onclick="downloadUserExcel('${user._id}')"
		>Ecxel</button>`,
			fichaje:
				schedule && schedule.firstTime.length >= 8
					? `<span class="badge__for__status__user status__active"></span>`
					: `<span class="badge__for__status__user status__not__active"></span>`,
		};
	});

	return {
		message: `Todos los usuarios obtenidos desde la base de datos`,
		success: true,
		employes: JSON.stringify(data),
	};
};

const invalidrfid = () => {
	return {
		message: `RFID no asignada a ningún usuario`,
		success: false,
		color: '#db3a34',
	};
};
const getValidUser = async (cardUid) => {
	const users = await Employe.findOne({
		$or: [{ rfid: cardUid.uid }, { alternativeRfid: cardUid.uid }],
	});
	if (users) {
		return await saveUserSchedules(users);
	}

	return invalidrfid();
};

module.exports = {
	createUser,
	getAllEmployes,
	getValidUser,
};
