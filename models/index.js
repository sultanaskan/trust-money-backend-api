const sequelize = require('../config/db');
const User = require('./User');
const Transaction = require('./Transaction');
const Package = require('./Package');
const CompanyDoc = require('./CompanyDoc');
const CurrencyRate = require('./CurrencyRate');
const Wallet = require('./Wallet')
const PaymentMethod = require('./PaymentMethod')
// রিলেশনশিপ সেট করা (এটি নিশ্চিত করে যে Sequelize জানে টেবিলগুলোর সম্পর্ক কী)
if (User && Transaction) {
    User.hasMany(Transaction, { foreignKey: 'userId' });
    Transaction.belongsTo(User, { foreignKey: 'userId' });
}

// সবগুলো মডেলকে একটি অবজেক্ট হিসেবে এক্সপোর্ট করা হচ্ছে
module.exports = {
    sequelize,
    User,
    Transaction,
    Package,
    CompanyDoc,
    CurrencyRate,
    Wallet,
    PaymentMethod
};