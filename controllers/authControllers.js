const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


// ✅ Configure Brevo SMTP Transporter
const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST, 
    port: parseInt(process.env.BREVO_SMTP_PORT), 
    secure: false, // Must be false for port 587 (TLS)
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false, // ✅ Prevent TLS errors
    },
    debug: true,  // Enable debugging
    logger: true, // Enable logging
});

// ✅ Password Validation Function
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
    return passwordRegex.test(password);
};

// Generate JWT Token (expires in 1 hour)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Generate Refresh Token (expires in 7 days)
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};



// ✅ User Registration with Password Validation
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!isValidPassword(password)) {
            return res.status(400).json({ message: 'Password must be exactly 16 characters long and include uppercase, lowercase, number, and special character.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const newUser = await User.create({ name, email, password });
        res.status(201).json({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser.id),
            refreshToken: generateRefreshToken(newUser.id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed' });
    }
};

// User Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("🔍 [Backend] Checking password...");

        const isMatch = await bcrypt.compare(password, user.password); // ✅ Compare hashed password
        if (!isMatch) {
            console.log("❌ [Backend] Password does not match!");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("✅ [Backend] Password matched! Logging in...");

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
            isAdmin: user.isAdmin,
            refreshToken: generateRefreshToken(user.id),
        });

    } catch (error) {
        console.error("❌ [Backend] Login failed:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};
const logoutUser = async (req, res) => {
    try {
        const token = req.header("Authorization"); // ✅ Get Token from Header
        if (!token) return res.status(400).json({ message: "No token provided in headers" });

        // ✅ Ensure it's a Bearer token
        if (!token.startsWith("Bearer ")) {
            return res.status(400).json({ message: "Invalid token format" });
        }

        const actualToken = token.split(" ")[1]; // ✅ Extract token after "Bearer "

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
};

// Refresh Token
const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const newToken = generateToken(verified.id);
        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid Refresh Token' });
    }
};

// ✅ Request Password Reset (Send Reset Email via Brevo)
const requestPasswordReset = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.tokenExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // ✅ Email Configuration
        const mailOptions = {
            from: `"Student Feedback System" <${process.env.BREVO_SMTP_USER}>`,
            to: user.email,
            subject: "🔑 Password Reset Request",
            html: `
                <h3>Password Reset Request</h3>
                <p>Hello ${user.name},</p>
                <p>We received a request to reset your password. Click the link below to reset it:</p>
                <a href="http://localhost:3000/reset-password/${resetToken}" style="background: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Thanks,<br>Student Feedback System Team</p>
            `
        };

        // ✅ Send Email using Brevo SMTP
        await transporter.sendMail(mailOptions);
        console.log("✅ Password reset email sent!");

        res.json({ message: 'Password reset email sent successfully' });
 
    } catch (error) {
        console.error("❌ Error sending reset email:", error);
        res.status(500).json({ message: 'Error sending reset email' });
    }
};

// ✅ Reset Password with Validation
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        // ✅ Enforce new password rules
        if (!isValidPassword(newPassword)) {
            return res.status(400).json({ message: 'Password must be exactly 10 characters long and include uppercase, lowercase, number, and special character.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetToken = undefined;
        user.tokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });

    } catch (error) {
        console.error("❌ Error resetting password:", error);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

module.exports = { registerUser, loginUser, refreshToken, requestPasswordReset, resetPassword, logoutUser };
