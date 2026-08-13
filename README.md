# Volunteer Disaster Relief Coordination System
> A Complete Full-Stack Capstone Project for Emergency Response & Humanitarian Volunteer Management

![Project License](https://img.shields.io/badge/License-MIT-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.x-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)

---

## 📌 Project Overview
The **Volunteer Disaster Relief Coordination System** is a web-based platform engineered to streamline disaster response operations. It enables administrators to log disaster incidents, manage relief resources, register shelter facilities, assign tasks to registered volunteers, and track real-time progress across crisis zones.

---

## 🎯 Key Features

### 🔐 Authentication & Roles
- **Role-Based Access**: Distinct Admin and Volunteer dashboards and action permissions.
- **Secure Password Authentication**: BCrypt hashed passwords and JWT session handling.

### 📊 Admin Dashboard
- **Comprehensive Metrics**: Real-time counters for Total & Active Volunteers, Disasters, Tasks, Resources, and Relief Shelters.
- **Operational Control**: Manage disasters, task allocations, supply inventories, and emergency notifications.

### 🙋 Volunteer Dashboard
- **Personalized Workspace**: View assigned emergency tasks, update status (Pending $\rightarrow$ In Progress $\rightarrow$ Completed), view disaster warnings, and access shelter contact details.

### 🛠️ Complete Management Modules (CRUD)
1. **Volunteers**: Register, view, edit, delete, search, filter by availability and status.
2. **Disasters**: Log incident type, severity (Low, Moderate, High, Critical), location, start date, and description.
3. **Tasks**: Create tasks, assign volunteers, update progress lifecycle.
4. **Resources**: Track supply inventory, quantity, and fulfillment status (Requested, Dispatched, Delivered).
5. **Relief Centers**: Shelter capacity management, contact numbers, and operational status.
6. **Locations**: Geographic address repository (Address, City, District, Pincode).
7. **Reports**: Statistical visual breakdown for executive decision making.
8. **Notifications**: System announcements and task dispatch alerts.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), JavaScript (ES6+), HTML5, CSS3 (Glassmorphic Theme), Lucide Icons |
| **Backend** | Java 17/26, Spring Boot 3.x, Spring Data JPA, Spring Security, JWT, Maven |
| **Database** | MySQL 8.0+ |
| **Tools** | VS Code / IntelliJ IDEA, Git |

---

## 📁 Project Structure

```
Volunteer-Disaster-Relief-System/
├── frontend/                     # React Single Page Application
│   ├── src/
│   │   ├── components/          # Reusable UI (Sidebar, Navbar, Modals, StatCards)
│   │   ├── pages/               # 12 Core Application Pages
│   │   ├── services/            # API Layer (Live REST API + Offline Mock Fallback)
│   │   ├── App.jsx              # Routing & Context Setup
│   │   └── index.css            # Custom Styling System
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Spring Boot REST API Service
│   ├── src/main/java/com/disaster/backend/
│   │   ├── config/              # Security, CORS, Data Initializer
│   │   ├── controller/          # REST Controllers
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── entity/              # JPA Entities
│   │   ├── exception/           # Exception Handling
│   │   ├── repository/          # Spring Data Repositories
│   │   └── service/             # Business Logic Services
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── database/
│   └── schema.sql               # MySQL Schema & Seed Data Script
│
├── docs/
│   ├── ER_Diagram.md            # Database Schema & Mermaid ER Diagram
│   ├── Problem_Statement.md     # Problem Statement & Functional Requirements
│   └── Project_Documentation.md # Architecture & Module Specs
│
├── README.md                    # Main Project Readme
└── .gitignore                   # Git Ignore Rules
```

---

## 🚀 Getting Started & Setup Guide

### 1️⃣ Database Setup (MySQL)
1. Open MySQL Workbench or your MySQL CLI client.
2. Run the script provided in `database/schema.sql`:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. This creates the `volunteer_disaster_relief` database and populates initial seed data.

### 2️⃣ Backend Setup (Spring Boot)
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Verify database connection in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/volunteer_disaster_relief?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
3. Build and launch the Spring Boot application:
   ```bash
   mvn clean spring-boot:run
   ```
4. The REST API will start on `http://localhost:8080/api`.

### 3️⃣ Frontend Setup (React + Vite)
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🔑 Default Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@disaster.org` | `admin123` |
| **Volunteer** | `john@disaster.org` | `volunteer123` |

---

## 📡 REST API Endpoint Summary

- **POST** `/api/auth/login` - Authenticate User
- **POST** `/api/auth/register` - Volunteer Registration
- **GET / POST** `/api/volunteers` - Manage Volunteers
- **GET / POST** `/api/disasters` - Manage Disasters
- **GET / POST** `/api/tasks` - Manage Relief Tasks
- **PATCH** `/api/tasks/{id}/status` - Update Task Progress
- **GET / POST** `/api/resources` - Manage Emergency Resources
- **GET / POST** `/api/relief-centers` - Manage Shelters
- **GET / POST** `/api/locations` - Manage Locations
- **GET** `/api/reports/summary` - Aggregate System Reports
- **GET** `/api/notifications` - Retrieve Alerts

---

## 🔮 Future Enhancements
- Interactive Map view (Leaflet / Mapbox) for real-time GIS disaster tracking.
- SMS & WhatsApp alerts integration for urgent field updates.
- Progressive Web App (PWA) offline support for disaster zone connectivity loss.
