'use strict';
const { randomUUID } = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const carsData = [];

		const allowedNumbers = [2, 4, 6];

		for (let i = 1; i <= 5; i++) {
			const randomIndex = Math.floor(Math.random() * allowedNumbers.length);

			carsData.push({
				id: randomUUID(),
				name: `Car ${i}`,
				rentPerDay: `${i}0000`,
				capacity: allowedNumbers[randomIndex],
				image: `./images/car0${i}.min.jpg`,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		return queryInterface.bulkInsert('Cars', carsData);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('Cars', null, {});
	},
};
