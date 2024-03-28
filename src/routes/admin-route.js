const express = require('express');
const { getAdminCarsPage, getCarsDetailPage, getAddCarPage, getEditCarPage, createCar, deleteCar, editCar } = require('../controllers/admin-controller');

const router = express.Router();

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
			throw Error(`Invalid MIME type! Allowed: ${allowedTypes}`);
		}
	},
	limits: {
		fileSize: 2 * 1024 * 1024, // 2MB
	},
});

const upload = multer({ storage: storage }).single('image');

//! admin dashboard
router.route('/dashboard'); // unknown action (blank page)

//! admin cars
router.route('/').get(getAdminCarsPage);
router.route('/car/:id').get(getCarsDetailPage);

router.route('/add').get(getAddCarPage).post(upload, createCar);

router.route('/edit/:id').get(getEditCarPage);
router.route('/edit/:id').post(upload, editCar);

router.route('/delete/:id').post(deleteCar);

module.exports = router;
