// users.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (email, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    await db.execute(query, [email, hashedPassword, role]);
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0]; // Returns the first user or undefined
};

module.exports = {
    createUser,
    findUserByEmail,
};
