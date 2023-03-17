const Employe = require('../models/employe');
const Schedules = require('../models/schedules');
// Require library
const xl = require('excel4node');
// Create a new instance of a Workbook class
const wb = new xl.Workbook();
const userWb = new xl.Workbook();
// Add Worksheets to the workbook
const ws = wb.addWorksheet('Sheet 1');
const userWs = userWb.addWorksheet('Sheet 1');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const { getDate } = require('../utils/useDate');
const style = wb.createStyle({
	font: {
		color: '#fe9920',
		size: 16,
		bold: true,
	},
	numberFormat: '$#,##0.00; ($#,##0.00); -',
});
const dataStyle = wb.createStyle({
	font: {
		color: '#0d2149',
		size: 13,
	},
	numberFormat: '$#,##0.00; ($#,##0.00); -',
});
const globalGenerateSVC = async () => {
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
	ws.cell(1, 1).string('Nombre').style(style);
	ws.cell(1, 2).string('DNI').style(style);
	ws.cell(1, 3).string('RFID').style(style);
	ws.cell(1, 4).string('RFID Alternativo').style(style);
	ws.cell(1, 5).string('Fecha').style(style);
	ws.cell(1, 6).string('Primer Tiempo').style(style);
	ws.cell(1, 7).string('Primera Salida').style(style);
	ws.cell(1, 8).string('Segundo Tiempo').style(style);
	ws.cell(1, 9).string('Jornada Finalizada').style(style);
	ws.column(1).setWidth(25);
	ws.column(2).setWidth(15);
	ws.column(3).setWidth(15);
	ws.column(5).setWidth(15);
	ws.column(4).setWidth(20);
	ws.column(6).setWidth(20);
	ws.column(7).setWidth(20);
	ws.column(8).setWidth(20);
	ws.column(9).setWidth(22);
	let repeats = 2;
	employes.forEach((csv) => {
		ws.cell(repeats, 1).string(csv.name).style(dataStyle);
		ws.cell(repeats, 2).string(csv.dni).style(dataStyle);
		ws.cell(repeats, 3).string(csv.rfid).style(dataStyle);
		ws.cell(repeats, 4).string(csv.alternativeRfid).style(dataStyle);

		csv.schedules.forEach((schedule) => {
			if (schedule) {
				ws.cell(repeats, 1).string(csv.name).style(dataStyle);
				ws.cell(repeats, 2).string(csv.dni).style(dataStyle);
				ws.cell(repeats, 3).string(csv.rfid).style(dataStyle);

				ws.cell(repeats, 4)
					.string(csv.alternativeRfid)
					.style(dataStyle);
				ws.cell(repeats, 5).string(schedule.date).style(dataStyle);
				ws.cell(repeats, 6)
					.string(schedule.firstTime)
					.style(dataStyle);
				ws.cell(repeats, 7)
					.string(schedule.secondTime)
					.style(dataStyle);
				ws.cell(repeats, 8)
					.string(schedule.firstExit)
					.style(dataStyle);
				ws.cell(repeats, 9)
					.string(schedule.lastExit)
					.style(dataStyle);
				repeats = repeats + 1;
			}
		});

		repeats = repeats + 1;
	});
	const arcName = `global-${getDate()}`;
	const excelPath = path.join(
		__dirname,
		'../../excels',
		arcName + '.xlsx'
	);

	wb.write(excelPath);
	return {
		succes: true,
		message: `Puede encontrar el archivo en:</br>${excelPath}`,
	};
};
const userGenerateSVC = async (userId) => {
	const employe = await Employe.findById(userId);
	const schedules = await Schedules.find({
		employe: userId,
	});
	const result = {
		role: employe.role,
		rfid: employe.rfid,
		alternativeRfid: employe.alternativeRfid,
		name: employe.name,
		dni: employe.dni,
		schedules,
	};

	userWs.cell(1, 1).string('Nombre').style(style);
	userWs.cell(1, 2).string('DNI').style(style);
	userWs.cell(1, 3).string('RFID').style(style);
	userWs.cell(1, 4).string('RFID Alternativo').style(style);
	userWs.cell(1, 5).string('Fecha').style(style);
	userWs.cell(1, 6).string('Primer Tiempo').style(style);
	userWs.cell(1, 7).string('Primera Salida').style(style);
	userWs.cell(1, 8).string('Segundo Tiempo').style(style);
	userWs.cell(1, 9).string('Jornada Finalizada').style(style);
	userWs.column(1).setWidth(25);
	userWs.column(2).setWidth(15);
	userWs.column(3).setWidth(15);
	userWs.column(5).setWidth(15);
	userWs.column(4).setWidth(20);
	userWs.column(6).setWidth(20);
	userWs.column(7).setWidth(20);
	userWs.column(8).setWidth(20);
	userWs.column(9).setWidth(22);
	let repeats = 2;
	let arcName;

	userWs.cell(repeats, 1).string(result.name).style(dataStyle);
	userWs.cell(repeats, 2).string(result.dni).style(dataStyle);
	userWs.cell(repeats, 3).string(result.rfid).style(dataStyle);
	userWs
		.cell(repeats, 4)
		.string(result.alternativeRfid)
		.style(dataStyle);
	const resultName = result.name.split(' ');
	arcName = `${result.dni}-${resultName[0]}-${resultName[1]}`;
	result.schedules.forEach((schedule) => {
		if (schedule) {
			userWs.cell(repeats, 1).string(result.name).style(dataStyle);
			userWs.cell(repeats, 2).string(result.dni).style(dataStyle);
			userWs.cell(repeats, 3).string(result.rfid).style(dataStyle);

			userWs
				.cell(repeats, 4)
				.string(result.alternativeRfid)
				.style(dataStyle);
			userWs.cell(repeats, 5).string(schedule.date).style(dataStyle);
			userWs
				.cell(repeats, 6)
				.string(schedule.firstTime)
				.style(dataStyle);
			userWs
				.cell(repeats, 7)
				.string(schedule.secondTime)
				.style(dataStyle);
			userWs
				.cell(repeats, 8)
				.string(schedule.firstExit)
				.style(dataStyle);
			userWs
				.cell(repeats, 9)
				.string(schedule.lastExit)
				.style(dataStyle);
			repeats = repeats + 1;
		}
	});

	repeats = repeats + 1;

	const excelPath = path.join(
		__dirname,
		'../../excels',
		arcName + '.xlsx'
	);
	userWb.write(excelPath);
	return {
		succes: true,
		message: `Puede encontrar el archivo en:</br> ${excelPath}`,
	};
};

module.exports = {
	globalGenerateSVC,
	userGenerateSVC,
};
