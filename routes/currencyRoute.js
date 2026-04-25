const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const currencyController = require('../controllers/currencyController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/flags");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// POST রাউটে upload.single('flagIcon') যোগ করুন
router.post('/set-currency-rate', upload.single('flagIcon'), currencyController.setCurrencyRate);
router.get('/get-currency-rates', currencyController.getAllRates);
router.get('/get-currency-rate/:id', currencyController.getSingleRate);
router.put('/update-currency-rate/:id', currencyController.updateCurrencyRate);
router.delete('/delete-currency-rate/:id', currencyController.deleteCurrencyRate)

module.exports = router;
