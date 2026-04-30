const express = require('express');
const router = express.Router(); 
const moneyRequestController = require('../controllers/moneyRequestController');

router.post('/', moneyRequestController.createRequest);
router.get('/all', moneyRequestController.getAllRequests); // অ্যাডমিনের জন্য
router.get('/my', moneyRequestController.getMyRequests); // ইউজারের জন্য
router.put('/:id', moneyRequestController.updateStatus);
router.delete('/:id', moneyRequestController.deleteRequest);

module.exports = router;