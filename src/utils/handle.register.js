const { ipcMain } = require('electron');
const { NFC } = require('nfc-pcsc');
const nfc = new NFC(); // optionally you can pass logger

const {
	createUser,
	getAllEmployes,
} = require('../controllers/users');
const { assignRFID, deleteRFID } = require('../controllers/rfid');
const useLogger = require('../helpers/logger');
const {
	globalGenerateSVC,
	userGenerateSVC,
} = require('../helpers/generateCVS');
const path = require('path');
ipcMain.handle('addUserOnDialog', async (event, user) => {
	const data = await createUser(user);
	useLogger(data.success ? 'info' : 'error', `${data.message}`);
	return event.sender.send('response:addUserOnDialog', data);
});

ipcMain.handle('getAllEmployes', async (event, user) => {
	const data = await getAllEmployes();
	useLogger('info', `${data.message}`);
	return event.sender.send('response:getAllEmployes', data);
});

ipcMain.handle('userGetReaderStatus', async (event, args) => {
	console.log(args);
	console.log('entro>>>userGetReaderStatus');
	nfc.on('reader', (reader) => {
		reader.on('error', (err) => {
			return event.sender.send('readerStatus', {
				message: 'Hubo un error con el dispositivo' + ':' + err,
				status: false,
			});
		});

		reader.on('end', () => {
			return event.sender.send('readerStatus', {
				message: 'dispositivo retirado',
				status: false,
			});
		});
	});
	return event.sender.send('readerStatus', {
		message: 'Reader está activo',
		status: true,
	});
});

ipcMain.handle('addNewRfidToUser', async (event, data) => {
	const { userId, rfid, alternative } = data;
	const dataRfid = await assignRFID(userId, rfid, alternative);
	useLogger(
		dataRfid.success ? 'info' : 'error',
		`${dataRfid.message}`
	);
	return event.sender.send('response:addNewRfidToUser', dataRfid);
});

ipcMain.handle('deleteRfidFromUser', async (event, data) => {
	const { userId, rfid, alternative } = data;
	const dataRfid = await deleteRFID(userId, rfid, alternative);
	useLogger(
		dataRfid.success ? 'info' : 'error',
		`${dataRfid.message}`
	);
	return event.sender.send('response:deleteRfidFromUser', dataRfid);
});
ipcMain.handle('generateGlobalCVS', async (event, data) => {
	const excelPath = await globalGenerateSVC();
	useLogger('info', {
		succes: excelPath.succes,
		message: excelPath.message,
	});
	return event.sender.send('response:generateGlobalCVS', {
		succes: excelPath.succes,
		message: excelPath.message,
	});
});
ipcMain.handle('generateUserCVS', async (event, data) => {
	const excelPath = await userGenerateSVC(data);
	useLogger('info', {
		succes: excelPath.succes,
		message: excelPath.message,
	});
	return event.sender.send('response:generateUserCVS', {
		succes: excelPath.succes,
		message: excelPath.message,
	});
});
