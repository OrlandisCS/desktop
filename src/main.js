require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { NFC } = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger
const { Reader } = require('./reader');
const createMenu = require('./utils/create.menu');
const { icon, isDev, availability } = require('../config.json');
const { getValidUser } = require('./controllers/users');
const { getTime } = require('./utils/useDate');
const { addDays } = require('date-fns');
const Company = require('./models/company');
const mainMessage = require('./helpers/createMail');
let mainWindow;
let windowChild;

const createWindow = () => {
	/* Main window */
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 728,
		fullscreen: true,
		frame: false,
		icon: icon,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			devTools: !app.isPackaged,
		},
	});
	mainWindow.loadFile('./src/client/index.html');

	let isWeek = true;
	/* 	let weekDay;
	const getTimeIsWork = async () => {
		const companyData = await Company.findOne({ company: 'MSP' });
		weekDay = new Date(Date.now()).getDay();
		isWeek = companyData.weekdays.includes(weekDay);
		if (isWeek) {
		}  
	};
	getTimeIsWork(); */
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

		const sendReaderStatus = () => {
			clearTimeout(interval);
			const readerStatus = new Reader(mainWindow, 'readerStatus', {
				message: 'Reader está activo',
				status: true,
			});
			readerStatus.sendCurrier();
		};
		interval = setTimeout(() => {
			sendReaderStatus();
		}, 1000);

		reader.on('card', async (card) => {
			await mainMessage().catch(console.error);
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
