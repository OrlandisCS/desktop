const badgeStatus = document.querySelector('.reader__status');

window.electronAPI.getReaderStatus((event, args) => {
	if (args.status) {
		document
			.querySelector('.main__Loader')
			.style.setProperty('display', 'none');
	}
	badgeStatus.classList.add(
		args.status ? 'reader__is__ready' : 'reader__not__ready'
	);
	badgeStatus.classList.remove(
		args.status ? 'reader__not__ready' : 'reader__is__ready'
	);
});

window.electronAPI.getCardStatus((event, args) => {
	console.log('evento 2:');
	console.log(args);
});
