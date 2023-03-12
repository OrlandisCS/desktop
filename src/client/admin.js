const formNewUser = document.querySelector('#addNewUser');
const btnNewUser = document.querySelector('#btn-submit-newUser');
const allListusers = document.querySelector('#allListusers');

const closeModalNewUser = document.querySelector(
	'#closeModalNewUser'
);
//get employes
window.electronAPI.loadAllEmployes();
window.electronAPI.getAllEmployes((event, args) => {
	const users = JSON.parse(args.employes);
	usersTemplate(users);
});
//add new user
btnNewUser.addEventListener('click', (e) => {
	e.preventDefault();
	e.stopPropagation();
	const user = {
		user: formNewUser['userNameComplete'].value,
		dni: formNewUser['userNameDni'].value,
	};
	window.electronAPI.addNewUserOnDialog(user);
});

window.electronAPI.getServerResponse((event, args) => {
	alertify.set('notifier', 'position', 'top-right');

	args.success
		? alertify.success(args.message)
		: alertify.error(args.message);

	if (args.success || args.deleteForm) {
		formNewUser.reset();
		closeModalNewUser.click();
	}
	if (args.clearForm) {
		formNewUser.reset();
	}
});

/* console.log(users); */
const usersTemplate = (allUsers) => {
	allUsers.forEach((item) => {
		allListusers.childNodes[1].innerHTML += `
		<option id='${item._id}' value='${item.rfid}-${item.alternativeRfid}'>${item.name}</option>
		`;
	});
};
allListusers.childNodes[1].addEventListener('change', () => {
	const rfs = allListusers.childNodes[1].value
		.split('-')
		.filter((value) => value);
	document.querySelector('#rfsID').innerHTML = rfs[0]
		? `	
			<button type='button' class='btn btn-danger'>
			<img class='rfid__icons' src='../assets/eliminar.png' alt='icon eliminar'/> RFID: <span class='badge text-bg-secondary'>${rfs[0]}</span> 
			</button>
		`
		: `	<button type='button' class='btn btn-info'>
		<img class='rfid__icons' src='../assets/add.png' alt='icon eliminar'/>  Asignar RFID:
		<span class='badge text-bg-secondary'>${1}</span>
	</button>
`;
	document.querySelector('#alternativerfsID').innerHTML = rfs[1]
		? `	<button type='button' class='btn btn-danger'>
		<img class='rfid__icons' src='../assets/eliminar.png' alt='icon eliminar'/> Alternative RFID:
						<span class='badge text-bg-secondary'>${rfs[1]}</span>
					</button>
				`
		: `	<button type='button' class='btn btn-info'>
		<img class='rfid__icons' src='../assets/add.png' alt='icon eliminar'/> Asignar alternative RFID:
		<span class='badge text-bg-secondary'>${2}</span>
	</button>
`;
});
