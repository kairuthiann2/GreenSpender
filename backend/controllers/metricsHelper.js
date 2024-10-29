//Helper function that maps categories and descriptions to their relevant impact factors
const predefinedImpactFactors = {
  Bills: {
    internet: ["energy_consumption_factor"],
    water: ["water_usage_factor"],
    electricity: ["energy_consumption_factor"],
  },

  Transportation: {
    trip: ["energy_consumption_factor", "carbon_emission_factor"],
    Fuel: ["energy_consumption_factor", "carbon_emission_factor"],
  },

  Food: {
    takeaways: ["waste_generated_factor"],
    foodDelivery: ["waste_generated_factor"],
  },

  Groceries: {
    Fruits: ["waste_generated_factor"],
    vegetables: ["waste_generated_factor"],
  },

  PersonalCare: {
    beauty: ["energy_consumption_factor"],
    personalcCareProducts: ["waste_generated_factor"],
  },
};

const getRelevantImpactFactors = (category, description) => {
  if (
    predefinedImpactFactors[category] &&
    predefinedImpactFactors[category][description]
  ) {
    return predefinedImpactFactors[category][description];
  }
  return [];
};

module.exports = { getRelevantImpactFactors };
