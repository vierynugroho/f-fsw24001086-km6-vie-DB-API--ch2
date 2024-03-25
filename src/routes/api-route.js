const express = require('express');
const { getAllCars, createCar, getCarsById, updateCar, deleteCar } = require('../controllers/cars-controller');

const router = express.Router();

//! admin cars
router.route('/cars/').get(getAllCars).post(createCar);
router.route('/cars/:id').get(getCarsById).put(updateCar).delete(deleteCar);

module.exports = router;
