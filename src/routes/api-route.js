const express = require('express');
const router = express.Router();
const { getAllCars, createCar, getCarsById, updateCar, deleteCar } = require('../controllers/api-controller');
const upload = require('../libs/multer');

//! admin cars
router.route('/').get(getAllCars).post(upload, createCar);
router.route('/:id').get(getCarsById).put(updateCar).delete(deleteCar);

module.exports = router;
