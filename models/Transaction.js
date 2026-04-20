const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define('Transaction', {
    transactionId: {
        type: DataTypes.STRING,
        defaultValue: () => `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: { 
        type: DataTypes.ENUM('deposit', 'withdraw', 'transfer', 'payment'), 
        allowNull: false 
    },
    amount: { 
        type: DataTypes.DECIMAL(15, 2), 
        allowNull: false 
    },
    status: { 
        type: DataTypes.ENUM('pending', 'success', 'failed', 'cancelled'), 
        defaultValue: 'pending' 
    },
    description: { 
        type: DataTypes.STRING 
    }
}, {
    timestamps: true
});

module.exports = Transaction;