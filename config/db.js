const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, // আপনার .env এর নাম অনুযায়ী এখানে DB_PASS রাখা হয়েছে
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || 'mysql', // .env থেকে dialect নিচ্ছে
        logging: false,
        port: 3306,
        dialectOptions: {
            connectTimeout: 60000 
        }
    }
);

module.exports = sequelize;