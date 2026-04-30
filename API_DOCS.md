আপনার প্রজেক্টের বর্তমান সব ফিচার এবং নতুন যোগ করা Deposit Request ও Company Documents এন্ডপয়েন্টসহ আপডেট করা এপিআই ডকুমেন্টেশন নিচে দেওয়া হলো। এটি আপনার মোবাইল অ্যাপ (Jetpack Compose) বা ফ্রন্টেন্ড ডেভেলপমেন্টের জন্য পূর্ণাঙ্গ গাইড হিসেবে কাজ করবে।

🏦 Trust Money App - API Documentation (Updated V2)
Base URL: http://localhost:5000/api
Remote Base URl: https://trustmoneyapi.wellcometoserbia.com/api



৩. ব্যাংকিং প্যাকেজ (Packages)
A. প্যাকেজ সেট করা (Admin Only)
Endpoint: /package
Method: POST
Body (JSON):
JSON
{
  "packageName": "SME Business Loan",
  "price": 500.00,
  "validityDays": 30,
  "features": "Low interest rate, Fast processing"
}

B. প্যাকেজ লিস্ট দেখা
Endpoint: /package
Method: GET

C. Get Package by id
Endpoint: /package/:id
Method: Get

D. Put package by id
EndPoint: /package/:id
Method: PUT
PayLoad: {
  "packageName": "SME Business Loan",
  "price": 500.00,
  "validityDays": 30,
  "features": "Low interest rate, Fast processing"
}

E. Delete Package
Endpoint: /package/:id
Method: DELETE
  




৪. কোম্পানি ডকুমেন্টস (Company Documents)
A. ডকুমেন্ট আপলোড (Admin Only)
Endpoint: /api/doc
Method: POST
Description: কোম্পানির লাইসেন্স, পলিসি বা অন্যান্য লিগ্যাল ফাইল ডাটাবেসে সেভ করার জন্য।
Body (JSON):
JSON {
  "docFile": "Trade License 2026",
  "title": "uploads/docs/license.pdf",
  "docType": "pdf",
  "description": "Company legal trade license for the current year."
}

B. সব ডকুমেন্ট দেখা
Endpoint: /api/doc
Method: GET
Description: আপলোড করা সকল ডকুমেন্টের লিস্ট দেখার জন্য (নতুনগুলো আগে দেখাবে)।

C. ডকুমেন্ট আপডেট করা
Endpoint: /api/doc/:id
Method: PUT
Description: নির্দিষ্ট কোনো ডকুমেন্টের তথ্য (টাইটেল, ডেসক্রিপশন ইত্যাদি) পরিবর্তন করার জন্য।
Example Body:
JSON
{
  "docFile": "Trade License 2026",
  "title": "uploads/docs/license.pdf",
  "docType": "pdf",
  "description": "Company legal trade license for the current year."
} 
Response: {
    "message": "Document updated successfully",
    "doc": {
        "id": 4,
        "title": "asdfadf",
        "fileUrl": "public/uploads/docs/1777109040302-ai.svg",
        "docType": "werwer",
        "description": "asdfas",
        "createdAt": "2026-04-25T08:50:59.000Z",
        "updatedAt": "2026-04-25T09:24:00.338Z"
    }
}


D. ডকুমেন্ট ডিলিট করা
Endpoint: /api/doc/:id
Method: DELETE
Description: ডাটাবেস থেকে কোনো ডকুমেন্ট স্থায়ীভাবে মুছে ফেলার জন্য।



৫. লেনদেনের ইতিহাস (Transaction History)
A. ইউজার ভিত্তিক হিস্টরি (User Wise History)
নির্দিষ্ট একজন ইউজারের করা সকল লেনদেনের তালিকা দেখার জন্য।

