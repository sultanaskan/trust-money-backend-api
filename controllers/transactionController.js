const { Transaction, User } = require('../models');

// ১. Create Transaction
exports.createTransaction = async (req, res) => {
    try {
        const { userId, type, amount, description } = req.body;
        const newTxn = await Transaction.create({ userId, type, amount, description });
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