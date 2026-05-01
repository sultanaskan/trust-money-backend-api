const { Notification, User } = require('../models');
const { Op } = require('sequelize');

// ১. নোটিফিকেশন তৈরি করা (অ্যাডমিন)
exports.createNotification = async (req, res) => {
    try {
        const { userId, title, message } = req.body;
        const notification = await Notification.create({
            userId: userId || null, // আইডি না দিলে পাবলিক হয়ে যাবে
            title,
            message
        });
        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ২. ইউজারের জন্য নোটিফিকেশন ফেচ করা (Public + User Specific)
exports.getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;

        const notifications = await Notification.findAll({
            where: {
                [Op.or]: [
                    { userId: null },      // পাবলিক নোটিফিকেশন
                    { userId: userId }     // ইউজারের প্রাইভেট নোটিফিকেশন
                ]
            },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৩. সব নোটিফিকেশন দেখা (অ্যাডমিন প্যানেলের জন্য)
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৪. নোটিফিকেশন Read স্ট্যাটাস আপডেট করা
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.update({ isRead: true }, { where: { id } });
        res.status(200).json({ success: true, message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৫. নোটিফিকেশন মুছে ফেলা
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.destroy({ where: { id } });
        res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};