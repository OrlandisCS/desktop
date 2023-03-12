const { ipcMain } = require('electron');
const {
	createUser,
	getAllEmployes,
} = require('../controllers/users');

ipcMain.handle('addUserOnDialog', async (event, user) => {
	const data = await createUser(user);
	event.sender.send('response:addUserOnDialog', data);
});

ipcMain.handle('getAllEmployes', async (event, user) => {
	const data = await getAllEmployes();
	event.sender.send('response:getAllEmployes', data);
});
