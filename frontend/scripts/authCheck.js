document.addEventListener('DOMContentLoaded', () => {
    const jwtToken = localStorage.getItem('token');
    const getStartedButton = document.querySelector('.bt a');
    const loginLink = document.querySelector('.nav-links a[href="login.html"]');
    const registerLink = document.querySelector('.nav-links a[href="register.html]');

    // check if JWT token exist
    if (!jwtToken) {
        getStartedButton.href = 'register.html'; // Redirect to register form

    } else {
        // If the token exist 
        getStartedButton.href = 'view_expense.html'; // Redirect to view expense dashboard page
    };

    // Hide login and register for logged in users
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
});