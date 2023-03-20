const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	userGetReaderStatus: (arg) =>
		ipcRenderer.invoke('userGetReaderStatus', arg),
	//get all employes
	loadAllEmployes: (arg) => ipcRenderer.invoke('getAllEmployes', arg),
	getAllEmployes: (callback) =>
		ipcRenderer.on('response:getAllEmployes', callback),
	getCardStatus: (callback) => ipcRenderer.on('cardStatus', callback),
	getReaderStatus: (callback) =>
		ipcRenderer.on('readerStatus', callback),

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
	//get user file
	userIsFileSuccess: (callback) =>
		ipcRenderer.on('userIsFileSuccess', callback),

	//generate globla cvs
	generateGlobalCVS: (arg) =>
		ipcRenderer.invoke('generateGlobalCVS', arg),
	generateGlobalCVSResponse: (callback) =>
		ipcRenderer.on('response:generateGlobalCVS', callback),
	//generate user cvs
	generateUserCVS: (arg) =>
		ipcRenderer.invoke('generateUserCVS', arg),
	generateUserCVSResponse: (callback) =>
		ipcRenderer.on('response:generateUserCVS', callback),
	//get device status
	getDeviceStatus: (callback) =>
		ipcRenderer.on('deviceStatus', callback),
});
