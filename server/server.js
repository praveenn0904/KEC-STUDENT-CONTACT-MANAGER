// index.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors=require('cors');
const { createUser, findUserByEmail } = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./config/db');
app.use(bodyParser.json());

app.use(cors());
const SECRET_KEY = '59da8b5a297665cf5fcde2a76e7f58b1e28891ceef61f7c5671516513d2f4d03fc240ba45b9705a354e00b3994ddc1e6e7929056210648321642621440dd79cbd3c0927ad5056fc1bc5102986b4b0f029530221169fe44ee53a9acbee22386ed221b2c0e5d5ca8d3aa7e6812d50c9ef4c8bc099601de860c28a02183355fed3cd8005cb4398a2a255662831f9712bcaff32c72ff270240ef4abe2fdd6e2f9b4d469c9f1b454e836f94123ad680e58b146aa0a82361aeb513a50520e9f86e10dcc455193af0e3c858d0a81ba727a2cb86a11bdc272bfbb6d44f2cb6a79204452f7105ff2169c5595cdafdfc0ff75c4b1407680fa8ff33ae81b61035b1ebd9344b'; // Change this to a strong secret key

// Register route
app.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password and role are required.' });
    }
    if (role !== 'admin' && role !== 'student') {
        return res.status(400).json({ message: 'Role must be either admin or student.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    await createUser(email, password, role);
    res.status(201).json({ message: 'User registered successfully.' });
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});


// Create a new student
app.post('/students', async (req, res) => {
    const { name, rollno, department, section, yearofStudy, phonenumber, mailid, linedin, leetcode, github } = req.body;
    console.log(name, rollno, department, section, yearofStudy, phonenumber, mailid, linedin, leetcode, github);
    
    const query = 'INSERT INTO students (name, rollno, department, section, yearofStudy, phonenumber, mailid, linedin, leetcode, github) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    try {
        const [result] = await db.execute(query, [name, rollno, department, section, yearofStudy, phonenumber, mailid, linedin, leetcode, github]);
        res.status(201).json({ id: result.insertId, message: 'Student created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read all students
app.get('/students', async (req, res) => {
    const query = 'SELECT * FROM students';

    try {
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read a single student by ID
app.get('/students/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM students WHERE id = ?';

    try {
        const [rows] = await db.execute(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(rows[0]); // Return the first student
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, rollno, department, section, yearofStudy, phonenumber, mailid, linedin, leetcode, github } = req.body;

    const query = 'UPDATE students SET name = ?, rollno = ?, department = ?, section = ?, yearofStudy = ?, phonenumber = ?, mailid = ?, linedin = ?, leetcode = ?, github = ? WHERE id = ?';
    
    try {
        const [result] = await db.execute(query, [name, rollno, department, section, yearofStudy, phonenumber, mailid, linedin, leetcode, github, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM students WHERE id = ?';

    try {
        const [result] = await db.execute(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
