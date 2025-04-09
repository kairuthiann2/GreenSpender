// Login and Register form validation and logic
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  // Check if registerForm exists before adding event listener
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      console.log("Form submission prevented");

      // Retrieve values from the input fields
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      //console.log('Input Values:', { username, email, password });

      try {
        // Send a POST request to the server with the registration data
        console.log("Sending registration request to server...");
        const { status, data } = await apiCall("/api/v1/register", "POST", {
          username,
          email,
          password,
        });

        if (status === 201) {
          alert("Registartion successfull");
          // The redirect the user to the login page
          window.location.href = "./pages/login.html";

        } else if (status === 429) {
          alert("You have exceeded the maximum number of requests. Please try again later");

        } else {
          alert("Error registering. Please try again.");
        }
      } catch (error) {
        // Handle any errors that occur during the fetch request
        console.error("Error registering:", error.message);
        alert("Error registering. please try again");
      }

    });
    
  } else {
    console.error("Register form not found");
  }

  // Check if loginForm exists before adding event listener
  if (loginForm) {
    // User login form submission
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Retrieve values from input field
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      //console.log('Input Values:', { email, password });

      try {
        // Send a POST request to the server with the login data
        const { status, data } = await apiCall("/api/v1/login", "POST", {
          email,
          password,
        });

        // Handle login status
        if (status === 200) {
          // Log and save the received token
          const token = result.token;
          localStorage.setItem("token", token);

          // Decode the token to extract the user ID
          const decodeToken = jwt_decode(token);
          localStorage.setItem("user_id", decodeToken.id);

          // If login was successful notify the user
          console.log("Login was successful");
          alert("Login was successful");

          // Then redirect the user to get started
          window.location.href = "/pages/view_expense.html";
        } else if (status === 429) {
          alert("You have Exceeded the maximum numer of login attempts. Please try again later");

        } else if (status === 401) {
          alert("Invalid Email or password.");
          
        } else {
          alert("Error logging in. Try again later.");

        }

      } catch (error) {
        // Handle any error that occur during the fetch request
        console.error("Error login:", error);
        alert("Error Login. please try again later");
      }
    });

    // Display error if loginForm is not found
  } else {
    console.log("Login form not found");
  }
});
