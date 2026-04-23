const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const currencyController = require('../controllers/currencyController');

// ফাইল সেভ করার লোকেশন সেটআপ
const storage = multer.diskStorage({
    destination: './uploads/flags/',
    filename: (req, file, cb) => {
        cb(null, 'flag-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST রাউটে upload.single('flagIcon') যোগ করুন
router.post('/set-currency-rate', upload.single('flagIcon'), currencyController.setCurrencyRate);
router.get('/get-currency-rates', currencyController.getAllRates);
router.get('/get-currency-rate/:id', currencyController.getSingleRate);
router.put('/update-currency-rate/:id', currencyController.updateCurrencyRate);

module.exports = router;