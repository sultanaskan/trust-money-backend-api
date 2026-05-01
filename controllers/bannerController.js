const { BannerUpload } = require('../models');
const fs = require('fs');
const path = require('path');

// ১. ব্যানার আপলোড করা
exports.uploadBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image" });
        }

        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const imageUrl = `${protocol}s://${host}/public/uploads/banners/${req.file.filename}`;

        const banner = await BannerUpload.create({
            title: req.body.title || "Untitled Banner",
            bannerUrl: imageUrl
        });

        res.status(201).json({ success: true, data: banner });
    } catch (error) {
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