const { User, Package, Transaction, sequelize } = require("../models")
// একটি উদাহরণ যা আপনার কন্ট্রোলারে থাকতে পারে
exports.getDashboardSummary = async (req, res) => {
    try {
        const userMatrix = await User.findOne({
            attributes: [
                // মোট ইউজার সংখ্যা
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalUsers'],

                // অ্যাকাউন্ট টাইপ অনুযায়ী কাউন্ট (CASE WHEN ব্যবহার করে)
                [sequelize.literal(`COUNT(CASE WHEN type = 'personal' THEN 1 END)`), 'personalCount'],
                [sequelize.literal(`COUNT(CASE WHEN type = 'agent' THEN 1 END)`), 'agentCount'],

                // স্ট্যাটাস অনুযায়ী কাউন্ট
                [sequelize.literal(`COUNT(CASE WHEN status = 'active' THEN 1 END)`), 'activeCount'],
                [sequelize.literal(`COUNT(CASE WHEN status = 'pending' THEN 1 END)`), 'pendingCount'],
                [sequelize.literal(`COUNT(CASE WHEN status = 'suspended' THEN 1 END)`), 'suspendedCount'],
                [sequelize.literal(`COUNT(CASE WHEN status = 'inactive' THEN 1 END)`), 'inactiveCount']
            ],
            raw: true
        });




        // এর রেজাল্ট আসবে অনেকটা এরকম: [{status: 'active', count: 10}, {status: 'pending', count: 5}]

        const activePackages = await Package.count();
        // Sequelize-এ যোগফল বের করার নিয়ম
        const totalDeposits = await Transaction.sum('amount', { where: { type: 'deposit', status: 'completed' } });
        const pendingWithdraws = await Transaction.count({ where: { type: 'withdraw', status: 'pending' } });

        res.json({
            success: true,
            summary: {
                userMatric: userMatrix,
                transMatrix: {},
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};