const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MoneyRequest = sequelize.define('MoneyRequest', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2), // DOUBLE এর বদলে DECIMAL ব্যবহার করা ভালো ব্যাংকিং অ্যাপের জন্য
        allowNull: false,
        validate: { min: 0.01 }
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

module.exports = MoneyRequest;