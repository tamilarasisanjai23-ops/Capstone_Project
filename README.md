# Volunteer Disaster Relief Coordination System
> A Complete Full-Stack Capstone Project for Emergency Response & Humanitarian Volunteer Management

![Project License](https://img.shields.io/badge/License-MIT-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.x-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)

---

## 📌 Project Overview
The **Volunteer Disaster Relief Coordination System** is a web-based platform engineered to streamline disaster response operations. It enables administrators to log disaster incidents, manage relief resources, register shelter facilities, assign tasks to registered volunteers, broadcast critical emergency alerts, and track real-time progress across crisis zones.

---

## 🎯 Key Features

### 🚨 Real-World Emergency Response Subsystem (NEW)
1. **Emergency Alert System**: Create broadcast warnings with severity levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`). Critical alerts trigger prominent warning banners and Web Audio API alarm sirens.
2. **Voice Alert / Microphone Feature**: Microphone recording in Admin dashboard using browser `MediaRecorder` API. Persists voice metadata and enables volunteers to listen via an inline player with Play, Pause, and Stop controls.
3. **Emergency Radio / Push-to-Talk (PTT)**: Dedicated `/emergency-radio` tactical walkie-talkie page supporting 5 channels (*Medical*, *Rescue*, *Food Distribution*, *Transport*, *General Emergency*), real-time WebRTC audio streams, microphone permission indicators, mute/unmute, and frequency visualizers.
4. **SOS Emergency Button**: Prominent SOS button on Volunteer Dashboard capturing live GPS coordinates (`navigator.geolocation`), notifying Command Center Admins, updating SOS status, and providing an Admin `/sos-alerts` portal.
5. **Live Location & Emergency Map**: Dedicated `/emergency-map` page rendering interactive pins for Disasters, Relief Shelters, SOS Emergency calls, and Live Volunteer coordinates with layer filters.
6. **Enhanced Notification Center**: Unified notification hub for Emergency Warnings, Voice Alerts, SOS Alerts, Task Assignments, and Announcements.

### 🔐 Authentication & Roles
- **Role-Based Access**: Distinct Admin and Volunteer dashboards and action permissions.
- **Secure Password Authentication**: BCrypt hashed passwords and JWT session handling.

### 📊 Admin Dashboard
- **Comprehensive Metrics**: Real-time counters for Total & Active Volunteers, Disasters, Tasks, Resources, Relief Shelters, and Active SOS Calls.
- **Operational Control**: Manage disasters, task allocations, supply inventories, voice broadcasts, and emergency notifications.

### 🙋 Volunteer Dashboard
- **Personalized Workspace**: View assigned emergency tasks, update status (Pending $\rightarrow$ In Progress $\rightarrow$ Completed), trigger SOS distress calls, listen to voice alerts, and connect to PTT channels.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), JavaScript (ES6+), Web Audio API, WebRTC, MediaRecorder API, Geolocation API, HTML5, CSS3, Lucide Icons |
| **Backend** | Java 17/26, Spring Boot 3.x, Spring Data JPA, Spring Security, JWT, Maven |
| **Database** | MySQL 8.0+ |
| **Tools** | VS Code / IntelliJ IDEA, Git |

---

## 📂 Project Structure

```
Volunteer-Disaster-Relief-System/
├── frontend/                     # React Single Page Application
│   ├── src/
│   │   ├── components/          # Reusable UI (Sidebar, Navbar, Modals, StatCards, SosButton, VoicePlayer, VoiceRecorderModal)
│   │   ├── pages/               # 15 Core Application Pages (inc. EmergencyRadio, EmergencyMap, SosAlerts)
│   │   ├── services/            # API Layer (Live REST API + Offline Mock Fallback + audioService)
│   │   ├── App.jsx              # Routing & Context Setup
│   │   └── index.css            # Custom Styling System
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # Spring Boot REST API Service
│   ├── src/main/java/com/disaster/backend/
│   │   ├── controller/          # REST Controllers (EmergencyAlertController, VoiceAlertController, SosAlertController, etc.)
│   │   ├── entity/              # JPA Entities (User, Volunteer, EmergencyAlert, VoiceAlert, SosAlert, etc.)
│   │   ├── repository/          # Spring Data Repositories
│   │   └── BackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── database/
│   └── schema.sql               # MySQL Schema (14 Tables & Initial Seed Data)
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

## 🚀 REST API Endpoints Summary

### Emergency Response Endpoints
- `GET /api/emergency-alerts` - Fetch all emergency alerts
- `POST /api/emergency-alerts` - Create emergency alert
- `GET /api/voice-alerts` - Fetch voice audio broadcasts
- `POST /api/voice-alerts` - Publish voice audio dispatch
- `GET /api/sos-alerts` - Fetch active SOS distress calls
- `POST /api/sos-alerts` - Trigger SOS signal with GPS coordinates
- `PUT /api/sos-alerts/{id}/status` - Update SOS status (ACTIVE, RESPONDING, RESOLVED)
- `GET /api/radio-channels` - List emergency PTT channels
- `GET /api/volunteer-locations` - View live volunteer coordinates
- `POST /api/volunteer-locations` - Update volunteer live location
