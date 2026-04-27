const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CompanyDoc = sequelize.define('CompanyDoc', {
    title: {
        type: DataTypes.STRING,
        allowNull: false // ডকুমেন্টের নাম (যেমন: Trade License)
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false // ফাইলের পাথ বা লিঙ্ক
    },
    docType: {
        type: DataTypes.STRING,
        allowNull: true // pdf, png, jpg ইত্যাদি
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = CompanyDoc;