const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/docControllers');

router.post('/', adminCtrl.postDoc);   // POST: /api/admin/docs
router.get('/', adminCtrl.getDocs)
router.put('/:id', adminCtrl.putDoc);
router.delete('/:id', adminCtrl.deleteDoc);

module.exports = router;