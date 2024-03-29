const express = require('express');
const upload = require('../libs/multer');

const router = express.Router();

const { getAllCars, createCar, getCarsById, editCar, deleteCar } = require('../controllers/api-controller');

//! admin cars
router.route('/').get(getAllCars).post(upload, createCar);
router.route('/:id').get(getCarsById).put(upload, editCar).delete(deleteCar);

module.exports = router;
