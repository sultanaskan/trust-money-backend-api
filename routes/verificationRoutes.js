const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const docController = require('../controllers/userVerificationDocsController');

// --- ১. রাউট ফাইলেই মাল্টার কনফিগ (Multer Config inside Route) ---

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads/userdocs';
        // ফোল্ডার না থাকলে তৈরি করবে
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // ফাইলের নাম র্যান্ডম নাম্বার হিসেবে জেনারেট হবে
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2 মেগাবাইট লিমিট
});

// --- ২. এন্ডপয়েন্টসমূহ (Endpoints) ---

// ডকুমেন্ট আপলোড (Front এবং Back Image আলাদা কি-তে আসবে)
router.post(
    '/upload',
    upload.fields([
        { name: 'frontPartImage', maxCount: 1 },
        { name: 'backPartImage', maxCount: 1 }
    ]),
    docController.uploadDocs
);

// নির্দিষ্ট ইউজারের ডকুমেন্টের স্ট্যাটাস দেখা
router.get('/my-status/:userId', docController.getUserDocs);

// সব পেন্ডিং ডকুমেন্ট দেখা (অ্যাডমিন প্যানেল)
router.get('/admin/all-pending', docController.getAllPendingDocs);

// ডকুমেন্ট এপ্রুভ বা রিজেক্ট করা (অ্যাডমিন প্যানেল)
router.put('/admin/update-status/:id', docController.updateDocStatus);

// ডকুমেন্ট রেকর্ড ডিলিট করা
router.delete('/admin/delete/:id', docController.deleteDoc);

module.exports = router;