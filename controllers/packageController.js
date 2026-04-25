// নিশ্চিত করুন আপনি কার্লি ব্রেসেস { } ব্যবহার করছেন
const { Package } = require('../models/index');

exports.setPackage = async (req, res) => {
    try {
        const { packageName, price, validityDays, features } = req.body;

        // চেক করার জন্য একটি লগ দিন (টার্মিনালে দেখবেন এটি Function দেখায় কি না)
        console.log("Package Model Type:", typeof Package);

        const newPackage = await Package.create({
            packageName,
            price,
            validityDays,
            features
        });

        res.status(201).json({ message: "Package set successfully", newPackage });
    } catch (err) {
        console.error("Internal Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.findAll();
        res.json(packages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ১. নির্দিষ্ট একটি প্যাকেজ খুঁজে বের করা (Get Single Package)
exports.getPackage = async (req, res) => {
    try {
        const { id } = req.params;
        const packageData = await Package.findByPk(id);

        if (!packageData) {
            return res.status(404).json({ message: "Package not found" });
        }

        res.status(200).json(packageData);
    } catch (err) {
        console.error("Get Package Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ২. প্যাকেজের তথ্য আপডেট করা (Update Package)
exports.putPackage = async (req, res) => {
    try {
        const { id } = req.params;
        const { packageName, price, validityDays, features } = req.body;

        const packageData = await Package.findByPk(id);

        if (!packageData) {
            return res.status(404).json({ message: "Package not found" });
        }

        // ডাটা আপডেট করা
        await packageData.update({
            packageName,
            price,
            validityDays,
            features
        });

        res.status(200).json({
            message: "Package updated successfully",
            packageData
        });
    } catch (err) {
        console.error("Update Package Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ৩. প্যাকেজ ডিলিট করা (Delete Package)
exports.deletePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const packageData = await Package.findByPk(id);

        if (!packageData) {
            return res.status(404).json({ message: "Package not found" });
        }

        // ডাটাবেস থেকে ডিলিট করা
        await packageData.destroy();

        res.status(200).json({
            message: "Package deleted successfully",
            deletedId: id
        });
    } catch (err) {
        console.error("Delete Package Error:", err);
        res.status(500).json({ error: err.message });
    }
};