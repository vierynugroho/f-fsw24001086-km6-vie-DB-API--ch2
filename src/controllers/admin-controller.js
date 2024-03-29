require('dotenv/config');

const fs = require('fs');

const { randomUUID } = require('crypto');
const { Op } = require('sequelize');
const { Car } = require('../databases/models');
const { createDataValidation, updateDataValidation } = require('../validations/car-validation');

//TODO: RENDER PAGE
const getAdminCarsPage = async (req, res) => {
	try {
		const capacity_value = req.query.capacity || '0';
		const searchTerm = req.query.search || '';

		const queryObj = { ...req.query };
		const excludedColumns = ['page', 'sort', 'limit'];

		excludedColumns.forEach((el) => delete queryObj[el]);

		const queryStr = JSON.stringify(queryObj);

		//! Advance Filter
		const query = {
			[Op.or]: [{ gte: { ...JSON.parse(queryStr) } }, { gt: { ...JSON.parse(queryStr) } }, { lte: { ...JSON.parse(queryStr) } }, { lt: { ...JSON.parse(queryStr) } }],
		};

		//! Sorting
		const sortBy = req.query.sort ? req.query.sort.split(',').join(' ') : 'capacity';
		query.order = [sortBy];

		//! Search by capacity
		query.where = {
			capacity: {
				[Op.gte]: capacity_value,
			},
			name: {
				[Op.iLike]: `%${searchTerm}%`,
			},
		};

		//! Pagination
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 10;
		const offset = (page - 1) * limit;

		query.offset = offset;
		query.limit = limit;

		const cars = await Car.findAll(query);

		const data = {
			capacity: req.query.capacity,
			searchTerm,
			cars,
			url: '',
			message: req.flash('message', ''),
		};

		res.render('admin/cars/index', data);
	} catch (error) {
		res.render('errors/error.ejs', {
			code: 500,
			message: error.message,
		});
	}
};

const getAddCarPage = async (req, res) => {
	try {
		const data = {
			url: req.url,
			field_error: req.flash('field_error', ''),
		};

		res.render('admin/cars/add-car', data);
	} catch (error) {
		res.render('errors/error.ejs', {
			code: 500,
			message: error.message,
		});
	}
};

const getEditCarPage = async (req, res) => {
	try {
		const car = await Car.findByPk(req.params.id);

		if (!car) {
			throw Error('Not Found');
		}

		const data = {
			car,
			url: '/edit',
			field_error: req.flash('field_error', ''),
		};

		res.render('admin/cars/edit-car', data);
	} catch (error) {
		res.render('errors/error.ejs', {
			code: 404,
			message: error.message,
		});
	}
};

//TODO: ACTION
const createCar = async (req, res) => {
	//! Validation
	const { error } = createDataValidation(req.body);
	if (error) {
		req.flash('field_error', error.details[0].message);
		return res.redirect('/admin/cars/list-car/add');
	}

	try {
		const data = req.body;
		data.id = randomUUID();
		data.image = './images/' + req.file.filename;

		await Car.create(data);

		req.flash('message', ['success', 'Data Berhasil Disimpan!']);
		res.redirect('/admin/cars/list-car');
	} catch (error) {
		res.render('errors/error.ejs', {
			code: 400,
			message: error.message,
		});
	}
};

const editCar = async (req, res) => {
	//! Validation
	const car = await Car.findByPk(req.params.id);
	const { error } = updateDataValidation(req.body);
	if (error) {
		req.flash('field_error', error.details[0].message);
		return res.redirect(`/admin/cars/list-car/edit/${car.id}`);
	}

	try {
		const data = req.body;

		data.image = req.file ? './images/' + req.file.filename : car.image;
		console.log(data.image);

		// hapus gambar lama jika gambar di update
		if (car.image != data.image) {
			fs.unlinkSync(`./public/assets/${car.image}`);
		}

		await Car.update(req.body, {
			where: {
				id: req.params.id,
			},
		});

		req.flash('message', ['success', 'Data Berhasil Diperbarui!']);
		res.redirect('/admin/cars/list-car');
	} catch (error) {
		res.render('errors/error.ejs', {
			code: 400,
			message: error.message,
		});
	}
};

const deleteCar = async (req, res) => {
	try {
		const car = await Car.findByPk(req.params.id);
		fs.unlinkSync(`./public/assets/${car.image}`);

		await Car.destroy({
			where: {
				id: req.params.id,
			},
		});

		req.flash('message', ['dark', 'Data Berhasil Dihapus!']);
		res.redirect('/admin/cars/list-car');
	} catch (error) {
		res.render('errors/error.ejs', {
			code: 500,
			message: error.message,
		});
	}
};

module.exports = {
	getAdminCarsPage,
	createCar,
	getAddCarPage,
	getEditCarPage,
	deleteCar,
	editCar,
};
