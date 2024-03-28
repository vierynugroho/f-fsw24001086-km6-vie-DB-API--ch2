require('dotenv/config');

const Joi = require('joi');

const { randomUUID } = require('crypto');
const { Op } = require('sequelize');

const { Car } = require('../databases/models');

const { createDataValidation, updateDataValidation } = require('../validations/car-validation');

//! general
const getAllCars = async (req, res) => {
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

		if (cars.length === 0) {
			throw Error('Not Found');
		}

		res.status(200).json({
			status: 'OK',
			totalData: cars.length,
			requestAt: req.requestTime,
			data: cars,
		});
	} catch (error) {
		res.status(500).json({
			status: 'FAILED',
			message: error.message,
		});
	}
};

const getCarsById = async (req, res) => {
	try {
		const id = req.params.id;
		const car = await Car.findByPk(id);

		if (!car) {
			throw new Error('Car Not Found');
		}

		const data = {
			car,
		};

		res.status(200).json({
			status: 'OK',
			data: data,
		});
	} catch (error) {
		res.status(404).json({
			status: 'FAILED',
			message: error.message,
		});
	}
};

const createCar = async (req, res) => {
	const { error } = createDataValidation(req.body);
	if (error) {
		return res.status(400).json({
			status: 'FAIL',
			error_message: error.details[0].message,
		});
	}

	try {
		const data = req.body;
		data.id = randomUUID();
		data.image = './images/' + req.file.originalname;

		const car = await Car.create(data);

		res.status(201).json({
			status: 'OK',
			message: 'CREATE car success!',
			data: car,
		});
	} catch (error) {
		res.status(400).json({
			status: 'FAIL',
			message: error.message,
		});
	}
};

const updateCar = async (req, res) => {
	const { error } = updateDataValidation(req.body);
	if (error) {
		return res.status(400).json({
			status: 'FAIL',
			error_message: error.details[0].message,
		});
	}

	try {
		const data = req.body;
		data.image = req.file ? './images/' + req.file.originalname : data.image;

		const car = await Car.findByPk(req.params.id);

		// hapus gambar lama jika gambar di update
		if (car.image != data.image) {
			fs.unlinkSync(`./public/assets/${car.image}`);
		}

		await Car.update(req.body, {
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json({
			status: 'OK',
			message: 'UPDATE car success!',
			data: req.body,
		});
	} catch (error) {
		res.status(400).json({
			status: 'FAIL',
			message: error.message,
		});
	}
};

const deleteCar = async (req, res) => {
	try {
		const id = req.params.id;

		const findCar = await Car.findByPk(id);

		if (!findCar) {
			throw new Error('Car Not Found');
		}

		await Car.destroy({
			where: {
				id,
			},
		});

		res.status(200).json({
			status: 'OK',
			message: 'DELETE car success!',
		});
	} catch (error) {
		res.status(400).json({
			status: 'FAIL',
			message: error.message,
		});
	}
};

module.exports = {
	getAllCars,
	getCarsById,
	createCar,
	updateCar,
	deleteCar,
};
