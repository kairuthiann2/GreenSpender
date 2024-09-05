const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../userAuth/auth');

// Create an instance of express
const router = express.Router();

// Add Expense route
router.post('/add_expense', authenticateToken, (req, res) => {

    const { amount, date, category, description } = req.body;
    // Get user_id from JWT payload
    const user_id = req.user.id;

        // Insert the expense into the database
        const addExpense = 'INSERT INTO expenses (user_id, amount, date, category, description) VALUES (?, ?, ?, ?, ?)';
        const values = [user_id, amount, date, category, description];

        db.query(addExpense, values, (err, data) => {
            if (err) {
                console.error('Error adding expense:', err.message)
                return res.status(500).json('Internal server Error');
            }

            return res.status(200).json('Expense added successully');

            
        });
    
});

// View expense
router.get('/view_expense/:user_id', authenticateToken, (req, res) => {
    
        const { user_id } = req.params;

        // 
        const viewExpense = 'SELECT * FROM expenses WHERE user_id = ?';
        
        db.query(viewExpense, [user_id], (err, data) => {
            if (err) {
                console.error('Error viewing expenses:', err.message)
                return res.status(500).json('Internal server error');
            }

            
            return res.status(200).json(data);

            
        });
   
});

// Edit expense
router.put('/edit_expense/:id', authenticateToken, (req, res) => {
    
    const { id } = req.params;
    const { amount, date, category, description } = req.body

        // 
    const editExpense = `
       UPDATE expenses
       SET amount = ?, date = ?, category = ?, description = ?
       WHERE id = ?`;
    
    const values = [amount, date, category, description, id];
        
        db.query(editExpense, values, (err, data) => {
            if (err) {
                console.error('Error editing expenses:', err.message)
                return res.status(500).json('Internal server error');
            }

            
            return res.status(200).json('Expense updated successfully');

            
        });
   
});

// Fetch a single expense by ID
router.get('/edit_expense/:id', authenticateToken, (req, res) => {
    
    const { id } = req.params;

    const fetchExpenseQuery = 'SELECT * FROM expenses WHERE id = ?';
        
        db.query(fetchExpenseQuery, [id], (err, data) => {
            if (err) {
                console.error('Error fetching expenses:', err.message)
                return res.status(500).json('Internal server error');
            }
            
            return res.status(200).json(data[0]); // Return the first matching expense
           
        });
   
});




// Delete Expense
router.delete('/delete_expense/:id', authenticateToken, (req, res) => {
    
    const { id } = req.params;
    
    const deleteExpense = 'DELETE FROM expenses WHERE id = ?';
        
        db.query(deleteExpense, [id], (err, data) => {
            if (err) {
                console.error('Error deleting expenses:', err.message)
                return res.status(500).json('Internal server error');
            }

            
            return res.status(200).json('Expense deleted successfully');

            
        });
   
});

module.exports = router;