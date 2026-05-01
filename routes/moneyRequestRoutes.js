const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moneyRequestController = require('../controllers/moneyRequestController');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "public/uploads/receipts";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 } // 1MB Limit
});

// Routes (auth সরিয়ে ফেলা হয়েছে)
router.post('/', upload.single('recitImage'), moneyRequestController.createRequest);
router.get('/all', moneyRequestController.getAllRequests);
// :userId যোগ করা হয়েছে যাতে /my/10 এভাবে কল করা যায়
router.get('/my/:userId', moneyRequestController.getMyRequests);
router.put('/:id', moneyRequestController.updateStatus);
router.delete('/:id', moneyRequestController.deleteRequest);

module.exports = router;