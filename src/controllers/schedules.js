const Schedules = require('../models/schedules');
const { getDate, getTime } = require('../utils/useDate');

const saveUserSchedules = async (user) => {
	const verification = await Schedules.findOne({
		$and: [
			{ employe: { $eq: user.id } },
			{ date: { $eq: getDate() } },
		],
	});

	if (verification) {
		if (
			verification.firstTime &&
			verification.firstTime.length >= 8 &&
			!verification.firstExit &&
			!verification.secondTime &&
			!verification.lastExit
		) {
			const verification = await Schedules.findOneAndUpdate(
				{
					$and: [
						{ employe: { $eq: user.id } },
						{ date: { $eq: getDate() } },
					],
				},
				{ firstExit: getTime() },
				{ new: true }
			);

			if (verification) {
				const data = {
					verification: JSON.stringify(verification),
					success: true,
					message: `${user.name} primer tiempo: ${
						verification.firstTime
					}-${getTime()}`,
				};
				return data;
			}
		}
		if (
			verification.firstExit &&
			verification.firstExit.length >= 8 &&
			verification.firstTime &&
			!verification.secondTime &&
			!verification.lastExit
		) {
			const verification = await Schedules.findOneAndUpdate(
				{
					$and: [
						{ employe: { $eq: user.id } },
						{ date: { $eq: getDate() } },
					],
				},
				{ secondTime: getTime() },
				{ new: true }
			);
			if (verification) {
				const data = {
					verification: JSON.stringify(verification),
					success: true,
					message: `${user.name} descanso desde: ${
						verification.firstExit
					} hasta: ${getTime()}`,
				};
				return data;
			}
		}
		if (
			verification.secondTime &&
			verification.secondTime.length >= 8 &&
			verification.firstTime &&
			verification.secondTime &&
			!verification.lastExit
		) {
			const verification = await Schedules.findOneAndUpdate(
				{
					$and: [
						{ employe: { $eq: user.id } },
						{ date: { $eq: getDate() } },
					],
				},
				{ lastExit: getTime() },
				{ new: true }
			);
			if (verification) {
				const data = {
					verification: JSON.stringify(verification),
					success: true,
					message: `${user.name} segundo tiempo desde: ${
						verification.firstExit
					} hasta: ${getTime()}`,
				};
				return data;
			}
		}

		if (
			verification.firstExit &&
			verification.lastExit &&
			verification.lastExit.length >= 8 &&
			verification.firstTime &&
			verification.secondTime
		) {
			const data = {
				verification: JSON.stringify(verification),
				success: true,
				message: `${user.name} Ya Finalizó su jornada`,
			};
			return data;
		}
		if (
			verification.lastExit &&
			verification.firstTime &&
			verification.secondTime
		) {
			const data = {
				verification: JSON.stringify(verification),
				success: true,
				message: `Jornada de ${user.name} Finalizó correctamente`,
			};
			return data;
		}
		return;
	}
	const horario = await new Schedules({
		employe: user._id,
		firstTime: getTime(),
		date: getDate(),
	});
	const isSave = await horario.save();

	if (isSave) {
		const data = {
			verification: JSON.stringify(verification),
			success: true,
			message: `${user.name} Fichó correctamente`,
		};
		return data;
	}
};

module.exports = {
	saveUserSchedules,
};
