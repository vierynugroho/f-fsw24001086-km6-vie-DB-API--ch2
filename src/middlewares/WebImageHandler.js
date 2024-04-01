const upload = require('../libs/multer');

const ImageHandler = (req, res, next) => {
	const id = req.params.id;
	let url = 'add';

	if (id) {
		url = `edit/${id}`;
	}

	upload(req, res, function (error) {
		if (error) {
			req.flash('field_error', error.message);
			return res.redirect(`/admin/cars/list-car/${url}`);
		}
		next();
	});
};

module.exports = ImageHandler;
