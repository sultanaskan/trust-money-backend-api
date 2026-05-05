const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require("fs")
const currencyController = require('../controllers/currencyController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "public/uploads/flags";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
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
    limits: {
        fileSize: 1 * 1024 * 1024 // 1 মেগাবাইট (Bytes এ কনভার্ট করা)
    }
});

// POST রাউটে upload.single('flagIcon') যোগ করুন
router.post('/', upload.single('flagIcon'), currencyController.setCurrencyRate);
router.get('/', currencyController.getAllRates);
router.get('/:id', currencyController.getSingleRate);
router.put('/:id', upload.single('flagIcon'), currencyController.updateCurrencyRate);
router.delete('/:id', currencyController.deleteCurrencyRate)

module.exports = router;
