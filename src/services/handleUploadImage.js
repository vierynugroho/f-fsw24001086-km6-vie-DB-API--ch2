const path = require('path');
const imageKit = require('../libs/imageKit');

const handleUploadImage = async (file, strFile) => {
	const { url, fileId } = await imageKit.upload({
		fileName: Date.now() + path.extname(file.originalname),
		file: strFile,
	});

	return { url, fileId };
};

module.exports = handleUploadImage;
