require('dotenv/config');

const { randomUUID } = require('crypto');
const { Op } = require('sequelize');
const { Car } = require('../databases/models');
const { createDataValidation, updateDataValidation } = require('../validations/car-validation');

const imageKit = require('../libs/imageKit');
const handleUploadImage = require('../services/handleUploadImage');

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
			throw new Error('Car Not Found!');
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
	//! Validation
	const { error } = createDataValidation(req.body);
	if (error) {
		return res.status(400).json({
			status: 'FAIL',
			error_message: error.details[0].message,
		});
	}

	try {
		const data = req.body;
		const file = req.file;

		if (file && (data !== '' || data !== undefined)) {
			const strFile = file.buffer.toString('base64');

			const { url, fileId } = await handleUploadImage(file, strFile);

			data.image = url;
			data.image_id = fileId;
		}

		data.id = randomUUID();

		const car = await Car.create(data);

		res.status(201).json({
			status: 'OK',
			message: 'Data Berhasil Disimpan!',
			data: car,
		});
	} catch (error) {
		res.status(400).json({
			status: 'FAIL',
			message: error.message,
		});
	}
};

const editCar = async (req, res) => {
	//! Validation
	const car = await Car.findByPk(req.params.id);
	const { error } = updateDataValidation(req.body);
	if (error) {
		return res.status(400).json({
			status: 'FAIL',
			error_message: error.details[0].message,
		});
	}

	try {
		const data = req.body;
		const file = req.file;

		if (file) {
			const strFile = file.buffer.toString('base64');
			const { url, fileId } = await handleUploadImage(file, strFile);

			data.image = url;
			data.image_id = fileId;

			// hapus gambar lama
			await imageKit.deleteFile(car.image_id);
		} else {
			car.image;
		}

		await Car.update(req.body, {
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json({
			status: 'OK',
			message: 'Data Berhasil Diperbarui!',
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
		const car = await Car.findByPk(req.params.id);

		if (!car) {
			throw Error('Car Not Found!');
		}

		if (car.image != '' || car.image_id != '') {
			await imageKit.deleteFile(car.image_id);
		}

		await Car.destroy({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json({
			status: 'OK',
			message: 'Data Berhasil Dihapus!',
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
	editCar,
	deleteCar,
};
