const Joi = require('joi');

//! Create Car
const createDataValidation = (data) => {
	const carSchema = Joi.object().keys({
		name: Joi.string().required(),
		rentPerDay: Joi.number().required().min(0),
		capacity: Joi.number().required().min(0),
		image: Joi.string().required(),
	});

	return carSchema.validate(data);
};

const updateDataValidation = (data) => {
	const carSchema = Joi.object().keys({
		name: Joi.string().required(),
		rentPerDay: Joi.number().required().min(0),
		capacity: Joi.number().required().min(0),
	});

	return carSchema.validate(data);
};

module.exports = { createDataValidation, updateDataValidation };
