const sequelize = require('../config/db');
const User = require('./User');
const Transaction = require('./Transaction');
const Package = require('./Package');
const CompanyDoc = require('./CompanyDoc');
const CurrencyRate = require('./CurrencyRate'); // নতুন যোগ করা কারেন্সি মডেল

// রিলেশনশিপ সেট করা
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

// যেহেতু DepositRequest ডিলিট করা হয়েছে, তাই এখান থেকে সেটি বাদ দেওয়া হলো

module.exports = { 
    sequelize, 
    User, 
    Transaction, 
    Package, 
    CompanyDoc,
    CurrencyRate 
};