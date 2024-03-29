const multer = require('multer');

const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

const multerConfig = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, './public/assets/images');
		},
		filename: (req, file, cb) => {
			cb(null, Date.now() + file.originalname);
		},
	}),
	fileFilter: (req, file, cb) => {
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			return cb(new Error(`Only ${allowedTypes} are allowed`));
		}
	},
	limits: {
		fileSize: 2 * 1024 * 1024, // 2MB
	},
});

const upload = multerConfig.single('image');

module.exports = upload;
