 //import { apiCall } from "./apiCalls";

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
        //console.log('Input Values:', { username, email, password });

        try {
            // Send a POST request to the server with the registration data
            console.log('Sending registration request to server...');
            const response = await apiCall('/api/register', 'POST', { username, email, password });


            // If registration is successful, notify the user
            console.log('Registration succesfull', response);
            alert('Registration successful');

            // The redirect the user to the login page
            window.location.href = './pages/login.html';

        } catch (error) {
            // Handle any errors that occur during the fetch request
            console.error('Error registering:', error.message);
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
        //console.log('Input Values:', { email, password });

        try {

            // Send a POST request to the server with the login data           
            const result = await apiCall('/api/login', 'POST', { email, password });
                
           
            // If login was successful notify the user
            console.log('Login was successful');
            alert('Login was successful');

            // Log and save the received token
            const token = result.token;
            localStorage.setItem('token', token);

            // Decode the token to extract the user ID
            const decodeToken = jwt_decode(token);
            localStorage.setItem('user_id', decodeToken.id);

            // Then redirect the user to get started
            window.location.href = '/pages/view_expense.html';
          
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