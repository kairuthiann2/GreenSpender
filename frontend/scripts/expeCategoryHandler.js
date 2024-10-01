document.addEventListener('DOMContentLoaded', () => {
    const expenseCategory = document.getElementById("expense-category");
    const expenseDescription = document.getElementById("description");

    // check if expenseCatogory or expenseDescription is null
    if (!expenseCategory) {
        console.log("Error: 'expense-category' element not found");
    }

    if (!expenseDescription) {
        console.log("Error: 'description' element not found");
    }

    // Object containing description for each category
    const descriptionOptions = {
        'Bills': ['Internet', 'Water', 'Electricity'],
        'Transportation': ['Public', 'Transport', 'Fuel'],
        'Food': ['Takeaways', 'Food Delivery'],
        'Groceries': ['Fruits', 'Vegetables'],
        'personalCare': ['Beauty', 'Personal Care Products']
    };

    // Function to update the expense description dropdown
    const updateDescriptionOptions = (category) => {
        console.log(`slected category: ${category}`);
        try {
            // Clear the existing options
            expenseDescription.innerHTML = '<option value="" disabled selected>Select Expense Description</option>';


            // Gete the list of descriptions based on selected category
            const descriptions = descriptionOptions[category] || [];

            console.log(`Description for category: ${descriptions}`);

            if (descriptions.length === 0) {
                console.warn(`Warning: no descriptions available for category: ${category}`);


            }
            // Populate the description dropdown
            descriptions.forEach(description => {
                const option = document.createElement('option');

                if (!option) {
                    throw new Error("Failed to create <option> element");

                }

                option.value = description.toLowerCase().replace(/ /g, '-');
                option.textContent = description;
                
                expenseDescription.appendChild(option);

                console.log(`Added option: ${option}`);
            })

        } catch (error) {
            console.error("Error occured while updating descriptions:", error.message);
        };

    };

    // Listen for changes in the expense category dropdown
    expenseCategory.addEventListener('change', (e) => {
        try {
            const selectedCategory = e.target.value;
            console.log(`Category changed: ${selectedCategory}`);
             
            if (!selectedCategory) {
                throw new Error("No category selected");
            }

            updateDescriptionOptions(selectedCategory);

        } catch (error) {
            console.error("Error category selection or update:", error.message);
        }
         
        
    });

});