document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.querySelector('a[href="log-out.html"]');

  if (logoutLink) {
    logoutLink.addEventListener("click", async () => {
      try {
        // clear JWT token from localStorage on logout
        localStorage.removeItem("token");

        // call the backend to destroy the session and the localStorage
        const response = await apiCall("/api/v1/logout", "POST");

        // Redirect to home page after logout
        window.location.href = "/index.html";
      } catch (error) {
        console.log("Error during logout:", error);
      }
    });
  } else {
    console.log("LoginLink not found");
  }
});
