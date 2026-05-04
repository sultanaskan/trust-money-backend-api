const fs = require('fs');
const path = require('path')
const { CompanyDoc } = require('../models');

// ১. নতুন ডকুমেন্ট আপলোড/সেভ করা
exports.postDoc = async (req, res) => {
    try {
        const { title, docType, description } = req.body;

        // চেক করা ফাইল আপলোড হয়েছে কি না
        if (!req.file) {
            return res.status(400).json({ error: "Please upload a document file" });
        }

        // ভেরিয়েবল নাম ঠিক করা হয়েছে (docUrl -> fileUrl)
        let fileUrl;
        if (req.get('host') === "localhost") {
            fileUrl = `${req.protocol}://${req.get('host')}/public/uploads/docs/${req.file.filename}`;
        } {
            fileUrl = `${req.protocol}s://${req.get('host')}/public/uploads/docs/${req.file.filename}`;
        }

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        // ডাটাবেসে সেভ করা
        const newDoc = await CompanyDoc.create({
            title,
            fileUrl, // এখন ভেরিয়েবল এবং কলাম নাম মিলবে
            docType,
            description
        });

        res.status(201).json({
            message: "Document uploaded successfully",
            newDoc
        });

    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ২. সকল ডকুমেন্ট লিস্ট দেখা
exports.getDocs = async (req, res) => {
    try {
        const docs = await CompanyDoc.findAll({
            order: [['createdAt', 'DESC']] // নতুন ডকুমেন্টগুলো উপরে দেখাবে
        });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ৩. ডকুমেন্ট আপডেট করা (নতুন যোগ করা হয়েছে)
exports.putDoc = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, docType } = req.body;

        const doc = await CompanyDoc.findByPk(id);
        if (!doc) {
            return res.status(404).json({ error: "Document not found" });
        }

        // আপডেট করার জন্য ডাটা অবজেক্ট তৈরি
        let updatedData = { title, description, docType };

        // যদি নতুন ফাইল আপলোড করা হয়
        if (req.file) {
            // ১. পুরানো ফাইলটি সার্ভার থেকে মুছে ফেলা (Clean up)
            if (doc.fileUrl && fs.existsSync(doc.fileUrl)) {
                fs.unlinkSync(doc.fileUrl);
            }

            // ২. নতুন ফাইলের পাথ সেট করা
            updatedData.fileUrl = `${req.protocol}s://${req.get('host')}/public/uploads/docs/${req.file.filename}`;
        }

        // ডাটাবেস আপডেট
        await doc.update(updatedData);

        res.json({
            message: "Document updated successfully",
            doc
        });

    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};
// ৪. ডকুমেন্ট ডিলিট করা (নতুন যোগ করা হয়েছে)
exports.deleteDoc = async (req, res) => {
    try {
        const { id } = req.params;

        // ১. ডাটাবেস থেকে আগে ডকুমেন্টটি খুঁজে বের করুন
        const doc = await CompanyDoc.findByPk(id);

        if (!doc) {
            return res.status(404).json({ error: "Document not found" });
        }

        // ২. ফাইলটি সার্ভার থেকে ডিলিট করা
        if (doc.fileUrl) {
            // ডাটাবেসে সেভ থাকা রিলেটিভ পাথটিকে অ্যাবসোলিউট পাথে রূপান্তর করা (যদি প্রয়োজন হয়)
            const filePath = path.join(__dirname, '..', doc.fileUrl);

            // চেক করা ফাইলটি আসলে ওই ফোল্ডারে আছে কি না
            if (fs.existsSync(doc.fileUrl)) {
                fs.unlinkSync(doc.fileUrl); // ফাইলটি মুছে ফেলবে
                console.log(`File deleted: ${doc.fileUrl}`);
            } else {
                console.log("File not found on server, but database record being removed.");
            }
        }

        // ৩. ডাটাবেস থেকে রেকর্ডটি মুছে ফেলা
        await doc.destroy();

        res.json({ message: "Document and associated file deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: err.message });
    }
};