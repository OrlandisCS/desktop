const courier = (activeWindow, channel, args) => {
	activeWindow.webContents.send(channel, args);
};
module.exports = {
	courier,
};
