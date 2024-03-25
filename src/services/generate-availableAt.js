//TODO: if availableAt auto generate
// ! Generate availableAt
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const now = new Date();
const isPositive = getRandomInt(0, 1) === 1;
const mutator = getRandomInt(1000000, 100000000);
const carAvailableAt = new Date(now.getTime() + (isPositive ? mutator : -1 * mutator));

module.exports = {
	carAvailableAt,
};
