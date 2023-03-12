const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	getCardStatus: (callback) => ipcRenderer.on('cardStatus', callback),
	getReaderStatus: (callback) =>
		ipcRenderer.on('readerStatus', callback),

	userGetReaderStatus: (arg) =>
		ipcRenderer.send('userGetReaderStatus', arg),
	//add new user
	addNewUserOnDialog: (arg) =>
		ipcRenderer.invoke('addUserOnDialog', arg),
	getServerResponse: (callback) =>
		ipcRenderer.on('response:addUserOnDialog', callback),
	//get all employes
	loadAllEmployes: (arg) => ipcRenderer.invoke('getAllEmployes', arg),
	getAllEmployes: (callback) =>
		ipcRenderer.on('response:getAllEmployes', callback),
});
