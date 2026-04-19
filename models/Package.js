const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Package = sequelize.define('Package', {
    packageName: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    validityDays: { type: DataTypes.INTEGER, allowNull: false },
    features: { type: DataTypes.TEXT }
});

module.exports = Package; // এটি যেন কোনোভাবেই অবজেক্ট { Package } না হয়