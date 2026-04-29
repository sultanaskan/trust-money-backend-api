const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PaymentMethod = sequelize.define('PaymentMethod', {
    methodType: {
        type: DataTypes.ENUM('mobile', 'banking'),
        allowNull: false,
        comment: 'Type of payment: mobile (Bkash/Nagad) or traditional banking'
    },
    providerName: {
        type: DataTypes.STRING,
        allowNull: false,
        placeholder: 'e.g., Bkash, Rocket, DBBL, City Bank'
    },
    bankLogoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accountType: {
        type: DataTypes.ENUM("personal", "agent", "saving"),
        allowNull: true,
        placeholder: 'e.g., Personal, Agent, Savings, Current'
    },
    paymentGuide: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Instruction for the user on how to pay'
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    }
}, {
    timestamps: true // এটি অটোমেটিক createdAt এবং updatedAt তৈরি করবে
});

module.exports = PaymentMethod;