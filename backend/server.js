require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const db = require('./db');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');
const expenseRoute = require('./routes/expenseRoute');
const metricsRoute = require('./routes/metricsRoute');

// Create an instance of express
const app = express();

// Health check route
/*app.get('/health', (req, res) => {
    res.status(200).send('OK');
})*/

// Middlewares
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Serve static files form th public directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to handle the root path
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../frontend/pages/index.html');
    console.log(`Serving file: ${filePath}`);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while serving the root page ');
        }
    })
})

// Define a dynamic route for serving the HTML files
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const pageWithoutExtension = page.split('.').slice(0, -1).join('.');

    const filePath = path.join(__dirname, `../frontend/pages/${pageWithoutExtension}.html`);
    console.log(`Attempting to serve the file: ${filePath}`);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('Page not found');
        }
    });
});


// Use the route
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/expenses', expenseRoute);
app.use('api/impact-metrics', metricsRoute);

// Start server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
