const { MoneyRequest, User } = require('../models');

// Create - নতুন রিকোয়েস্ট তৈরি করা
exports.createRequest = async (req, res) => {
    try {
        const { paymentMethod, amount } = req.body;
        const newRequest = await MoneyRequest.create({
            userId: req.user.id, // Auth Middleware থেকে আইডি নেওয়া
            paymentMethod,
            amount
        });
        res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Read - সব রিকোয়েস্ট দেখা (অ্যাডমিনের জন্য)
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await MoneyRequest.findAll({
            include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
        });
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Read - নির্দিষ্ট ইউজারের নিজস্ব রিকোয়েস্ট দেখা
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await MoneyRequest.findAll({ where: { userId: req.user.id } });
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update - রিকোয়েস্ট আপডেট করা (যেমন অ্যাডমিন স্ট্যাটাস পরিবর্তন করবে)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const request = await MoneyRequest.findByPk(id);

        if (!request) return res.status(404).json({ message: "Request not found" });

        await request.update({ status });
        res.json({ success: true, message: "Status updated", data: request });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete - রিকোয়েস্ট মুছে ফেলা
exports.deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        await MoneyRequest.destroy({ where: { id, userId: req.user.id } });
        res.json({ success: true, message: "Request deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};