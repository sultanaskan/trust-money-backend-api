const { MoneyRequest, User, Wallet, Transaction, sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

// 1. Create - নতুন রিকোয়েস্ট তৈরি করা (userId এখন বডি থেকে আসবে)
exports.createRequest = async (req, res) => {
    try {
        const { paymentMethod, amount, transactionId, userId } = req.body;

        // ভ্যালিডেশন: userId ছাড়া রিকোয়েস্ট গ্রহণ করা হবে না
        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        let recitUrl = null;
        if (req.file) {
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            const host = req.get('host');
            recitUrl = `${protocol}s://${host}/public/uploads/receipts/${req.file.filename}`;
        }

        const newRequest = await MoneyRequest.create({
            userId: userId, // req.user.id এর বদলে সরাসরি userId ব্যবহার করা হয়েছে
            paymentMethod,
            amount,
            transactionId: transactionId || null,
            recitUrl: recitUrl,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: "Money request submitted successfully",
            data: newRequest
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Read - সব রিকোয়েস্ট দেখা
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

exports.getMyRequests = async (req, res) => {
    try {
        // URL থেকে আইডি নেওয়া (যেমন: /my/:userId)
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required in the URL parameter"
            });
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

// 4. Update Status - রিকোয়েস্ট Approve বা Reject করা
exports.updateStatus = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        // ১. মানি রিকোয়েস্ট খুঁজে বের করা
        const request = await MoneyRequest.findByPk(id, { transaction: t });

        if (!request) {
            await t.rollback();
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // ২. স্ট্যাটাস চেক (শুধুমাত্র pending রিকোয়েস্ট আপডেট করা যাবে)
        if (request.status !== 'pending') {
            await t.rollback();
            return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
        }

        // ৩. যদি রিকোয়েস্ট এপ্রুভ করা হয়
        if (status === 'approved') {
            // ওয়ালেট খুঁজে বের করা
            const wallet = await Wallet.findOne({ where: { userId: request.userId }, transaction: t });

            if (!wallet) {
                // ওয়ালেট না থাকলে নতুন তৈরি করা (ব্যালেন্স হিসেবে রিকোয়েস্টের অ্যামাউন্ট বসবে)
                await Wallet.create({
                    userId: request.userId,
                    balance: request.amount, // মডেল অনুযায়ী ফিল্ডের নাম 'balance'
                    status: 'active'
                }, { transaction: t });
            } else {
                // ওয়ালেট থাকলে ব্যালেন্স বাড়ানো
                await wallet.increment('balance', {
                    by: request.amount,
                    transaction: t
                });
            }

            // ট্রানজেকশন রেকর্ড তৈরি করা (Transaction মডেল অনুযায়ী)
            await Transaction.create({
                transactionId: request.transactionId,
                userId: request.userId,
                type: 'deposit', // এনাম টাইপ 'deposit'
                amount: request.amount,
                status: 'success',
                description: `Money request approved via ${request.paymentMethod}. TransID: ${request.transactionId || 'N/A'}`
            }, { transaction: t });
        }

        // ৪. মানি রিকোয়েস্টের স্ট্যাটাস আপডেট করা
        await request.update({ status }, { transaction: t });

        // ৫. ট্রানজেকশন কমিট করা (এটি খুব গুরুত্বপূর্ণ)
        await t.commit();

        res.status(200).json({
            success: true,
            message: `Request status updated to ${status}`,
            data: request
        });

    } catch (error) {
        // কোনো সমস্যা হলে রোলব্যাক করা
        if (t) await t.rollback();
        res.status(500).json({ success: false, error: error.message });
    }
};

// 5. Delete - রিকোয়েস্ট মুছে ফেলা
exports.deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await MoneyRequest.findByPk(id);

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        if (request.recitUrl) {
            try {
                // URL থেকে পাথ বের করে ফাইল ডিলিট করা
                const parsedUrl = new URL(request.recitUrl);
                const filePath = path.join(process.cwd(), parsedUrl.pathname);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error("File deletion failed:", err.message);
            }
        }

        await request.destroy();
        res.status(200).json({ success: true, message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};