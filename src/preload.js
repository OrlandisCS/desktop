const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	getCardStatus: (callback) => ipcRenderer.on('cardStatus', callback),
	getReaderStatus: (callback) =>
		ipcRenderer.on('readerStatus', callback),
	getServerResponse: (callback) =>
		ipcRenderer.on('respuesta:server', callback),
	/* Sends */
	userGetReaderStatus: (arg) =>
		ipcRenderer.send('userGetReaderStatus', arg),
	addNewUserOnDialog: (arg) =>
		ipcRenderer.invoke('addUserOnDialog', arg),
});
