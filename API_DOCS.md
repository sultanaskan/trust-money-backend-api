আপনার প্রজেক্টের বর্তমান সব ফিচার এবং নতুন যোগ করা Deposit Request ও Company Documents এন্ডপয়েন্টসহ আপডেট করা এপিআই ডকুমেন্টেশন নিচে দেওয়া হলো। এটি আপনার মোবাইল অ্যাপ (Jetpack Compose) বা ফ্রন্টেন্ড ডেভেলপমেন্টের জন্য পূর্ণাঙ্গ গাইড হিসেবে কাজ করবে।

🏦 Trust Money App - API Documentation (Updated V2)
Base URL: http://localhost:5000/api

১. ইউজার ম্যানেজমেন্ট (Authentication)
A. রেজিস্ট্রেশন (Registration)
Endpoint: /register
Method: POST
Body (JSON):
JSON
{
  "name": "MD Rasel",
  "email": "rasel@example.com",
  "password": "yourpassword123"
}

B. লগইন (Login)
Endpoint: /login
Method: POST
Body (JSON):
JSON
{
  "email": "rasel@example.com",
  "password": "yourpassword123"
}




৩. ব্যাংকিং প্যাকেজ (Packages)
A. প্যাকেজ সেট করা (Admin Only)
Endpoint: /set-packages
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
Endpoint: /get-packages
Method: GET


৪. কোম্পানি ডকুমেন্টস (Company Documents)
A. ডকুমেন্ট আপলোড (Admin Only)
কোম্পানির লাইসেন্স বা পলিসি ফাইল আপলোড করার জন্য।
Endpoint: /admin/upload-doc
Method: POST
Body (JSON):
JSON
{
  "title": "Trade License 2026",
  "fileUrl": "uploads/docs/license.pdf",
  "docType": "pdf",
  "description": "Company legal trade license for the current year."
}

B. সব ডকুমেন্ট দেখা
Endpoint: /company-docs
Method: GET



৫. লেনদেনের ইতিহাস (Transaction History)
A. ইউজার ভিত্তিক হিস্টরি
Endpoint: /transactions/:userId
Method: GET
Example: /api/transactions/1




৬. আপডেট করা এপিআই ডকুমেন্টেশন (Markdown)
আপনার API_DOCS.md ফাইলে এই অংশটি যোগ করে নিন:
Markdown
### ৬. কারেন্সি রেট ম্যানেজমেন্ট (Currency Management)

#### **A. সেট কারেন্সি রেট**
* **Endpoint:** `/api/set-currency-rate`
* **Method:** `POST`
* **Body (JSON):**
```json
{
  "countryName": "Bangladesh",
  "flagUrl": "[https://flagsapi.com/BD/flat/64.png](https://flagsapi.com/BD/flat/64.png)",
  "currencyName": "BDT",
  "rateInUsd": 110.50
}
B. সব রেট দেখা
Endpoint: /api/get-currency-rates
Method: GET

C. আপডেট কারেন্সি রেট
Endpoint: /api/update-currency-rate/:id
Method: PUT
Example Body:
JSON
{
  "rateInUsd": 112.00
}






🛠 টেকনিক্যাল নোট:
Content-Type: সব রিকোয়েস্টের জন্য Content-Type: application/json ব্যবহার করতে হবে।

Nodemon: আপনার সার্ভার এখন npm run dev কমান্ডে চলে এবং কোড পরিবর্তন করলে অটো-রিলোড হয়।

Database: Sequelize এর মাধ্যমে আপনার ডাটাবেসে নতুন টেবিলগুলো (DepositRequests, CompanyDocs) অটোমেটিক তৈরি হয়ে গেছে।