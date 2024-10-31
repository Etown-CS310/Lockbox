const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: '34.162.214.167:3306', // Your MySQL server host
    user: 'root', // Your MySQL username
    password: 'lockbox', // Your MySQL password
    database: 'Google Cloud Database' // Your MySQL database name
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return; // Exit if connection fails
    }
    console.log('MySQL Connected...');
});

// Example route to fetch users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM Users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Example route to add a user
app.post('/users', async (req, res) => {
    const { username, password_hash } = req.body;

    // Validate request
    if (!username || !password_hash) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Hash the password before storing (optional, depending on your approach)
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        
        db.query('INSERT INTO Users (username, password_hash) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error adding user:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ id: result.insertId, username });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

// Login route (assuming you want to add a login feature)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate request
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];

        // Compare hashed password
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', userId: user.id });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
