const admin = require("firebase-admin");
const path = require("path");

// .env থেকে স্ট্রিংটি নিয়ে এসে JSON অবজেক্টে রূপান্তর করা
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8'));
;

// Private Key-এর \n (newline) ক্যারেক্টারগুলো ঠিক করা (খুবই জরুরি)
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin SDK Initialized");
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