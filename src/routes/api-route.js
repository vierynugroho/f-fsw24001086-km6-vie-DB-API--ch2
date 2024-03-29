const express = require('express');
const router = express.Router();
const { getAllCars, createCar, getCarsById, updateCar, deleteCar } = require('../controllers/api-controller');

//! admin cars
router.route('/').get(getAllCars).post(createCar);
router.route('/:id').get(getCarsById).put(updateCar).delete(deleteCar);

module.exports = router;
