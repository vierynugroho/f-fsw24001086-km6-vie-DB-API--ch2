const Joi = require('joi');

//! Create Car
const createDataValidation = (data) => {
	const carSchema = Joi.object().keys({
		name: Joi.string().trim().required(),
		rentPerDay: Joi.number().min(0).required(),
		capacity: Joi.number().min(0).required(),
	});

	return carSchema.validate(data);
};

const updateDataValidation = (data) => {
	const carSchema = Joi.object().keys({
		name: Joi.string().trim().required(),
		rentPerDay: Joi.number().min(0).required(),
		capacity: Joi.number().min(0).required(),
	});

	return carSchema.validate(data);
};

module.exports = { createDataValidation, updateDataValidation };
