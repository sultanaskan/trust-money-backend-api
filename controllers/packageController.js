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