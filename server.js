require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

// কন্ট্রোলার ইমপোর্ট (ডিপোজিট কন্ট্রোলার বাদ দেওয়া হয়েছে)
const authController = require('./controllers/authController');
const packageController = require('./controllers/packageController');
const transactionController = require('./controllers/transactionController');
const adminController = require('./controllers/adminController');
const currencyController = require('./controllers/currencyController');

const app = express();
app.use(express.json());

// ১. অথেনটিকেশন রাউটস
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// ২. প্যাকেজ রাউটস
app.post('/api/set-packages', packageController.setPackage);
app.get('/api/get-packages', packageController.getPackages);

// ৩. সরাসরি ট্রানজ্যাকশন রাউট (ডিপোজিটের বিকল্প)
app.post('/api/make-transaction', transactionController.makeTransaction);
app.get('/api/transactions/:userId', async (req, res) => {
    const { Transaction } = require('./models');
    const logs = await Transaction.findAll({ where: { userId: req.params.userId } });
    res.json(logs);
});

// ৪. অ্যাডমিন ও কোম্পানি ডকুমেন্ট রাউটস
app.post('/api/admin/upload-doc', adminController.uploadCompanyDoc);
app.get('/api/company-docs', adminController.getCompanyDocs);

// ৫. কারেন্সি রেট ম্যানেজমেন্ট রাউটস
app.post('/api/set-currency-rate', currencyController.setCurrencyRate);
app.get('/api/get-currency-rates', currencyController.getAllRates);
app.get('/api/get-currency-rate/:id', currencyController.getSingleRate);
app.put('/api/update-currency-rate/:id', currencyController.updateCurrencyRate);

const PORT = process.env.PORT || 5000;

// ডাটাবেস সিঙ্ক এবং সার্ভার চালু
sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Database synced successfully.');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
    console.error('❌ Database Sync Error:', err);
});