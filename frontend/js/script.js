function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    const loginData = {
        email: email,
        password: password
    };

    fetch("https://capstone-project-c6bv.onrender.com/api/users/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(loginData)

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Invalid email or password");
        }

        return response.json();

    })
    .then(user => {

        localStorage.setItem(
            "loggedInEmail",
            user.email
        );

        if (user.role === "ADMIN") {

            alert("Admin Login Successful!");

            window.location.href =
                "admin-dashboard.html";

        } else {

            alert("Login Successful!");

            window.location.href =
                "volunteer-dashboard.html";
        }

    })
    .catch(error => {

        console.error("Login error:", error);

        alert("Invalid email or password.");

    });

}



// ====================
// REGISTER
// ====================

function registerUser(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const password =
        document.getElementById("password").value;

    const skills =
        document.getElementById("skills").value;

    const location =
        document.getElementById("location").value.trim();


    // Validate fields

    if (
        !name ||
        !email ||
        !phone ||
        !password ||
        !skills ||
        !location
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    // Data sent to Spring Boot

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


    fetch("https://capstone-project-c6bv.onrender.com/api/users/register", {

    method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(userData)

        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Registration failed"
            );

        }

        return response.json();

    })

    .then(data => {

        console.log(
            "Registration successful:",
            data
        );


        alert(
            "Volunteer registration successful!"
        );


        window.location.href =
            "login.html";

    })

    .catch(error => {

        console.error(
            "Registration error:",
            error
        );


        alert(
            "Registration failed. Please try again."
        );

    });

}



// ====================
// CONNECT REGISTER FORM
// ====================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        registerUser
    );

}



// ====================
// ACCEPT TASK
// ====================

function acceptTask(taskName) {

    alert(
        "Task accepted: " +
        taskName
    );

}



// ====================
// UPDATE TASK
// ====================

function updateTask(taskName) {

    alert(
        "Task status update selected.\n\nTask: " +
        taskName
    );

}



// ====================
// LOGOUT
// ====================

function logoutUser() {

    alert(
        "You have been logged out."
    );


    window.location.href =
        "login.html";

}