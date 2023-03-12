const { app, Menu } = require('electron');

const createMenu = (windowChild, mainWindow) => {
	const template = [
		{
			label: 'reload ',
			role: 'reload',
		},
		{
			label: 'toggleDevTools ',
			role: 'toggleDevTools',
		},
		{
			label: 'Admin',
			role: 'Admin',
			accelerator:
				process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
			click: () => {
				windowChild.show();
			},
		},
		{
			label: 'Salir',
			role: 'Salir',
			click: () => {
				app.quit();
			},
		},
	];
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
};

module.exports = createMenu;
