document.addEventListener('DOMContentLoaded', function () {
	const formNewUser = document.querySelector('#addNewUser');
	const btnNewUser = document.querySelector('#btn-submit-newUser');
	const allListusers = document.querySelector('#allListusers');

	const closeModalNewUser = document.querySelector(
		'#closeModalNewUser'
	);
	//btn to delete
	const delete_rfid = document.querySelector('#delete_rfid');
	const span_delete_rfid = document.querySelector(
		'#span_delete_rfid'
	);

	const add_rfid = document.querySelector('#add_rfid');
	const active__rfid = document.querySelector('#active__rfid');

	function deleteRFID(rf) {
		console.log({ rd });
	}
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

	const templateBtn = (contain, classes, id) => {
		const button = document.createElement('button');
		button.innerHTML = `${contain}`;
		const splited = classes.split(' ');
		splited.length > 1
			? splited.forEach((classJS) => button.classList.add(classJS))
			: button.classList.add(classes.trim());
		button.setAttribute('id', id);
		button.addEventListener('click', () => console.log('por finn'));
		return button;
	};

	allListusers.childNodes[1].addEventListener('change', () => {
		document.querySelector('#rfsID').innerHTML = '';
		document.querySelector('#alternativerfsID').innerHTML = '';
		const rfs = allListusers.childNodes[1].value
			.split('-')
			.filter((value) => value);

		const button = templateBtn(
			rfs[0]
				? `<img class='rfid__icons' src='../assets/eliminar.png' alt='icon eliminar'/> RFID: <span class='badge text-bg-secondary'>${rfs[0]}</span>`
				: `<img class='rfid__icons' src='../assets/add.png' alt='icon eliminar'/>  Asignar RFID:`,
			`btn ${rfs[0] ? 'btn-danger' : 'btn-info'}`,
			rfs[0]
		);
		document.querySelector('#rfsID').appendChild(button);

		const buttonAlternative = templateBtn(
			rfs[1]
				? `<img class='rfid__icons' src='../assets/eliminar.png' alt='icon eliminar'/> RFID: <span class='badge text-bg-secondary'>${rfs[1]}</span>`
				: `<img class='rfid__icons' src='../assets/add.png' alt='icon eliminar'/>  Asignar alternativo RFID:`,
			`btn ${rfs[1] ? 'btn-danger' : 'btn-info'}`,
			rfs[1]
		);
		document
			.querySelector('#alternativerfsID')
			.appendChild(buttonAlternative);
	});
});
