const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CurrencyRate = require('./CurrencyRate');

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { notEmpty: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
        // কন্ট্রোলারে এটি অবশ্যই bcrypt দিয়ে হ্যাশ করে সেভ করবেন
    },
    currencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // এখানে ডিফল্ট ভ্যালু হিসেবে সরাসরি আইডি নাম্বার দিতে হবে (ধরি বাংলাদেশ ১ নাম্বার আইডি)
        defaultValue: 1,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("user", "admin", "moderator"),
        allowNull: false,
        defaultValue: "user" // এখানে '=' এর বদলে ':' হবে
    },
    status: {
        type: DataTypes.ENUM("active", "inactive", "pending", "suspended"),
        allowNull: false,
        defaultValue: "pending"
    },
    type: {
        type: DataTypes.ENUM("personal", 'agent'),
        allowNull: false,
        defaultValue: "personal"
    },
}, {
    timestamps: true,
    // সিকিউরিটির জন্য পাসওয়ার্ড হাইড করে রাখা (JSON এ দেখাবে না)
    defaultScope: {
        attributes: { exclude: ['password'] }
    },
    scopes: {
        withPassword: {
            attributes: {},
        }
    }
});


module.exports = User;