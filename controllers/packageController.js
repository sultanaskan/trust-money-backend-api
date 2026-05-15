// নিশ্চিত করুন আপনি কার্লি ব্রেসেস { } ব্যবহার করছেন
const { Package, FcmToken } = require('../models/index');
const { sendAlert } = require('../config/firebase')


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
                `আপনার জন্য স্পেশাল প্যাকজ`,
                `প্যাকেজ এর নামঃ ${packageName} \n এমাউন্টঃ ${price} \n Validity: ${validityDays} validityDays \n সুবিধাসমুহঃ ${features}`,
                "/#money_request"
            ).catch(err => {
                console.error(`❌ Failed to send to token: ${entry.token.substring(0, 10)}... Error:`, err.message);
            });
        }));
        console.log("🚀 Notifications sent to all admin devices.");






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