document.addEventListener('DOMContentLoaded', function () {
	let employes;

	const disableViewDataEmployes = document.querySelector(
		'#disableViewDataEmployes'
	);
	const buttonViewDataEmployes = document.querySelector(
		'#buttonViewDataEmployes'
	);
	const datableForUsers = document.querySelector('#datableForUsers');
	const btn__go__back = document.querySelector('#btn__go__back');

	window.electronAPI.getAllEmployes((event, args) => {
		const users = JSON.parse(args.employes);
		employes = users;
	});

	buttonViewDataEmployes.addEventListener('click', () => {
		disableViewDataEmployes.classList.toggle('hidden__element');
		datableForUsers.classList.toggle('hidden__element');
	});
	btn__go__back.addEventListener('click', () => {
		disableViewDataEmployes.classList.toggle('hidden__element');
		datableForUsers.classList.toggle('hidden__element');
	});
	setTimeout(() => {
		new FancyGrid({
			title: 'Emplados disponibles',
			renderTo: 'fancyGrid',
			width: 1800,
			height: 800,
			data: employes,
			defaults: {
				editable: false,
				sortable: true,
				filter: {
					header: true,
					emptyText: 'Buscar',
				},
			},
			clicksToEdit: 1,
			columns: [
				{
					index: 'dni',
					locked: true,
					title: 'DNI',
					editable: false,
					width: 200,
				},
				{
					index: 'name',
					locked: true,
					title: 'Nombre',
					width: 280,
				},
				{
					index: 'role',
					title: 'Rol',
					width: 120,
				},
				{
					index: 'rfid',
					title: 'RFID',
					width: 150,
				},
				{
					index: 'alternativeRfid',
					title: 'RFID Alternativo',
					width: 150,
				},
				{
					index: 'schedule.date',
					title: 'Fecha',
					width: 140,
				},
				{
					index: 'schedule.firstTime',
					title: 'Primer Tiempo',
					width: 140,
				},
				{
					index: 'schedule.firstExit',
					title: 'Primera Salida',
					width: 140,
				},
				{
					index: 'schedule.secondTime',
					title: 'Segundo Tiempo',
					width: 140,
				},
				{
					index: 'schedule.lastExit',
					title: 'Jornada Finalizada',
					width: 140,
				},
				{
					index: 'fichaje',
					title: 'Ficheje',
					width: 100,
				},
				{
					index: 'excel',
					title: 'Excel',
					width: 100,
				},
			],
		});
	}, 2000);
});
