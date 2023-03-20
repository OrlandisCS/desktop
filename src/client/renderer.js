document.addEventListener('DOMContentLoaded', function () {
	const deviceIsWork = `<div class="deviceIsWork">
<div class="badge__container fw-bold">
	ReaderStatus:
	<span class="reader__status"></span>
</div>
<div class="badge__container__time fw-bold">
	<span class="timeActually"></span>
</div>

<div class="container__css">
	<div class="texts-content">
		<h1 class="fw-bolder" id="messageUserOnReaderCard"></h1>
		<p class="fw-bolder" id="userLocaleData"></p>
	</div>
	<div class="images" id="mainPageImage"></div>
</div>
</div>`;

	//muestra hace : @Date.now()
	const userLocaleData = document.querySelector('#userLocaleData');

	const badgeStatus = document.querySelector('.reader__status');
	const timeActually = document.querySelector('.timeActually');
	const messageUserOnReaderCard = document.querySelector(
		'#messageUserOnReaderCard'
	);
	const mainPageImage = document.querySelector('#mainPageImage');
	const defautlText = 'Pase su tarjeta por el lector rfid';
	const defautlImage = `<img
src="./assets/icons/lector.png"
class="img-fluid"
alt="lector rfid"
/>`;
	window.electronAPI.userGetReaderStatus('Hola Desde el front');
	window.electronAPI.getReaderStatus((event, args) => {
		console.log(args);
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
	window.electronAPI.getDeviceStatus((event, args) => {
		if (!args.success) {
			const deviceIsNotWork = `<div class="deviceIsNotWork">
	<div class="container__css">
	<div class="texts-content">
		<h1 class="fw-bolder" id="messageUserOnReaderCard">
			${args.message}
			</h1>
			</div>
			<h3>
			${args.operational}
			</h3>
</div>
</div>`;
			document.querySelector('body').innerHTML = deviceIsNotWork;
			return;
		} else {
			document.querySelector('body').innerHTML = deviceIsWork;

			//functions
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
					messageUserOnReaderCard.innerHTML =
						' ' + args.userData.message;
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
		 <td><h3 class='h3__schedules'>${
				firstTime ? firstTime : '-'
			}</h3></td>
		</tr>
		<tr>
		  <th scope="row"><h2>Primera Salida: </h2></th>
		 <td><h3 class='h3__schedules'>${
				firstExit ? firstExit : '-'
			}</h3></td>
		</tr>
		<tr>
		  <th scope="row"><h2>Segundo tiempo: </h2></th>
		 <td><h3 class='h3__schedules'>${
				secondTime ? secondTime : '-'
			}</h3></td>
		</tr>
		<tr>
		  <th scope="row"><h2>Jornada Finalizada: </h2></th>
		 <td><h3 class='h3__schedules'>${lastExit ? lastExit : '-'}</h3></td>
		</tr>
	  </tbody>
		</table>
		`;
				}
				if (!args.status) {
					mainPageImage.classList.remove('un__left__container');
					messageUserOnReaderCard.innerHTML = defautlText;
					mainPageImage.innerHTML = defautlImage;
					userLocaleData.innerHTML = '';
				}
				if (args.userData.time && args.userData.time.length > 0) {
					userLocaleData.innerHTML = args.userData.time;
				}
			};

			window.electronAPI.getCardStatus((event, args) => {
				setUserState(args);
			});
		}
	});
});
