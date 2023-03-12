const { ipcMain } = require('electron');

ipcMain.handle('addUserOnDialog', (event, args) => {
	console.log(event);
	console.log(args);
	event.sender.send('respuesta:server', 'Hola desde el server');
});
