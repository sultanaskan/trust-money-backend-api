const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User')


const UserVerificationDocs = sequelize.define('UserVerificationDocs', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    docType: {
        type: DataTypes.ENUM('nid', 'passport', 'driving_licence'),
        allowNull: false
    },
    docNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // same card cannot be used repeatedly.
        validate: { notEmpty: true }
    },
    frontPartUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: { isUrl: true }
    },
    backPartUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    },
    adminComment: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

User.hasMany(UserVerificationDocs, { foreignKey: 'userId' })
UserVerificationDocs.belongsTo(User, { foreignKey: 'userId' })

module.exports = UserVerificationDocs;