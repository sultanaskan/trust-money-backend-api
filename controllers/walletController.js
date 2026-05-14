const { Wallet, Transaction, sequelize, User } = require('../models');
const { sendAlert } = require('../config/firebase')

// ১. ওয়ালেট ব্যালেন্স দেখা
exports.getWalletBalance = async (req, res) => {
    try {
        // findOrCreate ব্যবহার করা হয়েছে যাতে ওয়ালেট না থাকলে তৈরি হয়ে যায়
        const [wallet, created] = await Wallet.findOrCreate({
            where: { userId: req.params.userId },
            defaults: { balance: 0, status: 'active' }
        });
        res.json(wallet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ২. ফান্ড এড করা (Deposit/Add Money)
exports.addFunds = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { userId, amount, description } = req.body;

        // ওয়ালেট না থাকলে তৈরি করবে, থাকলে খুঁজে বের করবে
        const [wallet, created] = await Wallet.findOrCreate({
            where: { userId },
            defaults: { balance: 0 },
            transaction: t
        });

        // ব্যালেন্স আপডেট
        wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
        await wallet.save({ transaction: t });

        // ট্রানজ্যাকশন হিস্ট্রি তৈরি
        await Transaction.create({
            userId,
            type: 'deposit',
            amount,
            status: 'success',
            description: description || "Funds added to wallet"
        }, { transaction: t });

        await t.commit();



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
                "একজন ইউজার এর Wallet এ ডিপোজিট সম্পন্ন হয়েছে",
                `একজন ইউজার এর Wallet এ ডিপোজিট সম্পন্ন হয়েছে...`,
                "/#wallet"
            ).catch(err => {
                console.error(`❌ Failed to send to token: ${entry.token.substring(0, 10)}... Error:`, err.message);
            });
        }));
        console.log("🚀 Notifications sent to all admin devices.");

        res.json({ message: "Funds added successfully", currentBalance: wallet.balance });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

// ৩. ফান্ড উইথড্র বা পেমেন্ট (Deduct Funds)
exports.deductFunds = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { userId, amount, description } = req.body;

        const [wallet, created] = await Wallet.findOrCreate({
            where: { userId },
            defaults: { balance: 0 },
            transaction: t
        });

        // ব্যালেন্স চেক
        if (parseFloat(wallet.balance) < parseFloat(amount)) {
            throw new Error("Insufficient balance");
        }

        wallet.balance = parseFloat(wallet.balance) - parseFloat(amount);
        await wallet.save({ transaction: t });

        await Transaction.create({
            userId,
            type: 'withdraw',
            amount,
            status: 'success',
            description: description || "Funds deducted from wallet"
        }, { transaction: t });

        await t.commit();





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
                "একজন ইউজার এর Wallet থেকে withdraw সম্পন্ন হয়েছে",
                `একজন ইউজার এর Wallet এ withdraw সম্পন্ন হয়েছে...`,
                "/#wallet"
            ).catch(err => {
                console.error(`❌ Failed to send to token: ${entry.token.substring(0, 10)}... Error:`, err.message);
            });
        }));
        console.log("🚀 Notifications sent to all admin devices.");




        res.json({ message: "Payment/Withdrawal successful", currentBalance: wallet.balance });
    } catch (err) {
        await t.rollback();
        res.status(400).json({ error: err.message });
    }
};