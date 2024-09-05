const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');



// Create an instance of express
const router = express.Router();

// User register Route 
router.post('/', async (req, res) => {
    try {
        const users = 'SELECT * FROM users WHERE email = ?;';
        // check if the user already exists
        db.query(users, [req.body.email], (err, data) => {
            if (err) return res.json(err);
            if (data.length > 0) return res.status(409).json('User already exists');

        });

        // Hashed password 
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hashSync(req.body.password, salt)


        // Create new user
        const newUser = 'INSERT INTO users (`email`, `username`, `password`) VALUES (?)';
        const values = [req.body.email, req.body.username, hashedPassword];

        db.query(newUser, [values], (err, data) => {
            console.log('Error Inserting new User:', err);
            if (err) return res.json(err);

            // Create session after successful registration
            req.session.userId = data.insertId;

            return res.status(200).json('User created successfully')


        });
        
    } catch (error) {
        console.log('Catch block error:', err);
        res.status(500).json('Internal server Error')
    }
});

module.exports = router;