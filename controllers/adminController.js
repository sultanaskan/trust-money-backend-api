const { CompanyDoc } = require('../models');

exports.uploadCompanyDoc = async (req, res) => {
    try {
        const { title, fileUrl, docType, description } = req.body;
        const newDoc = await CompanyDoc.create({ title, fileUrl, docType, description });
        res.status(201).json({ message: "Doc uploaded", newDoc });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCompanyDocs = async (req, res) => {
    try {
        const docs = await CompanyDoc.findAll();
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};