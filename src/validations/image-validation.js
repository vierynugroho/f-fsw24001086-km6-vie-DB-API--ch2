const ImageValidation = (data) => {
	const extensionImage = ['jpg', 'jpeg', 'png'];
	const getExtension = data.image ? data.image.split('.').pop().toLowerCase() : null;

	if (getExtension && !extensionImage.includes(getExtension)) {
		throw Error(`Invalid image extension! valid Extension: ${extensionImage}`);
	}
};

module.exports = ImageValidation;
