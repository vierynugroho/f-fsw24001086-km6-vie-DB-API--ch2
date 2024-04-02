'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Cars', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.STRING,
			},
			name: {
				type: Sequelize.STRING,
			},
			rentPerDay: {
				type: Sequelize.FLOAT,
			},
			capacity: {
				type: Sequelize.INTEGER,
			},
			image: {
				type: Sequelize.TEXT,
			},
			image_id: {
				type: Sequelize.TEXT,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('now'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.fn('now'),
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Cars');
	},
};
