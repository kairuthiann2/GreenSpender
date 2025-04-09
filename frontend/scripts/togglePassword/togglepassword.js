document.addEventListener("DOMContentLoaded", () => {
    const passwordField = document.getElementById("password");
    const toggleButton = document.getElementById("togglePassword");

    // This function shows or hides the pasword
    function togglePassword() {  
        
         // If the password is hidden, show it
    if (passwordField.type === "password") {
        passwordField.type = "text"; // Make the password visible
        toggleButton.textContent = "🙈"; // Change button icon to a "hide" icon

    } else {
        // If Password is visible, hide it
        passwordField.type = "password"; // Hide the password
        toggleButton.textContent = "👁️"; // Change button icon to "show" icon
        }
        
    }
    // Attach the togglePassword function to the button's click event
    toggleButton.addEventListener("click", togglePassword);
})