const badgeStatus = document.querySelector('.reader__status');
const timeActually = document.querySelector('.timeActually');
const messageUserOnReaderCard = document.querySelector(
	'#messageUserOnReaderCard'
);
const mainPageImage = document.querySelector('#mainPageImage');
/* new Date().getHours() + '-' + new Date().getMinutes() + '-' + new Date().getSeconds()*/

const defautlText = 'Pase su tarjeta por el lector rfid';
const defautlImage = `<img
src="./assets/icons/lector.png"
class="img-fluid"
alt="lector rfid"
/>`;
messageUserOnReaderCard.innerHTML = defautlText;
mainPageImage.innerHTML = defautlImage;
let cardStatus;
const getTimeAMPMFormat = (date) => {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	hours = hours < 10 ? '0' + hours : hours;
	// appending zero in the start if hours less than 10
	minutes = minutes < 10 ? '0' + minutes : minutes;
	timeActually.innerHTML = hours + ':' + minutes + ' ' + ampm;
};
getTimeAMPMFormat(new Date());

setInterval(() => {
	getTimeAMPMFormat(new Date());
}, 60000);
let interval;
const setUserState = (args) => {
	mainPageImage.classList.add('un__left__container');
	if (args.userData) {
		messageUserOnReaderCard.innerHTML = args.userData.message;
	}
	if (args.status) {
		const { date, firstTime, firstExit, secondTime, lastExit } =
			JSON.parse(args.userData.verification);
		mainPageImage.innerHTML = `
		<table class="table table-dark">
		<tbody>
		<tr>
		  <th scope="row"><h2>Fecha: </h2></th>
		 <td><h3 class='main__h3__schedules'>${date}</h3></td>
		</tr>
		<tr>
		  <th scope="row"><h2>Primer tiempo: </h2></th>
		 <td><h3 class='h3__schedules'>${firstTime}</h3></td>
		</tr>
		<tr>
		  <th scope="row"><h2>Primera Salida: </h2></th>
		 <td><h3 class='h3__schedules'>${firstExit}</h3></td>
		</tr>
		<tr>
		  <th scope="row"><h2>Segundo tiempo: </h2></th>
		 <td><h3 class='h3__schedules'>${secondTime}</h3></td>
		</tr>
		<tr>
		  <th scope="row"><h2>Jornada Finalizada: </h2></th>
		 <td><h3 class='h3__schedules'>${lastExit}</h3></td>
		</tr>
	  </tbody>
		</table>
		`;
	}
	if (!args.status) {
		mainPageImage.classList.remove('un__left__container');
		messageUserOnReaderCard.innerHTML = defautlText;
		mainPageImage.innerHTML = defautlImage;
	}
};

window.electronAPI.getReaderStatus((event, args) => {
	if (args.status) {
		document
			.querySelector('.main__Loader')
			.style.setProperty('display', 'none');
	} else {
		document
			.querySelector('.main__Loader')
			.style.setProperty('display', 'flex');
	}
	badgeStatus.classList.add(
		args.status ? 'reader__is__ready' : 'reader__not__ready'
	);
	badgeStatus.classList.remove(
		args.status ? 'reader__not__ready' : 'reader__is__ready'
	);
});

window.electronAPI.getCardStatus((event, args) => {
	setUserState(args);
});
