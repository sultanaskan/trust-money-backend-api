const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CurrencyRate = sequelize.define('CurrencyRate', {
    countryName: { type: DataTypes.STRING, allowNull: false, unique: true },
    flagUrl: { type: DataTypes.STRING, allowNull: true },
    currencyName: { type: DataTypes.STRING, allowNull: false },
    rateInUsd: { type: DataTypes.DECIMAL(18, 6), allowNull: false }
}, {
    timestamps: true
});

module.exports = CurrencyRate; // এখানে কোনো রিলেশন থাকবে না