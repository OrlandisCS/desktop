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
			width: '100%',
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
					width: 400,
				},
				{
					index: 'role',
					title: 'Rol',
					width: 190,
				},
				{
					index: 'rfid',
					title: 'RFID',

					width: 200,
				},
				{
					index: 'alternativeRfid',
					title: 'RFID Alternativo',
					width: 200,
				},
				{
					width: 100,
					cls: 'my-column-action',
					index: 'loading',
					render: function (o) {
						o.value = [];

						if (o.data.loading) {
							o.value.push(
								'<i class="button-status"><svg xmlns="http://www.w3.org/2000/svg" width="12.959999999999999" height="12.959999999999999" viewBox="0 0 54 54"><g><path d="M10.9,48.6c-1.6-1.3-2-3.6-0.7-5.3c1.3-1.6,3.6-2.1,5.3-0.8c0.8,0.5,1.5,1.1,2.4,1.5c7.5,4.1,16.8,2.7,22.8-3.4c1.5-1.5,3.8-1.5,5.3,0c1.4,1.5,1.4,3.9,0,5.3c-8.4,8.5-21.4,10.6-31.8,4.8C13,50.1,11.9,49.3,10.9,48.6z" fill="#888888"></path><path d="M53.6,31.4c-0.3,2.1-2.3,3.5-4.4,3.2c-2.1-0.3-3.4-2.3-3.1-4.4c0.2-1.1,0.2-2.2,0.2-3.3c0-8.7-5.7-16.2-13.7-18.5c-2-0.5-3.2-2.7-2.6-4.7s2.6-3.2,4.7-2.6C46,4.4,53.9,14.9,53.9,27C53.9,28.5,53.8,30,53.6,31.4z" fill="#888888"></path><path d="M16.7,1.9c1.9-0.8,4.1,0.2,4.8,2.2s-0.2,4.2-2.1,5c-7.2,2.9-12,10-12,18.1c0,1.6,0.2,3.2,0.6,4.7c0.5,2-0.7,4.1-2.7,4.6c-2,0.5-4-0.7-4.5-2.8C0.3,31.5,0,29.3,0,27.1C0,15.8,6.7,5.9,16.7,1.9z" fill="#888888"></path></g></svg></i>'
							);
							o.value.push('<span class="my-button">Stop</span>');
						} else {
							o.value.push('<span class="my-button">Click</span>');
						}

						o.value = o.value.join('');

						return o;
					},
				},
			],
		});
	}, 2000);
});
