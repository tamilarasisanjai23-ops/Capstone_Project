// ============================================================
// LOGIN
// ============================================================

async function loginUser(event) {

    event.preventDefault();

    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");

    if (!emailInput || !passwordInput) {
        console.error("Login fields not found.");
        return;
    }

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (!email || !password) {

        alert(
            "Please enter email and password."
        );

        return;
    }

    const loginData = {
        email: email,
        password: password
    };

    try {

        console.log(
            "Sending login request for:",
            email
        );

        const response =
            await fetch(
                "https://capstone-project-c6bv.onrender.com/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            loginData
                        )
                }
            );


        const responseText =
            await response.text();


        console.log(
            "Login response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            alert(
                "Invalid email or password."
            );

            return;
        }


        let user;

        try {

            user =
                JSON.parse(
                    responseText
                );

        } catch (error) {

            console.error(
                "Invalid login response:",
                error
            );

            alert(
                "Login response is invalid."
            );

            return;
        }


        if (!user || !user.email) {

            alert(
                "Login failed. User data not received."
            );

            return;
        }


        localStorage.setItem(
            "loggedInEmail",
            user.email
        );


        localStorage.setItem(
            "loggedInRole",
            user.role || ""
        );


        console.log(
            "Login successful:",
            user
        );


        if (
            String(user.role || "")
                .toUpperCase() === "ADMIN"
        ) {

            alert(
                "Admin Login Successful!"
            );

            window.location.href =
                "admin-dashboard.html";

        } else {

            alert(
                "Login Successful!"
            );

            window.location.href =
                "volunteer-dashboard.html";
        }

    }
    catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            "Unable to connect to server. Please try again."
        );

    }

}


// Make inline HTML onsubmit able to call it
window.loginUser =
    loginUser;


// ============================================================
// REGISTER
// ============================================================

async function registerUser(event) {

    event.preventDefault();


    const nameElement =
        document.getElementById("name");

    const emailElement =
        document.getElementById("email");

    const phoneElement =
        document.getElementById("phone");

    const passwordElement =
        document.getElementById("password");

    const skillsElement =
        document.getElementById("skills");

    const locationElement =
        document.getElementById("location");


    if (
        !nameElement ||
        !emailElement ||
        !phoneElement ||
        !passwordElement
    ) {

        console.error(
            "Registration fields not found."
        );

        return;

    }


    const name =
        nameElement.value.trim();

    const email =
        emailElement.value.trim();

    const phone =
        phoneElement.value.trim();

    const password =
        passwordElement.value;

    const skills =
        skillsElement
            ? skillsElement.value
            : "";

    const location =
        locationElement
            ? locationElement.value.trim()
            : "";


    if (
        !name ||
        !email ||
        !phone ||
        !password
    ) {

        alert(
            "Please fill all required fields."
        );

        return;

    }


    const userData = {

        name: name,

        email: email,

        phone: phone,

        password: password,

        role: "VOLUNTEER"

    };


    console.log(
        "Registration data:",
        userData
    );


    try {

        const response =
            await fetch(
                "https://capstone-project-c6bv.onrender.com/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            userData
                        )
                }
            );


        const responseText =
            await response.text();


        console.log(
            "Registration response:",
            response.status,
            responseText
        );


        if (!response.ok) {

            alert(
                "Registration failed."
            );

            return;
        }


        alert(
            "Volunteer registration successful!"
        );


        window.location.href =
            "login.html";

    }
    catch (error) {

        console.error(
            "Registration error:",
            error
        );


        alert(
            "Unable to connect to server."
        );

    }

}


// Make inline HTML able to use it
window.registerUser =
    registerUser;


// ============================================================
// REGISTER FORM SUPPORT
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                registerUser
            );

        }

    }
);


// ============================================================
// ACCEPT TASK
// ============================================================

function acceptTask(taskName) {

    alert(
        "Task accepted: " +
        taskName
    );

}

window.acceptTask =
    acceptTask;


// ============================================================
// UPDATE TASK
// ============================================================

function updateTask(taskName) {

    alert(
        "Task status update selected.\n\nTask: " +
        taskName
    );

}

window.updateTask =
    updateTask;


// ============================================================
// LOGOUT
// ============================================================

function logoutUser() {

    localStorage.removeItem(
        "loggedInEmail"
    );

    localStorage.removeItem(
        "loggedInRole"
    );


    alert(
        "You have been logged out."
    );


    window.location.href =
        "login.html";

}

window.logoutUser =
    logoutUser;