Endpoint: /api/transactions/user/:userId
Method: GET
Parameters: userId (ইউজারের আইডি)
Example: /api/transactions/user/1
Response:
JSON
[
  {
    "id": 1,
    "transactionId": "TXN-1713583824000-452",
    "userId": 1,
    "type": "deposit",
    "amount": 5000.00,
    "status": "success",
    "description": "Added money via Bkash",
    "createdAt": "2026-04-20T09:30:00Z"
  }
]
B. স্ট্যাটাস ভিত্তিক ফিল্টারিং (Filter by Status)
পেন্ডিং বা সফল ট্রানজ্যাকশনগুলো আলাদাভাবে দেখার জন্য (সাধারণত এডমিন প্যানেলের জন্য)।
Endpoint: /api/transactions/status/:status
Method: GET
Possible Status: pending, success, failed, cancelled
Example: /api/transactions/status/pending
C. নতুন ট্রানজ্যাকশন তৈরি (Initiate Transaction)
Endpoint: /api/transactions
Method: POST
Body (JSON):
JSON
{
  "userId": 1,
  "type": "deposit",
  "amount": 2500.50,
  "description": "পেমেন্ট গেটওয়ের মাধ্যমে ব্যালেন্স রিচার্জ",
  "status": "pending"
} "deposit/withdraw/transfer/payment"
D. ট্রানজ্যাকশন স্ট্যাটাস আপডেট (Update Status)
এডমিন যখন কোনো রিকোয়েস্ট অ্যাপ্রুভ বা রিজেক্ট করবে।
Endpoint: /api/transactions/:id/status
Method: PUT
Body (JSON):
JSON
{
  "status": "success"
}

E. Get User Transactions: 
EndPoint: /transactionns/user/:userID





৬. আপডেট করা এপিআই ডকুমেন্টেশন (Markdown)
আপনার API_DOCS.md ফাইলে এই অংশটি যোগ করে নিন:
Markdown
### ৬. কারেন্সি রেট ম্যানেজমেন্ট (Currency Management)

