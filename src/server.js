const app = require('./app');
const dotenv = require('dotenv');

//! ------------- config -------------
dotenv.config();

//! ------------- declaration var config -------------
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
	console.log(`Ramadhan Kareem! http://localhost:${PORT}`);
});
