const { CurrencyRate } = require('../models');
const fs = require('fs');
const path = require('path');


// ১. নতুন কারেন্সি রেট সেট করা
exports.setCurrencyRate = async (req, res) => {
    try {
        const { countryName, currencyName, rateInUsd } = req.body;
        let flagUrl = req.body.flagUrl;
        if (req.file) {
            // ডাইনামিক হোস্ট ইউআরএল তৈরি
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            // ফুল ইউআরএল সেট করা
            flagUrl = `${baseUrl}/public/uploads/flags/${req.file.filename}`;
        }

        const newRate = await CurrencyRate.create({
            countryName,
            flagUrl,
            currencyName,
            rateInUsd: Number(rateInUsd)
        });

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
            const baseUrl = `${req.protocol}://${req.get('host')}`;
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