const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    countryName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY, // শুধুমাত্র তারিখ সংরক্ষণের জন্য (YYYY-MM-DD)
        allowNull: false
    }
}, {
    timestamps: true // createdAt এবং updatedAt অটোমেটিক তৈরি হবে
});

// আপনার দেওয়া ইন্সট্রাকশন অনুযায়ী: সরাসরি এক্সপোর্ট
module.exports = User;