const db = require('../db');

const getExpensesForUser = (userId) => {
    try {
        const [rows] = db.query('SELECT * FROM expenses where user_id = ?', [userId])
        return rows;
    } catch (error) {
        console.log('Error fetching expenses:', error)
    }
};

const calculateImpactMetrics = async (userId) => {
    try {
        // Fetch user expenses from the database
    const expenses = await getExpensesForUser(userId) || [];

    // Calculate metrics 
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const carbonEmissions = totalSpent * 0.5;
    const wasteGenerated = totalSpent * 0.3;
    const waterUsage = totalSpent * 2;
    const energyConsumption = totalSpent * 1.5;

    return {
        totalSpent,
        carbonEmissions,
        wasteGenerated,
        waterUsage,
        energyConsumption
    };

    } catch (error) {
       console.log('Error calculating impact metrics:', error)
    }
    
};
module.exports = { calculateImpactMetrics };