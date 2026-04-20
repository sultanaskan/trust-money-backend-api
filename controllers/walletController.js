const { Wallet, Transaction, sequelize } = require('../models');

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
        res.json({ message: "Payment/Withdrawal successful", currentBalance: wallet.balance });
    } catch (err) {
        await t.rollback();
        res.status(400).json({ error: err.message });
    }
};