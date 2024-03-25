const { Car } = require('../databases/models');
const Joi = require('joi');
const { randomUUID } = require('crypto');

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

//! general
const getAllCars = async (req, res) => {
	try {
		const cars = await Car.findAll();

		res.status(200).json({
			data: cars,
		});
	} catch (error) {
		res.status(500).json({
			status: 'FAIL',
			message: error.message,
		});
	}
};

const getCarsById = async (req, res) => {
	try {
		const id = req.params.id;
		const car = await Car.findByPk(id);

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
	try {
		const data = req.body;
		data.id = randomUUID();
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
	try {
		const id = req.params.id;
		const { name, rentPerDay, capacity, image } = req.body;

		const car = await Car.update(
			{
				name,
				rentPerDay,
				capacity,
				image,
			},
			{
				where: {
					id,
				},
			}
		);

		res.status(200).json({
			status: 'OK',
			message: 'UPDATE car success!',
			data: car,
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

//! rendering pages
const getAdminCarsPage = async (req, res) => {
	try {
		const cars = await Car.findAll();

		const data = {
			cars,
		};

		res.render('admin/cars/cars', data);
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

const getEditCarPage = async (req, res) => {
	try {
		const id = req.params.id;
		const car = await Car.findByPk(id);
		const data = {
			car,
		};

		res.render('admin/cars/edit-car', data);
	} catch (error) {
		res.status(500).json({
			status: 'FAIL',
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

module.exports = { getAdminCarsPage, getCarsDetailPage, getAddCarPage, getEditCarPage, getAllCars, getCarsById, createCar, updateCar, deleteCar };
