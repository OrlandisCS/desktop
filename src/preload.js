const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	getCardStatus: (callback) => ipcRenderer.on('cardStatus', callback),
	getReaderStatus: (callback) =>
		ipcRenderer.on('readerStatus', callback),
	/* Sends */
	userGetReaderStatus: (arg) =>
		ipcRenderer.send('userGetReaderStatus', arg),
	addNewUserOnDialog: (arg) =>
		ipcRenderer.send('addUserOnDialog', arg),
});
