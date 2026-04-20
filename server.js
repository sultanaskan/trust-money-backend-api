require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Transaction } = require('./models'); // একদম ওপরেই মডেলগুলো নিয়ে নিলাম

// কন্ট্রোলার ইমপোর্ট
const authController = require('./controllers/authController');
const packageController = require('./controllers/packageController');
const transactionController = require('./controllers/transactionController');
const adminController = require('./controllers/adminController');
const currencyController = require('./controllers/currencyController');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/transactions', transactionRoutes); // লাইন ২৮ হতে পারে এটি
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/admin', adminRoutes)

// --- ১. অথেনটিকেশন রাউটস ---
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// --- ২. প্যাকেজ রাউটস ---
app.post('/api/set-packages', packageController.setPackage);
app.get('/api/get-packages', packageController.getPackages);

// --- ৩. ট্রানজ্যাকশন রাউটস ---

// --- ৪. অ্যাডমিন ও কারেন্সি রাউটস ---app.get('/api/company-docs', adminController.getCompanyDocs);
app.post('/api/set-currency-rate', currencyController.setCurrencyRate);
app.get('/api/get-currency-rates', currencyController.getAllRates);
app.get('/api/get-currency-rate/:id', currencyController.getSingleRate);
app.put('/api/update-currency-rate/:id', currencyController.updateCurrencyRate);

const PORT = process.env.PORT || 5000;

// ডাটাবেস কানেকশন এবং সার্ভার লাইভ করার অংশ
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Remote Database synced successfully (using your .env config)');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
        });
    })
    .catch(err => {
        console.error('❌ Database Sync Error:', err.message);
        if (err.message.includes('Access denied')) {
            console.log('💡 Tip: cPanel-এ আপনার IP (103.151.75.186) অ্যাড করা আছে কি না চেক করুন।');
        }
    });