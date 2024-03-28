const express = require('express');
const { getAdminCarsPage, getCarsDetailPage, getAddCarPage, getEditCarPage, createCar, deleteCar, editCar } = require('../controllers/admin-controller');
const upload = require('../libs/multer');

const router = express.Router();

//! admin cars
router.route('/').get(getAdminCarsPage);

router.route('/add').get(getAddCarPage).post(upload, createCar);

router.route('/edit/:id').get(getEditCarPage);
router.route('/edit/:id').post(upload, editCar);

router.route('/delete/:id').post(deleteCar);

module.exports = router;
