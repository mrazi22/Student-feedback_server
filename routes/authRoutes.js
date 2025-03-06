const express = require('express');
const { registerUser, loginUser, requestPasswordReset, resetPassword, logoutUser } = require('../controllers/authControllers');
const { refreshToken } = require('../controllers/authControllers');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshToken); 
router.post('/forgot-password', requestPasswordReset); // ✅ Request Password Reset
router.post('/reset-password', resetPassword); // ✅ Reset Password


module.exports = router;