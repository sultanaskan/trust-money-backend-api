const { MoneyRequest, User, Wallet, Transaction, sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

// 1. Create - নতুন রিকোয়েস্ট তৈরি করা (userId সরাসরি বডি থেকে আসবে)
exports.createRequest = async (req, res) => {
    try {
        const { paymentMethod, amount, transactionId, userId, type } = req.body;

        // ভ্যালিডেশন: userId এবং type অবশ্যই থাকতে হবে
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        if (!['deposit', 'withdraw', 'recharge'].includes(type)) {
            return res.status(400).json({ success: false, message: "Invalid request type" });
        }

        let recitUrl = null;
        if (req.file) {
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            const host = req.get('host');
            recitUrl = `${protocol}://${host}/public/uploads/receipts/${req.file.filename}`;
        }

        const newRequest = await MoneyRequest.create({
            userId,
            type,
            paymentMethod,
            amount,
            transactionId: transactionId || null,
            recitUrl: recitUrl,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} request submitted successfully`,
            data: newRequest
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Read - সব রিকোয়েস্ট দেখা (অ্যাডমিনের জন্য - কোনো Auth চেক নেই)
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await MoneyRequest.findAll({
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Read - নির্দিষ্ট ইউজারের রিকোয়েস্ট দেখা (userId ইউআরএল প্যারামস থেকে আসবে)
exports.getMyRequests = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        const requests = await MoneyRequest.findAll({
            where: { userId: userId },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Update Status - এপ্রুভ বা রিজেক্ট লজিক (সরাসরি ID দিয়ে কাজ করবে)
exports.updateStatus = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        const request = await MoneyRequest.findByPk(id, { transaction: t });

        if (!request) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        if (request.status !== 'pending') {
            await t.rollback();
            return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
        }

        if (status === 'approved') {
            const wallet = await Wallet.findOne({ where: { userId: request.userId }, transaction: t });

            // Withdraw হলে ব্যালেন্স চেক এবং কমানো
            if (request.type === 'withdraw') {
                if (!wallet || wallet.balance < request.amount) {
                    await t.rollback();
                    return res.status(400).json({ success: false, message: "Insufficient wallet balance for withdrawal" });
                }
                await wallet.decrement('balance', { by: request.amount, transaction: t });
            } else {
                // Deposit বা Recharge হলে বাড়ানো
                if (!wallet) {
                    await Wallet.create({
                        userId: request.userId,
                        balance: request.amount,
                        status: 'active'
                    }, { transaction: t });
                } else {
                    await wallet.increment('balance', { by: request.amount, transaction: t });
                }
            }

            // ট্রানজেকশন লগ তৈরি
            await Transaction.create({
                transactionId: request.transactionId || `TXN-${Date.now()}`,
                userId: request.userId,
                type: request.type,
                amount: request.amount,
                status: 'success',
                description: `${request.type.toUpperCase()} approved successfully.`
            }, { transaction: t });
        }

        await request.update({ status }, { transaction: t });
        await t.commit();

        res.status(200).json({
            success: true,
            message: `Request ${status} successfully`,
            data: request
        });

    } catch (error) {
        if (t) await t.rollback();
        res.status(500).json({ success: false, error: error.message });
    }
};

// 5. Delete - রিকোয়েস্ট মুছে ফেলা
exports.deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await MoneyRequest.findByPk(id);

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // ইমেজ ফাইল ডিলিট করার লজিক
        if (request.recitUrl) {
            try {
                const urlPath = new URL(request.recitUrl).pathname;
                const filePath = path.join(process.cwd(), urlPath);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error("File deletion error:", err.message);
            }
        }

        await request.destroy();
        res.status(200).json({ success: true, message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};