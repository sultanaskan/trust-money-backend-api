const express = require('express');
const router = express.Router();
const walletCtrl = require('../controllers/walletController');

router.get('/:userId', walletCtrl.getWalletBalance);      // ব্যালেন্স চেক
router.post('/add-money', walletCtrl.addFunds);           // টাকা ইন
router.post('/withdraw', walletCtrl.deductFunds);         // টাকা আউট

module.exports = router;