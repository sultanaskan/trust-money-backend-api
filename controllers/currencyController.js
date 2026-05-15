const { CurrencyRate, FcmToken } = require('../models');
const fs = require('fs');
const path = require('path');
const { sendAlert } = require('../config/firebase')

// ১. নতুন কারেন্সি রেট সেট করা
exports.setCurrencyRate = async (req, res) => {
    try {
        const { countryName, currencyName, rateInUsd } = req.body;
        let flagUrl = req.body.flagUrl;
        if (req.file) {
            // ডাইনামিক হোস্ট ইউআরএল তৈরি
            const baseUrl = `${req.protocol}s://${req.get('host')}`;
            // ফুল ইউআরএল সেট করা
            flagUrl = `${baseUrl}/public/uploads/flags/${req.file.filename}`;
        }

        const newRate = await CurrencyRate.create({
            countryName,
            flagUrl,
            currencyName,
            rateInUsd: Number(rateInUsd)
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
                `এক্সচেঞ্জ রেট আপডেটেড`,
                `Trust money এর মাধ্যমে টাকা পাঠান সর্বোচ্চ রেটে\n ${countryName}`,
                "/#money_request"
            ).catch(err => {
                console.error(`❌ Failed to send to token: ${entry.token.substring(0, 10)}... Error:`, err.message);
            });
        }));
        console.log("🚀 Notifications sent to all admin devices.");




        res.status(201).json({
            message: "Currency rate added successfully",
            newRate
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// ২. সব কারেন্সি রেট দেখা
exports.getAllRates = async (req, res) => {
    try {
        const rates = await CurrencyRate.findAll();
        res.json(rates);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ৩. নির্দিষ্ট রেট দেখা
exports.getSingleRate = async (req, res) => {
    try {
        const rate = await CurrencyRate.findByPk(req.params.id);
        if (!rate) return res.status(404).json({ error: "Rate not found" });
        res.json(rate);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ৪. আপডেট করা

exports.updateCurrencyRate = async (req, res) => {
    try {
        const { id } = req.params;
        const { countryName, currencyName, rateInUsd } = req.body;
        const rate = await CurrencyRate.findByPk(id);
        if (!rate) {
            return res.status(404).json({ error: "Currency rate not found" });
        }
        // নতুন ডাটার জন্য অবজেক্ট তৈরি
        let updatedData = {
            countryName,
            currencyName,
            rateInUsd: rateInUsd ? Number(rateInUsd) : rate.rateInUsd
        };

        // যদি নতুন ফ্ল্যাগ ফাইল আপলোড করা হয়
        if (req.file) {
            // ১. পুরানো ফাইলটি সার্ভার থেকে ডিলিট করা
            if (rate.flagUrl) {
                try {
                    console.log(new URL(rate.flagUrl))
                    const urlPath = new URL(rate.flagUrl).pathname;
                    const oldFilePath = path.join(process.cwd(), urlPath);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                } catch (fileErr) {
                    console.log("Old file not found or invalid URL, skipping delete.");
                }
            }
            const baseUrl = `${req.protocol}s://${req.get('host')}`;
            updatedData.flagUrl = `${baseUrl}/public/uploads/flags/${req.file.filename}`;
        }

        // ডাটাবেস আপডেট
        await rate.update(updatedData);

        res.json({
            message: "Currency rate updated successfully",
            rate
        });

    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};



exports.deleteCurrencyRate = async (req, res) => {
    try {
        // ১. আইডি দিয়ে রেকর্ডটি খুঁজে বের করা
        const rate = await CurrencyRate.findByPk(req.params.id);

        // ২. যদি রেকর্ড না পাওয়া যায়
        if (!rate) {
            return res.status(404).json({ error: "Rate not found" });
        }

        // ৩. রেকর্ডটি ডাটাবেস থেকে মুছে ফেলা (Sequelize method is destroy)
        await rate.destroy();

        // ৪. সফল রেসপন্স পাঠানো
        res.json({
            message: "Deleted Successfully",
            deletedRate: rate // কোন ডাটা ডিলিট হলো তা দেখানোর জন্য (অপশনাল)
        });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: error.message });
    }
};