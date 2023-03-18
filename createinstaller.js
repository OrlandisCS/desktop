const createWindowsInstaller =
	require('electron-winstaller').createWindowsInstaller;
const path = require('path');

getInstallerConfig()
	.then(createWindowsInstaller)
	.catch((error) => {
		console.error(error.message || error);
		process.exit(1);
	});

function getInstallerConfig() {
	console.log('creating windows installer');
	const rootPath = path.join('./');
	const outPath = path.join(rootPath, 'builds/');

	return Promise.resolve({
		appDirectory: path.join(outPath, 'app/'),
		authors: 'OrlandisDev',
		noMsi: true,
		outputDirectory: path.join(outPath, 'windows-installer'),
		exe: 'mps desk windows.exe',
		setupExe: 'MspAppInstaller.exe',
		setupIcon: path.join(rootPath, 'src', 'assets', 'MS-favicon.ico'),
	});
}
