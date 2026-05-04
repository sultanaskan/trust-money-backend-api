const { 
    User, Wallet, Transaction, MoneyRequest, Package, sequelize 
} = require('../models');
const { Op } = require('sequelize');

exports.getAdminSummary = async (req, res) => {
    try {
        // ১. ইউজার সামারি
        const totalUsers = await User.count();
        const activeUsers = await User.count({ where: { status: 'active' } });
        const agents = await User.count({ where: { type: 'agent' } });

        // ২. ফিন্যান্সিয়াল সামারি (Wallet)
        const totalWalletBalance = await Wallet.sum('balance') || 0;

        // ৩. ট্রানজেকশন সামারি
        const totalDeposits = await Transaction.sum('amount', { where: { type: 'deposit', status: 'success' } }) || 0;
        const totalWithdrawals = await Transaction.sum('amount', { where: { type: 'withdraw', status: 'success' } }) || 0;

        // ৪. রিকোয়েস্ট সামারি (Money Requests)
        const pendingRequests = await MoneyRequest.count({ where: { status: 'pending' } });
        const totalApprovedRequests = await MoneyRequest.sum('amount', { where: { status: 'approved' } }) || 0;

        // ৫. রিসেন্ট ট্রানজেকশন (শেষ ৫টি)
        const recentTransactions = await Transaction.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }] // যদি রিলেশন থাকে
        });

        res.status(200).json({
            success: true,
            summary: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    agents: agents
                },
                finance: {
                    totalSystemBalance: totalWalletBalance,
                    totalDeposits: totalDeposits,
                    totalWithdrawals: totalWithdrawals,
                    revenue: totalDeposits - totalWithdrawals // উদাহরণস্বরূপ লাভ
                },
                requests: {
                    pendingCount: pendingRequests,
                    approvedVolume: totalApprovedRequests
                }
            },
            recentActivity: recentTransactions
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};