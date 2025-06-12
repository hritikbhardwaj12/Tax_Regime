/**document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");

  const loginSection = document.getElementById("login");
  const signupSection = document.getElementById("signup");
  const forgotPasswordSection = document.getElementById("forgot-password");

  // Properly switching sections
  document.querySelectorAll("a[href^='#']").forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    if (loginSection) loginSection.classList.add("hidden");
    if (signupSection) signupSection.classList.add("hidden");
    if (forgotPasswordSection) forgotPasswordSection.classList.add("hidden");

    const targetId = this.getAttribute("href")?.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) targetElement.classList.remove("hidden");
  });
});

  // ========== LOGIN ==========
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const userId = document.getElementById("userId").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, password })
        });

        const data = await response.json();
        if (response.ok) {
          alert(Login successful. Welcome ${data.userName});
          loginForm.reset();
        } else {
          alert(data.message || "Login failed.");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Login failed due to a server error.");
      }
    });
  }

  // ========== SIGNUP ==========
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const signupUserId = document.getElementById("signupUserId").value;
      const userName = document.getElementById("userName").value;
      const email = document.getElementById("email").value;
      const contactNo = document.getElementById("contactNo").value;
      const signupPassword = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (signupPassword !== confirmPassword || signupPassword.length < 6) {
        alert("Passwords do not match or are too short.");
        return;
      }

      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signupUserId, userName, email, contactNo, signupPassword })
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          signupForm.reset();
        } else {
          alert(data.message || "Signup failed.");
        }
      } catch (err) {
        console.error("Signup error:", err);
        alert("Signup failed due to a server error.");
      }
    });
  }

  // ========== FORGOT PASSWORD ==========
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const fpEmail = document.getElementById("fpEmail").value;
      const fpContactNo = document.getElementById("fpContactNo").value;

      if (!fpEmail && !fpContactNo) {
        alert("Please enter either Email or Contact Number.");
        return;
      }

      try {
        const response = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fpEmail, fpContactNo })
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          forgotPasswordForm.reset();
        } else {
          alert(data.message || "No matching user found.");
        }
      } catch (err) {
        console.error("Forgot password error:", err);
        alert("Could not process forgot password request.");
      }
    });
  }
});*/
document.addEventListener("DOMContentLoaded", () => {
  // ... existing navigation code ...

  // ========== LOGIN ==========
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const userId = document.getElementById("userId").value;
      const password = document.getElementById("password").value;
      const keepLoggedIn = document.getElementById("keepLoggedIn").checked;

      try {
        const response = await fetch("http://localhost:3001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, password }),
          credentials: "include" // Important for cookies
        });

        const data = await response.json();
        if (response.ok) {
          // Store user info in localStorage
          localStorage.setItem("loggedInUser", JSON.stringify(data));
          // Redirect to record details page
          window.location.href = "Rec-details.html";
        } else {
          alert(data.error || "Login failed.");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Login failed due to a server error.");
      }
    });
  }

  // ========== SIGNUP ==========
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const signupUserId = document.getElementById("signupUserId").value;
      const userName = document.getElementById("userName").value;
      const email = document.getElementById("email").value;
      const contactNo = document.getElementById("contactNo").value;
      const signupPassword = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (signupPassword !== confirmPassword || signupPassword.length < 6) {
        alert("Passwords do not match or are too short.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            signupUserId, 
            userName, 
            email, 
            contactNo, 
            signupPassword 
          })
        });

        const data = await response.json();
        if (response.ok) {
          alert("Account created successfully! Please log in.");
          signupForm.reset();
          // Show login form
          document.getElementById("signup").classList.add("hidden");
          document.getElementById("login").classList.remove("hidden");
        } else {
          alert(data.error || "Signup failed.");
        }
      } catch (err) {
        console.error("Signup error:", err);
        alert("Signup failed due to a server error.");
      }
    });
  }

  // ========== FORGOT PASSWORD ==========
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const fpEmail = document.getElementById("fpEmail").value;
      const fpContactNo = document.getElementById("fpContactNo").value;

      if (!fpEmail && !fpContactNo) {
        alert("Please enter either Email or Contact Number.");
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/password/request-reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fpEmail, fpContactNo })
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          forgotPasswordForm.reset();
        } else {
          alert(data.error || "No matching user found.");
        }
      } catch (err) {
        console.error("Forgot password error:", err);
        alert("Could not process forgot password request.");
      }
    });
  }
});