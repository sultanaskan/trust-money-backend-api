const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Null মানে এটি সবার জন্য (Public Notification)
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT, // বড় মেসেজের জন্য STRING এর বদলে TEXT ব্যবহার করা ভালো
        allowNull: false,
        validate: { notEmpty: true }
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = Notification;