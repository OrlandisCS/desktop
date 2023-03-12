const formNewUser = document.querySelector('#addNewUser');
const btnNewUser = document.querySelector('#btn-submit-newUser');
const badgeStatus = document.querySelector('.reader__status');

/* const addNewUserOnDialog = document.querySelector(
	'#addNewUserOnDialog'
); */
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
window.electronAPI.getServerResponse((event, args) => {
	console.log('evento response:');
	console.log(args);
});
btnNewUser.addEventListener('click', (e) => {
	e.preventDefault();
	const user = {
		user: formNewUser['userNameComplete'].value,
		dni: formNewUser['userNameDni'].value,
	};
	window.electronAPI.addNewUserOnDialog(user);
});
