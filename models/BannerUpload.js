const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BannerUpload = sequelize.define('BannerUpload', {
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bannerUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = BannerUpload;