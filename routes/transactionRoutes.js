const express = require('express');
const router = express.Router();
const txnCtrl = require('../controllers/transactionController');

// রাউট লিস্ট
router.post('/', txnCtrl.createTransaction);                // Create
router.get('/', txnCtrl.getAllTransactions);              // Get All
router.get('/user/:userId', txnCtrl.getTransactionsByUserId); // User Wise
router.get('/status/:status', txnCtrl.getTransactionsByStatus); // Status Wise
router.put('/:id/status', txnCtrl.updateTransactionStatus);   // Update Status

module.exports = router;