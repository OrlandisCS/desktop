function downloadUserExcel(id) {
	if (id) {
		window.electronAPI.generateUserCVS(id);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const badgeStatus = document.querySelector('.reader__status');
	const formNewUser = document.querySelector('#addNewUser');
	const btnNewUser = document.querySelector('#btn-submit-newUser');
	const allListusers = document.querySelector('#allListusers');
	const closeModalNewUser = document.querySelector(
		'#closeModalNewUser'
	);

	//getCardStatus
	let readerCard;
	function deleteRFID(rf, userId, alternative) {
		alertify.set('notifier', 'position', 'center-center');

		alertify
			.confirm(`Desea desvincular el rfid: ${rf}?`, function () {
				if (rf.length > 0) {
					const data = {
						userId,
						rfid: rf,
						alternative,
					};
					window.electronAPI.deleteRfidFromUser(data);
				}
			})
			.setHeader('<em> Desvincular un RFID </em> ')
			.set('reverseButtons', true)
			.set('movable', false)
			.moveTo(700, 450)
			.pin();
	}
	window.electronAPI.deleteRfidFromUserResponse((event, args) => {
		alertify.set('notifier', 'position', 'top-right');
		const myModalEl = document.getElementById('staticAddRFID');
		const modal = bootstrap.Modal.getInstance(myModalEl);

		if (args.success) {
			alertify.success(`${args.message}`);
			modal.hide();
			loadEmployes();
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} else {
			alertify.error(`${args.message}`);
		}
	});
	function assignRFID(userId, alternative) {
		if (readerCard.card.length > 0 && readerCard.status) {
			const data = {
				userId,
				rfid: readerCard.card,
				alternative,
			};
			window.electronAPI.addNewRfidToUser(data);
		}
	}

	window.electronAPI.addNewRfidToUserResponse((event, args) => {
		alertify.set('notifier', 'position', 'top-right');
		const myModalEl = document.getElementById('staticAddRFID');
		const modal = bootstrap.Modal.getInstance(myModalEl);

		if (args.success) {
			alertify.success(`${args.message}`);
			modal.hide();
			loadEmployes();
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} else {
			alertify.error(`${args.message}`);
		}
	});

	window.electronAPI.getCardStatus((event, args) => {
		readerCard = args;
		getStatusCard();
		badgeStatus.classList.add(
			args.status ? 'reader__is__ready' : 'reader__not__ready'
		);
		badgeStatus.classList.remove(
			args.status ? 'reader__not__ready' : 'reader__is__ready'
		);
	});

	//get employes
	const loadEmployes = () => {
		window.electronAPI.loadAllEmployes();
	};
	loadEmployes();
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

	const usersTemplate = (allUsers) => {
		allListusers.childNodes[1].innerHTML = '';
		allUsers.forEach((item) => {
			allListusers.childNodes[1].innerHTML += `
			<option id='${item._id}' value='${item._id}-${item.rfid}-${item.alternativeRfid}'>${item.name}</option>
			`;
		});
	};

	const templateBtn = (contain, classes, id, userId, alternative) => {
		const button = document.createElement('button');
		button.innerHTML =
			contain.length <= 0 ? 'inserte RFID' : `${contain}`;
		const splited = classes.split(' ');
		splited.length > 1
			? splited.forEach((classJS) => button.classList.add(classJS))
			: button.classList.add(classes.trim());
		button.setAttribute('id', id);
		button.addEventListener('click', () =>
			id
				? deleteRFID(id, userId, alternative)
				: assignRFID(userId, alternative)
		);
		return button;
	};
	const getStatusCard = () => {
		document.querySelector('#rfsID').innerHTML = '';
		document.querySelector('#alternativerfsID').innerHTML = '';
		window.electronAPI.getCardStatus((event, args) => {
			readerCard = args;
			badgeStatus.classList.add(
				args.status ? 'reader__is__ready' : 'reader__not__ready'
			);
			badgeStatus.classList.remove(
				args.status ? 'reader__not__ready' : 'reader__is__ready'
			);
		});

		const [userId, two, trhee] = allListusers.childNodes[1].value
			.split('-')
			.filter((value) => value);

		const button = templateBtn(
			two
				? `<img class='rfid__icons' src='../assets/eliminar.png' alt='icon eliminar'/> RFID: <span class='badge text-bg-secondary'>${two}</span>`
				: readerCard.status
				? `<img class='rfid__icons' src='../assets/add.png' alt='icon eliminar'/>  Asignar RFID:<span class='badge text-bg-secondary'>${readerCard.card}</span>`
				: '',
			`btn m-1 ${two ? 'btn-danger' : 'btn-info'}`,
			two,
			userId,
			false
		);
		document.querySelector('#rfsID').appendChild(button);

		const buttonAlternative = templateBtn(
			trhee
				? `<img class='rfid__icons' src='../assets/eliminar.png' alt='icon eliminar'/> RFID: <span class='badge text-bg-secondary'>${trhee}</span>`
				: readerCard.status
				? `<img class='rfid__icons' src='../assets/add.png' alt='icon eliminar'/>  Asignar alternativo RFID:<span class='badge text-bg-secondary'>${readerCard.card}</span>`
				: '',
			`btn m-1 ${trhee ? 'btn-danger' : 'btn-info'}`,
			trhee,
			userId,
			true
		);
		document
			.querySelector('#alternativerfsID')
			.appendChild(buttonAlternative);
	};
	allListusers.childNodes[1].addEventListener('change', async () => {
		getStatusCard();
	});

	window.electronAPI.userIsFileSuccess((event, args) => {
		alertify.set('notifier', 'position', 'top-right');
		alertify.success(`${args.message}`);
	});
	document
		.querySelector('#downloadGlobalExcel')
		.addEventListener('click', () => {
			window.electronAPI.generateGlobalCVS();
		});
	window.electronAPI.generateGlobalCVSResponse((event, args) => {
		alertify.set('notifier', 'position', 'center-center');
		alertify
			.confirm(`<em> ${args.message} </em> `)
			.setHeader(`Estado de la generacion de Excel`)
			.set('reverseButtons', true)
			.set('movable', false)
			.moveTo(700, 450)
			.pin();
	});
	window.electronAPI.generateUserCVSResponse((event, args) => {
		alertify.set('notifier', 'position', 'center-center');

		alertify
			.confirm(`<em> ${args.message} </em> `)
			.setHeader(`Estado de la generacion de Excel`)
			.set('reverseButtons', true)
			.set('movable', false)
			.moveTo(700, 450)
			.pin();
	});
});
