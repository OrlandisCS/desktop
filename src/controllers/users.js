const Employe = require('../models/employe');
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
	const employes = await Employe.find()
		.sort({ name: 1 })
		.collation({ locale: 'es', caseLevel: true });
	return {
		message: `Todos los usuarios obtenidos desde la base de datos`,
		success: true,
		employes: JSON.stringify(employes),
	};
};
module.exports = {
	createUser,
	getAllEmployes,
};
