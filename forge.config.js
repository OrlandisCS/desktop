module.exports = {
	packagerConfig: {},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {},
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin'],
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				options: {
					maintainer: 'OrlanidisDev',
					homepage: 'https://orlandis.tech',
				},
			},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {},
		},
	],
};
