const courier = (activeWindow, channel, args) => {
	console.log(args);
	activeWindow.webContents.send(channel, args);
};
module.exports = {
	courier,
};
