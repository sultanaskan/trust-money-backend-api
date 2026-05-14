const { Transaction, User, FcmToken } = require('../models');
const { sendAlert } = require('../config/firebase')

// ১. Create Transaction
exports.createTransaction = async (req, res) => {
    try {
        const { userId, type, amount, description } = req.body;
        const newTxn = await Transaction.create({ userId, type, amount, description });



        // ১. প্রথমে অ্যাডমিন ইউজার খুঁজুন
        const admin = await User.findOne({ where: { role: "admin" } });
        // ২. চেক করুন অ্যাডমিন পাওয়া গেছে কিনা
        if (!admin) {
            console.error("❌ No admin user found in the database.");
        }
        // ৩. অ্যাডমিনের সব টোকেন খুঁজুন (findAll ব্যবহার করা হয়েছে যাতে সব ডিভাইস পাওয়া যায়)
        const tokenEntries = await FcmToken.findAll({
            where: {
                userId: admin.id
                // এখানে platform filter সরিয়ে দিলে সব ডিভাইসেই (web, android, ios) যাবে
            }
        });
        // ৪. চেক করুন টোকেন আছে কিনা
        if (!tokenEntries || tokenEntries.length === 0) {
            console.error("❌ No FCM Tokens found for admin:", admin.id);
            res.status(500).json({ success: false, error: error.message });
        }

        console.log(`✅ Found ${tokenEntries.length} tokens for admin. Sending alerts...`);
        // Promise.all ব্যবহার করা ভালো যাতে সবগুলো রিকোয়েস্ট প্যারালালি চলে
        await Promise.all(tokenEntries.map(entry => {
            sendAlert(
                entry.token, // আপনার DB অনুযায়ী প্রপার্টি নাম token হলে
                "নতুন লেনদেন সম্পন্ন হয়েছে... ",
                `একটি নতুন লেনদেন সম্পন্ন হয়েছে...`,
                "/#transaction"
            ).catch(err => {
                console.error(`❌ Failed to send to token: ${entry.token.substring(0, 10)}... Error:`, err.message);
            });
        }));
        console.log("🚀 Notifications sent to all admin devices.");





        res.status(201).json({ message: "Transaction initiated", transaction: newTxn });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ২. Get All Transactions (Admin View)
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ order: [['createdAt', 'DESC']] });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ৩. Get Transactions by User ID
exports.getTransactionsByUserId = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']]
        });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ৪. Get Transactions by Status (e.g., 'pending')
exports.getTransactionsByStatus = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { status: req.params.status }
        });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ৫. Update Transaction Status (Admin Action)
exports.updateTransactionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const txn = await Transaction.findByPk(req.params.id);
        if (!txn) return res.status(404).json({ error: "Transaction not found" });

        txn.status = status;
        await txn.save();
        res.json({ message: `Transaction marked as ${status}`, transaction: txn });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};