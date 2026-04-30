const express = require('express');
const router = express.Router();
const payCtrl = require('../controllers/paymentMethodController');
const multer = require('multer');
const path = require('path');
const fs = require("fs")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "public/uploads/banklogos";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 1 * 1024 * 1024 // 1 মেগাবাইট (Bytes এ কনভার্ট করা)
    }
});



router.post('/', upload.single("File"), payCtrl.createPaymentMethod);      // POST: /api/payment-methods
router.get('/', payCtrl.getAllPaymentMethods);      // GET: /api/payment-methods
router.get('/:id', payCtrl.getPaymentMethodById);   // GET: /api/payment-methods/:id
router.put('/:id', upload.single("File"), payCtrl.updatePaymentMethod);    // PUT: /api/payment-methods/:id
router.delete('/:id', payCtrl.deletePaymentMethod); // DELETE: /api/payment-methods/:id

module.exports = router;