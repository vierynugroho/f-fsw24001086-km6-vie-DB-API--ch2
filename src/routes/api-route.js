const express = require('express');
const router = express.Router();
const { getAllCars, createCar, getCarsById, updateCar, deleteCar } = require('../controllers/cars-controller');
const multer = require('multer');

const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/assets/images');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
	fileFilter: (req, file, cb) => {
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			throw new Error(`Invalid MIME type! Allowed: ${allowedTypes}`);
		}
	},
	limits: {
		fileSize: 2 * 1024 * 1024, // 2MB
	},
});

const upload = multer({ storage: storage }).single('image');

//! admin cars
router.route('/cars').get(getAllCars).post(upload, createCar);
router.route('/cars/:id').get(getCarsById).put(updateCar).delete(deleteCar);

module.exports = router;
