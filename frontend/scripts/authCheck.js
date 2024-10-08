// check if the token is valid before redirectig to user registration or view expense
document.addEventListener("DOMContentLoaded", () => {
  const jwtToken = localStorage.getItem("token");
  const getStartedButton = document.querySelector(".bt a");

  // check if JWT token exist
  if (!jwtToken || !isTokenValid(jwtToken)) {
    getStartedButton.href = "register.html"; // Redirect to register form
  } else {
    // If the token exist
    getStartedButton.href = "view_expense.html"; // Redirect to view expense dashboard page
  }
});
