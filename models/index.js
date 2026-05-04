const sequelize = require('../config/db');
const User = require('./User');
const Transaction = require('./Transaction');
const Package = require('./Package');
const CompanyDoc = require('./CompanyDoc');
const CurrencyRate = require('./CurrencyRate');
const Wallet = require('./Wallet');
const PaymentMethod = require('./PaymentMethod');
const MoneyRequest = require('./MoneyRequest');
const BannerUpload = require('./BannerUpload');
const Notification = require('./Notification')



// ১. User এবং MoneyRequest এর সম্পর্ক
User.hasMany(MoneyRequest, {
    foreignKey: 'userId',
    onDelete: 'CASCADE' // ইউজার ডিলিট হলে তার সব রিকোয়েস্ট ডিলিট হয়ে যাবে
});
MoneyRequest.belongsTo(User, {
    foreignKey: 'userId'
});
// User এবং Transaction এর সম্পর্ক
User.hasMany(Transaction, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Transaction.belongsTo(User, {
    foreignKey: 'userId'
});

// Wallet এবং User এর সম্পর্ক (এটিও ড্যাশবোর্ডের জন্য প্রয়োজন হবে)
User.hasOne(Wallet, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Wallet.belongsTo(User, {
    foreignKey: 'userId'
});


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
    MoneyRequest,
    BannerUpload,
    Notification
};