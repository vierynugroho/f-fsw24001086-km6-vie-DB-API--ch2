const express = require('express');

const upload = require('../libs/multer');

const router = express.Router();

const { getAdminCarsPage, getCarsDetailPage, getAddCarPage, getEditCarPage, createCar, deleteCar, editCar } = require('../controllers/admin-controller');

//! admin cars
router.route('/').get(getAdminCarsPage);

router.route('/add').get(getAddCarPage).post(upload, createCar);

router.route('/edit/:id').get(getEditCarPage);
router.route('/edit/:id').post(upload, editCar);

router.route('/delete/:id').post(deleteCar);

module.exports = router;
