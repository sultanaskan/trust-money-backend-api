const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');




// Endpoint: POST /api/notifications/save-token
router.post('/save-token', notificationController.saveToken);

// Endpoint: POST /api/notifications/remove-token (Use for Logout)
router.post('/remove-token', notificationController.removeToken);



// অ্যাডমিনের জন্য
router.post('/', notificationController.createNotification);
router.get('/all', notificationController.getAllNotifications);
router.delete('/:id', notificationController.deleteNotification);

// ইউজারের জন্য (বিনা অথেন্টিকেশনে আইডি দিয়ে এক্সেস)
router.get('/user/:userId', notificationController.getUserNotifications);
router.put('/read/:id', notificationController.markAsRead);


module.exports = router;