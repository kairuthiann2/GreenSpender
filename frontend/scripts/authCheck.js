// check if the token is valid on Get started button before redirectig to user registration or view expense
document.addEventListener("DOMContentLoaded", () => {
  const jwtToken = localStorage.getItem("token");
  const getStartedButton = document.querySelector(".bt a");

  // Token validation check before getting started
  if (jwtToken && isTokenValid(jwtToken)) {
    getStartedButton.href = "view_expense.html"; // Redirect to view expenses
  } else {
    // If the token does not exist
    getStartedButton.href = "register.html"; // Redirect to register form
  }

  // token expiration after login
  if (!jwtToken || !isTokenValid(jwtToken)) {
    alert("You are not logged in. Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "/login.html";
  }
});
