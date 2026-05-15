const { PaymentMethod, FcmToken } = require('../models'); // আপনার পাথ অনুযায়ী ইমপোর্ট করুন
const fs = require("fs")
const path = require("path")
const { sendAlert } = require("../config/firebase")

// ১. নতুন পেমেন্ট মেথড তৈরি করা (Create)
exports.createPaymentMethod = async (req, res) => {
    try {
        const { methodType, providerName, accountNumber, accountType, paymentGuide, status } = req.body;
        let bankLogoUrl = req.body.File;
        if (req.file) {
            // ডাইনামিক হোস্ট ইউআরএল তৈরি
            const baseUrl = `${req.protocol}s://${req.get('host')}`;
            // ফুল ইউআরএল সেট করা
            bankLogoUrl = `${baseUrl}/public/uploads/banklogos/${req.file.filename}`;
        }
        const newMethod = await PaymentMethod.create({
            methodType,
            providerName,
            bankLogoUrl,
            accountNumber,
            accountType,
            paymentGuide,
            status
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
                `Trust Money তে নতুন পেমেন্ট মেথড যুক্ত হয়েছে`,
                `এখন থেকে আপনি ${providerName} এর মাধ্যমেও টাকা পাঠানে পারবেন।`,
                "/#money_request"
            ).catch(err => {
                console.error(`❌ Failed to send to token: ${entry.token.substring(0, 10)}... Error:`, err.message);
            });
        }));
        console.log("🚀 Notifications sent to all admin devices.");




        res.status(201).json({
            success: true,
            message: "Payment method created successfully",
            data: newMethod
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ২. সকল পেমেন্ট মেথড দেখা (Read All)
exports.getAllPaymentMethods = async (req, res) => {
    try {
        const methods = await PaymentMethod.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: methods.length,
            data: methods
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৩. নির্দিষ্ট একটি পেমেন্ট মেথড দেখা (Read Single)
exports.getPaymentMethodById = async (req, res) => {
    try {
        const method = await PaymentMethod.findByPk(req.params.id);

        if (!method) {
            return res.status(404).json({ success: false, message: "Payment method not found" });
        }

        res.status(200).json({ success: true, data: method });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৪. পেমেন্ট মেথড আপডেট করা (Update)
exports.updatePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const { methodType, providerName, accountNumber, accountType, paymentGuide, status } = req.body;

        // ১. ডাটাবেস থেকে বর্তমান পেমেন্ট মেথডটি খুঁজে বের করা
        const paymentMethod = await PaymentMethod.findByPk(id);
        if (!paymentMethod) {
            return res.status(404).json({ success: false, message: "Payment method not found" });
        }

        // ২. ডাটা আপডেট করার জন্য অবজেক্ট তৈরি
        let updatedData = {
            methodType: methodType || paymentMethod.methodType,
            providerName: providerName || paymentMethod.providerName,
            accountNumber: accountNumber || paymentMethod.accountNumber,
            accountType: accountType || paymentMethod.accountType,
            paymentGuide: paymentGuide || paymentMethod.paymentGuide,
            status: status || paymentMethod.status
        };

        // ৩. যদি নতুন ফাইল (Logo) আপলোড করা হয়
        if (req.file) {
            // পুরানো লোগোটি সার্ভার থেকে ডিলিট করা
            if (paymentMethod.bankLogoUrl) {
                try {
                    // ইউআরএল থেকে পাথের অংশটুকু বের করা (যেমন: /public/uploads/...)
                    const urlPath = new URL(paymentMethod.bankLogoUrl).pathname;
                    const oldFilePath = path.join(process.cwd(), urlPath);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                } catch (fileErr) {
                    console.log("Old file not found or invalid URL, skipping delete.");
                }
            }

            // নতুন ডাইনামিক হোস্ট ইউআরএল তৈরি
            const protocol = req.headers['x-forwarded-proto'] || req.protocol;
            const host = req.get('host');
            updatedData.bankLogoUrl = `${protocol}s://${host}/public/uploads/banklogos/${req.file.filename}`;
        }

        // ৪. ডাটাবেসে আপডেট সম্পন্ন করা
        await paymentMethod.update(updatedData);

        res.status(200).json({
            success: true,
            message: "Payment method updated successfully",
            data: paymentMethod
        });

    } catch (error) {
        console.error("Update Payment Method Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
// ৫. পেমেন্ট মেথড ডিলিট করা (Delete)
exports.deletePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const method = await PaymentMethod.findByPk(id);

        if (!method) {
            return res.status(404).json({ success: false, message: "Payment method not found" });
        }

        await method.destroy();

        res.status(200).json({
            success: true,
            message: "Payment method deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};