import React from "react";
import ReactDOM from "react-dom/client";

import EmergencyRadio from "./pages/EmergencyRadio";


const loggedInEmail =
    localStorage.getItem("loggedInEmail");


const loggedInName =
    localStorage.getItem("loggedInName");


const currentUser = {

    name:
        loggedInName ||
        loggedInEmail ||
        "Field Unit",

    email:
        loggedInEmail ||
        ""

};


ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <EmergencyRadio
            currentUser={currentUser}
        />

    </React.StrictMode>

);