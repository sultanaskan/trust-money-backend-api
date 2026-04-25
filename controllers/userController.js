const User = require('../models/User'); // আপনার পাথ অনুযায়ী ইমপোর্ট করুন
const bcrypt = require('bcryptjs');

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
        const { firstName, lastName, phone, email, role, status, password } = req.body;

        // ইউজারটি ডাটাবেসে আছে কিনা চেক করা
        let user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // যদি পাসওয়ার্ড আপডেট করতে চায়, তবে সেটি হ্যাশ করে নেওয়া
        let updatedData = { firstName, lastName, phone, email, role, status };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(password, salt);
        }

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