const express = require('express');
const { getAdminCarsPage, getCarsDetailPage, getAddCarPage, getEditCarPage } = require('../controllers/cars-controller');

const router = express.Router();

//! admin dashboard
router.route('/dashboard'); // unknown action (blank page)

//! admin cars
router.route('/cars/list-car').get(getAdminCarsPage);
router.route('/cars/list-car/:id').get(getCarsDetailPage);

router.route('/cars/list-car/add').get(getAddCarPage);
router.route('/cars/list-car/edit/:id').get(getEditCarPage);
module.exports = router;
