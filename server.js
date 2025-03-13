const express = require('express');
const connectDB = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');


//routes
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const syncRoutes = require('./routes/syncRoutes');
const adminRoutes = require('./routes/adminRoutes');


const corsOptions = {
    origin: ["http://localhost:3000", "https://yourfrontend.com"], // ✅ Allowed frontend URLs
    credentials: true,
};
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: "Too many login attempts. Try again later."
});


//load environment variables
dotenv.config()

//connect to database
connectDB();

//create express app
const app = express();

// Middleware
app.use(express.json());  // Body parser for JSON requests
app.use(cors());          // Enable CORS for frontend


// Define routes
app.get('/', (req, res) => {
    res.send('Student Feedback API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes); 
app.use('/api/profile', userProfileRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/auth/login', loginLimiter);
app.use(cors(corsOptions));
app.use(helmet());

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));