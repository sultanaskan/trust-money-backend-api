const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');

router.post('/docs', adminCtrl.uploadCompanyDoc);   // POST: /api/admin/docs
router.get('/docs', adminCtrl.getCompanyDocs);     // GET:  /api/admin/docs
router.put('/docs/:id', adminCtrl.updateCompanyDoc); 
router.delete('/docs/:id', adminCtrl.deleteCompanyDoc);

module.exports = router;