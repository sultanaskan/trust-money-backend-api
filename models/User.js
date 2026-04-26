const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
    countryName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Bangladesh",
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
    balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
            min: 0
        }
    }
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