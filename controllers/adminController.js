const { CompanyDoc } = require('../models');

// ১. নতুন ডকুমেন্ট আপলোড/সেভ করা
exports.uploadCompanyDoc = async (req, res) => {
    try {
        const { title, fileUrl, docType, description } = req.body;
        
        // ভ্যালিডেশন: টাইটেল এবং ফাইল ইউআরএল বাধ্যতামূলক
        if (!title || !fileUrl) {
            return res.status(400).json({ error: "Title and File URL are required" });
        }

        const newDoc = await CompanyDoc.create({ title, fileUrl, docType, description });
        res.status(201).json({ message: "Document uploaded successfully", newDoc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ২. সকল ডকুমেন্ট লিস্ট দেখা
exports.getCompanyDocs = async (req, res) => {
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
exports.updateCompanyDoc = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, docType } = req.body;

        const doc = await CompanyDoc.findByPk(id);
        if (!doc) return res.status(404).json({ error: "Document not found" });

        await doc.update({ title, description, docType });
        res.json({ message: "Document updated successfully", doc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ৪. ডকুমেন্ট ডিলিট করা (নতুন যোগ করা হয়েছে)
exports.deleteCompanyDoc = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await CompanyDoc.findByPk(id);

        if (!doc) return res.status(404).json({ error: "Document not found" });

        await doc.destroy();
        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};