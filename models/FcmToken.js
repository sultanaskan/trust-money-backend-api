const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FcmToken = sequelize.define('FcmToken', {
    token: {
        type: DataTypes.STRING, // Tokens can be long
        allowNull: false,
        unique: true
    },
    platform: {
        type: DataTypes.ENUM('android', 'web', 'ios'),
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = FcmToken;