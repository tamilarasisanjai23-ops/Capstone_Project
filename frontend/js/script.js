// ======================================
// Volunteer Disaster Relief System
// Frontend JavaScript
// ======================================

// LOGIN
function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
        alert("Please enter email and password.");
        return;
    }

    // Admin login
    if (email === "admin@gmail.com" && password === "admin123") {
        alert("Admin Login Successful!");
        window.location.href = "admin-dashboard.html";
        return;
    }

    // Volunteer login
    alert("Login Successful!");
    window.location.href = "volunteer-dashboard.html";
}


// REGISTER
function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    if (name === "" || email === "" || phone === "" || password === "") {
        alert("Please fill all required fields.");
        return;
    }

    alert("Volunteer registration successful!");

    window.location.href = "login.html";
}


// ACCEPT TASK
function acceptTask(taskName) {
    alert("Task accepted: " + taskName);
}


// UPDATE TASK
function updateTask(taskName) {
    alert("Task status update selected.\n\nTask: " + taskName);
}


// LOGOUT
function logoutUser() {
    alert("You have been logged out.");
    window.location.href = "login.html";
}