require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { NFC } = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger
const { Reader } = require('./reader');
const createMenu = require('./utils/create.menu');
const { icon, isDev } = require('../config.json');
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
		modal: true,
		parent: mainWindow,
		show: false,
	});
	windowChild.loadFile('./src/client/admin.html');
	createMenu(windowChild, mainWindow);
	let interval;

	nfc.on('reader', (reader) => {
		isDev &&
			BrowserWindow.getFocusedWindow().webContents.openDevTools();

		clearInterval(interval);
		interval = setTimeout(() => {
			const readerStatus = new Reader(mainWindow, 'readerStatus', {
				message: 'Reader está activo',
				status: true,
			});
			readerStatus.sendCurrier();
		}, 2000);

		reader.on('card', (card) => {
			const cardStatus = new Reader(mainWindow, 'cardStatus', {
				message: `rfid leido: ${card.uid}`,
				status: true,
			});
			cardStatus.sendCurrier();
		});

		reader.on('card.off', (card) => {
			const cardStatus = new Reader(mainWindow, 'cardStatus', {
				message: `rfid retirado: ${card.uid}`,
				status: false,
			});
			cardStatus.sendCurrier();
		});

		reader.on('error', (err) => {
			const readerStatus = new Reader(mainWindow, 'readerStatus', {
				message: 'Hubo un error con el dispositivo',
				status: false,
			});
			readerStatus.sendCurrier();

			console.log(`${reader.reader.name}  an error occurred`, err);
		});

		reader.on('end', () => {
			const readerStatus = new Reader(mainWindow, 'readerStatus', {
				message: 'dispositivo retirado',
				status: false,
			});
			readerStatus.sendCurrier();
			console.log(`${reader.reader.name}  device removed`);
		});
	});

	nfc.on('error', (err) => {
		const readerStatus = new Reader(
			mainWindow,
			windowChild,
			'readerStatus',
			{
				message: 'Reader no  está activo',
				status: false,
			}
		);
		readerStatus.sendCurrier();
		console.log('an error occurred', err);
	});
};

module.exports = {
	createWindow,
};
