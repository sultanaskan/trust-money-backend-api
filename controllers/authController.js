const { User } = require('../models/User'); // পাথ ঠিক আছে কি না চেক করুন
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// রেজিস্ট্রেশন ফাংশন
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully", userId: user.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// লগইন ফাংশন
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user: { name: user.name, email: user.email } });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// এই লাইনটি খুব জরুরি! সবগুলো ফাংশন এক্সপোর্ট করতে হবে।
module.exports = { register, login };