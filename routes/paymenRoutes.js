const express = require('express');
const router = express.Router();
const payCtrl = require('../controllers/paymentMethodController');

router.post('/', payCtrl.createPaymentMethod);      // POST: /api/payment-methods
router.get('/', payCtrl.getAllPaymentMethods);      // GET: /api/payment-methods
router.get('/:id', payCtrl.getPaymentMethodById);   // GET: /api/payment-methods/:id
router.put('/:id', payCtrl.updatePaymentMethod);    // PUT: /api/payment-methods/:id
router.delete('/:id', payCtrl.deletePaymentMethod); // DELETE: /api/payment-methods/:id

module.exports = router;