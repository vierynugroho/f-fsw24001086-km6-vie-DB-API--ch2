class Car {
	static list = [];

	static init(cars) {
		//! SORT ASC
		cars.sort((a, b) => a.capacity - b.capacity);

		this.list = cars.map((i) => new this(i));
	}

	constructor({ id, plate, manufacture, model, image, rentPerDay, capacity, description, transmission, available, type, year, options, specs, availableAt }) {
		this.id = id;
		this.plate = plate;
		this.manufacture = manufacture;
		this.model = model;
		this.image = image;
		this.rentPerDay = rentPerDay;
		this.capacity = capacity;
		this.description = description;
		this.transmission = transmission;
		this.available = available;
		this.type = type;
		this.year = year;
		this.options = options;
		this.specs = specs;
		this.availableAt = availableAt;
	}

	//! NUMBER FORMAT
	formatRupiah = (angka) => {
		let number_string = angka.toString(),
			sisa = number_string.length % 3,
			rupiah = number_string.substr(0, sisa),
			ribuan = number_string.substr(sisa).match(/\d{3}/g);

		if (rupiah) {
			rupiah += '.';
		}

		rupiah += ribuan.join('.');
		return 'Rp ' + rupiah;
	};

	render() {
		return `
			<div class="card border-0 h-100" id="card-car">
			<div class="card-body h-100">
			<img class="img-fluid" id="img-car" src="./assets/${this.image}" alt="${this.manufacture}" />
					<h2 class="card-title fw-bold pt-2" id="car-name">${this.manufacture} ${this.model}/${this.type}</h2>
					<h4 class="card-sub-title fw-bold" id="car-rent">${this.formatRupiah(this.rentPerDay)} / hari</h4>
					<p class="card-text">${this.description}</p>
					<ul class="list-group car-list">
						<li class="list-group-item"><i><img src="./assets/images/fi_passenger.svg" alt="user-icon" /></i> ${this.capacity}
							Orang</li>
						<li class="list-group-item"><i><img src="./assets/images/fi_settings.svg" alt="user-icon" /></i> ${this.transmission}</li>
						<li class="list-group-item"><i><img src="./assets/images/fi_calendar.svg" alt="user-icon" /></i> Tahun
							${this.year}</li>
					</ul>
				</div>
				<div class="card-footer border-0">
				<a href="cars?id=${this.id}"
						class="d-block w-100 py-2 nav-link success-color text-white fw-bold text-center">Pilih
						Mobil</a>
				</div>
			</div>
    `;
	}
}
