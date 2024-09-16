const db = require('../db');
const { detectAndUpdateImpactFactors } = require('./metricsControllers'); 

// Fetching data from the database.
const getExpensesForUser = async (userId) => {
    try {
        // Detect and update impact factors before data fetching
        await detectAndUpdateImpactFactors(userId);

        console.log(`Fetching expenses for use ID: ${userId}`)
        const [rows] = await db.promise().query('SELECT category, description, amount, date FROM expenses where user_id = ?', [userId])
        console.log(`Expenses fetched: `, rows);
        return rows;
    } catch (error) {
        console.log('Error fetching expenses:', error);
        throw error;
    }
};

// Fetching impact factors for user
const getImpactFactorsForUser = async (userId) => {
    try {
        console.log(`Fetching impact factors for user ID: ${userId}`)
        const [rows] = await db.promise().query('SELECT FROM impact_factors WHERE  user_id = ?', [userId])
        console.log(`Impact factors fetched: `, rows);
        return rows;
    } catch (error) {
        console.log('Error fetching impact factors:', error);
        throw error;
    }
}


module.exports = { getExpensesForUser, getImpactFactorsForUser };