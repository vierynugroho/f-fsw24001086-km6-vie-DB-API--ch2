const fs = require('fs');

const writeFile = (filename, data) => {
	fs.writeFileSync(`./public/data/${filename}`, JSON.stringify(data));
};

module.exports = {
	writeFile,
};
