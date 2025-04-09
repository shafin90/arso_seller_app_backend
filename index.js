const express = require('express');
const mongoose = require('mongoose');
const supervisor = require('./routes/supervisor');
// const orderController = require('./controllers/orderController');
require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/arso_deliveryman';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Arso Deliveryman Backend!');
});

// Import Controllers

// User Routes
app.use('/supervisor', supervisor);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});