const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Wallet = sequelize.define('Wallet', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true // এক ইউজারের একটিই ওয়ালেট থাকবে
    },
    balance: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0.00,
        allowNull: false,
        validate: {
            min: 0 // ব্যালেন্স কখনো নেগেটিভ হতে পারবে না
        }
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'BDT'
    },
    status: {
        type: DataTypes.ENUM('active', 'locked', 'suspended'),
        defaultValue: 'active'
    }
}, {
    timestamps: true
});

module.exports = Wallet;