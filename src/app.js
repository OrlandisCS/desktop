const { app } = require('electron');
const { createWindow } = require('./main');

app.whenReady().then(() => {
	createWindow();
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
	require('./database/conection');
	require('./utils/handle.register');
});
