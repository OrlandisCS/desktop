const courier = (mainWindow, childWindow, channel, args) => {
	mainWindow.webContents.send(channel, args);
	childWindow.webContents.send(channel, args);
};
const receive = (mainWindow, childWindow, channel, fn) => {
	mainWindow.webContents.on(channel, () => fn());
	childWindow.webContents.on(channel, () => fn());
};
module.exports = {
	courier,
	receive,
};
