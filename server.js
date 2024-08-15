const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Import the User model
const jwtUtils = require('./jwtUtils');

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Orders', {
  autoIndex: true // Optional, based on your use case
});

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Endpoint to handle account creation
app.post('/create-account', async (req, res) => {
    try {
        console.log('Account creation request received:', req.body); // Debugging line
        const { email, password, firstName, lastName, phoneNumber, gender } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Account already exists for email:', email); // Debugging line
            return res.status(400).json({ message: 'Account already exists!' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed for email:', email); // Debugging line

        // Create a new user
        const newUser = new User({ email, password: hashedPassword, firstName, lastName, phoneNumber, gender });
        await newUser.save();

        console.log('New user created:', newUser); // Debugging line
        res.status(200).json({ message: 'Account created successfully!' });
    } catch (err) {
        console.error('Error creating account:', err); // Debugging line
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to handle login
app.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body); // Debugging line
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email); // Debugging line
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password matches
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log('Password mismatch for email:', email); // Debugging line
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log('Login successful for email:', email); // Debugging line
        res.status(200).json({ message: 'Login successful!' });
    } catch (err) {
        console.error('Error during login:', err); // Debugging line
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/create-account', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'Create.html');
    console.log('Serving Create.html from:', filePath); // Debugging line
    res.sendFile(filePath);
});

app.get('/login', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'login.html');
    console.log('Serving login.html from:', filePath); // Debugging line
    res.sendFile(filePath);
});

app.get('/food', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'food.html');
    console.log('Serving food.html from:', filePath); // Debugging line
    res.sendFile(filePath);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
