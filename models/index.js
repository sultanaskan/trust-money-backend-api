const sequelize = require('../config/db');
const User = require('./User');
const Transaction = require('./Transaction');
const Package = require('./Package');
const CompanyDoc = require('./CompanyDoc');
const CurrencyRate = require('./CurrencyRate');
const Wallet = require('./Wallet');
const PaymentMethod = require('./PaymentMethod');
const MoneyRequest = require('./MoneyRequest')



// সবগুলো মডেলকে একটি অবজেক্ট হিসেবে এক্সপোর্ট করা হচ্ছে
module.exports = {
    sequelize,
    User,
    Transaction,
    Package,
    CompanyDoc,
    CurrencyRate,
    Wallet,
    PaymentMethod,
    MoneyRequest
};