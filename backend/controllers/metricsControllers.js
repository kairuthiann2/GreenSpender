const db = require('../db');

// Check if a category exists in the impact_factors table
const checkImpactFactorsExists = async (category, description, date) => {
    const checkImpactFactors = `SELECT * FROM impact_factors WHERE category description date = ????`;
    const [rows] = await db.promise().query(checkImpactFactors, [category, description, date]);
    return rows.length > 0;
};

// Insert new impact factor
const insertImpactFactor = async (userId, category, description, date) => {
    const insertFactor = `
      INSERT INTO impact_factors
      (user_id, category, description, date, carbon_emission_factor, energy_consumption_factor, water_usage_factor, waste_generated_factor)
      VALUES (?, ?, ?, ?, 0, 0, 0, 0)
      ON DUPLICATE KEY UPDATE
      carbon_emission_factor = VALUES(carbon_emission_factor),
      energy_consumption_factor = VALUES(energy_consumption_factor),
      water_usage_factor = VALUES(water_usage_factor),
      waste_generated_factor = VALUES(waste_generated_factor),
   
    `
    await db.promise().query(insertFactor, [userId, category, description, date]);
    console.log('Impact factor inserted/updated successfully');
};

// Detect new expenses and update the impact factors table
const detectAndUpdateImpactFactors = async (userId) => {
    try {
        // Fetch user expenses
        const [expenses] = await db.promise().query('SELECT category, description, date FROM expenses WHERE user_id = ?', [userId]);
        for (const expense of expenses) {
            const { category, description, date } = expense;

            // check if the impact factor for this category and description exists
            const exists = await checkImpactFactorsExists(category, description, date);

            if (!exists) {
                // If it doesnt exist, insert new impact factor
                await insertImpactFactor(userId, category, description, date);

            } else {
                console.log('Impact factor already exists, skipping insertion. ');
            }
        }
      
    } catch (error) {
        console.log('error detecting or updating impact factors:', error);
    }
};

module.exports = { detectAndUpdateImpactFactors };
