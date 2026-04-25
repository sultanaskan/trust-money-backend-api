const { PaymentMethod } = require('../models'); // আপনার পাথ অনুযায়ী ইমপোর্ট করুন

// ১. নতুন পেমেন্ট মেথড তৈরি করা (Create)
exports.createPaymentMethod = async (req, res) => {
    try {
        const { methodType, methodName, accountNumber, accountType, paymentGuide, status } = req.body;

        const newMethod = await PaymentMethod.create({
            methodType,
            methodName,
            accountNumber,
            accountType,
            paymentGuide,
            status
        });

        res.status(201).json({
            success: true,
            message: "Payment method created successfully",
            data: newMethod
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ২. সকল পেমেন্ট মেথড দেখা (Read All)
exports.getAllPaymentMethods = async (req, res) => {
    try {
        const methods = await PaymentMethod.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: methods.length,
            data: methods
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৩. নির্দিষ্ট একটি পেমেন্ট মেথড দেখা (Read Single)
exports.getPaymentMethodById = async (req, res) => {
    try {
        const method = await PaymentMethod.findByPk(req.params.id);

        if (!method) {
            return res.status(404).json({ success: false, message: "Payment method not found" });
        }

        res.status(200).json({ success: true, data: method });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// ৪. পেমেন্ট মেথড আপডেট করা (Update)
exports.updatePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;

        // ১. নির্দিষ্ট ফিল্ডগুলো বডি থেকে আলাদা করা (Destructuring)
        const {
            methodType,
            methodName,
            accountNumber,
            accountType,
            paymentGuide,
            status
        } = req.body;

        // ২. ডাটাবেসে পেমেন্ট মেথডটি আছে কি না চেক করা
        const method = await PaymentMethod.findByPk(id);

        if (!method) {
            return res.status(404).json({
                success: false,
                message: "Payment method not found"
            });
        }

        // ৩. নির্দিষ্ট ফিল্ডগুলো দিয়ে আপডেট করা
        await method.update({
            methodType,
            methodName,
            accountNumber,
            accountType,
            paymentGuide,
            status
        });

        res.status(200).json({
            success: true,
            message: "Payment method updated successfully",
            data: method
        });
    } catch (error) {
        console.error("Update Payment Method Error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
// ৫. পেমেন্ট মেথড ডিলিট করা (Delete)
exports.deletePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const method = await PaymentMethod.findByPk(id);

        if (!method) {
            return res.status(404).json({ success: false, message: "Payment method not found" });
        }

        await method.destroy();

        res.status(200).json({
            success: true,
            message: "Payment method deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};