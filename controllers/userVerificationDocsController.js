const { UserVerificationDocs, User, sequelize, FcmToken } = require('../models');
const fs = require('fs');
const path = require('path');
const { sendAlert } = require('../config/firebase')

// 1. Upload Documents - ইউজার তার আইডি কার্ড বা পাসপোর্ট আপলোড করবে
exports.uploadDocs = async (req, res) => {
    try {
        const { userId, docType, docNumber } = req.body;

        if (!userId || !docType || !docNumber) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        // ফাইল চেক করা (frontPartImage এবং backPartImage)
        if (!req.files || !req.files['frontPartImage']) {
            return res.status(400).json({ success: false, message: "Front part of the document is required" });
        }

        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');

        const frontPartUrl = `${protocol}://${host}/public/uploads/userdocs/${req.files['frontPartImage'][0].filename}`;

        let backPartUrl = null;
        if (req.files['backPartImage']) {
            backPartUrl = `${protocol}://${host}/public/uploads/userdocs/${req.files['backPartImage'][0].filename}`;
        }

        const newDoc = await UserVerificationDocs.create({
            userId,
            docType,
            docNumber,
            frontPartUrl,
            backPartUrl,
            status: 'pending'
        });




        // ১. প্রথমে অ্যাডমিন ইউজার খুঁজুন
        const admin = await User.findOne({ where: { role: "admin" } });
        // ২. চেক করুন অ্যাডমিন পাওয়া গেছে কিনা
        if (!admin) {
            console.error("❌ No admin user found in the database.");

        }
        // ৩. অ্যাডমিনের সব টোকেন খুঁজুন (findAll ব্যবহার করা হয়েছে যাতে সব ডিভাইস পাওয়া যায়)
        const tokenEntries = await FcmToken.findAll({
            where: {
                userId: admin.id
                // এখানে platform filter সরিয়ে দিলে সব ডিভাইসেই (web, android, ios) যাবে
            }
        });
        // ৪. চেক করুন টোকেন আছে কিনা
        if (!tokenEntries || tokenEntries.length === 0) {
            console.error("❌ No FCM Tokens found for admin:", admin.id);
            res.status(500).json({ success: false, error: error.message });
        }

        console.log(`✅ Found ${tokenEntries.length} tokens for admin. Sending alerts...`);
        // Promise.all ব্যবহার করা ভালো যাতে সবগুলো রিকোয়েস্ট প্যারালালি চলে
        await Promise.all(tokenEntries.map(entry => {
            sendAlert(
                entry.token, // আপনার DB অনুযায়ী প্রপার্টি নাম token হলে
                "কেও তার একাউন্ট ভেরিফাই করতে চাচ্ছে।",
                `একজন ইউজার তার একাউন্ট ভেরিফাই করার জন্য ডকুমেন্ট আপলোড করেছেন...`,
                "/#verification_fragment"
            ).catch(err => {
                console.error(`❌ Failed to send to token: ${entry.token.substring(0, 10)}... Error:`, err.message);
            });
        }));
        console.log("🚀 Notifications sent to all admin devices.");



        res.status(201).json({
            success: true,
            message: "Documents uploaded successfully. Waiting for admin approval.",
            data: newDoc
        });
    } catch (error) {
        // যদি ডাটাবেসে সেভ হতে এরর দেয়, তবে আপলোড হওয়া ফাইল ডিলিট করে দেওয়া ভালো (Cleanup)
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Get User userdocs - নির্দিষ্ট ইউজারের ডকুমেন্টের অবস্থা দেখা
exports.getUserDocs = async (req, res) => {
    try {
        const { userId } = req.params;
        const docs = await UserVerificationDocs.findAll({
            where: { userId }
        });

        res.status(200).json({ success: true, data: docs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get All Docs (Admin Only) - সব পেন্ডিং রিকোয়েস্ট দেখা
exports.getAllPendingDocs = async (req, res) => {
    try {
        const pendingDocs = await UserVerificationDocs.findAll({
            where: { status: 'pending' },
            include: [{
                model: User,
                attributes: ['firstName', 'lastName', 'email', 'phone']
            }]
        });

        res.status(200).json({ success: true, data: pendingDocs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Update Verification Status (Admin Only) - এপ্রুভ বা রিজেক্ট করা
exports.updateDocStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminComment } = req.body; // status: 'verified' or 'rejected'

        const doc = await UserVerificationDocs.findByPk(id);

        if (!doc) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        await doc.update({
            status,
            adminComment: adminComment || null
        });

        res.status(200).json({
            success: true,
            message: `Document status updated to ${status}`,
            data: doc
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 5. Delete Document Record
exports.deleteDoc = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await UserVerificationDocs.findByPk(id);

        if (!doc) {
            return res.status(404).json({ success: false, message: "Document record not found" });
        }

        // ফাইল ডিলিট লজিক
        [doc.frontPartUrl, doc.backPartUrl].forEach(url => {
            if (url) {
                const urlPath = new URL(url).pathname;
                const filePath = path.join(process.cwd(), urlPath);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        });

        await doc.destroy();
        res.status(200).json({ success: true, message: "Document record and files deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};