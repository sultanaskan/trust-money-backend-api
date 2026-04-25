const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/docControllers');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "public/uploads/docs";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });
// POST: /api/admin/docs
// এখানে 'docFile' হলো কী (Key) এর নাম
router.post('', upload.single('docFile'), adminCtrl.postDoc);
router.get('/', adminCtrl.getDocs);
router.put('/:id', upload.single('docFile'), adminCtrl.putDoc);
router.delete('/:id', adminCtrl.deleteDoc);

module.exports = router;