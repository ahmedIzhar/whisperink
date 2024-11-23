const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());

// CORS Setup
app.use(cors({ origin: '*' }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Razorpay instance
const razorpay = new Razorpay({
    key_id: 'rzp_live_i3ZxPZvkJubDIv', // Replace with your actual Razorpay Key ID
    key_secret: 'FdIGZa91GzX7tLDEuwocFYeX' // Replace with your actual Razorpay Key Secret
});

// Endpoint to create an order
app.post('/api/create-order', async (req, res) => {
    try {
        if (!req.body.amount || isNaN(req.body.amount)) {
            return res.status(400).json({ message: 'Invalid amount provided.' });
        }

        const amountInPaise = req.body.amount;
        const options = {
            amount: amountInPaise, // Amount in paise
            currency: 'INR',
            receipt: 'receipt#1'
        };

        const order = await razorpay.orders.create(options);
        res.json({ orderId: order.id });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'There was an error creating your order. Please try again.' });
    }
});

// Health check route
app.get('/health', (req, res) => {
    res.send('Server is up and running!');
});

// Serve the index.html file at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback route for any other paths (SPA routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
