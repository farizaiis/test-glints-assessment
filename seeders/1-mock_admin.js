'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return await queryInterface.bulkInsert('admins', [
            {
                email: 'fariz@glintsacademy.com',
                password:
                    '$2b$10$nyXmGMmHqgfHtMf0LzaD9.ytTfOtUN0/5eo8TzRGgxLTTchUAeAjW',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return await queryInterface.bulkInsert('admins', null, {});
    },
};
