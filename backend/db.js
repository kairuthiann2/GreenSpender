// Setting up the database connection
require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// check if the connection works
db.connect((err) => {
    if (err) return console.log("Error connecting to the database");
    console.log(`Connected to the MySQL database. ${process.env.DB_DATABASE}`);

    // Create users table 
    const usersTable = `
   CREATE TABLE IF NOT EXISTS users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(100) NOT NULL UNIQUE,
     username VARCHAR(50) NOT NULL,
     password VARCHAR(255) NOT NULL
   )`;
    
    db.query(usersTable, (err, result) => {
        if (err) return console.log('Users table not created/checked:', err.message)
                    
        console.log('Users table creater/checked')
    
    });

    // cretate expenses Table
    const expensesTable = `
      CREATE TABLE IF NOT EXISTS expenses(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        category VARCHAR(100),
        description VARCHAR(100),
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE KEY unique_expense (date, category, description)
)`;
    
  // Create the new expenses table
   db.query(expensesTable, (err) => {
     if (err) return console.log('Error creating expenses table');
     console.log('Expenses table Created/checked')

     // check if the Reference index exists
     const checkRefIndex = `
       SELECT COUNT(1) AS indexExists
       FROM information_schema.statistics
       WHERE table_schema = '${process.env.DB_DATABASE}'
       AND table_name = 'expenses'
       AND index_name = 'idx_expenses'
     `;

     db.query(checkRefIndex, (err, result) => {
       if (err) return console.log('Error checking for index on expenses table:', err.message);

       // If the index does not exist, add it
       if (result[0].indexExists === 0) {
         const expensesTableRefIndex = `
           ALTER TABLE expenses
           ADD INDEX idx_expenses ( category, description, date )
         `;

         db.query(expensesTableRefIndex, (err) => {
           if (err) return console.log('Error Adding index to expenses table:', err.message);
           console.log('Index added/checked successfully on expenses table.');

         });

       } else {
         console.log('Index already exists on expenses table.')
       }
     });
   });
  
    // Create impact_factors table
    const impactFactorsTable = `
      CREATE TABLE IF NOT EXISTS impact_factors(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category VARCHAR(100),
        description VARCHAR(100),
        date DATE NOT NULL,
        carbon_emission_factor FLOAT,
        energy_consumption_factor FLOAT,
        water_usage_factor FLOAT,
        waste_generated_factor FLOAT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (category, description, date) REFERENCES expenses(category, description, date)
    
)`;
  
   // Create the impact factors table
    db.query(impactFactorsTable, (err, result) => {
        if (err) return console.log('Impact factors table not created/checked:', err.message)
                    
      console.log('Impact factors table creater/checked');

         
    });
    
});





module.exports = db;