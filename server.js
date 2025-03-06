const express = require('express');
const connectDB = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');


//routes
const authRoutes = require('./routes/authRoutes');


const corsOptions = {
    origin: ["http://localhost:3000", "https://yourfrontend.com"], // ✅ Allowed frontend URLs
    credentials: true,
};


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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));