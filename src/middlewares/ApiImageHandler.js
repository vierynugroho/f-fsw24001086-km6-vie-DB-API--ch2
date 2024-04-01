const upload = require('../libs/multer');

const ImageHandler = (req, res, next) => {
	upload(req, res, function (error) {
		if (error) {
			res.status(400).json({
				status: 'FAIL',
				message: error.message,
			});
		}
		next();
	});
};

module.exports = ImageHandler;
