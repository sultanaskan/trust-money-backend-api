const { User, Transaction, sequelize } = require('../models');

exports.makeTransaction = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { userId, type, amount, description } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            await t.rollback();
            return res.status(404).json({ error: "User not found" });
        }

        const numAmount = parseFloat(amount);

        // ব্যালেন্স আপডেট লজিক
        if (type.toLowerCase() === 'credit' || type.toLowerCase() === 'deposit') {
            user.balance = parseFloat(user.balance) + numAmount;
        } else if (type.toLowerCase() === 'debit' || type.toLowerCase() === 'withdraw') {
            if (user.balance < numAmount) {
                await t.rollback();
                return res.status(400).json({ error: "Insufficient balance" });
            }
            user.balance = parseFloat(user.balance) - numAmount;
        } else {
            await t.rollback();
            return res.status(400).json({ error: "Invalid transaction type" });
        }

        await user.save({ transaction: t });

        // ট্রানজ্যাকশন হিস্টরি তৈরি
        const newTransaction = await Transaction.create({
            userId,
            type,
            amount: numAmount,
            description
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ 
            message: "Transaction successful", 
            currentBalance: user.balance,
            newTransaction 
        });

    } catch (err) {
        if (t) await t.rollback();
        res.status(500).json({ error: err.message });
    }
};