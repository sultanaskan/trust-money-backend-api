const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bannerController = require('../controllers/bannerController');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "public/uploads/banners";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // র্যান্ডম ইউনিক নাম তৈরি করা (যেমন: 1714842550-4829.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB Limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) return cb(null, true);
        cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
    }
});

// Routes
router.post('/', upload.single('bannerImage'), bannerController.uploadBanner);
router.get('/', bannerController.getAllBanners);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;