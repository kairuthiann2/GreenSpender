const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiration = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();

    // Check if the token is expired
    return expiration > now;
  } catch (error) {
    console.error("Invalid token", error);
    return false;
  }
};
