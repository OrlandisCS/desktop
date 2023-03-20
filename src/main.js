require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { NFC } = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger
const { Reader } = require('./reader');
const createMenu = require('./utils/create.menu');
const { icon, isDev, availability } = require('../config.json');
const { getValidUser } = require('./controllers/users');
const { getTime, getDate } = require('./utils/useDate');
const { addDays, format } = require('date-fns');
let mainWindow;
let windowChild;
const Company = require('./models/company');
const createWindow = () => {
	/* Main window */
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 728,
		fullscreen: true,
		frame: false,
		icon: path.join(__dirname, 'assets/MS-favicon.ico'),
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			devTools: !app.isPackaged,
		},
	});
	mainWindow.loadFile('./src/client/index.html');

	let isWeek;
	let weekDay;
	const getTimeIsWork = async () => {
		const dia = getDate();
		const hora = getTime().slice(0, 5);
		const companyData = await Company.findOne({
			company: process.env.COMPANY,
		});

		weekDay = new Date(Date.now()).getDay();
		const availability = companyData.deviceAvailability.filter(
			(date) => date.weekdays.includes(weekDay)
		)[0];
		const from = availability.from;
		const to = availability.to;
		isWeek = hora >= from && hora <= to;

		//console.log(hora);
		//console.log('From es Horario operativo: ', hora >= from);
		//console.log(from + '-' + hora);
		//console.log('To es Horario operativo: ', hora <= to);
		//console.log(to + '-' + hora);
		//console.log({ from, to, hora, weekDay });

		//Comunicar status del dispositivo

		const deviceStatus = new Reader(mainWindow, 'deviceStatus', {
			message: !isWeek
				? `Dispositivo deshabilitado por configuración horaria`
				: 'Dispositivo Operativo',
			operational: `Desde las ${from} hasta las ${to}`,
			status: isWeek,
		});
		deviceStatus.sendCurrier();
	};

	setTimeout(async () => {
		await getTimeIsWork();
	}, 1000);
	setInterval(async () => {
		await getTimeIsWork();
	}, 3600000);

	/* Admin window */
	windowChild = new BrowserWindow({
		width: 1024,
		height: 728,
		fullscreen: true,
		frame: true,
		autoHideMenuBar: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			devTools: !app.isPackaged,
		},
		modal: false,
		/* parent: mainWindow, */
		show: false,
	});
	windowChild.loadFile('./src/client/admin.html');
	createMenu(windowChild, mainWindow);
	let interval;
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
	windowChild.on('closed', function () {
		windowChild = null;
	});
	nfc.on('reader', (reader) => {
		isDev &&
			BrowserWindow.getFocusedWindow().webContents.openDevTools();

		/* 	const sendReaderStatus = () => {
			clearTimeout(interval);
			const readerStatus = new Reader(mainWindow, 'readerStatus', {
				message: 'Reader está activo',
				status: true,
			});
			readerStatus.sendCurrier();
		};
		interval = setTimeout(() => {
			sendReaderStatus();
		}, 1500);
 */
		reader.on('card', async (card) => {
			/* await mainMessage().catch(console.error); */
			if (card.type !== 'TAG_ISO_14443_3') return;
			if (mainWindow) {
				const cardStatus = new Reader(mainWindow, 'cardStatus', {
					message: `rfid leido: ${card.uid}`,
					status: true,
					card: card.uid,
					userData: isWeek ? await getValidUser(card) : {},
				});
				cardStatus.sendCurrier();
			}
			if (windowChild) {
				const cardStatusAdmin = new Reader(
					windowChild,
					'cardStatus',
					{
						message: `rfid leido: ${card.uid}`,
						status: true,
						card: card.uid,
					}
				);
				cardStatusAdmin.sendCurrier();
			}
		});

		reader.on('card.off', async (card) => {
			if (mainWindow) {
				const cardStatus = new Reader(mainWindow, 'cardStatus', {
					message: `rfid retirado: ${card.uid}`,
					status: false,
				});
				cardStatus.sendCurrier();
			}
			if (windowChild) {
				const cardStatusAdmin = new Reader(
					windowChild,
					'cardStatus',
					{
						message: `rfid retirado: ${card.uid}`,
						status: false,
						card: '',
					}
				);
				cardStatusAdmin.sendCurrier();
			}
		});

		reader.on('error', (err) => {
			if (mainWindow) {
				const readerStatus = new Reader(mainWindow, 'readerStatus', {
					message: 'Hubo un error con el dispositivo',
					status: false,
				});

				readerStatus.sendCurrier();
			}
			console.log(`${reader.reader.name}  an error occurred`, err);
		});

		reader.on('end', () => {
			if (mainWindow) {
				const readerStatus = new Reader(mainWindow, 'readerStatus', {
					message: 'dispositivo retirado',
					status: false,
				});
				readerStatus.sendCurrier();
			}
			console.log(`${reader.reader.name}  device removed`);
		});
	});

	nfc.on('error', (err) => {
		if (mainWindow) {
			const readerStatus = new Reader(mainWindow, 'readerStatus', {
				message: 'Reader no  está activo',
				status: false,
			});
			readerStatus.sendCurrier();
		}
		console.log('an error occurred', err);
	});
};

module.exports = {
	createWindow,
};
