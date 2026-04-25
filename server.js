require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize, Transaction } = require('./models'); // একদম ওপরেই মডেলগুলো নিয়ে নিলাম
const authController = require('./controllers/authController');
const packageController = require('./controllers/packageController');
const transactionController = require('./controllers/transactionController');
const adminController = require('./controllers/docControllers');
const currencyController = require('./controllers/currencyController');
const transactionRoutes = require('./routes/transactionRoutes');
const docRoutes = require('./routes/docRoutes');
const currencyRoute = require('./routes/currencyRoute')
const userRoutes = require('./routes/userRoutes')
const packageRoutes = require('./routes/packageRoutes')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/transactions', transactionRoutes); // লাইন ২৮ হতে পারে এটি
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/doc', docRoutes);
app.use('/api/currency', currencyRoute)
app.use('/api/user', userRoutes)
app.use('/api/package', packageRoutes)

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// --- ৩. ট্রানজ্যাকশন রাউটস ---


const PORT = process.env.PORT || 5000;

// ডাটাবেস কানেকশন এবং সার্ভার লাইভ করার অংশ
sequelize.sync()
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