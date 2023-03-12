const badgeStatus = document.querySelector('.reader__status');
const addNewUserOnDialog = document.querySelector(
	'#addNewUserOnDialog'
);
window.electronAPI.getReaderStatus((event, args) => {
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

/* addNewUserOnDialog.addEventListener('click', () => {
	alert('Hola Mundo');
});
 */
