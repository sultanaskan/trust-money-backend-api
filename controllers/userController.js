const { User, Wallet } = require('../models'); // আপনার পাথ অনুযায়ী ইমপোর্ট করুন
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {
    try {
        const {
            currencyId,
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
            currencyId,
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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ইউজার খুঁজে বের করা
        // সংশোধন করা লাইন:
        const user = await User.scope('withPassword').findOne({ where: { email } });

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
            console.log(user)

            // রেসপন্সে ইউজারের নতুন ফিল্ডগুলো পাঠানো
            res.json({
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    currencyId: user.currencyId,
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





// ১. সকল ইউজারদের লিস্ট পাওয়া (getUsers)
exports.getUsers = async (req, res) => {
    try {
        // পাসওয়ার্ড বাদে সকল ইউজার ডাটা নিয়ে আসা
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;

        // আইডি দিয়ে ইউজার খোঁজা এবং পাসওয়ার্ড বাদ দেওয়া
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        // যদি ইউজার না পাওয়া যায়
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // সফল রেসপন্স
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ২. ইউজারের তথ্য আপডেট করা (updateUser)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone, email, role, status } = req.body;

        // ইউজারটি ডাটাবেসে আছে কিনা চেক করা
        let user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // যদি পাসওয়ার্ড আপডেট করতে চায়, তবে সেটি হ্যাশ করে নেওয়া
        let updatedData = { firstName, lastName, phone, email, role, status };


        // আপডেট করা
        await user.update(updatedData);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                id: user.id,
                email: user.email,
                firstName: user.firstName
            }
        });
    } catch (error) {
        // ডুপ্লিকেট ইমেইল বা ফোনের জন্য এরর হ্যান্ডেলিং
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, message: "Email or Phone already exists" });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৩. ইউজার ডিলিট করা (deleteUser)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ডাটাবেস থেকে মুছে ফেলা
        await user.destroy();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};