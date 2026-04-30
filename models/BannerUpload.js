const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CurrencyRate = require('./CurrencyRate');

const BannerUpload = sequelize.define('BannerUpload', {
    bannerUrl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notEmpty: true }
    },
}, {
    timestamps: true,
    // সিকিউরিটির জন্য পাসওয়ার্ড হাইড করে রাখা (JSON এ দেখাবে না)
    defaultScope: {
        attributes: { exclude: ['password'] }
    },
    scopes: {
        withPassword: {
            attributes: {},
        }
    }
});


module.exports = BannerUPload;