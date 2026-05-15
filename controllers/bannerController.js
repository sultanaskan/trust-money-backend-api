const { BannerUpload, FcmToken } = require('../models');
const fs = require('fs');
const { platform } = require('os');
const path = require('path');
const { sendAlert } = require('../config/firebase');
const { log } = require('console');

// ১. ব্যানার আপলোড করা
exports.uploadBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image" });
        }

        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const imageUrl = `${protocol}://${host}/public/uploads/banners/${req.file.filename}`;

        const banner = await BannerUpload.create({
            title: req.body.title || "Untitled Banner",
            bannerUrl: imageUrl
        });



        // ৩. অ্যাডমিনের সব টোকেন খুঁজুন (findAll ব্যবহার করা হয়েছে যাতে সব ডিভাইস পাওয়া যায়)
        const tokenEntries = await FcmToken.findAll({
            where: {
                platform: "android"
                // এখানে platform filter সরিয়ে দিলে সব ডিভাইসেই (web, android, ios) যাবে
            }
        });

        // ৪. চেক করুন টোকেন আছে কিনা
        if (!tokenEntries || tokenEntries.length === 0) {
            res.status(500).json({ success: false, error: error.message });
        }

        console.log(`✅ Found ${tokenEntries.length} tokens for admin. Sending alerts...`);
        // Promise.all ব্যবহার করা ভালো যাতে সবগুলো রিকোয়েস্ট প্যারালালি চলে
        await Promise.all(tokenEntries.map(entry => {
            sendAlert(
                entry.token, // আপনার DB অনুযায়ী প্রপার্টি নাম token হলে
                `আপনার জন্য বিশেষ অফার`,
                `বিশেষ অফার আপনার জন্য, অ্যাপ এ ভিজিট করুন \n ${req.body.title}`,
                "/#money_request"
            ).catch(err => {
                console.error(`❌ Failed to send to token: ${entry.token.substring(0, 10)}... Error:`, err.message);
            });
        }));
        console.log("🚀 Notifications sent to all admin devices.");








        res.status(201).json({ success: true, data: banner });
    } catch (error) {
        console.log("Error submiting banner: ", error.message)
        res.status(500).json({ success: false, error: error.message });
    }
};

// ২. সব ব্যানার দেখা (পাবলিক বা অ্যাডমিন)
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await BannerUpload.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json({ success: true, data: banners });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৩. ব্যানার মুছে ফেলা (সার্ভার ফাইলসহ)
exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await BannerUpload.findByPk(id);

        if (!banner) return res.status(404).json({ message: "Banner not found" });

        // সার্ভার থেকে ফাইল ডিলিট করা
        const urlPath = new URL(banner.bannerUrl).pathname;
        const filePath = path.join(process.cwd(), urlPath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await banner.destroy();
        res.json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};