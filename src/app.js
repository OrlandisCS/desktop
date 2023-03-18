//handle setupevents as quickly as possible
/* const setupEvents = require('../setupEvents');
if (setupEvents.handleSquirrelEvent()) {
	// squirrel event handled and app will exit in 1000ms, so don't do anything else
	return;
}
 */
const { app } = require('electron');
const { createWindow } = require('./main');
const http = require('http');
app.whenReady().then(() => {
	createWindow();
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
	require('./database/conection');
	require('./utils/handle.register');
});
