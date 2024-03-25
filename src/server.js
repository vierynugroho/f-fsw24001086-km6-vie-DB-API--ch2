const app = require('./app');
const dotenv = require('dotenv');

//! ------------- config -------------
dotenv.config();

//! ------------- declaration var config -------------
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Yohoo! running in http://localhost:${PORT}`);
});
