const { Notification, User, FcmToken } = require('../models');
const { Op } = require('sequelize');
const { sendAlert } = require('../config/firebase')


exports.saveToken = async (req, res) => {
    try {
        const { userId, token, platform } = req.body;
        if (!token || !platform) {
            return res.status(400).json({ message: "Token and platform are required" });
        }
        // Upsert logic: Update if exists, create if not
        const [fcmToken, created] = await FcmToken.findOrCreate({
            where: { token: token },
            defaults: {
                userId: userId,
                platform: platform
            }
        });

        if (!created && fcmToken.userId !== userId) {
            // If token exists but belongs to a different user (e.g., re-assigned phone)
            fcmToken.userId = userId;
            await fcmToken.save();
        }

        await sendAlert(
            token,
            "Push notification confirm",
            "Your device registered successfully to recive notification! ",
            "" // Specific page or fragment
        );

        res.status(200).json({
            success: true,
            message: created ? "Token saved successfully" : "Token updated"
        });
    } catch (error) {
        console.error("FCM Token Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.removeToken = async (req, res) => {
    try {
        const { token } = req.body;
        await FcmToken.destroy({ where: { token: token } });
        res.status(200).json({ message: "Token removed" });
    } catch (error) {
        res.status(500).json({ message: "Error removing token" });
    }
};





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

