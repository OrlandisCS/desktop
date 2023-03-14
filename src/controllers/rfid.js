const useLogger = require('../helpers/logger');
const Employe = require('../models/employe');

const assignRFID = async (userId, rfid, alternative) => {
	const userUpdated = await Employe.findOne({
		$or: [{ rfid: rfid }, { alternativeRfid: rfid }],
	});
	if (userUpdated && userUpdated._id !== userId) {
		return {
			message: `El RFID: ${rfid} ya está asignado a  ${userUpdated.name}`,
			success: false,
			deleteForm: false,
			clearForm: false,
		};
	}
	const data = alternative
		? { alternativeRfid: rfid }
		: { rfid: rfid };
	const setRFID = await Employe.findByIdAndUpdate(userId, data, {
		new: true,
	});
	if (setRFID) {
		useLogger(
			'trace',
			`RFID asignada a ${setRFID.name} exitosamente`
		);

		return {
			message: `RFID:${rfid} asignada a ${setRFID.name} exitosamente`,
			success: true,
			deleteForm: false,
			clearForm: false,
		};
	}
};

const deleteRFID = async (userId, rfid, alternative) => {
	const updateData = alternative
		? { alternativeRfid: '' }
		: { rfid: '' };
	const userUpdated = await Employe.findByIdAndUpdate(
		userId,
		updateData
	);

	if (!userUpdated) {
		return {
			message: `Error al eliminar el RFID: ${rfid}`,
			success: false,
			deleteForm: false,
			clearForm: false,
		};
	}
	return {
		message: `se eliminó el RFID: ${rfid} de ${userUpdated.name}`,
		success: true,
		deleteForm: false,
		clearForm: false,
	};
};
module.exports = { assignRFID, deleteRFID };
