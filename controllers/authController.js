const { User, Wallet } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ১. রেজিস্ট্রেশন ফাংশন
const register = async (req, res) => {
    try {
        const {
            countryName,
            firstName,
            lastName,
            phone,
            email,
            password,
            dateOfBirth
        } = req.body;

        // ইমেইল বা ফোন আগে ব্যবহার হয়েছে কি না চেক করা
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingPhone = await User.findOne({ where: { phone } });
        if (existingPhone) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        // পাসওয়ার্ড হ্যাশ করা
        const hashedPassword = await bcrypt.hash(password, 10);

        // ইউজার তৈরি (নতুন মডেল অনুযায়ী role এবং status যোগ করা হয়েছে)
        const user = await User.create({
            countryName,
            firstName,
            lastName,
            phone,
            email,
            password: hashedPassword,
            dateOfBirth,
            role: 'user',   // ডিফল্ট রোল
            status: 'active' // ডিফল্ট স্ট্যাটাস
        });

        // ইউজারের জন্য একটি প্রাথমিক ওয়ালেট তৈরি করা
        await Wallet.create({
            userId: user.id,
            balance: 0.00
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: user.id
        });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// ২. লগইন ফাংশন
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ইউজার খুঁজে বের করা
        const user = await User.findOne({ where: { email } });

        if (user && await bcrypt.compare(password, user.password)) {

            // অ্যাকাউন্ট একটিভ আছে কি না চেক করা
            if (user.status !== 'active') {
                return res.status(403).json({ message: "Your account is not active." });
            }

            // টোকেন তৈরি
            const token = jwt.sign(
                { id: user.id, role: user.role }, // টোকেনে রোল যোগ করা হয়েছে
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // রেসপন্সে ইউজারের নতুন ফিল্ডগুলো পাঠানো
            res.json({
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    country: user.countryName,
                    role: user.role,
                    status: user.status
                }
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };