require('dotenv/config');

const Joi = require('joi');

const { randomUUID } = require('crypto');
const { Op } = require('sequelize');

const { Car } = require('../databases/models');

//! schema validation data
const carSchema = Joi.object().keys({
	id: Joi.string().required(),
	name: Joi.string().required(),
	rentPerDay: Joi.number().required(),
	capacity: Joi.number().required(),
	image: Joi.string().required(),
	createdAt: Joi.date().required(),
	updatedAt: Joi.date().required(),
});

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
			message: req.flash('message', ''),
		};

		res.render('admin/cars/index', data);
	} catch (error) {
		res.status(500).json({
			status: 'FAIL',
			message: error.message,
		});
	}
};

const getAddCarPage = async (req, res) => {
	try {
		res.render('admin/cars/add-car');
	} catch (error) {
		res.status(500).json({
			status: 'FAIL',
			message: error.message,
		});
	}
};

const createCar = async (req, res) => {
	try {
		const data = req.body;
		data.id = randomUUID();
		data.image = './images/' + req.file.originalname;

		await Car.create(data);

		req.flash('message', 'Berhasil Ditambah!');
		res.redirect('/admin/cars/list-car');
	} catch (error) {
		res.status(400).json({
			status: 'FAIL',
			message: error.message,
		});
	}
};

const getEditCarPage = async (req, res) => {
	try {
		const car = await Car.findByPk(req.params.id);

		res.render('admin/cars/edit-car', { car });
	} catch (error) {
		res.status(500).json({
			status: 'FAIL',
			message: error.message,
		});
	}
};

const editCar = async (req, res) => {
	try {
		await Car.update(req.body, {
			where: {
				id: req.params.id,
			},
		});
		console.log(req.body);

		req.flash('message', 'Data Berhasil Diperbarui!');
		res.redirect('/admin/cars/list-car');
	} catch (error) {
		res.render('error.ejs', {
			message: error.message,
		});
	}
};

const getCarsDetailPage = async (req, res) => {
	try {
		res.render('admin/cars/car-detail');
	} catch (error) {
		res.status(500).json({
			status: 'FAIL',
			message: error.message,
		});
	}
};

const deleteCar = async (req, res) => {
	try {
		await Car.destroy({
			where: {
				id: req.params.id,
			},
		});

		req.flash('message', 'Data Berhasil Dihapus!');
		res.redirect('/admin/cars/list-car');
	} catch (error) {
		res.render('error.ejs', {
			message: error.message,
		});
	}
};

module.exports = {
	getAdminCarsPage,
	getCarsDetailPage,
	createCar,
	getAddCarPage,
	getEditCarPage,
	deleteCar,
	editCar,
};
