const { detectAndUpdateImpactFactors } = require('./metricsControllers'); 
const { getExpensesForUser, getImpactFactorsForUser } = require('./metricsService'); //imported  getExpensesForUser function
const { getRelevantImpactFactors } = require('./metricsHelper'); // imported the helper

// Calculate impact metrics for a user 
const calculateImpactMetrics = async (userId) => {
    try {
        // Ensure impact factors are up to date
        await detectAndUpdateImpactFactors(userId);

        // Fetch user expenses from the database
        const expenses = await getExpensesForUser(userId) || [];
        const impactFactors = await getImpactFactorsForUser(userId) || [];

        // console.log('Fetched expenses:', expenses);
        // console.log('Fetching impact factors:', impactFactors);

        // Initialize metrics
        let totalSpent = 0;
        let carbonEmissions = 0;
        let wasteGenerated = 0;
        let waterUsage = 0;
        let energyConsumption = 0;

    // Calculate metrics using impact factors
        expenses.forEach((expense) => {
            totalSpent += expense.amount;

            // find corresponding impact factor for each expense
            const correspondingFactor = impactFactors.find(
                (f) => f.category === expense.category && f.description === expense.description
            );
            // log if corresponding factor is found
            console.log(`Expense: ${expense.category}, ${expense.description}, ${expense.date}`);
            if (correspondingFactor) {

                console.log('Corresponding factor found:', correspondingFactor);

                // Fetch relevant impact factors based on category and description
                const relevantFactors = getRelevantImpactFactors(expense.category, expense.description);

                // Only calculate the factors that are relevant
                if (relevantFactors.includes('carbon_emission_factor')) {
                    carbonEmissions += expense.amount * (correspondingFactor.carbon_emission_factor || 0);
                }
                if (relevantFactors.includes('waste_generated_factor')) {
                    wasteGenerated += expense.amount * (correspondingFactor.waste_generated_factor || 0);
                }
                if (relevantFactors.includes('water_usage_factor')) {
                    waterUsage += expense.amount * (correspondingFactor.water_usage_factor || 0);
                }
                if (relevantFactors.includes('energy_consumption_factor')) {
                    energyConsumption += expense.amount * (correspondingFactor.energy_consumption_factor || 0);
                }
           
            } else {
                console.log('No corresponding factor found for this expense')
            }        
        });

        console.log('Total Spent:', totalSpent);
        console.log('Carbon Emissions:', carbonEmissions);
        console.log('Waste Generated:', wasteGenerated);
        console.log('Water Usage:', waterUsage);
        console.log('Energy Consumption:', energyConsumption);

    return {
        totalSpent,
        carbonEmissions,
        wasteGenerated,
        waterUsage,
        energyConsumption
    };

    } catch (error) {
        console.error('Error calculating impact metrics:', error);
    }
    
};
module.exports = { calculateImpactMetrics };
// modified the metricsCalculation to incoporate the impact metrics helper function 'getRelevantImpactFactors' The logic now determines which impact factors are relevant for each expense then calculates the corresponding environmental impact metrics only for those factors.