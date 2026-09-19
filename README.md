# Volunteer Disaster Relief Coordination System

> A Full-Stack Web Application for Emergency Response and Volunteer Coordination

## 📌 Project Overview

The **Volunteer Disaster Relief Coordination System** is a web-based disaster management application designed to help administrators and volunteers coordinate emergency-response activities.

The system provides a centralized platform for managing volunteers, disasters, emergency alerts, SOS requests, tasks, resources, shelters, and emergency communication.

---

## 🚨 Key Features

* Emergency Alert System
* Voice Alert System
* Emergency SOS
* Emergency Radio / Push-to-Talk
* Disaster Management
* Volunteer Task Coordination
* Notification Center
* Resource Management
* Shelter Management
* Volunteer Management

## 🔔 Emergency Alert System

* Admin can create emergency alerts.
* Alerts can contain a title, message, and severity.
* Volunteers can view available emergency alerts.
* Admin can delete emergency alerts.

## 🔊 Voice Alert System

* Admin can create voice alerts.
* Volunteers can view available voice alerts.
* Voice-based emergency communication is supported through the frontend.

## 📻 Emergency Radio

* Emergency Radio interface for volunteers.
* Emergency channel selection.
* Microphone access for communication.
* Push-to-talk style communication interface.
* Uses browser-based audio capabilities.

## 🆘 SOS Alert System

* Volunteers can send SOS alerts during emergency situations.
* Admin can monitor SOS alerts.
* Admin can update SOS alert status.
* Volunteers can receive updated SOS status.

## 📋 Task Coordination

* Admin can assign tasks to volunteers.
* Volunteers can view assigned tasks.
* Volunteers can update task status.
* Supported task statuses:

  * Pending
  * In Progress
  * Completed

## 🔔 Notification Center

Notifications can be used for:

* Emergency alerts
* Task assignments
* Task status updates
* SOS status changes
* Other emergency-response activities

---

## 🔐 Authentication & Roles

### 👨‍💼 Admin

Admin features include:

* Manage disasters
* Manage volunteers
* Assign tasks
* Manage emergency alerts
* Manage voice alerts
* Monitor SOS alerts
* Manage resources
* Manage shelters
* Monitor notifications

### 🙋 Volunteer

Volunteer features include:

* View assigned tasks
* Update task status
* View emergency alerts
* View voice alerts
* Send SOS alerts
* View notifications
* Access Emergency Radio
* Participate in emergency communication

---

## 📊 Admin Dashboard

The Admin Dashboard provides centralized management of disaster-relief activities.

### Admin Operations

* Volunteer Management
* Disaster Management
* Task Assignment
* Resource Management
* Shelter Management
* Emergency Alert Management
* Voice Alert Management
* SOS Monitoring
* Notification Management

---

## 🙋 Volunteer Dashboard

The Volunteer Dashboard provides volunteers with access to emergency-response activities.

### Volunteer Operations

* View assigned tasks
* Update task status
* View emergency alerts
* View voice alerts
* Send SOS alerts
* View notifications
* Access Emergency Radio
* Participate in emergency communication

---

## 🛠️ Technology Stack

| Layer                 | Technology                                   |
| --------------------- | -------------------------------------------- |
| **Frontend**          | HTML5, CSS3, JavaScript                      |
| **Backend**           | Java, Spring Boot 3.x                        |
| **API**               | Spring Boot REST APIs                        |
| **Data Access**       | Spring Data JPA                              |
| **Database**          | MySQL 8.0+                                   |
| **Build Tool**        | Maven                                        |
| **Browser Features**  | Web Audio / MediaRecorder / Geolocation APIs |
| **Development Tools** | VS Code, Git, GitHub                         |
| **Deployment**        | Docker / Render                              |

---

## 📂 Project Structure

```text
capstone/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── volunteer-dashboard.html
│   ├── tasks.html
│   ├── radio.html
│   │
│   ├── css/
│   │
│   ├── js/
│   │
│   └── src/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── disaster/
│   │       │           └── backend/
│   │       │               ├── controller/
│   │       │               ├── entity/
│   │       │               ├── repository/
│   │       │               └── BackendApplication.java
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   ├── Dockerfile
│   └── pom.xml
│
├── database/
│   └── schema.sql
│
├── docs/
├── er_diagram.md
├── problem-statement.md
├── README.md
├── capstone.code-workspace
└── .gitignore
```

---

## 🚀 Backend API

The Spring Boot backend provides REST APIs for disaster-response operations.

### 🚨 Emergency Alerts

```text
GET    /api/emergency-alerts
POST   /api/emergency-alerts
DELETE /api/emergency-alerts/{id}
```

### 🔊 Voice Alerts

```text
GET  /api/voice-alerts
POST /api/voice-alerts
```

### 🆘 SOS Alerts

```text
GET /api/sos-alerts
POST /api/sos-alerts
PUT /api/sos-alerts/{id}/status
```

### 📋 Other Backend Operations

The backend also supports operations related to:

* Volunteer management
* Task assignment
* Task status updates
* Notifications
* Disaster management
* Relief coordination
* Emergency-response activities

---

## 🗄️ Database

The project uses **MySQL** for persistent data storage.

The database manages information related to:

* Users
* Volunteers
* Disasters
* Emergency Alerts
* SOS Alerts
* Voice Alerts
* Tasks
* Notifications
* Relief Resources
* Shelters

Database scripts are maintained inside:

```text
database/
└── schema.sql
```

---

## 🔄 System Workflow

```text
                         ADMIN
                           │
             ┌─────────────┼─────────────┐
             │             │             │
         Manage         Create        Monitor
        Volunteers       Alerts          SOS
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                  SPRING BOOT BACKEND
                           │
                     REST API Operations
                           │
                           ▼
                         MYSQL
                           │
                           ▼
                       FRONTEND
                           │
                           ▼
                      VOLUNTEERS
                           │
              ┌────────────┼────────────┐
              │            │            │
            Tasks        Alerts         SOS
              │            │            │
              ▼            ▼            ▼
        Update Status  View Alerts   Send SOS
                           │
                           ▼
                    Emergency Radio
```

---

## ▶️ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/tamilarasisanjai23-ops/Capstone_Project.git
cd Capstone_Project
```

### 2. Start the Backend

Open a terminal inside the backend directory:

```bash
cd backend
```

Build the project:

```bash
mvn clean package
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

### 3. Frontend

The frontend contains HTML, CSS, and JavaScript pages for the disaster-response system.

Open the required frontend page using the configured frontend environment.

---

## 🐳 Docker Deployment

The backend includes a Dockerfile:

```text
backend/Dockerfile
```

The Docker configuration is used for container-based deployment of the Spring Boot backend.

The backend can be deployed to a cloud platform such as **Render** using the Docker configuration.

---

## 📌 Project Status

The project is being developed as a **college capstone project**.

### Current Development Areas

* Emergency response
* Volunteer coordination
* Task management
* Emergency alerts
* Voice alerts
* SOS management
* Emergency communication
* Backend API integration
* Database integration
* Cloud deployment

---

## 🎯 Project Objective

The main objective of the **Volunteer Disaster Relief Coordination System** is to provide a centralized platform for coordinating volunteers and emergency-response activities during disaster situations.

The system focuses on:

* Faster emergency communication
* Volunteer coordination
* Task assignment and tracking
* Emergency reporting
* SOS management
* Resource and shelter coordination
* Centralized disaster-response management

---

## 👩‍💻 Project Information

**Project:** Volunteer Disaster Relief Coordination System

**Type:** College Capstone Project

**Domain:** Disaster Management / Emergency Response

**Architecture:** Full-Stack Web Application