#### **A. সেট কারেন্সি রেট**
* **Endpoint:** `/currency`
* **Method:** `POST`
* **Body (JSON):**
```json
{
  "flagIcon": file,
  "countryName": "Bangladesh",
  "flagUrl": "[https://flagsapi.com/BD/flat/64.png](https://flagsapi.com/BD/flat/64.png)",
  "currencyName": "BDT",
  "rateInUsd": 110.50
}
B. সব রেট দেখা
Endpoint: /currency
Method: GET

C. আপডেট কারেন্সি রেট
Endpoint: /currency/:id
Method: PUT
Example Body:
JSON
{
  "flagIcon": file,
  "countryName": "Bangladesh",
  "flagUrl": "[https://flagsapi.com/BD/flat/64.png](https://flagsapi.com/BD/flat/64.png)",
  "currencyName": "BDT",
  "rateInUsd": 110.50
}
D. Get single currency rate
Endpoint: /currency/:id
Method: GET
Response: {
    "id": 1,
    "countryName": "dsfg",
    "flagUrl": "https://localhost:5000/public/uploads/flags/1777292450118-ai.svg",
    "currencyName": "df",
    "rateInUsd": "45.000000",
    "createdAt": "2026-04-27T12:20:50.000Z",
    "updatedAt": "2026-04-27T12:20:50.000Z"
}

E. Delete Currency Rate: 
Encpoint: /currency/:id
Method: DELETE




7. ওয়ালেট ম্যানেজমেন্ট (Wallet Management)
A. ওয়ালেট ব্যালেন্স দেখা
Endpoint: /api/wallet/:userId
Method: GET
Description: ইউজারের বর্তমান ব্যালেন্স এবং ওয়ালেটের স্ট্যাটাস দেখার জন্য।

B. ফান্ড অ্যাড করা (Deposit/Add Money)
Endpoint: /api/wallet/add-money
Method: POST
Body (JSON):
{ "userId": 1, "amount": 500, "description": "Cash In" }

C. ফান্ড উইথড্র বা পেমেন্ট (Withdraw/Pay)
Endpoint: /api/wallet/withdraw
Method: POST
{ "userId": 1, "amount": 200, "description": "Buy Package" }
Description: ওয়ালেট থেকে টাকা খরচ করা বা উইথড্র করার জন্য।



8.User management
A. Get all users
Endpoint: /user
Method: GET
RESPONSE: 
{
    "success": true,
    "count": 1,
    "data": [
        {
            "id": 1,
            "currencyId": "Bangladesh",
            "role": "user"/"admin",
            "status": "active"/"inactive"/"pending"/"suspended",
            "type": "personal"/"agent",
            "firstName": "a",
            "lastName": "ad",
            "phone": "adf",
            "email": "a@gmail.com",
            "dateOfBirth": "2026-04-24",
            "createdAt": "2026-04-23T13:32:14.000Z",
            "updatedAt": "2026-04-23T13:32:14.000Z"
        }
    ]
}
B. Get get user with user id
EndPoint: /user/:id
Method: GET

C. Get Update user with user id 
EndPoint: /user/:id
Method: PUT
PlayLoad: {
  "firstName": "Rasel",
  "lastName": "Mollah",
  "phone": "01700000000",
  "email": "rasel.updated@example.com",
  "role": "admin",
  "status": "active", //personal/agent
  "password": "newsecurepassword123"
}
Response: {
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "10",
    "email": "rasel.updated@example.com",
    "firstName": "Rasel"
  }
}
D. রেজিস্ট্রেশন (Registration)
Endpoint: /user/register
Method: POST
Body (JSON):
JSON
{ 
  "currencyId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "phone": "01700000000",
  "email": "john@example.com",
  "role": "user",
  "status": "personal",
  "password": "mysecretpassword",
  "dateOfBirth": "1995-10-15"
}

E. লগইন (Login)
Endpoint: /user/login
Method: POST
Body (JSON):
JSON
{
  "email": "john@example.com",
  "password": "mysecretpassword"
}
Response: {
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc3NTIzNzgyLCJleHAiOjE3Nzc1MjczODJ9.3chve6cSVUf2wcVDBeACtGpZ0F3LM9YKFDL24lI1uuY",
    "user": {
        "id": 2,
        "currencyId": 0,
        "firstName": "John",
        "lastName": "Doe",
        "email": "a@gmail.com",
        "phone": "01700000010",
        "role": "admin",
        "status": "active"
    }
}
}





9. Payment method apis
A. Create Payment Methodনতুন একটি পেমেন্ট গেটওয়ে বা অ্যাকাউন্ট যোগ করার জন্য।
URL: /payment 
Method: POST 
Request Body (JSON):JSON {
  "File" ====> bankLogoUrl
    "methodType": "mobile", 
    "providerName": "Bkash",
    "accountNumber": "01700000000",
    "accountType": "personal/agent/saving",
    "paymentGuide": "Send money to this number and provide transaction ID.",
    "status": "active"
}
Success Response (201 Created):JSON{
    "success": true,
    "message": "Payment method created successfully",
    "data": { "id": 1, ... }
}

B. Get All Payment Methodsসিস্টেমে থাকা সকল পেমেন্ট মেথডের লিস্ট দেখার জন্য।
URL: /payment
Method: GET
Success Response (200 OK):JSON
{
    "success": true,
    "count": 2,
    "data": [
        {
            "id": 2,
            "methodType": "mobile",
            "providerName": "askdjf",
            "bankLogoUrl": "https://localhost:5000/public/uploads/banklogos/1777459214096-trust bank visa card.png",
            "accountNumber": "aasdf",
            "accountType": "personal",
            "paymentGuide": "asdfasdfgadfg",
            "status": "active",
            "createdAt": "2026-04-29T10:26:21.000Z",
            "updatedAt": "2026-04-29T10:40:14.000Z"
        },
        {
            "id": 1,
            "methodType": "mobile",
            "providerName": "askdjf",
            "bankLogoUrl": "https://localhost:5000/public/uploads/banklogos/1777458212038-image.jpg",
            "accountNumber": "aasdf",
            "accountType": "personal",
            "paymentGuide": "asdfasdfgadfg",
            "status": "active",
            "createdAt": "2026-04-29T10:23:32.000Z",
            "updatedAt": "2026-04-29T10:23:32.000Z"
        }
    ]
}

C. Get Single Payment Method
নির্দিষ্ট একটি মেথডের ডিটেইলস দেখার জন্য।
URL: /:id
Method: GET
Success Response (200 OK):JSON
{
    "success": true,
    "data": {
        "id": 1,
        "methodType": "mobile",
        "providerName": "askdjf",
        "bankLogoUrl": "https://localhost:5000/public/uploads/banklogos/1777458212038-image.jpg",
        "accountNumber": "aasdf",
        "accountType": "personal",
        "paymentGuide": "asdfasdfgadfg",
        "status": "active",
        "createdAt": "2026-04-29T10:23:32.000Z",
        "updatedAt": "2026-04-29T10:23:32.000Z"
    }
}

D. Update Payment Methodবিদ্যমান কোনো মেথডের তথ্য পরিবর্তন করার জন্য।URL: 
/:id
Method: PUT
Request Body (JSON):(শুধুমাত্র যে ফিল্ডগুলো পরিবর্তন করতে চান সেগুলো পাঠালেই হবে)JSON
{
  "File" ====> bankLogoUrl
    "methodType": "mobile", 
    "providerName": "Bkash",
    "accountNumber": "01700000000",
    "accountType": "personal/agent/saving",
    "paymentGuide": "Send money to this number and provide transaction ID.",
    "status": "active"
}

E. Delete Payment Methodকোনো পেমেন্ট মেথড চিরতরে মুছে ফেলার জন্য।
URL: /:id
Method: DELETE
Success Response (200 OK):
JSON{
    "success": true,
    "message": "Payment method deleted successfully"
}






1. Create Money Request
নতুন একটি টাকার রিকোয়েস্ট জমা দেওয়ার জন্য।
URL: /
Method: POST
Auth Required: Yes
Request Body:
JSON
{
  "paymentMethod": "bKash",
  "amount": 5000.00
}
Success Response (201):

JSON
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 10,
    "paymentMethod": "bKash",
    "amount": 5000.00,
    "status": "pending",
    "updatedAt": "2024-03-21T...",
    "createdAt": "2024-03-21T..."
  }
}
2. Get My Requests
লগইন করা ইউজার তার নিজের করা সব রিকোয়েস্ট দেখতে পাবে।
URL: /my
Method: GET
Auth Required: Yes
Success Response (200):
JSON
{
  "success": true,
  "data": [
    {
      "id": 1,
      "amount": 5000.00,
      "status": "pending",
      "createdAt": "2024-03-21T..."
    }
  ]
}
3. Get All Requests (Admin Only)
সিস্টেমের সব ইউজারের রিকোয়েস্ট দেখার জন্য (অ্যাডমিন প্যানেলের জন্য)।
URL: /all
Method: GET
Auth Required: Yes (Admin Role)
Success Response (200):
JSON
{
  "success": true,
  "data": [
    {
      "id": 1,
      "amount": 5000.00,
      "status": "pending",
      "User": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      }
    }
  ]
}
4. Update Request Status (Admin Only)
কোনো রিকোয়েস্ট Approve বা Reject করার জন্য।
URL: /:id
Method: PUT
Auth Required: Yes (Admin/Moderator)
Request Body:
JSON
{
  "status": "approved" 
}
Status Options: pending, approved, rejected
Success Response (200):
JSON
{
  "success": true,
  "message": "Status updated",
  "data": { "id": 1, "status": "approved" }
}
5. Delete Request
পেন্ডিং থাকা অবস্থায় কোনো রিকোয়েস্ট মুছে ফেলার জন্য।
URL: /:id
Method: DELETE
Auth Required: Yes
Success Response (200):
JSON
{
  "success": true,
  "message": "Request deleted"
}





🛠 টেকনিক্যাল নোট:
Content-Type: সব রিকোয়েস্টের জন্য Content-Type: application/json ব্যবহার করতে হবে।
স
Nodemon: আপনার সার্ভার এখন npm run dev কমান্ডে চলে এবং কোড পরিবর্তন করলে অটো-রিলোড হয়।

Database: Sequelize এর মাধ্যমে আপনার ডাটাবেসে নতুন টেবিলগুলো (DepositRequests, CompanyDocs) অটোমেটিক তৈরি হয়ে গেছে।