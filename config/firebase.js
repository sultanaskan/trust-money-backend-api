const admin = require("firebase-admin");
const path = require("path");



try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    // Private key-এর newline ক্যারেক্টার ঠিক করা
    if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Admin SDK Initialized");
    }
} catch (error) {
    console.error("❌ Firebase Initialization Error:", error.message);
}



/**
 * Helper function to send a notification
 * @param {string} token - The user's FCM token
 * @param {string} title - Notification title
 * @param {string} body - Notification message
 * @param { string} targetUrl - For redirect in app or web
 */
const sendAlert = async (token, title, body, targetUrl = "/") => {
    const message = {
        token: token,
        notification: {
            title: title,
            body: body,
        },
        data: {
            // This is where we pass the navigation link
            url: targetUrl
        },
        webpush: {
            notification: {
                title: title,
                body: body,
                // Passing data here again ensures it reaches the service worker
                data: {
                    url: targetUrl
                }
            }
        }
    };

    return await admin.messaging().send(message);
};

// Export BOTH the admin instance and the helper function
module.exports = {
    admin,
    sendAlert
};