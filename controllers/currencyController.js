const { CurrencyRate } = require('../models');

// ১. নতুন কারেন্সি রেট সেট করা
exports.setCurrencyRate = async (req, res) => {
    try {
        const { countryName, flagUrl, currencyName, rateInUsd } = req.body;
        const newRate = await CurrencyRate.create({ 
            countryName, flagUrl, currencyName, rateInUsd 
        });
        res.status(201).json({ message: "Currency rate added successfully", newRate });
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
        const rate = await CurrencyRate.findByPk(req.params.id);
        if (!rate) return res.status(404).json({ error: "Rate not found" });
        await rate.update(req.body);
        res.json({ message: "Updated successfully", rate });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};