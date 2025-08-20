const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');
const meetingRoutes = require('./routes/meetings');
const actionItemRoutes = require('./routes/actionItemRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api', userRoutes);
app.use('/api', meetingRoutes);
app.use('/api', actionItemRoutes);
app.use('/api', notificationRoutes);
app.use('/api', chatRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


