class App {
	constructor() {
		//? CARS CONTAINER
		this.carContainerElement = document.getElementById('cars-container');

		//? FILTER DATA
		this.driver_type = document.getElementById('driverType');
		this.date = document.getElementById('date'); // 2024-03-13;
		this.pick_up_time = document.getElementById('pickUpTime'); // 00:00
		this.total_passenger = document.getElementById('totalPassenger');

		//? BUTTON FILTER
		this.btn_submit = document.getElementById('btnCariMobil');
	}

	async init() {
		await this.load();
	}

	run = () => {
		this.clear();

		//! CARS CONTAINER
		this.carContainerElement.classList.remove('d-none');

		if (Car.list.length == 0 || Car.list.length == undefined) {
			let car_container = document.getElementById('cars-container');
			car_container.innerHTML = `
			<div class="alert alert-danger text-center fw-bold mt-2" role="alert"> Mobil Tidak Tersedia! </div>
			`;
		} else {
			Car.list.forEach((car) => {
				const node = document.createElement('div');

				//! ADD CLASS FOR UI
				node.classList.add('col-12', 'col-lg-3', 'col-md-6', 'mt-3');
				node.innerHTML = car.render();
				this.carContainerElement.appendChild(node);
			});
		}
	};

	async load() {
		const cars = await Binar.listCars();
		Car.init(cars);
	}

	async loadWithFilter() {
		//! LOG FILTER DATA
		console.log('DATA FILTER:');
		console.log('Driver Type: ' + this.driver_type.value);
		console.log('Tanggal: ' + this.date.value);
		console.log('Waktu Ambil: ' + this.pick_up_time.value);
		console.log('Jumlah Penumpang: ' + this.total_passenger.value);
		console.log('---------------');

		let filter_dateTime = new Date(`${this.date.value} ${this.pick_up_time.value}`);

		//! VALIDATION INPUT
		//TODO: total_passenger is empty
		if (this.total_passenger.value == '') this.total_passenger.value = 0;

		//TODO: all input is empty
		if (this.date.value == '' && this.pick_up_time.value == '' && this.total_passenger.value == '0') {
			console.log('empty input!');
			this.init().then(this.run);
			return;
		}

		//TODO: driver_type is empty
		if (this.driver_type.value == '' || this.driver_type.value == null) {
			alert('Masukkan  Tipe Driver Pengambilan Mobil!');
			return;
		}

		//TODO: date or pick up time is empty
		if (this.date.value != '' && this.pick_up_time.value == '') {
			alert('Masukkan  Waktu Pengambilan Mobil!');
			return;
		} else if (this.pick_up_time.value != '' && this.date.value == '') {
			alert('Masukkan Tanggal Pengambilan Mobil!');
			return;
		}

		//! VALIDATION FILTER
		let filteredCars;

		//TODO: if passenger empty
		if (this.total_passenger.value == '' || this.total_passenger.value == null) {
			filteredCars = (car) => car.availableAt <= filter_dateTime.value && car.available === true;
		}
		//TODO: if date or pick up time empty
		else if (this.date.value == '' || this.date.value == null || this.pick_up_time.value == '' || this.pick_up_time.value == null) {
			filteredCars = (car) => car.capacity >= this.total_passenger.value && car.available === true;
		}
		//TODO: if all inputs are filled
		else {
			filteredCars = (car) => car.capacity >= this.total_passenger.value && car.available === true && car.availableAt <= filter_dateTime;
		}

		//! GET FILTERED CARS
		async function getCarsFiltered() {
			const data = await Binar.listCars(filteredCars);
			console.log(data);
			return data;
		}

		//! EXC FILTERED CARS
		getCarsFiltered().then((carsFiltered) => {
			console.log(carsFiltered);
			Car.init(carsFiltered);
			this.run();
		});
	}

	clear = () => {
		let child = this.carContainerElement.firstElementChild;

		while (child) {
			child.remove();
			child = this.carContainerElement.firstElementChild;
		}
	};
}
