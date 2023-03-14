const { ipcMain } = require('electron');
const {
	createUser,
	getAllEmployes,
} = require('../controllers/users');
const { assignRFID, deleteRFID } = require('../controllers/rfid');
const useLogger = require('../helpers/logger');

ipcMain.handle('addUserOnDialog', async (event, user) => {
	const data = await createUser(user);
	useLogger(data.success ? 'info' : 'error', `${data.message}`);
	event.sender.send('response:addUserOnDialog', data);
});

ipcMain.handle('getAllEmployes', async (event, user) => {
	const data = await getAllEmployes();
	useLogger('info', `${data.message}`);
	event.sender.send('response:getAllEmployes', data);
});

ipcMain.handle('addNewRfidToUser', async (event, data) => {
	const { userId, rfid, alternative } = data;
	const dataRfid = await assignRFID(userId, rfid, alternative);
	useLogger(
		dataRfid.success ? 'info' : 'error',
		`${dataRfid.message}`
	);
	event.sender.send('response:addNewRfidToUser', dataRfid);
});

ipcMain.handle('deleteRfidFromUser', async (event, data) => {
	const { userId, rfid, alternative } = data;
	const dataRfid = await deleteRFID(userId, rfid, alternative);
	useLogger(
		dataRfid.success ? 'info' : 'error',
		`${dataRfid.message}`
	);
	event.sender.send('response:deleteRfidFromUser', dataRfid);
});
