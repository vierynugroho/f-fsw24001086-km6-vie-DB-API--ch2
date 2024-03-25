/*
 * Contoh kode untuk membaca query parameter,
 * Siapa tau relevan! :)
 * */

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Coba olah data ini hehe :)

//? PARAMS DATA
console.log('DATA PARAMS:');
console.log(params);
console.log('---------------');
let params_driverType = params.driverType;
let params_date = params.date;
let params_pickUpTime = params.pickUpTime;
let params_totalPassenger = params.totalPassenger;

const app = new App();
app.btn_submit.addEventListener('click', () => {
	app.loadWithFilter();
});
