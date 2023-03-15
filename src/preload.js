const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	//get all employes
	loadAllEmployes: (arg) => ipcRenderer.invoke('getAllEmployes', arg),
	getAllEmployes: (callback) =>
		ipcRenderer.on('response:getAllEmployes', callback),
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
	//add new user rfid
	addNewRfidToUser: (arg) =>
		ipcRenderer.invoke('addNewRfidToUser', arg),
	addNewRfidToUserResponse: (callback) =>
		ipcRenderer.on('response:addNewRfidToUser', callback),
	//delete user rfid
	deleteRfidFromUser: (arg) =>
		ipcRenderer.invoke('deleteRfidFromUser', arg),
	deleteRfidFromUserResponse: (callback) =>
		ipcRenderer.on('response:deleteRfidFromUser', callback),

	//get user to rfid passed
	viewUserOnCardReader: (callback) =>
		ipcRenderer.on('response:viewUserOnCardReader', callback),
});
