// Ensure the dom is fully loaded before running the script

// const { error } = require("console");

//const jwt_decode  = require('jwt-decode')
//import { jwt_decode } from 'jwt-decode';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");

   
    // Check if registerForm exists before adding event listener
    if (registerForm) {
        // User register form submission
        registerForm.addEventListener("submit", async (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();
        console.log('Form submission prevented');

        // Retrieve values from the input fields
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        console.log('Input Values:', { username, email, password });

        try {
            // Send a POST request to the server with the registration data
            console.log('Sending registration request to server...');
            const response = await fetch('http://localhost:4000/api/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },

                body: JSON.stringify({ username, email, password }),
            });

            // Parse the JSON response from the server
            const result = await response.json();

            if (response.ok) {
                // If registration is successful, notify the user
                console.log('Registration succesfull');
                alert('Registration successful');

                // The redirect the user to the login page
                window.location.href = './pages/login.html';

            } else {
                // If there is an error, display it to the user 
                console.error('Registration error:', result);
                alert(result);
            }

        } catch (error) {
            // Handle any errors that occur during the fetch request
            console.error('Error registering:', error);
            alert('Error registering. please try again');
        }
        });
       // display error if registerForm is not found 
    } else {
        console.error("Register form not found");

    }
    



    // Check if loginForm exists before adding event listener
    if (loginForm) {
        // User login form submission
         loginForm.addEventListener('submit', async (e) => {
             e.preventDefault();
             

        // Retrieve values from input field
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        console.log('Input Values:', { email, password });

        try {

            // Send a POST request to the server with the login data           
            const response = await fetch('http://localhost:4000/api/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({ email, password }),
            });

            // Parse the JSON response from the server 
            const result = await response.json();

            if (response.ok) {
                // If login was successful notify the user
                console.log('Login was successful');
                alert('Login was successful');

                // Log the received token
                const token = result.token;
                //console.log('Received token:', token);

                // Save the token in localstorage
                localStorage.setItem('token', token);
                //console.log('Token saved in localstorage');

                // Decode the token to extract the user ID
                const decodeToken = jwt_decode(token);
                //console.log('Decoded token:', decodeToken);

                // Save the user ID in localStorage
                localStorage.setItem('user_id', decodeToken.id);
                //console.log('user ID saved in localStorage:', decodeToken.id);

                // Then redirect the user to get started
                
                window.location.href = '/pages/view_expense.html';
                //console.log('Current location:', window.location.href);
                //console.log('Redirecting to: /pages/view_expense.html');

            } else {
                // If there is an error display to the user 
                console.error("Login failed:", result);
                alert(result);
            }
            
        } catch (error) {
            // Handle any error that occur during the fetch request 
            console.error("Error login:", error);
            alert('Error Login. please try again later');
        }


    });

        // Display error if loginForm is not found 
    } else {
        console.log("Login form not found")

    }

});