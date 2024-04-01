const express = require('express');

const router = express.Router();

const ImageHandler = require('../middlewares/WebImageHandler');

const { getAdminCarsPage, getAddCarPage, getEditCarPage, createCar, deleteCar, editCar } = require('../controllers/admin-controller');

//! admin cars
router.route('/').get(getAdminCarsPage);

router.route('/add').get(getAddCarPage).post(ImageHandler, createCar);

router.route('/edit/:id').get(getEditCarPage);
router.route('/edit/:id').post(ImageHandler, editCar);

router.route('/delete/:id').post(deleteCar);

module.exports = router;
