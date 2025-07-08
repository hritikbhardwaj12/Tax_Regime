document.addEventListener("DOMContentLoaded", () => {
  // --- Section Navigation ---
  const loginSection = document.getElementById("login");
  const signupSection = document.getElementById("signup");
  const forgotPasswordSection = document.getElementById("forgot-password");

  document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function(event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      [loginSection, signupSection, forgotPasswordSection].forEach(section => {
        section.classList.add("hidden");
      });

      target.classList.remove("hidden");
    });
  });

  // --- LOGIN FORM ---
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userId = document.getElementById("userId").value;
    const password = document.getElementById("password").value;

    if (!userId || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ userId, password })
      });

      const data = await response.json();

      if (response.ok) {
  alert("✅ Login successful!");
  localStorage.setItem("loggedInUser", JSON.stringify(data.user)); // save user
  window.location.href = "Home.html"; // go to dashboard
}
 else {
        alert(data.message || "❌ Login failed.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("❌ An error occurred during login.");
    }
  });

  // --- SIGNUP FORM ---
  const signupForm = document.getElementById("signupForm");
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const signupUserId = document.getElementById("signupUserId").value;
    const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const contactNo = document.getElementById("contactNo").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword || password.length < 6) {
      alert("❌ Passwords do not match or are less than 6 characters.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ signupUserId, userName, email, contactNo, signupPassword: password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Signup successful!");
        window.location.href = "Home.html"; // Redirect after signup
      } else {
        alert(data.message || "❌ Signup failed.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      alert("❌ An error occurred during signup.");
    }
  });

  // --- FORGOT PASSWORD FORM ---
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("fpEmail").value;
    const contactNo = document.getElementById("fpContactNo").value;

    if (!email && !contactNo) {
      alert("❌ Please provide either email or contact number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/password/request-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, contactNo })
      });

      const data = await response.json();

      if (response.ok) {
        alert("📧 Reset link sent (simulated).");
      } else {
        alert(data.message || "❌ Could not find user.");
      }
    } catch (err) {
      console.error("Reset Error:", err);
      alert("❌ An error occurred during password reset.");
    }
  });
});

// In your login success handler, modify to:
if (response.ok) {
  alert("✅ Login successful!");
  localStorage.setItem("loggedInUser", JSON.stringify(data.user));
  window.location.href = "Home.html";
}
