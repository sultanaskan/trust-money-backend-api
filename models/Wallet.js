const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Wallet = sequelize.define('Wallet', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    balance: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0.00,
        allowNull: false,
        validate: { min: 0 }
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

// এখানে রিলেশন (belongsTo) রাখবেন না
module.exports = Wallet;