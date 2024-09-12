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
    console.log("Connected to the MySQL database.");

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
        FOREIGN KEY (user_id) REFERENCES users(id)
)`;
    // check if the table already exist
    db.query("SHOW TABLES LIKE 'expenses'", (err, result) => {
        if (err) return console.log('Error checking for expense table:', err.message);
        (result.length > 0)
        console.log('Expenses table already exist.');
    });

    // Create impact_factors table
    const impactFactorsTable = `
      CREATE TABLE IF NOT EXISTS impact_factors(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category VARCHAR(255),
        description VARCHAR(255),
        carbon_emission_factor FLOAT,
        energy_consumption_factor FLOAT,
        water_usage_factor FLOAT,
        waste_generated_factor FLOAT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    
)`;
    db.query(impactFactorsTable, (err, result) => {
        if (err) return console.log('Impact factors table not created/checked:', err.message)
                    
        console.log('Impact factors table creater/checked')
    
    });
    
});





module.exports = db;