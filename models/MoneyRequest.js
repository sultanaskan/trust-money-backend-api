const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MoneyRequest = sequelize.define('MoneyRequest', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // নতুন ফিল্ড যোগ করা হয়েছে
    type: {
        type: DataTypes.ENUM('deposit', 'withdraw', 'recharge'),
        allowNull: false,
        defaultValue: 'deposit'
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: { min: 0.01 }
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    recitUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

module.exports = MoneyRequest;