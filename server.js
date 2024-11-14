const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('./loginInfo.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database connected');
        // Create tables if they don't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password_hash TEXT
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS StoredCredentials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                website TEXT,
                username TEXT,
                encrypted_password TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(id)
            )
        `);
    }
});

// Serve login page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve dashboard after login
app.get('/dashboard/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'dashboard.html'));
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
            res.json({ 
                message: 'Login successful', 
                userId: user.id,
                redirect: `/dashboard/${user.id}`
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        db.run('INSERT INTO Users (username, password_hash) VALUES (?, ?)', [username, passwordHash], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                console.error('Error inserting user:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ id: this.lastID, username });
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Store new credentials
app.post('/store-credentials', async (req, res) => {
    const { userId, website, username, password } = req.body;
    
    if (!userId || !website || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO StoredCredentials (user_id, website, username, encrypted_password) VALUES (?, ?, ?, ?)',
            [userId, website, username, encryptedPassword],
            function(err) {
                if (err) {
                    console.error('Error storing credentials:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json({ id: this.lastID, message: 'Credentials stored successfully' });
            }
        );
    } catch (err) {
        console.error('Error encrypting password:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Get all stored credentials for a user
app.get('/credentials/:userId', (req, res) => {
    const userId = req.params.userId;
    
    db.all(
        'SELECT id, website, username, created_at FROM StoredCredentials WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('Error fetching credentials:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(rows);
        }
    );
});

// Get recent credentials (last 5) for a user
app.get('/recent-credentials/:userId', (req, res) => {
    const userId = req.params.userId;
    
    db.all(
        'SELECT id, website, username, created_at FROM StoredCredentials WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('Error fetching recent credentials:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(rows);
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
