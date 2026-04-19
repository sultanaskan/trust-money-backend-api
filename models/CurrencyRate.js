const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CurrencyRate = sequelize.define('CurrencyRate', {
    countryName: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true 
    },
    flagUrl: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    currencyName: { 
        type: DataTypes.STRING, 
        allowNull: false // যেমন: BDT, INR, EUR
    },
    rateInUsd: { 
        type: DataTypes.DECIMAL(18, 6), 
        allowNull: false // ১ ডলারের বিপরীতে ওই কারেন্সির মান
    }
}, {
    timestamps: true
});

module.exports = CurrencyRate;