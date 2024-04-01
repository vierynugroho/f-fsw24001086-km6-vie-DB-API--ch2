const express = require('express');

const router = express.Router();

const ImageHandler = require('../middlewares/ApiImageHandler');

const { getAllCars, createCar, getCarsById, editCar, deleteCar } = require('../controllers/api-controller');

//! admin cars
router.route('/').get(getAllCars).post(ImageHandler, createCar);
router.route('/:id').get(getCarsById).put(ImageHandler, editCar).delete(deleteCar);

module.exports = router;
