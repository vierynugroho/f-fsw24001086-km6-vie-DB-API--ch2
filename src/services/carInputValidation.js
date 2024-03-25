const { getAllCars } = require('../controllers/cars-controller');

const carInputValidation = (method, data) => {
	const requireFields = ['plate', 'manufacture', 'model', 'image', 'rentPerDay', 'capacity', 'availableAt', 'transmission', 'available', 'type', 'year'];
	const extensionImage = ['jpg', 'jpeg', 'png'];
	const getExtension = data.image ? data.image.split('.').pop().toLowerCase() : null;

	for (const field of requireFields) {
		if (!data[field] && method != 'put') {
			throw Error(`Missing required field ${field}`);
		} else if (getExtension && !extensionImage.includes(getExtension)) {
			throw Error(`Invalid image extension! valid Extension: ${extensionImage}`);
		} else if (getAllCars().some((car) => car.plate === data.plate)) {
			throw Error(`Plate number cannot be the same!`);
		}
	}
};

module.exports = carInputValidation;
